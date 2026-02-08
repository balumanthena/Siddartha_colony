-- Create Office Bearers Table
-- Define Enums
DO $$ BEGIN
    CREATE TYPE office_bearer_role AS ENUM ('president', 'vice_president', 'secretary', 'treasurer', 'executive_member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE office_bearer_status AS ENUM ('active', 'former');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table Definition
CREATE TABLE IF NOT EXISTS public.office_bearers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    role office_bearer_role NOT NULL,
    full_name text NOT NULL,
    phone text, -- Added phone support directly here as it was added in UI
    start_date date NOT NULL DEFAULT current_date,
    end_date date,
    status office_bearer_status NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    CONSTRAINT office_bearers_pkey PRIMARY KEY (id)
);

-- RLS Policies
ALTER TABLE public.office_bearers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.office_bearers;
CREATE POLICY "Enable read access for all users"
    ON public.office_bearers
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Enable insert for admins only" ON public.office_bearers;
CREATE POLICY "Enable insert for admins only"
    ON public.office_bearers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Enable update for admins only" ON public.office_bearers;
CREATE POLICY "Enable update for admins only"
    ON public.office_bearers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Audit Trigger (Custom Function to avoid extension dependency)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_office_bearers_updated_at ON public.office_bearers;
CREATE TRIGGER handle_office_bearers_updated_at
    BEFORE UPDATE ON public.office_bearers
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
