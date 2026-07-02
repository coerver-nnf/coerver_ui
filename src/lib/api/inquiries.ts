import { createClient } from "@/lib/supabase/client";

export type InquiryType = "camp" | "academy" | "course" | "club" | "general";
export type InquiryStatus = "new" | "in_progress" | "resolved" | "spam";

export interface Inquiry {
  id: string;
  type: InquiryType;
  reference_id: string | null;
  program_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  child_name: string | null;
  child_age: number | null;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  program_name?: string | null;
}

export interface CreateInquiryInput {
  type: InquiryType;
  reference_id?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  child_name?: string;
  child_age?: number;
}

export interface UpdateInquiryInput {
  id: string;
  status?: InquiryStatus;
  admin_notes?: string;
}

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  camp: "Kamp",
  academy: "Akademija",
  course: "Tečaj",
  club: "Klub",
  general: "Opći upit",
};

// Get inquiries with program names
export async function getInquiries(options?: {
  type?: InquiryType;
  status?: InquiryStatus;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.type) {
    query = query.eq("type", options.type);
  }
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

  const inquiries = data as Inquiry[];

  // Fetch program names for each type
  const campIds = inquiries.filter(i => i.type === "camp" && i.program_id).map(i => i.program_id!);
  const academyIds = inquiries.filter(i => i.type === "academy" && i.program_id).map(i => i.program_id!);
  const courseIds = inquiries.filter(i => i.type === "course" && i.program_id).map(i => i.program_id!);

  const programNames: Record<string, string> = {};

  // Fetch camp names
  if (campIds.length > 0) {
    const { data: camps } = await supabase
      .from("camps")
      .select("id, title")
      .in("id", campIds);
    camps?.forEach(c => { programNames[c.id] = c.title; });
  }

  // Fetch academy names
  if (academyIds.length > 0) {
    const { data: academies } = await supabase
      .from("academies")
      .select("id, name")
      .in("id", academyIds);
    academies?.forEach(a => { programNames[a.id] = a.name; });
  }

  // Fetch course names
  if (courseIds.length > 0) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title")
      .in("id", courseIds);
    courses?.forEach(c => { programNames[c.id] = c.title; });
  }

  // Attach program names to inquiries
  return inquiries.map(inquiry => ({
    ...inquiry,
    program_name: inquiry.program_id ? programNames[inquiry.program_id] || null : null,
  }));
}

// Get inquiry by ID
export async function getInquiryById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Inquiry;
}

// Create inquiry (public - for contact forms)
export async function createInquiry(input: CreateInquiryInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      ...input,
      status: "new",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

// Update inquiry (admin only)
export async function updateInquiry(input: UpdateInquiryInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("inquiries")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

// Update inquiry status
export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  return updateInquiry({ id, status });
}

// Add admin notes
export async function addInquiryNotes(id: string, notes: string) {
  return updateInquiry({ id, admin_notes: notes });
}

// Delete inquiry
export async function deleteInquiry(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
}

// Get inquiry counts for dashboard
export async function getInquiryCounts() {
  const supabase = createClient();

  const { data, error } = await supabase.from("inquiries").select("status");

  if (error) throw error;

  const total = data?.length || 0;
  const newCount = data?.filter((i) => i.status === "new").length || 0;
  const inProgress = data?.filter((i) => i.status === "in_progress").length || 0;
  const resolved = data?.filter((i) => i.status === "resolved").length || 0;

  return { total, new: newCount, in_progress: inProgress, resolved };
}

// Server-side functions
export async function getInquiriesServer(options?: {
  type?: InquiryType;
  status?: InquiryStatus;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.type) {
    query = query.eq("type", options.type);
  }
  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Inquiry[];
}
