import { localizeMany } from "@/lib/i18n/localize";
import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { createStaticClient } from "@/lib/supabase/static";
import { Course } from "@/lib/api/courses";
import YouthDiploma2Client from "./YouthDiploma2Client";

export const revalidate = 3600;

async function getUpcomingCourses(): Promise<Course[]> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("start_date", { ascending: true })
      .eq("status", "published")
      .eq("type", "youth-diploma-2")
      .gte("start_date", new Date().toISOString().split("T")[0]);

    if (error) throw error;
    return (data as Course[]) ?? [];
  } catch (error) {
    console.error("Error loading courses:", error);
    return [];
  }
}

export default async function YouthDiploma2Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const courses = localizeMany(await getUpcomingCourses(), locale as Locale);

  return <YouthDiploma2Client courses={courses} />;
}
