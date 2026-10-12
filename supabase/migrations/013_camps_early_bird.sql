-- Early bird pricing for camps
-- Run this in Supabase SQL Editor

ALTER TABLE camps ADD COLUMN IF NOT EXISTS early_bird_price DECIMAL(10,2);
ALTER TABLE camps ADD COLUMN IF NOT EXISTS early_bird_price_full_day DECIMAL(10,2);
ALTER TABLE camps ADD COLUMN IF NOT EXISTS early_bird_price_day_only DECIMAL(10,2);
ALTER TABLE camps ADD COLUMN IF NOT EXISTS early_bird_deadline DATE;

COMMENT ON COLUMN camps.early_bird_price IS 'Early bird price for full camp with accommodation, shown until early_bird_deadline';
COMMENT ON COLUMN camps.early_bird_price_full_day IS 'Early bird price for full day without sleepover, shown until early_bird_deadline';
COMMENT ON COLUMN camps.early_bird_price_day_only IS 'Early bird price for training sessions only, shown until early_bird_deadline';
COMMENT ON COLUMN camps.early_bird_deadline IS 'Last date (inclusive) on which early bird prices apply';
