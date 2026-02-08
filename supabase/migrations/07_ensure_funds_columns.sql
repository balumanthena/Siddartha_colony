-- Forcefully ensure the columns exist, even if the table was already created empty
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS target_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS collected_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT NOW();
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed'));
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS is_voluntary BOOLEAN DEFAULT TRUE;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.funds ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Notify Supabase to refresh schema cache (usually automatic, but good to ensure RLS)
ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
