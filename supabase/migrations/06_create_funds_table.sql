-- Create Funds Table if it doesn't exist (or ensure structure)
CREATE TABLE IF NOT EXISTS public.funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    target_amount NUMERIC(12, 2) DEFAULT 0,
    collected_amount NUMERIC(12, 2) DEFAULT 0,
    start_date DATE DEFAULT NOW(),
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed')),
    is_voluntary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Admins can view funds" ON public.funds;
CREATE POLICY "Admins can view funds" ON public.funds FOR SELECT USING (true); -- Allow all for now, or restrict to detailed view

DROP POLICY IF EXISTS "Admins can insert funds" ON public.funds;
CREATE POLICY "Admins can insert funds" ON public.funds FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update funds" ON public.funds;
CREATE POLICY "Admins can update funds" ON public.funds FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Audit Trigger (re-attach if needed)
DROP TRIGGER IF EXISTS audit_funds ON public.funds;
CREATE TRIGGER audit_funds
AFTER INSERT OR UPDATE OR DELETE ON public.funds
FOR EACH ROW EXECUTE FUNCTION log_audit_event();
