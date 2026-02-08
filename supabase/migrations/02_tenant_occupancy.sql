-- 9. Tenant Occupancy History
-- Tracks the timeline of who lived in which house.
-- Never delete records from this table.

CREATE TYPE occupancy_status AS ENUM ('active', 'history');

CREATE TABLE public.tenant_occupancy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_id UUID REFERENCES public.houses(id) ON DELETE CASCADE,
    tenant_user_id UUID REFERENCES public.users(id), -- The tenant
    move_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
    move_out_date DATE, -- Null if currently active
    status occupancy_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.tenant_occupancy ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read (Transparency context)
CREATE POLICY "Occupancy history is viewable by everyone" ON public.tenant_occupancy FOR SELECT USING (true);

-- Policy: Only Admins can insert/update (Move-In / Move-Out)
-- Simplified check for now. In real app, check auth.uid() role.
CREATE POLICY "Admins can manage occupancy" ON public.tenant_occupancy FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Constraint: Only one active tenant per house
CREATE UNIQUE INDEX one_active_tenant_per_house 
ON public.tenant_occupancy (house_id) 
WHERE (status = 'active');
