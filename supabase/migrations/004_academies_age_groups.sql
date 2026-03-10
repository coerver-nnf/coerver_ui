-- Add age_groups to academies table
-- Run this in Supabase SQL Editor

ALTER TABLE academies ADD COLUMN IF NOT EXISTS age_groups TEXT[];

COMMENT ON COLUMN academies.age_groups IS 'Array of age group strings like "5-7", "8-10", "11-13"';
