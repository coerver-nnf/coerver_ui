"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group">
        <Card className="overflow-hidden h-full" hover>
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="aspect-video md:aspect-auto bg-gradient-to-br from-coerver-green to-coerver-green-dark relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Content */}
            <CardContent className="p-8 flex flex-col justify-center">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-coerver-green/10 text-coerver-green text-xs font-semibold rounded-full w-fit mb-4">
                  {post.category.name}
                </span>
              )}

              <h2 className="text-2xl font-bold text-coerver-dark mb-3 group-hover:text-coerver-green transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-coerver-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-coerver-gray-500">
                {post.author && (
                  <span>{post.author.full_name || "Coerver Tim"}</span>
                )}
                <span>{formatDate(post.created_at)}</span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="overflow-hidden h-full" hover>
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-coerver-dark to-coerver-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>

        <CardContent className="p-6">
          {post.category && (
            <span className="inline-block px-3 py-1 bg-coerver-green/10 text-coerver-green text-xs font-semibold rounded-full mb-3">
              {post.category.name}
            </span>
          )}

          <h3 className="text-lg font-bold text-coerver-dark mb-2 group-hover:text-coerver-green transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-coerver-gray-600 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-coerver-gray-500">
            {post.author && (
              <>
                <div className="w-6 h-6 rounded-full bg-coerver-green flex items-center justify-center text-white text-xs font-bold">
                  {(post.author.full_name || "C").charAt(0)}
                </div>
                <span>{post.author.full_name || "Coerver Tim"}</span>
              </>
            )}
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
