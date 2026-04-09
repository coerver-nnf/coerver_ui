-- Partner Clubs Management Schema
-- Migration: 006_partner_clubs.sql

-- Partner clubs table
CREATE TABLE partner_clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  website TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club coaches junction table (one coach per club)
CREATE TABLE club_coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES partner_clubs(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'head_coach')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Club category access
CREATE TABLE club_category_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES partner_clubs(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES exercise_categories(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(club_id, category_id)
);

-- Club subcategory access
CREATE TABLE club_subcategory_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES partner_clubs(id) ON DELETE CASCADE,
  subcategory_id UUID NOT NULL REFERENCES exercise_subcategories(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(club_id, subcategory_id)
);

-- Club exercise access
CREATE TABLE club_exercise_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES partner_clubs(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(club_id, exercise_id)
);

-- Coach subcategory access (individual overrides)
CREATE TABLE coach_subcategory_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subcategory_id UUID NOT NULL REFERENCES exercise_subcategories(id) ON DELETE CASCADE,
  access_type TEXT DEFAULT 'grant' CHECK (access_type IN ('grant', 'deny')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(coach_id, subcategory_id)
);

-- Add access_type to existing coach_exercise_access if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coach_exercise_access') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coach_exercise_access' AND column_name = 'access_type') THEN
      ALTER TABLE coach_exercise_access ADD COLUMN access_type TEXT DEFAULT 'grant' CHECK (access_type IN ('grant', 'deny'));
    END IF;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX idx_club_coaches_club_id ON club_coaches(club_id);
CREATE INDEX idx_club_coaches_coach_id ON club_coaches(coach_id);
CREATE INDEX idx_club_category_access_club_id ON club_category_access(club_id);
CREATE INDEX idx_club_subcategory_access_club_id ON club_subcategory_access(club_id);
CREATE INDEX idx_club_exercise_access_club_id ON club_exercise_access(club_id);
CREATE INDEX idx_coach_subcategory_access_coach_id ON coach_subcategory_access(coach_id);
CREATE INDEX idx_partner_clubs_status ON partner_clubs(status);
CREATE INDEX idx_partner_clubs_slug ON partner_clubs(slug);

-- Enable RLS on all new tables
ALTER TABLE partner_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_category_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_subcategory_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_exercise_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_subcategory_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_clubs
CREATE POLICY "Admins can manage partner clubs" ON partner_clubs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Coaches can view their club" ON partner_clubs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_coaches
      WHERE club_coaches.club_id = partner_clubs.id
      AND club_coaches.coach_id = auth.uid()
    )
  );

-- RLS Policies for club_coaches
CREATE POLICY "Admins can manage club coaches" ON club_coaches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Coaches can view own membership" ON club_coaches
  FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

-- RLS Policies for club_category_access
CREATE POLICY "Admins can manage club category access" ON club_category_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Coaches can view own club category access" ON club_category_access
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_coaches
      WHERE club_coaches.club_id = club_category_access.club_id
      AND club_coaches.coach_id = auth.uid()
    )
  );

-- RLS Policies for club_subcategory_access
CREATE POLICY "Admins can manage club subcategory access" ON club_subcategory_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Coaches can view own club subcategory access" ON club_subcategory_access
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_coaches
      WHERE club_coaches.club_id = club_subcategory_access.club_id
      AND club_coaches.coach_id = auth.uid()
    )
  );

-- RLS Policies for club_exercise_access
CREATE POLICY "Admins can manage club exercise access" ON club_exercise_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Coaches can view own club exercise access" ON club_exercise_access
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_coaches
      WHERE club_coaches.club_id = club_exercise_access.club_id
      AND club_coaches.coach_id = auth.uid()
    )
  );

-- RLS Policies for coach_subcategory_access
CREATE POLICY "Admins can manage coach subcategory access" ON coach_subcategory_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Coaches can view own subcategory access" ON coach_subcategory_access
  FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

-- Trigger to update updated_at on partner_clubs
CREATE OR REPLACE FUNCTION update_partner_clubs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_partner_clubs_updated_at
  BEFORE UPDATE ON partner_clubs
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_clubs_updated_at();
