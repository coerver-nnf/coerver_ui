"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

// Utility function for formatting dates
function formatDate(dateString: string, format: "short" | "long" = "long"): string {
  const date = new Date(dateString);
  if (format === "short") {
    return date.toLocaleDateString("hr-HR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return date.toLocaleDateString("hr-HR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Category Badge Component
function CategoryBadge({ category, size = "md" }: { category: { name: string; slug: string }; size?: "sm" | "md" }) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={cn("inline-block bg-coerver-green/10 text-coerver-green font-semibold rounded-full", sizes[size])}>
      {category.name}
    </span>
  );
}

// Tags Component
function TagsList({ tags, className }: { tags?: { name: string; slug: string }[]; className?: string }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((tag) => (
        <span key={tag.slug} className="text-coerver-gray-500 text-sm">
          #{tag.name}
        </span>
      ))}
    </div>
  );
}

// Author Avatar Component
function AuthorAvatar({ author, size = "md" }: { author?: { full_name: string | null }; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const name = author?.full_name || "Coerver";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={cn("rounded-full bg-coerver-green flex items-center justify-center text-white font-bold", sizes[size])}>
      {initial}
    </div>
  );
}

// ============================================
// BLOG CARD - Standard vertical card for grids
// ============================================
interface BlogCardProps {
  post: Post;
  showCategory?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  showTags?: boolean;
  imageAspect?: "video" | "square" | "portrait";
  className?: string;
}

