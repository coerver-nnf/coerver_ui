import { createClient } from "@/lib/supabase/client";

export type CourseType = "coerver-intro" | "youth-diploma-1" | "youth-diploma-2";

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: CourseType | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  capacity: number | null;
  image_url: string | null;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface CreateCourseInput {
  title: string;
  slug: string;
  description?: string;
  type?: CourseType;
  location?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  capacity?: number;
  image_url?: string;
  status?: "draft" | "published" | "cancelled" | "completed";
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string;
}

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  "coerver-intro": "Coerver Intro",
  "youth-diploma-1": "Youth Diploma 1",
  "youth-diploma-2": "Youth Diploma 2",
};

// Course CRUD
export async function getCourses(options?: {
  status?: string;
  type?: CourseType;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase.from("courses").select("*").order("start_date", { ascending: true });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.type) {
    query = query.eq("type", options.type);
  }
  if (options?.upcoming) {
    query = query.gte("start_date", new Date().toISOString().split("T")[0]);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Course[];
}

export async function getCourseById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Course;
}

export async function getCourseBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Course;
}

export async function createCourse(input: CreateCourseInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Course;
}

export async function updateCourse(input: UpdateCourseInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Course;
}

export async function deleteCourse(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

// Server-side functions
export async function getCoursesServer(options?: {
  status?: string;
  type?: CourseType;
  upcoming?: boolean;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase.from("courses").select("*").order("start_date", { ascending: true });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.type) {
    query = query.eq("type", options.type);
  }
  if (options?.upcoming) {
    query = query.gte("start_date", new Date().toISOString().split("T")[0]);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Course[];
}

export async function getCourseBySlugServer(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Course;
}
