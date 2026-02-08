-- Admin Panel Migration

-- 1. Communities Updates
ALTER TABLE public.communities 
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS registration_year INTEGER;

-- 2. Soft Delete Columns (archived_at)
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Nullable if system action
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE, ARCHIVE
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Admins can read audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Audit Log Trigger Function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF (TG_OP = 'DELETE') THEN
        old_data := to_jsonb(OLD);
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
        VALUES (current_user_id, 'DELETE', TG_TABLE_NAME, OLD.id, old_data);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
        
        -- Check if it's a soft delete (archived_at changed from NULL to Value)
        IF (OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL) THEN
             INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
             VALUES (current_user_id, 'ARCHIVE', TG_TABLE_NAME, NEW.id, old_data, new_data);
        ELSE
             INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
             VALUES (current_user_id, 'UPDATE', TG_TABLE_NAME, NEW.id, old_data, new_data);
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        new_data := to_jsonb(NEW);
        INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
        VALUES (current_user_id, 'INSERT', TG_TABLE_NAME, NEW.id, new_data);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Triggers to Tables
-- We check if trigger exists before creating to avoid errors in re-runs (Postgres 14+ supports create or replace trigger, but 13 doesnt simple IF NOT EXISTS)
-- We will drop and recreate for simplicity in this script.

DROP TRIGGER IF EXISTS audit_houses ON public.houses;
CREATE TRIGGER audit_houses
AFTER INSERT OR UPDATE OR DELETE ON public.houses
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_funds ON public.funds;
CREATE TRIGGER audit_funds
AFTER INSERT OR UPDATE OR DELETE ON public.funds
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_users ON public.users;
CREATE TRIGGER audit_users
AFTER INSERT OR UPDATE OR DELETE ON public.users
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_contributions ON public.contributions;
CREATE TRIGGER audit_contributions
AFTER INSERT OR UPDATE OR DELETE ON public.contributions
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_proposals ON public.proposals;
CREATE TRIGGER audit_proposals
AFTER INSERT OR UPDATE OR DELETE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_notices ON public.notices;
CREATE TRIGGER audit_notices
AFTER INSERT OR UPDATE OR DELETE ON public.notices
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- 6. Strict RLS Updates for Admin Features

-- Ensure community table is restricted for updates
CREATE POLICY "Admins can update community details" ON public.communities
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Allow Admins to manage everything (Broad Admin Policy)
-- Note: We already have some policies. We need to audit them or add a catch-all admin policy if not covered.
-- Simplest is to ensure every table has an admin write policy.

-- Houses
CREATE POLICY "Admins can insert houses" ON public.houses FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update houses" ON public.houses FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete houses" ON public.houses FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Users (Role management)
CREATE POLICY "Admins can update users" ON public.users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Funds (Already had insert, adding update/delete)
CREATE POLICY "Admins can update funds" ON public.funds FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
-- We use Soft Delete (Update archived_at), but if hard delete is attempted, allow admins (Application logic should prevent this)
CREATE POLICY "Admins can delete funds" ON public.funds FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Proposals
CREATE POLICY "Admins can insert proposals" ON public.proposals FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update proposals" ON public.proposals FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Notices
CREATE POLICY "Admins can insert notices" ON public.notices FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update notices" ON public.notices FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Documents
CREATE POLICY "Admins can insert documents" ON public.documents FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
