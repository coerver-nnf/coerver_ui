import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

export const OG_LOCALES: Record<Locale, string> = {
  hr: "hr_HR",
  sl: "sl_SI",
  en: "en_US",
};

/** Path in a given locale: hr stays unprefixed, sl/en get a prefix. */
export function localePath(path: string, locale: Locale): string {
  const normalized = path === "/" ? "" : path;
  return locale === "hr" ? normalized || "/" : `/${locale}${normalized}`;
}

/**
 * hreflang alternates for a public page. `path` is the unprefixed
 * (Croatian) pathname, e.g. "/za-igrace/kampovi". Relies on metadataBase
 * set in the root layout for absolute URLs.
 */
export function localeAlternates(
  path: string,
  currentLocale: Locale
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(path, currentLocale),
    languages: {
      hr: localePath(path, "hr"),
      sl: localePath(path, "sl"),
      en: localePath(path, "en"),
      "x-default": localePath(path, "hr"),
    },
  };
}
