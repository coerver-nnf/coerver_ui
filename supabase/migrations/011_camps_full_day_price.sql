-- Add price_full_day field for full day attendance without sleeping over
ALTER TABLE camps ADD COLUMN IF NOT EXISTS price_full_day DECIMAL(10,2);

COMMENT ON COLUMN camps.price IS 'Price for full camp with accommodation (sleepover)';
COMMENT ON COLUMN camps.price_full_day IS 'Price for full day activities without sleeping over';
COMMENT ON COLUMN camps.price_day_only IS 'Price for training sessions only (partial day)';
