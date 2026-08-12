"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
}

export function LanguageSwitcher({
  orientation = "horizontal",
  className,
  buttonClassName,
  activeButtonClassName,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchTo = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    // Pass dynamic route params through so [slug] pages keep their path
    router.replace(
      // @ts-expect-error -- params are compatible with the current pathname
      { pathname, params },
      { locale: nextLocale }
    );
  };

  return (
    <div
      role="group"
      aria-label={t("changeLanguage")}
      className={cn(
        "flex items-center gap-1",
        orientation === "vertical" && "flex-col",
        className
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "text-[11px] font-bold uppercase tracking-wider w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
            buttonClassName,
            l === locale &&
              (activeButtonClassName ?? "bg-coerver-green text-white shadow-md")
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
