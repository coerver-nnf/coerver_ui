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

export default async function KampoviPage() {
  const camps = await getPublishedCamps();
  return <KampoviPageClient camps={camps} />;
}
