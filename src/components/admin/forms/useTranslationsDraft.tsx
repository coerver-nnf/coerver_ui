"use client";

import { useCallback, useState } from "react";
import type { Translations } from "@/lib/i18n/localize";
import type { EditLocale } from "./LocaleTabs";

export type TranslationLocale = Exclude<EditLocale, "hr">;

const TRANSLATION_LOCALES: TranslationLocale[] = ["sl", "en"];

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

/** Drops empty-string/null overrides (and empty locale objects) before saving. */
export function cleanTranslations(translations: Translations): Translations {
  const cleaned: Translations = {};
  for (const locale of TRANSLATION_LOCALES) {
    const overrides = translations[locale];
    if (!overrides) continue;
    const entries = Object.entries(overrides).filter(([, v]) => hasValue(v));
    if (entries.length > 0) cleaned[locale] = Object.fromEntries(entries);
  }
  return cleaned;
}

/** Local draft state for a row's `translations` JSONB in admin forms. */
export function useTranslationsDraft(initial?: Translations | null) {
  const [translations, setTranslations] = useState<Translations>(
    initial ?? {}
  );

  const getField = useCallback(
    (locale: TranslationLocale, field: string): string => {
      const value = translations[locale]?.[field];
      return typeof value === "string" ? value : "";
    },
    [translations]
  );

  const setField = useCallback(
    (locale: TranslationLocale, field: string, value: string) => {
      setTranslations((prev) => ({
        ...prev,
        [locale]: { ...(prev[locale] ?? {}), [field]: value },
      }));
    },
    []
  );

  const completeness: Record<TranslationLocale, boolean> = {
    sl: Object.values(translations.sl ?? {}).some(hasValue),
    en: Object.values(translations.en ?? {}).some(hasValue),
  };

  return { translations, setTranslations, getField, setField, completeness };
}

/** Small inline action that copies the Croatian value into the translation field. */
export function CopyFromHrButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-1 text-right">
      <button
        type="button"
        onClick={onClick}
        className="text-xs font-medium text-coerver-green hover:underline"
      >
        Kopiraj iz HR
      </button>
    </div>
  );
}