export function BlogCard({
  post,
  showCategory = true,
  showAuthor = true,
  showExcerpt = true,
  showTags = false,
  imageAspect = "video",
  className,
}: BlogCardProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block", className)}>
      <Card className="overflow-hidden h-full" padding="none" hover>
        {/* Image */}
        <div className={cn("relative overflow-hidden bg-coerver-gray-200", aspectClasses[imageAspect])}>
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-coerver-green to-coerver-green-dark" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        <CardContent className="p-5">
          {/* Category & Date */}
          <div className="flex items-center justify-between mb-3">
            {showCategory && post.category && <CategoryBadge category={post.category} />}
            <span className="text-coerver-gray-500 text-sm">{formatDate(post.created_at, "short")}</span>
          </div>

          {/* Tags */}
          {showTags && post.tags && <TagsList tags={post.tags} className="mb-2" />}

          {/* Title */}
          <h3 className="text-lg font-bold text-coerver-dark mb-2 group-hover:text-coerver-green transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-coerver-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
          )}

          {/* Author */}
          {showAuthor && post.author && (
            <div className="flex items-center gap-2 pt-3 border-t border-coerver-gray-100">
              <AuthorAvatar author={post.author} size="sm" />
              <span className="text-coerver-gray-600 text-sm">{post.author.full_name || "Coerver Tim"}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// ============================================
// BLOG CARD FEATURED - Large horizontal card
// ============================================
interface BlogCardFeaturedProps {
  post: Post;
  className?: string;
  imagePosition?: "left" | "right";
}

export function BlogCardFeatured({ post, className, imagePosition = "left" }: BlogCardFeaturedProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block", className)}>
      <Card className="overflow-hidden" padding="none" hover>
        <div className={cn("grid md:grid-cols-2", imagePosition === "right" && "md:grid-flow-dense")}>
          {/* Image */}
          <div
            className={cn(
              "aspect-video md:aspect-auto md:min-h-[320px] relative overflow-hidden bg-coerver-gray-200",
              imagePosition === "right" && "md:col-start-2"
            )}
          >
            {post.featured_image ? (
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-coerver-green to-coerver-green-dark" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Content */}
          <CardContent className="p-6 md:p-8 flex flex-col justify-center">
            {/* Category */}
            {post.category && (
              <div className="mb-4">
                <CategoryBadge category={post.category} />
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-coerver-dark mb-4 group-hover:text-coerver-green transition-colors">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && <p className="text-coerver-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-coerver-gray-500">
              {post.author && (
                <div className="flex items-center gap-2">
                  <AuthorAvatar author={post.author} size="md" />
                  <span>{post.author.full_name || "Coerver Tim"}</span>
                </div>
              )}
              <span className="w-1 h-1 rounded-full bg-coerver-gray-400" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

// ============================================
// BLOG CARD HORIZONTAL - Compact horizontal card
// ============================================
interface BlogCardHorizontalProps {
  post: Post;
  className?: string;
  imageSize?: "sm" | "md" | "lg";
}

export function BlogCardHorizontal({ post, className, imageSize = "md" }: BlogCardHorizontalProps) {
  const imageSizes = {
    sm: "w-20 h-20",
    md: "w-28 h-28 md:w-36 md:h-36",
    lg: "w-40 h-40 md:w-48 md:h-48",
  };

  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block", className)}>
      <div className="flex gap-4 p-4 rounded-xl hover:bg-coerver-gray-50 transition-colors">
        {/* Image */}
        <div className={cn("flex-shrink-0 relative overflow-hidden rounded-lg bg-coerver-gray-200", imageSizes[imageSize])}>
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-coerver-green to-coerver-green-dark" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Category & Date */}
          <div className="flex items-center gap-2 mb-2">
            {post.category && <CategoryBadge category={post.category} size="sm" />}
            <span className="text-coerver-gray-400 text-xs">{formatDate(post.created_at, "short")}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-coerver-dark group-hover:text-coerver-green transition-colors line-clamp-2 mb-1">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && <p className="text-coerver-gray-500 text-sm line-clamp-2 hidden md:block">{post.excerpt}</p>}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// BLOG CARD COMPACT - Small card for sidebars
// ============================================
interface BlogCardCompactProps {
  post: Post;
  className?: string;
  showImage?: boolean;
  index?: number;
}

export function BlogCardCompact({ post, className, showImage = false, index }: BlogCardCompactProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block", className)}>
      <div className="flex gap-3 py-3 border-b border-coerver-gray-100 last:border-0">
        {/* Index Number */}
        {typeof index === "number" && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center">
            <span className="text-coerver-green font-bold text-sm">{index + 1}</span>
          </div>
        )}

        {/* Image */}
        {showImage && !index && (
          <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-lg bg-coerver-gray-200">
            {post.featured_image ? (
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-coerver-green to-coerver-green-dark" />
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-coerver-dark group-hover:text-coerver-green transition-colors line-clamp-2 text-sm">
            {post.title}
          </h4>
          <span className="text-coerver-gray-400 text-xs mt-1 block">{formatDate(post.created_at, "short")}</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// BLOG CARD MINIMAL - Text-only minimal card
// ============================================
interface BlogCardMinimalProps {
  post: Post;
  className?: string;
}

export function BlogCardMinimal({ post, className }: BlogCardMinimalProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block py-4 border-b border-coerver-gray-100 last:border-0", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {post.category && <CategoryBadge category={post.category} size="sm" />}
          <h3 className="font-bold text-coerver-dark group-hover:text-coerver-green transition-colors mt-2">
            {post.title}
          </h3>
        </div>
        <span className="text-coerver-gray-400 text-sm flex-shrink-0">{formatDate(post.created_at, "short")}</span>
      </div>
    </Link>
  );
}

// ============================================
// BLOG CARD OVERLAY - Card with text overlay on image
// ============================================
interface BlogCardOverlayProps {
  post: Post;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BlogCardOverlay({ post, className, size = "md" }: BlogCardOverlayProps) {
  const sizeClasses = {
    sm: "aspect-square",
    md: "aspect-video",
    lg: "aspect-[16/10] md:aspect-[21/9]",
  };

  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block relative overflow-hidden rounded-xl", className)}>
      {/* Image */}
      <div className={cn("relative w-full bg-coerver-gray-200", sizeClasses[size])}>
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-coerver-green to-coerver-green-dark" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
        {post.category && (
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-coerver-green text-white text-xs font-semibold rounded-full">
              {post.category.name}
            </span>
          </div>
        )}
        <h3 className="text-white font-bold text-lg md:text-xl line-clamp-2 group-hover:text-coerver-green-light transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-white/70 text-sm">
          {post.author && <span>{post.author.full_name || "Coerver Tim"}</span>}
          <span className="w-1 h-1 rounded-full bg-white/50" />
          <span>{formatDate(post.created_at, "short")}</span>
        </div>
      </div>
    </Link>
  );
}
