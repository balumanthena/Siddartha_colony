-- Add new values to the enum
-- PostgreSQL doesn't support adding multiple values in one command easily within a transaction block usually, 
-- but `ALTER TYPE ... ADD VALUE` cannot be run inside a transaction block. 
-- However, Supabase migration scripts run individually.

-- We will use a safe approach to add values if they don't exist.
DO $$
BEGIN
    ALTER TYPE public.office_bearer_role ADD VALUE IF NOT EXISTS 'chief_secretary';
    ALTER TYPE public.office_bearer_role ADD VALUE IF NOT EXISTS 'joint_secretary';
    ALTER TYPE public.office_bearer_role ADD VALUE IF NOT EXISTS 'district_president';
    ALTER TYPE public.office_bearer_role ADD VALUE IF NOT EXISTS 'district_secretary';
    ALTER TYPE public.office_bearer_role ADD VALUE IF NOT EXISTS 'women_secretary';
    ALTER TYPE public.office_bearer_role ADD VALUE IF NOT EXISTS 'advisor';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
