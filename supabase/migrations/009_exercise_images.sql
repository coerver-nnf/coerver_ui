-- Add additional image fields to exercises table
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS image_1 TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS image_2 TEXT;
