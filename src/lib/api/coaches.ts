import { createClient } from "@/lib/supabase/client";

export interface Coach {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string;
  avatar_url: string | null;
  role: "coach";
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  category_access?: CategoryAccess[];
  exercise_access?: ExerciseAccess[];
}

export interface CategoryAccess {
  id: string;
  coach_id: string;
  category_id: string;
  granted_at: string;
  granted_by: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ExerciseAccess {
  id: string;
  coach_id: string;
  exercise_id: string;
  granted_at: string;
  granted_by: string | null;
  exercise?: {
    id: string;
    title: string;
    slug: string;
  };
}

// Get all coaches
export async function getCoaches(options?: {
  is_approved?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "coach")
    .order("created_at", { ascending: false });

  if (options?.is_approved !== undefined) {
    query = query.eq("is_approved", options.is_approved);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Coach[];
}

// Get coach by ID with access
export async function getCoachById(id: string) {
  const supabase = createClient();

  // Get coach profile
  const { data: coach, error: coachError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "coach")
    .single();

  if (coachError) throw coachError;

  // Get category access
  const { data: categoryAccess, error: catError } = await supabase
    .from("coach_category_access")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug)
    `
    )
    .eq("coach_id", id);

  if (catError) throw catError;

  // Get exercise access
  const { data: exerciseAccess, error: exError } = await supabase
    .from("coach_exercise_access")
    .select(
      `
      *,
      exercise:exercises(id, title, slug)
    `
    )
    .eq("coach_id", id);

  if (exError) throw exError;

  return {
    ...coach,
    category_access: categoryAccess,
    exercise_access: exerciseAccess,
  } as Coach;
}

// Approve coach
export async function approveCoach(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ approved: true })
    .eq("id", id)
    .eq("role", "coach")
    .select()
    .single();

  if (error) throw error;
  return data as Coach;
}

// Reject/Unapprove coach
export async function rejectCoach(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ approved: false })
    .eq("id", id)
    .eq("role", "coach")
    .select()
    .single();

  if (error) throw error;
  return data as Coach;
}

// Grant category access
export async function grantCategoryAccess(coachId: string, categoryId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("coach_category_access")
    .insert({
      coach_id: coachId,
      category_id: categoryId,
      granted_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CategoryAccess;
}

// Revoke category access
export async function revokeCategoryAccess(coachId: string, categoryId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("coach_category_access")
    .delete()
    .eq("coach_id", coachId)
    .eq("category_id", categoryId);

  if (error) throw error;
}

// Grant exercise access
export async function grantExerciseAccess(coachId: string, exerciseId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("coach_exercise_access")
    .insert({
      coach_id: coachId,
      exercise_id: exerciseId,
      granted_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ExerciseAccess;
}

// Revoke exercise access
export async function revokeExerciseAccess(coachId: string, exerciseId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("coach_exercise_access")
    .delete()
    .eq("coach_id", coachId)
    .eq("exercise_id", exerciseId);

  if (error) throw error;
}

// Bulk update category access
export async function updateCategoryAccess(
  coachId: string,
  categoryIds: string[]
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get current access
  const { data: currentAccess, error: fetchError } = await supabase
    .from("coach_category_access")
    .select("category_id")
    .eq("coach_id", coachId);

  if (fetchError) throw fetchError;

  const currentIds = currentAccess?.map((a) => a.category_id) || [];

  // IDs to add
  const toAdd = categoryIds.filter((id) => !currentIds.includes(id));
  // IDs to remove
  const toRemove = currentIds.filter((id) => !categoryIds.includes(id));

  // Add new access
  if (toAdd.length > 0) {
    const { error: insertError } = await supabase
      .from("coach_category_access")
      .insert(
        toAdd.map((categoryId) => ({
          coach_id: coachId,
          category_id: categoryId,
          granted_by: user?.id,
        }))
      );

    if (insertError) throw insertError;
  }

  // Remove revoked access
  if (toRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from("coach_category_access")
      .delete()
      .eq("coach_id", coachId)
      .in("category_id", toRemove);

    if (deleteError) throw deleteError;
  }
}

// Get coach counts for dashboard
export async function getCoachCounts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("is_approved")
    .eq("role", "coach");

  if (error) throw error;

  const total = data?.length || 0;
  const approved = data?.filter((c) => c.is_approved).length || 0;
  const pending = total - approved;

  return { total, approved, pending };
}

// Server-side functions
export async function getCoachesServer(options?: {
  is_approved?: boolean;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "coach")
    .order("created_at", { ascending: false });

  if (options?.is_approved !== undefined) {
    query = query.eq("is_approved", options.is_approved);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Coach[];
}
