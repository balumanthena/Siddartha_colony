-- "Nuclear" RLS Check: Open everything to PUBLIC to rule out auth issues completely.
-- We will restrict this back after verifying functionality.

ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. DROP ALL EXISTING POLICIES to ensure clean slate
DROP POLICY IF EXISTS "Admins can insert funds" ON public.funds;
DROP POLICY IF EXISTS "Admins can update funds" ON public.funds;
DROP POLICY IF EXISTS "Admins can view funds" ON public.funds;
DROP POLICY IF EXISTS "Admins can delete funds" ON public.funds;
DROP POLICY IF EXISTS "Authenticated users can insert funds" ON public.funds;
DROP POLICY IF EXISTS "Authenticated users can update funds" ON public.funds;
DROP POLICY IF EXISTS "Authenticated users can view funds" ON public.funds;
DROP POLICY IF EXISTS "Authenticated users can delete funds" ON public.funds;
DROP POLICY IF EXISTS "All users can view funds" ON public.funds;
DROP POLICY IF EXISTS "All users can insert funds" ON public.funds;
DROP POLICY IF EXISTS "All users can update funds" ON public.funds;
DROP POLICY IF EXISTS "All users can delete funds" ON public.funds;

-- Audit Logs Policies (Drop potential blockers)
DROP POLICY IF EXISTS "Enable insert for audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;


-- 2. CREATE PUBLIC (ANON + LOGGED IN) POLICIES
-- This allows ANYONE to view/edit funds. Purely for confirming the bug is RLS.

CREATE POLICY "All users can view funds" 
ON public.funds FOR SELECT 
TO public 
USING (true);

CREATE POLICY "All users can insert funds" 
ON public.funds FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "All users can update funds" 
ON public.funds FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "All users can delete funds" 
ON public.funds FOR DELETE 
TO public 
USING (true);

-- 3. ALLOW AUDIT LOG INSERTION (Fixes Trigger issues)
-- If the trigger tries to insert and fails RLS, the parent transaction fails.
CREATE POLICY "Enable insert for audit logs" 
ON public.audit_logs FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (true); -- Allow viewing for now too
