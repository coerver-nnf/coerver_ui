import { createClient } from "@/lib/supabase/client";

export interface Camp {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  address: string | null;
  start_date: string;
  end_date: string;
  price: number | null;
  capacity: number | null;
  age_min: number | null;
  age_max: number | null;
  image_url: string | null;
  gallery: string[] | null;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface CreateCampInput {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  address?: string;
  start_date: string;
  end_date: string;
  price?: number;
  capacity?: number;
  age_min?: number;
  age_max?: number;
  image_url?: string;
  gallery?: string[];
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
