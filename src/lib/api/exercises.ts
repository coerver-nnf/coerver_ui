import { createClient } from "@/lib/supabase/client";

export interface Exercise {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  category_id: string | null;
  subcategory_id: string | null;
  coaching_points: string[] | null;
  equipment: string[] | null;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  category?: ExerciseCategory | null;
  subcategory?: ExerciseSubcategory | null;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  created_at: string;
  exercise_count?: number;
  subcategory_count?: number;
}

export interface ExerciseSubcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  category?: ExerciseCategory | null;
  exercise_count?: number;
}

export interface CreateExerciseInput {
  title: string;
  slug: string;
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  category_id?: string;
  subcategory_id?: string;
  coaching_points?: string[];
  equipment?: string[];
  is_premium?: boolean;
  order_index?: number;
}

export interface UpdateExerciseInput extends Partial<CreateExerciseInput> {
  id: string;
}

// Exercise CRUD
export async function getExercises(options?: {
  category_id?: string;
  subcategory_id?: string;
  difficulty?: string;
  is_premium?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("exercises")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug, icon),
      subcategory:exercise_subcategories(id, name, slug, category_id)
    `
    )
    .order("order_index")
    .order("created_at", { ascending: false });

  if (options?.category_id) {
    query = query.eq("category_id", options.category_id);
  }
  if (options?.subcategory_id) {
    query = query.eq("subcategory_id", options.subcategory_id);
  }
  if (options?.difficulty) {
    query = query.eq("difficulty", options.difficulty);
  }
  if (options?.is_premium !== undefined) {
    query = query.eq("is_premium", options.is_premium);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Exercise[];
}

export async function getExerciseById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug, icon),
      subcategory:exercise_subcategories(id, name, slug, category_id)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Exercise;
}

export async function getExerciseBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug, icon),
      subcategory:exercise_subcategories(id, name, slug, category_id)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Exercise;
}

export async function createExercise(input: CreateExerciseInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercises")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Exercise;
}

export async function updateExercise(input: UpdateExerciseInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("exercises")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Exercise;
}

export async function deleteExercise(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("exercises").delete().eq("id", id);
  if (error) throw error;
}

// Exercise Categories
export async function getExerciseCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_categories")
    .select("*")
    .order("order_index");

  if (error) throw error;
  return data as ExerciseCategory[];
}

export async function getExerciseCategoriesWithCount() {
  const supabase = createClient();

  // Get categories
  const { data: categories, error: catError } = await supabase
    .from("exercise_categories")
    .select("*")
    .order("order_index");

  if (catError) throw catError;

  // Get exercise counts per category
  const { data: exerciseCounts, error: exCountError } = await supabase
    .from("exercises")
    .select("category_id")
    .not("category_id", "is", null);

  if (exCountError) throw exCountError;

  // Get subcategory counts per category
  const { data: subcategoryCounts, error: subCountError } = await supabase
    .from("exercise_subcategories")
    .select("category_id")
    .not("category_id", "is", null);

  if (subCountError) throw subCountError;

  // Calculate exercise counts
  const exerciseCountMap = exerciseCounts?.reduce((acc, ex) => {
    acc[ex.category_id] = (acc[ex.category_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Calculate subcategory counts
  const subcategoryCountMap = subcategoryCounts?.reduce((acc, sub) => {
    acc[sub.category_id] = (acc[sub.category_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return categories?.map((cat) => ({
    ...cat,
    exercise_count: exerciseCountMap[cat.id] || 0,
    subcategory_count: subcategoryCountMap[cat.id] || 0,
  })) as ExerciseCategory[];
}

export async function createExerciseCategory(input: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order_index?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_categories")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as ExerciseCategory;
}

export async function updateExerciseCategory(
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    order_index?: number;
  }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ExerciseCategory;
}

export async function deleteExerciseCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("exercise_categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// Exercise Subcategories
export async function getExerciseSubcategories(categoryId?: string) {
  const supabase = createClient();
  let query = supabase
    .from("exercise_subcategories")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug)
    `
    )
    .order("order_index");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ExerciseSubcategory[];
}

export async function getExerciseSubcategoriesWithCount(categoryId?: string) {
  const supabase = createClient();

  // Get subcategories
  let query = supabase
    .from("exercise_subcategories")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug)
    `
    )
    .order("order_index");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: subcategories, error: subError } = await query;
  if (subError) throw subError;

  // Get exercise counts per subcategory
  const { data: counts, error: countError } = await supabase
    .from("exercises")
    .select("subcategory_id")
    .not("subcategory_id", "is", null);

  if (countError) throw countError;

  // Calculate counts
  const countMap = counts?.reduce((acc, ex) => {
    acc[ex.subcategory_id] = (acc[ex.subcategory_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return subcategories?.map((sub) => ({
    ...sub,
    exercise_count: countMap[sub.id] || 0,
  })) as ExerciseSubcategory[];
}

export async function getExerciseSubcategoryById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_subcategories")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ExerciseSubcategory;
}

export async function createExerciseSubcategory(input: {
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order_index?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_subcategories")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as ExerciseSubcategory;
}

export async function updateExerciseSubcategory(
  id: string,
  input: {
    category_id?: string;
    name?: string;
    slug?: string;
    description?: string;
    image_url?: string;
    order_index?: number;
  }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_subcategories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ExerciseSubcategory;
}

export async function deleteExerciseSubcategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("exercise_subcategories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// Server-side functions
export async function getExercisesServer(options?: {
  category_id?: string;
  subcategory_id?: string;
  difficulty?: string;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("exercises")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug, icon),
      subcategory:exercise_subcategories(id, name, slug, category_id)
    `
    )
    .order("order_index")
    .order("created_at", { ascending: false });

  if (options?.category_id) {
    query = query.eq("category_id", options.category_id);
  }
  if (options?.subcategory_id) {
    query = query.eq("subcategory_id", options.subcategory_id);
  }
  if (options?.difficulty) {
    query = query.eq("difficulty", options.difficulty);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Exercise[];
}

export async function getExerciseCategoriesServer() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_categories")
    .select("*")
    .order("order_index");

  if (error) throw error;
  return data as ExerciseCategory[];
}

export async function getExerciseSubcategoriesServer(categoryId?: string) {
  const supabase = createClient();
  let query = supabase
    .from("exercise_subcategories")
    .select(
      `
      *,
      category:exercise_categories(id, name, slug)
    `
    )
    .order("order_index");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ExerciseSubcategory[];
}
