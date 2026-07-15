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

export default async function AkademijePage() {
  const academies = await getActiveAcademies();

  return <AkademijePageClient academies={academies} />;
}
