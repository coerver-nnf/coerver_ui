import { localizeMany } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { createStaticClient } from "@/lib/supabase/static";
import { Camp } from "@/lib/api/camps";
import KampoviPageClient from "./KampoviPageClient";

export const revalidate = 3600;

async function getPublishedCamps(): Promise<Camp[]> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .eq("status", "published")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return (data as Camp[]) ?? [];
  } catch (error) {
    console.error("Error loading camps:", error);
    return [];
  }
}

export default async function KampoviPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const camps = localizeMany(await getPublishedCamps(), locale as Locale);
  return <KampoviPageClient camps={camps} />;
}
