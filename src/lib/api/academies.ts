import { createClient } from "@/lib/supabase/client";

export interface Academy {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  image_url: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CreateAcademyInput {
  name: string;
  slug: string;
  description?: string;
  location?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  image_url?: string;
  status?: "active" | "inactive";
}

export interface UpdateAcademyInput extends Partial<CreateAcademyInput> {
  id: string;
}

// Academy CRUD
export async function getAcademies(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase.from("academies").select("*").order("name");

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Academy[];
}

export async function getAcademyById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Academy;
}

export async function getAcademyBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Academy;
}

export async function createAcademy(input: CreateAcademyInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("academies")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Academy;
}

export async function updateAcademy(input: UpdateAcademyInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("academies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Academy;
}

export async function deleteAcademy(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("academies").delete().eq("id", id);
  if (error) throw error;
}

// Server-side functions
export async function getAcademiesServer(options?: {
  status?: string;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase.from("academies").select("*").order("name");

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Academy[];
}

export async function getAcademyBySlugServer(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Academy;
}
