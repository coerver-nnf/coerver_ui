-- Birth year range (godišta) accepted for camp signups.
-- The inquiry form derives its birth-year dropdown from these values;
-- when NULL it falls back to a generic range based on the current year.
ALTER TABLE camps ADD COLUMN IF NOT EXISTS birth_year_min INTEGER;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS birth_year_max INTEGER;

COMMENT ON COLUMN camps.birth_year_min IS 'Oldest accepted birth year (e.g. 2013)';
COMMENT ON COLUMN camps.birth_year_max IS 'Youngest accepted birth year (e.g. 2019)';

-- Metković 2027: signups open for godišta 2013-2019
UPDATE camps
SET birth_year_min = 2013,
    birth_year_max = 2019
WHERE slug = 'coerver-camp-metkovic-2027';
