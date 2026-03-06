"use client";

import { BlogCard, BlogCardFeatured } from "./BlogCards";
import type { Post } from "@/types";

interface PostListProps {
  posts: Post[];
  showFeatured?: boolean;
}

export function PostList({ posts, showFeatured = true }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-coerver-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-coerver-gray-600 mb-2">
          Nema objava
        </h3>
        <p className="text-coerver-gray-500">
          Trenutno nema objava koje odgovaraju vašem pretraživanju.
        </p>
      </div>
    );
  }

  const featuredPost = showFeatured ? posts[0] : null;
  const regularPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <div className="space-y-8">
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <BlogCardFeatured post={featuredPost} />
        </div>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
