-- Coerver Admin Panel Database Schema
-- Run this migration in Supabase SQL Editor
-- UPDATED: Compatible with existing types + admin panel features

-- ============================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'coach', 'admin')),
  -- Both field names for compatibility
  approved BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN GENERATED ALWAYS AS (approved) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON profiles(approved);

-- ============================================
-- BLOG CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Both fields for compatibility (published boolean + status enum)
  published BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

-- ============================================
-- EXERCISE CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercise_categories_order ON exercise_categories(order_index);

-- ============================================
-- EXERCISE SUBCATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS exercise_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES exercise_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_exercise_subcategories_category ON exercise_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_exercise_subcategories_order ON exercise_subcategories(order_index);

-- ============================================
-- EXERCISES
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  -- Both duration fields for compatibility
  duration TEXT,
  duration_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category_id UUID REFERENCES exercise_categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES exercise_subcategories(id) ON DELETE SET NULL,
  coaching_points TEXT[],
  equipment TEXT[],
  -- Additional fields from existing types
  age_groups TEXT[],
  variations TEXT[],
  -- Admin panel fields
  is_premium BOOLEAN DEFAULT FALSE,
  -- Both order fields for compatibility
  "order" INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category_id);
CREATE INDEX IF NOT EXISTS idx_exercises_subcategory ON exercises(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_premium ON exercises(is_premium);
CREATE INDEX IF NOT EXISTS idx_exercises_order ON exercises(order_index);

-- ============================================
-- COACH CATEGORY ACCESS
-- ============================================
CREATE TABLE IF NOT EXISTS coach_category_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES exercise_categories(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(coach_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_coach_category_access_coach ON coach_category_access(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_category_access_category ON coach_category_access(category_id);

-- ============================================
-- COACH EXERCISE ACCESS (individual overrides)
-- ============================================
CREATE TABLE IF NOT EXISTS coach_exercise_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(coach_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_coach_exercise_access_coach ON coach_exercise_access(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_exercise_access_exercise ON coach_exercise_access(exercise_id);

-- ============================================
-- CAMPS
-- ============================================
CREATE TABLE IF NOT EXISTS camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Both name and title for compatibility
  name TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  address TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  -- Both pricing formats for compatibility
  pricing TEXT,
  price DECIMAL(10,2),
  capacity INTEGER,
  age_min INTEGER,
  age_max INTEGER,
  image_url TEXT,
  gallery TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_camps_status ON camps(status);
CREATE INDEX IF NOT EXISTS idx_camps_start_date ON camps(start_date);

-- ============================================
-- ACADEMIES
-- ============================================
CREATE TABLE IF NOT EXISTS academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  address TEXT,
  -- Existing type fields
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  schedule TEXT,
  pricing TEXT,
  -- Admin panel fields
  contact_email TEXT,
  contact_phone TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academies_status ON academies(status);

-- ============================================
-- COURSES (for coaches)
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Both name and title for compatibility
  name TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  -- Existing type fields
  curriculum TEXT,
  prerequisites TEXT,
  pricing TEXT,
  -- Admin panel fields
  type TEXT CHECK (type IN ('coerver-intro', 'youth-diploma-1', 'youth-diploma-2')),
  location TEXT,
  start_date DATE,
  end_date DATE,
  price DECIMAL(10,2),
  capacity INTEGER,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(type);
CREATE INDEX IF NOT EXISTS idx_courses_start_date ON courses(start_date);

-- ============================================
-- INQUIRIES (contact form submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('camp', 'academy', 'course', 'club', 'individual', 'general')),
  -- Both field names for compatibility
  reference_id UUID,
  program_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  child_name TEXT,
  child_age INTEGER,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'spam')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries(type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================
-- ADDITIONAL TABLES FROM EXISTING TYPES
-- ============================================

-- Tags for blog posts
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-Tag relationship (many-to-many)
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);

-- Training Content (for players)
CREATE TABLE IF NOT EXISTS training_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Progress
CREATE TABLE IF NOT EXISTS player_progress (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES training_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, content_id)
);

-- Course Materials
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'pdf', 'document')),
  file_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials(course_id);

-- Coach Progress (course enrollment)
CREATE TABLE IF NOT EXISTS coach_progress (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, course_id)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_category_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_exercise_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can do everything on profiles
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- BLOG CATEGORIES POLICIES
-- ============================================

-- Anyone can read blog categories
CREATE POLICY "Anyone can read blog categories" ON blog_categories
  FOR SELECT USING (true);

-- Admins can manage blog categories
CREATE POLICY "Admins can manage blog categories" ON blog_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POSTS POLICIES
-- ============================================

-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (status = 'published' OR published = true);

-- Admins can do everything with posts
CREATE POLICY "Admins can manage all posts" ON posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Authors can read their own posts
CREATE POLICY "Authors can read own posts" ON posts
  FOR SELECT USING (author_id = auth.uid());

-- ============================================
-- TAGS POLICIES
-- ============================================

CREATE POLICY "Anyone can read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POST TAGS POLICIES
-- ============================================

CREATE POLICY "Anyone can read post_tags" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage post_tags" ON post_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COMMENTS POLICIES
-- ============================================

CREATE POLICY "Anyone can read approved comments" ON comments
  FOR SELECT USING (approved = true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own comments" ON comments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage comments" ON comments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- EXERCISE CATEGORIES POLICIES
-- ============================================

-- Anyone can read exercise categories
CREATE POLICY "Anyone can read exercise categories" ON exercise_categories
  FOR SELECT USING (true);

-- Admins can manage exercise categories
CREATE POLICY "Admins can manage exercise categories" ON exercise_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- EXERCISE SUBCATEGORIES POLICIES
-- ============================================

-- Anyone can read exercise subcategories
CREATE POLICY "Anyone can read exercise subcategories" ON exercise_subcategories
  FOR SELECT USING (true);

-- Admins can manage exercise subcategories
CREATE POLICY "Admins can manage exercise subcategories" ON exercise_subcategories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- EXERCISES POLICIES
-- ============================================

-- Admins can do everything with exercises
CREATE POLICY "Admins can manage all exercises" ON exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Approved coaches can read exercises they have access to
CREATE POLICY "Coaches can read accessible exercises" ON exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'coach'
      AND approved = true
    )
    AND (
      -- Has category access
      EXISTS (
        SELECT 1 FROM coach_category_access
        WHERE coach_id = auth.uid()
        AND category_id = exercises.category_id
      )
      OR
      -- Has individual exercise access
      EXISTS (
        SELECT 1 FROM coach_exercise_access
        WHERE coach_id = auth.uid()
        AND exercise_id = exercises.id
      )
      OR
      -- Non-premium exercises are accessible to all approved coaches
      is_premium = false
    )
  );

-- ============================================
-- COACH ACCESS POLICIES
-- ============================================

-- Coaches can read their own access records
CREATE POLICY "Coaches can read own category access" ON coach_category_access
  FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "Coaches can read own exercise access" ON coach_exercise_access
  FOR SELECT USING (coach_id = auth.uid());

-- Admins can manage all access records
CREATE POLICY "Admins can manage coach category access" ON coach_category_access
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage coach exercise access" ON coach_exercise_access
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- CAMPS POLICIES
-- ============================================

-- Anyone can read published camps
CREATE POLICY "Anyone can read published camps" ON camps
  FOR SELECT USING (status = 'published');

-- Admins can manage all camps
CREATE POLICY "Admins can manage all camps" ON camps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- ACADEMIES POLICIES
-- ============================================

-- Anyone can read active academies
CREATE POLICY "Anyone can read active academies" ON academies
  FOR SELECT USING (status = 'active');

-- Admins can manage all academies
CREATE POLICY "Admins can manage all academies" ON academies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COURSES POLICIES
-- ============================================

-- Anyone can read published courses
CREATE POLICY "Anyone can read published courses" ON courses
  FOR SELECT USING (status = 'published');

-- Admins can manage all courses
CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COURSE MATERIALS POLICIES
-- ============================================

CREATE POLICY "Enrolled users can read course materials" ON course_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coach_progress
      WHERE user_id = auth.uid()
      AND course_id = course_materials.course_id
    )
  );

