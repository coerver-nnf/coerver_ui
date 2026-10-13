import { createClient } from "@/lib/supabase/client";
import type { Translations } from "@/lib/i18n/localize";

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
  price_full_day: number | null;
  price_day_only: number | null;
  early_bird_price: number | null;
  early_bird_price_full_day: number | null;
  early_bird_price_day_only: number | null;
  early_bird_deadline: string | null;
  registration_deadline: string | null;
  capacity: number | null;
  spots: number | null;
  total_spots: number | null;
  age_min: number | null;
  age_max: number | null;
  age_groups: string[] | null;
  birth_year_min: number | null;
  birth_year_max: number | null;
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
  translations?: Translations | null;
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
  price_full_day?: number;
  price_day_only?: number;
  early_bird_price?: number;
  early_bird_price_full_day?: number;
  early_bird_price_day_only?: number;
  early_bird_deadline?: string;
  registration_deadline?: string;
  capacity?: number;
  spots?: number;
  total_spots?: number;
  age_min?: number;
  age_max?: number;
  age_groups?: string[];
  birth_year_min?: number;
  birth_year_max?: number;
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
  translations?: Translations;
}

// Updates may write explicit nulls to clear optional columns
export interface UpdateCampInput
  extends Partial<{ [K in keyof CreateCampInput]: CreateCampInput[K] | null }> {
  id: string;
}

/** Early bird prices apply through the end of the deadline day (inclusive). */
export function isEarlyBirdActive(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return Date.now() <= new Date(`${deadline}T23:59:59`).getTime();
}

export interface TierPrice {
  amount: number;
  /** Regular price, set only when an early bird discount is currently applied. */
  regular: number | null;
}

/** Resolves the price to display for one tier, applying the early bird discount when active. */
export function getTierPrice(
  regular: number | null,
  earlyBird: number | null,
  earlyBirdActive: boolean
): TierPrice | null {
  if (!regular || regular <= 0) return null;
  if (earlyBirdActive && earlyBird && earlyBird > 0 && earlyBird < regular) {
    return { amount: earlyBird, regular };
  }
  return { amount: regular, regular: null };
}

/** Effective prices for all three camp tiers (null = tier not offered). */
export function getCampTierPrices(camp: Camp): {
  accommodation: TierPrice | null;
  fullDay: TierPrice | null;
  trainingOnly: TierPrice | null;
  earlyBirdActive: boolean;
} {
  const active = isEarlyBirdActive(camp.early_bird_deadline);
  const accommodation = getTierPrice(camp.price, camp.early_bird_price, active);
  const fullDay = getTierPrice(camp.price_full_day, camp.early_bird_price_full_day, active);
  const trainingOnly = getTierPrice(camp.price_day_only, camp.early_bird_price_day_only, active);
  const earlyBirdActive =
    active &&
    [accommodation, fullDay, trainingOnly].some((tier) => tier?.regular != null);
  return { accommodation, fullDay, trainingOnly, earlyBirdActive };
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
