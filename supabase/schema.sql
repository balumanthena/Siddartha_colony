-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Communities Table (Read-only identity)
CREATE TABLE public.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    official_area TEXT NOT NULL, -- e.g., 'Kisan Nagar'
    road_name TEXT NOT NULL, -- e.g., 'Road No. 6'
    association_name TEXT, -- e.g., 'Siddhartha Welfare Association'
    disclaimer_en TEXT DEFAULT 'This app is for transparency. It does not replace government approvals.',
    disclaimer_te TEXT DEFAULT 'ఈ యాప్ పారదర్శకత కోసమే. ఇది ప్రభుత్వ అనుమతులను భర్తీ చేయదు.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Houses Table
CREATE TABLE public.houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_number TEXT NOT NULL UNIQUE, -- e.g., '1-2-3/A'
    owner_name TEXT NOT NULL,
    resident_count INTEGER DEFAULT 0,
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Users Table (Role-based access)
CREATE TYPE user_role AS ENUM ('admin', 'member');

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'member',
    house_id UUID REFERENCES public.houses(id), -- Nullable for initial setup or external admins
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Funds Table (Strictly Voluntary)
-- Constraint: fund_type can ONLY be VOLUNTARY. 
-- We enforce this via application logic, but let's add a check constraint for safety if we had a type column.
-- Since requirement says "Fund type can ONLY be VOLUNTARY", we won't even have a type column, or default it.

CREATE TABLE public.funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    description_en TEXT,
    description_te TEXT,
    target_amount NUMERIC(12, 2) NOT NULL,
    collected_amount NUMERIC(12, 2) DEFAULT 0,
    is_voluntary BOOLEAN DEFAULT TRUE, -- HARD REQUIREMENT
    status TEXT DEFAULT 'active', -- active, closed
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT voluntary_check CHECK (is_voluntary = TRUE) -- Database level enforcement
);

-- 5. Contributions Table
CREATE TABLE public.contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_id UUID REFERENCES public.funds(id) ON DELETE CASCADE,
    house_id UUID REFERENCES public.houses(id), -- Link to house for transparency
    user_id UUID REFERENCES public.users(id), -- Link to specific user who paid
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_proof_url TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Decisions / Proposals Table
CREATE TYPE proposal_status AS ENUM ('discussion', 'approved', 'rejected', 'implemented');

CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_te TEXT NOT NULL,
    status proposal_status DEFAULT 'discussion',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notices Table
CREATE TYPE notice_type AS ENUM ('meeting', 'mom', 'general');

CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    content_en TEXT,
    content_te TEXT,
    notice_type notice_type NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE, -- For meetings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Documents Table (Linked to Funds or Proposals)
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'fund', 'proposal', 'notice'
    entity_id UUID NOT NULL, -- Logical reference
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for transparency - mostly Public Read)

-- Communities: Everyone can read
CREATE POLICY "Public communities are viewable by everyone" ON public.communities FOR SELECT USING (true);

-- Houses: Everyone can read
CREATE POLICY "Houses are viewable by everyone" ON public.houses FOR SELECT USING (true);

-- Users: Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- Funds: Everyone can read funds
CREATE POLICY "Funds are viewable by everyone" ON public.funds FOR SELECT USING (true);
-- Funds: Only admins can create/update
CREATE POLICY "Admins can insert funds" ON public.funds FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Contributions: Everyone can read (Transparency!)
CREATE POLICY "Contributions are viewable by everyone" ON public.contributions FOR SELECT USING (true);
-- Contributions: Admins or Users can insert (Self-reporting or Admin entry)
CREATE POLICY "Authenticated users can add contributions" ON public.contributions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Proposals: Everyone can read
CREATE POLICY "Proposals are viewable by everyone" ON public.proposals FOR SELECT USING (true);

-- Notices: Everyone can read
CREATE POLICY "Notices are viewable by everyone" ON public.notices FOR SELECT USING (true);

-- Documents: Everyone can read
CREATE POLICY "Documents are viewable by everyone" ON public.documents FOR SELECT USING (true);


-- Seed Data (Initial Community)
INSERT INTO public.communities (name, official_area, road_name)
VALUES ('Siddhartha Colony', 'Kisan Nagar', 'Road No. 6');

-- Seed Data (15 Houses)
-- We will need to fetch the community_id first in a real script, but for SQL editor, we can use a simpler approach or DO block.
DO $$
DECLARE
    comm_id UUID;
BEGIN
    SELECT id INTO comm_id FROM public.communities LIMIT 1;

    INSERT INTO public.houses (house_number, owner_name, community_id) VALUES
    ('1', 'Ramesh Gupta', comm_id),
    ('2', 'Srinivas Rao', comm_id),
    ('3', 'Lakshmi Narayana', comm_id),
    ('4', 'Mohd. Ali', comm_id),
    ('5', 'Krishna Reddy', comm_id),
    ('6', 'Venkatesh', comm_id),
    ('7', 'Sujatha', comm_id),
    ('8', 'Prasad', comm_id),
    ('9', 'Anitha', comm_id),
    ('10', 'Ramakrishna', comm_id),
    ('11', 'Narsimha', comm_id),
    ('12', 'Balu', comm_id),
    ('13', 'Satyanarayana', comm_id),
    ('14', 'Ravi Kumar', comm_id),
    ('15', 'Vijay', comm_id);
END $$;
