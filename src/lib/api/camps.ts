import { createClient } from "@/lib/supabase/client";

export interface DailyScheduleItem {
  time: string;
  activity: string;
  icon: string;
}

export interface WeeklyProgramItem {
  day: string;
  theme: string;
  description: string;
}

export interface IncludedItem {
  item: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  image?: string;
}

export interface Camp {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subtitle: string | null;
  location: string | null;
  address: string | null;
  map_url: string | null;
  start_date: string;
  end_date: string;
  price: number | null;
  early_bird_price: number | null;
  early_bird_deadline: string | null;
  capacity: number | null;
  spots: number | null;
  total_spots: number | null;
  age_min: number | null;
  age_max: number | null;
  age_groups: string[] | null;
  image_url: string | null;
  hero_image: string | null;
  gallery: string[] | null;
  highlights: string[] | null;
  daily_schedule: DailyScheduleItem[] | null;
  weekly_program: WeeklyProgramItem[] | null;
  included: IncludedItem[] | null;
  what_to_bring: string[] | null;
  faq: FaqItem[] | null;
  testimonials: TestimonialItem[] | null;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface CreateCampInput {
  title: string;
  slug: string;
  description?: string;
  subtitle?: string;
  location?: string;
  address?: string;
  map_url?: string;
  start_date: string;
  end_date: string;
  price?: number;
  early_bird_price?: number;
  early_bird_deadline?: string;
  capacity?: number;
  spots?: number;
  total_spots?: number;
  age_min?: number;
  age_max?: number;
  age_groups?: string[];
  image_url?: string;
  hero_image?: string;
  gallery?: string[];
  highlights?: string[];
  daily_schedule?: DailyScheduleItem[];
  weekly_program?: WeeklyProgramItem[];
  included?: IncludedItem[];
  what_to_bring?: string[];
  faq?: FaqItem[];
  testimonials?: TestimonialItem[];
  status?: "draft" | "published" | "cancelled" | "completed";
}

export interface UpdateCampInput extends Partial<CreateCampInput> {
  id: string;
}

// Camp CRUD
export async function getCamps(options?: {
  status?: string;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase.from("camps").select("*").order("start_date", { ascending: true });

  if (options?.status) {
    query = query.eq("status", options.status);
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
  return data as Camp[];
}

export async function getCampById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("camps")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Camp;
}

export async function getCampBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("camps")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Camp;
}

export async function createCamp(input: CreateCampInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("camps")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Camp;
}

export async function updateCamp(input: UpdateCampInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("camps")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Camp;
}

export async function deleteCamp(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("camps").delete().eq("id", id);
  if (error) throw error;
}

// Server-side functions
export async function getCampsServer(options?: {
  status?: string;
  upcoming?: boolean;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase.from("camps").select("*").order("start_date", { ascending: true });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.upcoming) {
    query = query.gte("start_date", new Date().toISOString().split("T")[0]);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Camp[];
}

export async function getCampBySlugServer(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("camps")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Camp;
}
