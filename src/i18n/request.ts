import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

// Missing sl/en keys fall back to the Croatian string instead of erroring
function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = result[key];
    const overrideVal = override[key];
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === "object" &&
      typeof overrideVal === "object" &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overrideVal)
    ) {
      result[key] = deepMerge(baseVal as Messages, overrideVal as Messages);
    } else {
      result[key] = overrideVal;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const hrMessages = (await import(`../../messages/hr.json`)).default;
  const messages =
    locale === "hr"
      ? hrMessages
      : deepMerge(
          hrMessages,
          (await import(`../../messages/${locale}.json`)).default
        );

  return { locale, messages };
});
