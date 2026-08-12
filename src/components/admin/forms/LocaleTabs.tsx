"use client";

import { cn } from "@/lib/utils";

export type EditLocale = "hr" | "sl" | "en";

const LOCALE_LABELS: Record<EditLocale, string> = {
  hr: "Hrvatski",
  sl: "Slovenski",
  en: "Engleski",
};

interface LocaleTabsProps {
  value: EditLocale;
  onChange: (locale: EditLocale) => void;
  /** Whether each non-hr locale has any translated content (shows a dot). */
  completeness?: Partial<Record<Exclude<EditLocale, "hr">, boolean>>;
  className?: string;
}

/**
 * HR/SL/EN tab strip for admin content forms. The HR tab edits the base
 * columns; SL/EN tabs edit the row's `translations` JSONB overrides.
 */
export function LocaleTabs({
  value,
  onChange,
  completeness,
  className,
}: LocaleTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1",
        className
      )}
      role="tablist"
      aria-label="Jezik sadržaja"
    >
      {(Object.keys(LOCALE_LABELS) as EditLocale[]).map((locale) => {
        const isActive = locale === value;
        const hasContent =
          locale === "hr" ? true : completeness?.[locale] ?? false;
        return (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(locale)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-coerver-dark shadow-sm"
                : "text-gray-500 hover:text-coerver-dark"
            )}
          >
            <span className="uppercase font-bold text-xs">{locale}</span>
            <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
            {locale !== "hr" && (
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  hasContent ? "bg-coerver-green" : "bg-gray-300"
                )}
                title={hasContent ? "Prijevod postoji" : "Nema prijevoda"}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
