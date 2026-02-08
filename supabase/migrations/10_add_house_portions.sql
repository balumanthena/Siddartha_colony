-- Add columns for multi-unit tracking
ALTER TABLE public.houses 
ADD COLUMN IF NOT EXISTS total_portions INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS rented_portions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vacant_portions INTEGER DEFAULT 0;

-- Optional: Drop old status if not needed, or keep for backward compat
-- We will keep status but default it based on logic if needed, or just ignore for now.
-- ALTER TABLE public.houses DROP COLUMN status;