CREATE POLICY "Admins can manage course materials" ON course_materials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COACH PROGRESS POLICIES
-- ============================================

CREATE POLICY "Users can read own progress" ON coach_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage coach progress" ON coach_progress
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- INQUIRIES POLICIES
-- ============================================

-- Anyone can create inquiries (for contact forms)
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Admins can do everything with inquiries
CREATE POLICY "Admins can manage all inquiries" ON inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- AUDIT LOG POLICIES
-- ============================================

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- System can insert audit logs (using service role)
CREATE POLICY "System can insert audit logs" ON audit_log
  FOR INSERT WITH CHECK (true);

-- ============================================
-- TRAINING CONTENT POLICIES
-- ============================================

CREATE POLICY "Anyone can read training content" ON training_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage training content" ON training_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PLAYER PROGRESS POLICIES
-- ============================================

CREATE POLICY "Users can read own player progress" ON player_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own player progress" ON player_progress
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TESTIMONIALS POLICIES
-- ============================================

CREATE POLICY "Anyone can read testimonials" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PARTNERS POLICIES
-- ============================================

CREATE POLICY "Anyone can read partners" ON partners
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage partners" ON partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_subcategories_updated_at
  BEFORE UPDATE ON exercise_subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_camps_updated_at
  BEFORE UPDATE ON camps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academies_updated_at
  BEFORE UPDATE ON academies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'player'),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_old_values, p_new_values)
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA: Default Exercise Categories
-- ============================================
INSERT INTO exercise_categories (name, slug, description, icon, order_index) VALUES
  ('Ball Mastery', 'ball-mastery', 'Potpuna kontrola lopte u svim situacijama kroz tisuće ponavljanja', 'ball', 1),
  ('1v1 Potezi', '1v1', 'Repertoar poteza za nadmudriti bilo kojeg braniča', 'duel', 2),
  ('Primanje i Okretanje', 'receiving-turning', 'Tehnika primanja lopte i brzo okretanje prema golu', 'turn', 3),
  ('Dodavanje', 'passing', 'Preciznost i tehnika dodavanja na sve udaljenosti', 'pass', 4),
  ('Završnica', 'finishing', 'Preciznost i hladnokrvnost pred golom', 'goal', 5),
  ('Brzina i Agilnost', 'speed', 'Eksplozivnost i promjena smjera specifična za nogomet', 'sprint', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: Default Blog Categories
-- ============================================
INSERT INTO blog_categories (name, slug) VALUES
  ('Vijesti', 'vijesti'),
  ('Tehnike', 'tehnike'),
  ('Savjeti za trenere', 'savjeti-za-trenere'),
  ('Uspjesi', 'uspjesi')
ON CONFLICT (slug) DO NOTHING;
