-- Grant ADMIN role to demo73313@gmail.com

-- 0. Ensure user exists in public.users if missing (from auth.users)
-- We DO NOT include 'name' because the public.users table does not have that column.
INSERT INTO public.users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'demo73313@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 1. Explicitly update if it was already there (redundant but safe)
UPDATE public.users
SET role = 'admin'
WHERE email = 'demo73313@gmail.com';

-- 2. Verify
-- select * from public.users where email = 'demo73313@gmail.com';
