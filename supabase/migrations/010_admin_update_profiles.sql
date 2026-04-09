-- Allow admins to update any profile (for approving coaches, etc.)
-- SAFE: This only affects UPDATE operations, not SELECT (which login uses)
-- The SELECT policy is already permissive (USING true), so this subquery can read profiles

-- Drop and recreate the update policy to include admin access
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Policy: Users can update own profile OR admins can update any profile
-- Using a simple scalar subquery to check admin role
CREATE POLICY "Users and admins can update profiles" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  )
  WITH CHECK (
    auth.uid() = id
    OR
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );
