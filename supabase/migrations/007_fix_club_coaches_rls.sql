-- Fix RLS policies for club coaches functionality
-- This migration adds additional policies to ensure admins can properly query coach data

-- Allow admins to read all profiles (for joins in club_coaches queries)
-- The existing "Admins have full access to profiles" policy should work, but let's ensure it's correct
DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Also allow coaches to read basic info of other coaches (for club member lists)
CREATE POLICY "Authenticated users can read coach profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (role = 'coach');
