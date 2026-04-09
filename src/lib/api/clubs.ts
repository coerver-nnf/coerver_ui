import { createClient } from "@/lib/supabase/client";
import {
  PartnerClub,
  ClubCoach,
  ClubCategoryAccess,
  ClubSubcategoryAccess,
  ClubExerciseAccess,
  CreateClubInput,
  UpdateClubInput,
} from "@/types/clubs";

// ============================================
// Club CRUD
// ============================================

export async function getClubs(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("partner_clubs")
    .select("*")
    .order("created_at", { ascending: false });

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

  // Get coach counts for each club
  const clubIds = data?.map((c) => c.id) || [];
  if (clubIds.length > 0) {
    const { data: coachCounts, error: countError } = await supabase
      .from("club_coaches")
      .select("club_id")
      .in("club_id", clubIds);

    if (countError) throw countError;

    const countMap = coachCounts?.reduce((acc, cc) => {
      acc[cc.club_id] = (acc[cc.club_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return data?.map((club) => ({
      ...club,
      coach_count: countMap[club.id] || 0,
    })) as PartnerClub[];
  }

  return data as PartnerClub[];
}

export async function getClubById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_clubs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as PartnerClub;
}

export async function getClubBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_clubs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as PartnerClub;
}

export async function createClub(input: CreateClubInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_clubs")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as PartnerClub;
}

export async function updateClub(input: UpdateClubInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("partner_clubs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PartnerClub;
}

export async function deleteClub(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("partner_clubs").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Club Coach Management
// ============================================

export async function getClubCoaches(clubId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_coaches")
    .select(
      `
      *,
      coach:profiles!club_coaches_coach_id_fkey(id, email, full_name, avatar_url, is_approved)
    `
    )
    .eq("club_id", clubId)
    .order("joined_at", { ascending: false });

  if (error) throw error;
  return data as ClubCoach[];
}

export async function addCoachToClub(
  clubId: string,
  coachId: string,
  role: "member" | "head_coach" = "member"
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("club_coaches")
    .insert({
      club_id: clubId,
      coach_id: coachId,
      role,
      added_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ClubCoach;
}

export async function removeCoachFromClub(clubId: string, coachId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("club_coaches")
    .delete()
    .eq("club_id", clubId)
    .eq("coach_id", coachId);

  if (error) throw error;
}

export async function updateCoachRole(
  clubId: string,
  coachId: string,
  role: "member" | "head_coach"
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_coaches")
    .update({ role })
    .eq("club_id", clubId)
    .eq("coach_id", coachId)
    .select()
    .single();

  if (error) throw error;
  return data as ClubCoach;
}

export async function getCoachesWithoutClub() {
  const supabase = createClient();

  // Get all coach IDs that are in a club
  const { data: clubCoaches, error: ccError } = await supabase
    .from("club_coaches")
    .select("coach_id");

  if (ccError) throw ccError;

  const coachIdsInClubs = clubCoaches?.map((cc) => cc.coach_id) || [];

  // Get all approved coaches
  const { data: allCoaches, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "coach")
    .eq("is_approved", true)
    .order("full_name");

  if (error) throw error;

  // Filter out coaches already in a club
  if (coachIdsInClubs.length > 0) {
    return allCoaches?.filter((coach) => !coachIdsInClubs.includes(coach.id)) || [];
  }

  return allCoaches || [];
}

// ============================================
// Club Category Access
// ============================================

export async function getClubCategoryAccess(clubId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_category_access")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug)
    `
    )
    .eq("club_id", clubId);

  if (error) throw error;
  return data as ClubCategoryAccess[];
}

export async function updateClubCategoryAccess(
  clubId: string,
  categoryIds: string[]
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get current access
  const { data: currentAccess, error: fetchError } = await supabase
    .from("club_category_access")
    .select("category_id")
    .eq("club_id", clubId);

  if (fetchError) throw fetchError;

  const currentIds = currentAccess?.map((a) => a.category_id) || [];

  // IDs to add
  const toAdd = categoryIds.filter((id) => !currentIds.includes(id));
  // IDs to remove
  const toRemove = currentIds.filter((id) => !categoryIds.includes(id));

  // Add new access
  if (toAdd.length > 0) {
    const { error: insertError } = await supabase
      .from("club_category_access")
      .insert(
        toAdd.map((categoryId) => ({
          club_id: clubId,
          category_id: categoryId,
          granted_by: user?.id,
        }))
      );

    if (insertError) throw insertError;
  }

  // Remove revoked access
  if (toRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from("club_category_access")
      .delete()
      .eq("club_id", clubId)
      .in("category_id", toRemove);

    if (deleteError) throw deleteError;
  }
}

// ============================================
// Club Subcategory Access
// ============================================

export async function getClubSubcategoryAccess(clubId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_subcategory_access")
    .select(
      `
      *,
      subcategory:exercise_subcategories(id, name, slug, category_id)
    `
    )
    .eq("club_id", clubId);

  if (error) throw error;
  return data as ClubSubcategoryAccess[];
}

export async function updateClubSubcategoryAccess(
  clubId: string,
  subcategoryIds: string[]
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get current access
  const { data: currentAccess, error: fetchError } = await supabase
    .from("club_subcategory_access")
    .select("subcategory_id")
    .eq("club_id", clubId);

  if (fetchError) throw fetchError;

  const currentIds = currentAccess?.map((a) => a.subcategory_id) || [];

  // IDs to add
  const toAdd = subcategoryIds.filter((id) => !currentIds.includes(id));
  // IDs to remove
  const toRemove = currentIds.filter((id) => !subcategoryIds.includes(id));

  // Add new access
  if (toAdd.length > 0) {
    const { error: insertError } = await supabase
      .from("club_subcategory_access")
      .insert(
        toAdd.map((subcategoryId) => ({
          club_id: clubId,
          subcategory_id: subcategoryId,
          granted_by: user?.id,
        }))
      );

    if (insertError) throw insertError;
  }

  // Remove revoked access
  if (toRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from("club_subcategory_access")
      .delete()
      .eq("club_id", clubId)
      .in("subcategory_id", toRemove);

    if (deleteError) throw deleteError;
  }
}

// ============================================
// Club Exercise Access
// ============================================

export async function getClubExerciseAccess(clubId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_exercise_access")
    .select(
      `
      *,
      exercise:exercises(id, title, slug)
    `
    )
    .eq("club_id", clubId);

  if (error) throw error;
  return data as ClubExerciseAccess[];
}

export async function updateClubExerciseAccess(
  clubId: string,
  exerciseIds: string[]
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get current access
  const { data: currentAccess, error: fetchError } = await supabase
    .from("club_exercise_access")
    .select("exercise_id")
    .eq("club_id", clubId);

  if (fetchError) throw fetchError;

  const currentIds = currentAccess?.map((a) => a.exercise_id) || [];

  // IDs to add
  const toAdd = exerciseIds.filter((id) => !currentIds.includes(id));
  // IDs to remove
  const toRemove = currentIds.filter((id) => !exerciseIds.includes(id));

  // Add new access
  if (toAdd.length > 0) {
    const { error: insertError } = await supabase
      .from("club_exercise_access")
      .insert(
        toAdd.map((exerciseId) => ({
          club_id: clubId,
          exercise_id: exerciseId,
          granted_by: user?.id,
        }))
      );

    if (insertError) throw insertError;
  }

  // Remove revoked access
  if (toRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from("club_exercise_access")
      .delete()
      .eq("club_id", clubId)
      .in("exercise_id", toRemove);

    if (deleteError) throw deleteError;
  }
}

// ============================================
// Stats
// ============================================

export async function getClubCounts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("partner_clubs")
    .select("status");

  if (error) throw error;

  const total = data?.length || 0;
  const active = data?.filter((c) => c.status === "active").length || 0;
  const inactive = data?.filter((c) => c.status === "inactive").length || 0;
  const pending = data?.filter((c) => c.status === "pending").length || 0;

  return { total, active, inactive, pending };
}

// ============================================
// Get coach's club
// ============================================

export async function getCoachClub(coachId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_coaches")
    .select(
      `
      *,
      club:partner_clubs(*)
    `
    )
    .eq("coach_id", coachId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw error;
  }
  return data as ClubCoach;
}
