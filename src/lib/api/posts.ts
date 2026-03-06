import { createClient } from "@/lib/supabase/client";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: BlogCategory | null;
  author?: { id: string; full_name: string } | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id?: string;
  status?: "draft" | "published" | "archived";
  published_at?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

// Client-side functions
export async function getPosts(options?: {
  status?: string;
  category_id?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("posts")
    .select(
      `
      *,
      category:blog_categories(id, name, slug),
      author:profiles(id, full_name)
    `
    )
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.category_id) {
    query = query.eq("category_id", options.category_id);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Post[];
}

export async function getPostById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:blog_categories(id, name, slug),
      author:profiles(id, full_name)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Post;
}

export async function getPostBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:blog_categories(id, name, slug),
      author:profiles(id, full_name)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Post;
}

export async function createPost(input: CreatePostInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...input,
      author_id: user?.id,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function updatePost(input: UpdatePostInput) {
  const supabase = createClient();
  const { id, ...updates } = input;

  // Set published_at when publishing
  if (updates.status === "published") {
    const existing = await getPostById(id);
    if (existing.status !== "published") {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function deletePost(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

// Blog Categories
export async function getBlogCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as BlogCategory[];
}

export async function createBlogCategory(input: { name: string; slug: string }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as BlogCategory;
}

export async function updateBlogCategory(
  id: string,
  input: { name?: string; slug?: string }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogCategory;
}

export async function deleteBlogCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);
  if (error) throw error;
}

// Server-side functions
export async function getPostsServer(options?: {
  status?: string;
  category_id?: string;
  limit?: number;
}) {
  const supabase = createClient();
  let query = supabase
    .from("posts")
    .select(
      `
      *,
      category:blog_categories(id, name, slug),
      author:profiles(id, full_name)
    `
    )
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.category_id) {
    query = query.eq("category_id", options.category_id);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Post[];
}
