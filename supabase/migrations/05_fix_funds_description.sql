-- Fix for missing 'description' column in funds table
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS description TEXT;

-- Ensure other columns required by the frontend also exist
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS target_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS is_voluntary BOOLEAN DEFAULT TRUE;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT NOW();
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update RLS policies to allow insert if not already present
DROP POLICY IF EXISTS "Admins can insert funds" ON public.funds;
CREATE POLICY "Admins can insert funds" ON public.funds FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
