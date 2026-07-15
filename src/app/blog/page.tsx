import { createStaticClient } from "@/lib/supabase/static";
import { Post, BlogCategory } from "@/lib/api/posts";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 3600;

async function getBlogData(): Promise<{ posts: Post[]; categories: BlogCategory[] }> {
  try {
    const supabase = createStaticClient();
    const [postsResult, categoriesResult] = await Promise.all([
      supabase
        .from("posts")
        .select(
          `
          *,
          category:blog_categories(id, name, slug),
          author:profiles(id, full_name)
        `
        )
        .eq("status", "published")
        .order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("*").order("name"),
    ]);

    if (postsResult.error) throw postsResult.error;
    if (categoriesResult.error) throw categoriesResult.error;

    return {
      posts: (postsResult.data as Post[]) || [],
      categories: (categoriesResult.data as BlogCategory[]) || [],
    };
  } catch (error) {
    console.error("Error loading blog data:", error);
    return { posts: [], categories: [] };
  }
}

export default async function BlogPage() {
  const { posts, categories } = await getBlogData();

  return <BlogPageClient posts={posts} categories={categories} />;
}
