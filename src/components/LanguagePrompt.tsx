"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const STORAGE_KEY = "coerver-lang-prompt-dismissed";

// Shown in the visitor's own language, so texts live here rather than
// in the per-page message catalogs.
const PROMPT_TEXTS: Record<Locale, { text: string; switch: string; dismiss: string }> = {
  hr: {
    text: "Ova web stranica dostupna je i na hrvatskom jeziku. Želite li prebaciti?",
    switch: "Prebaci na hrvatski",
    dismiss: "Ne, hvala",
  },
  sl: {
    text: "Ta spletna stran je na voljo tudi v slovenščini. Želite preklopiti?",
    switch: "Preklopi na slovenščino",
    dismiss: "Ne, hvala",
  },
  en: {
    text: "This website is also available in English. Would you like to switch?",
    switch: "Switch to English",
    dismiss: "No, thanks",
  },
};

function detectBrowserLocale(): Locale | null {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const lang of langs) {
    const base = lang?.toLowerCase().split("-")[0];
    if ((routing.locales as readonly string[]).includes(base)) {
      return base as Locale;
    }
  }
  return null;
}

export function LanguagePrompt() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    const browserLocale = detectBrowserLocale();
    if (browserLocale && browserLocale !== locale) {
      setSuggested(browserLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!suggested) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setSuggested(null);
  };

  const switchLocale = () => {
    const target = suggested;
    dismiss();
    router.replace(
      // @ts-expect-error -- params are compatible with the current pathname
      { pathname, params },
      { locale: target }
    );
  };

  const texts = PROMPT_TEXTS[suggested];

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[90] animate-slide-up"
    >
      <div className="bg-coerver-dark text-white rounded-2xl shadow-2xl shadow-black/30 border border-white/10 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-coerver-green/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </div>
          <p className="text-sm text-white/90 leading-relaxed">{texts.text}</p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={switchLocale}
            className="flex-1 bg-coerver-green hover:bg-coerver-green/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            {texts.switch}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            {texts.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
