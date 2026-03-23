-- Camps Accommodation Pricing Migration
-- Run this in Supabase SQL Editor

-- Add day-only price field (price field will be used for full camp with accommodation)
ALTER TABLE camps ADD COLUMN IF NOT EXISTS price_day_only DECIMAL(10,2);

-- Add registration deadline field
ALTER TABLE camps ADD COLUMN IF NOT EXISTS registration_deadline DATE;

-- Drop early bird columns (no longer needed)
ALTER TABLE camps DROP COLUMN IF EXISTS early_bird_price;
ALTER TABLE camps DROP COLUMN IF EXISTS early_bird_deadline;

-- Comments for documentation
COMMENT ON COLUMN camps.price IS 'Full camp price with accommodation (sleeping)';
COMMENT ON COLUMN camps.price_day_only IS 'Day-only camp price without accommodation';
COMMENT ON COLUMN camps.registration_deadline IS 'Last date for camp registration';
