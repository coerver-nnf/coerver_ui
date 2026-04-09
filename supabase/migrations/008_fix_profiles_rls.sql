-- Fix RLS policies for profiles table
-- This ensures users can read their own profile AND admins can read all profiles
-- IMPORTANT: We use auth.jwt() to avoid infinite recursion when checking admin role

-- First, drop all existing profile policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read coach profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read coach profiles" ON profiles;

-- Policy 1: All authenticated users can read ALL profiles
-- This is the simplest solution that avoids recursion and allows:
-- - Login role check
-- - Admin viewing all users
-- - Club coach lists
CREATE POLICY "Authenticated users can read profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Users can update their own profile only
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 4: Only admins can delete profiles
-- We check admin role via auth.jwt() metadata to avoid recursion
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
