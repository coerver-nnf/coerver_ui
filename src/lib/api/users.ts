import { createClient } from "@/lib/supabase/client";

export type UserRole = "player" | "coach" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string;
  avatar_url: string | null;
  role: UserRole;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserInput {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: UserRole;
  approved?: boolean;
}

// Get all users
export async function getUsers(options?: {
  role?: UserRole;
  is_approved?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const supabase = createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.role) {
    query = query.eq("role", options.role);
  }
  if (options?.is_approved !== undefined) {
    query = query.eq("is_approved", options.is_approved);
  }
  if (options?.search) {
    query = query.or(
      `full_name.ilike.%${options.search}%,email.ilike.%${options.search}%`
    );
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as User[];
}

// Get user by ID
export async function getUserById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as User;
}

// Update user
export async function updateUser(input: UpdateUserInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// Change user role
export async function changeUserRole(id: string, role: UserRole) {
  return updateUser({ id, role });
}

// Toggle user approval
export async function toggleUserApproval(id: string, approved: boolean) {
  return updateUser({ id, approved });
}

// Delete user (soft delete by setting inactive, or hard delete)
export async function deleteUser(id: string) {
  const supabase = createClient();
  // Note: This will cascade delete due to FK constraint
  // Consider implementing soft delete if needed
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

// Get user counts for dashboard
export async function getUserCounts() {
  const supabase = createClient();

  const { data, error } = await supabase.from("profiles").select("role");

  if (error) throw error;

  const total = data?.length || 0;
  const players = data?.filter((u) => u.role === "player").length || 0;
  const coaches = data?.filter((u) => u.role === "coach").length || 0;
  const admins = data?.filter((u) => u.role === "admin").length || 0;

  return { total, players, coaches, admins };
}

// Get current user profile
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data as User;
}

// Check if current user is admin
export async function isCurrentUserAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

