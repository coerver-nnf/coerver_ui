-- Multi-language support: per-row translations for public content.
-- Shape: { "sl": { "<field>": <override> }, "en": { ... } }
-- Missing locales/fields fall back to the base (Croatian) columns.
-- Array/JSONB fields (camps.daily_schedule, faq, ...) are overridden wholesale.

ALTER TABLE camps ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN camps.translations IS 'Locale-keyed field overrides, e.g. {"sl": {"title": "..."}, "en": {...}}; falls back to base columns';
COMMENT ON COLUMN academies.translations IS 'Locale-keyed field overrides; falls back to base columns';
COMMENT ON COLUMN courses.translations IS 'Locale-keyed field overrides; falls back to base columns';
COMMENT ON COLUMN posts.translations IS 'Locale-keyed field overrides; falls back to base columns';
COMMENT ON COLUMN blog_categories.translations IS 'Locale-keyed field overrides; falls back to base columns';
COMMENT ON COLUMN testimonials.translations IS 'Locale-keyed field overrides; falls back to base columns';
