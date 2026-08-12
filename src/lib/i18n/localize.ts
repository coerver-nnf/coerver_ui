import type { Locale } from "@/i18n/routing";

export type Translations = Partial<
  Record<Exclude<Locale, "hr">, Record<string, unknown>>
>;

interface Translatable {
  translations?: Translations | null;
}

function isEmptyOverride(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Merges the locale's translation overrides over the base (Croatian) fields.
 * Empty overrides (null, "", []) are skipped so partial translations fall
 * back to Croatian. Arrays/JSONB fields are replaced wholesale.
 */
export function localize<T extends Translatable>(
  entity: T,
  locale: Locale
): T {
  if (locale === "hr" || !entity?.translations) return entity;
  const overrides = entity.translations[locale as Exclude<Locale, "hr">];
  if (!overrides) return entity;

  const result: Record<string, unknown> = { ...(entity as Record<string, unknown>) };
  for (const [field, value] of Object.entries(overrides)) {
    if (!isEmptyOverride(value) && field in result) {
      result[field] = value;
    }
  }
  return result as T;
}

export function localizeMany<T extends Translatable>(
  entities: T[],
  locale: Locale
): T[] {
  if (locale === "hr") return entities;
  return entities.map((e) => localize(e, locale));
}

/** Localizes a post including its joined category (own translations column). */
export function localizePost<
  T extends Translatable & { category?: Translatable | null }
>(post: T, locale: Locale): T {
  const localized = localize(post, locale);
  if (localized.category) {
    return { ...localized, category: localize(localized.category, locale) };
  }
  return localized;
}

export function localizePosts<
  T extends Translatable & { category?: Translatable | null }
>(posts: T[], locale: Locale): T[] {
  if (locale === "hr") return posts;
  return posts.map((p) => localizePost(p, locale));
}
