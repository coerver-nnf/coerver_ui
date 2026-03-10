-- Extended Camps Fields Migration
-- Run this in Supabase SQL Editor

-- Add new columns to camps table
ALTER TABLE camps ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS map_url TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS early_bird_price DECIMAL(10,2);
ALTER TABLE camps ADD COLUMN IF NOT EXISTS early_bird_deadline DATE;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS spots INTEGER;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS total_spots INTEGER;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS hero_image TEXT;

-- JSON array fields for complex data
ALTER TABLE camps ADD COLUMN IF NOT EXISTS highlights TEXT[];
ALTER TABLE camps ADD COLUMN IF NOT EXISTS daily_schedule JSONB DEFAULT '[]'::jsonb;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS weekly_program JSONB DEFAULT '[]'::jsonb;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS included JSONB DEFAULT '[]'::jsonb;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS what_to_bring TEXT[];
ALTER TABLE camps ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS age_groups TEXT[];

-- Comments for documentation
COMMENT ON COLUMN camps.subtitle IS 'Short subtitle/tagline for the camp';
COMMENT ON COLUMN camps.map_url IS 'Google Maps URL for the location';
COMMENT ON COLUMN camps.early_bird_price IS 'Early bird discount price';
COMMENT ON COLUMN camps.early_bird_deadline IS 'Deadline for early bird pricing';
COMMENT ON COLUMN camps.spots IS 'Current available spots';
COMMENT ON COLUMN camps.total_spots IS 'Total capacity of the camp';
COMMENT ON COLUMN camps.hero_image IS 'Main hero image URL for the camp page';
COMMENT ON COLUMN camps.highlights IS 'Array of highlight strings';
COMMENT ON COLUMN camps.daily_schedule IS 'JSON array of {time, activity, icon}';
COMMENT ON COLUMN camps.weekly_program IS 'JSON array of {day, theme, description}';
COMMENT ON COLUMN camps.included IS 'JSON array of {item, icon}';
COMMENT ON COLUMN camps.what_to_bring IS 'Array of items to bring';
COMMENT ON COLUMN camps.faq IS 'JSON array of {question, answer}';
COMMENT ON COLUMN camps.testimonials IS 'JSON array of {name, role, text, image?}';
COMMENT ON COLUMN camps.age_groups IS 'Array of age group strings like "7-9", "10-12"';
