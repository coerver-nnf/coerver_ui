import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hr", "sl", "en"],
  defaultLocale: "hr",
  // Croatian stays on unprefixed URLs; sl/en get /sl and /en prefixes
  localePrefix: "as-needed",
  // No Accept-Language redirects — everyone lands on Croatian
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
