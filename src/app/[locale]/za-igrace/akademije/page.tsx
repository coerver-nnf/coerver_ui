import { localizeMany } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { createStaticClient } from "@/lib/supabase/static";
import { Academy } from "@/lib/api/academies";
import AkademijePageClient from "./AkademijePageClient";

export const revalidate = 3600;

async function getActiveAcademies(): Promise<Academy[]> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("academies")
      .select("*")
      .eq("status", "active")
      .order("name");

    if (error) throw error;
    // Match previous client behavior: fetched ordered by name, then reversed.
    return ((data as Academy[]) || []).reverse();
  } catch (error) {
    console.error("Error loading academies:", error);
    return [];
  }
}

export default async function AkademijePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const academies = localizeMany(await getActiveAcademies(), locale as Locale);

  return <AkademijePageClient academies={academies} />;
}
