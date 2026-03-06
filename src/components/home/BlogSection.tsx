"use client";

import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";

// Sample posts - in production this would come from props/API
const samplePosts: Post[] = [
  {
    id: "1",
    title: "POČETAK RADA COERVER® AKADEMIJA",
    slug: "pocetak-rada-coerver-akademija",
    content: "",
    excerpt:
      "ZAPOČINJU RAD COERVER® PERFORMANCE AKADEMIJE – OTKLJUČAJTE PUNI POTENCIJAL VAŠE IGRE! Dragi roditelji i mladi nogometaši, s velikim uzbuđenjem najavljujemo početak nove sezone.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-70.jpg",
    author_id: "1",
    category_id: "1",
    published: true,
    created_at: "2025-09-11T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Coerver Tim", phone: null, approved: true, created_at: "" },
    category: { id: "1", name: "Vijesti", slug: "vijesti" },
  },
  {
    id: "2",
    title: "NK Lokomotiva Rijeka & Coerver: 5 godina suradnje",
    slug: "nk-lokomotiva-rijeka-coerver-5-godina-suradnje",
    content: "",
    excerpt:
      "Nogometni klubovi diljem svijeta sve više prepoznaju važnost implementacije suvremenih metoda.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-60.jpg",
    author_id: "1",
    category_id: "1",
    published: true,
    created_at: "2024-12-16T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Coerver Tim", phone: null, approved: true, created_at: "" },
    category: { id: "1", name: "Partnerstva", slug: "partnerstva" },
  },
  {
    id: "3",
    title: "BOŽIĆNI KAMP MAKARSKA",
    slug: "bozicni-kamp-makarska",
    content: "",
    excerpt:
      "Coerver Coaching ove zime organizira božićni nogometni kamp u Makarskoj.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-15.jpg",
    author_id: "1",
    category_id: "1",
    published: true,
    created_at: "2024-11-25T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Coerver Tim", phone: null, approved: true, created_at: "" },
    category: { id: "1", name: "Kampovi", slug: "kampovi" },
  },
  {
    id: "4",
    title: "5 Ball Mastery Vježbi Za Svaki Dan",
    slug: "5-ball-mastery-vjezbi-za-svaki-dan",
    content: "",
    excerpt:
      "Jednostavne vježbe koje možeš raditi kod kuće za poboljšanje kontrole lopte.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-25.jpg",
    author_id: "1",
    category_id: "1",
    published: true,
    created_at: "2024-11-20T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Ivan Perić", phone: null, approved: true, created_at: "" },
    category: { id: "1", name: "Treninzi", slug: "treninzi" },
  },
];

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface BlogSectionProps {
  posts?: Post[];
}

export function BlogSection({ posts = samplePosts }: BlogSectionProps) {
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-4">
              <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
              <span className="text-coerver-green text-sm font-semibold">Blog</span>
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white">
              Najnovije iz <span className="text-coerver-green">Coerver</span> svijeta
            </h2>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-coerver-dark font-semibold px-6 py-3 rounded-full transition-all duration-300"
          >
            Svi članci
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>

        {/* Blog Grid - Featured + Side posts */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Post - Large */}
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group relative"
          >
            <article className="relative h-full min-h-[500px] lg:min-h-[600px] rounded-3xl overflow-hidden">
              {/* Image */}
              <Image
                src={featuredPost.featured_image || "/images/photoshoot/Coerver_Kustosija-70.jpg"}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                {/* Category */}
                {featuredPost.category && (
                  <span className="inline-flex items-center gap-2 bg-coerver-green text-white text-xs font-bold px-4 py-2 rounded-full w-fit mb-4">
                    {featuredPost.category.name}
                  </span>
                )}

                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-4 group-hover:text-coerver-green transition-colors leading-tight">
                  {featuredPost.title}
                </h3>

                <p className="text-white/70 text-lg mb-6 line-clamp-2 max-w-xl">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {featuredPost.author && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                          {featuredPost.author.full_name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {featuredPost.author.full_name || "Coerver Tim"}
                          </p>
                          <p className="text-white/50 text-sm">
                            {formatDateShort(featuredPost.created_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-coerver-green flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </Link>

          {/* Side Posts - Stacked */}
          <div className="flex flex-col gap-6">
            {sidePosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="flex gap-5 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 border border-white/10">
                  {/* Image */}
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={post.featured_image || "/images/photoshoot/Coerver_Kustosija-60.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center py-1">
                    {/* Category & Date */}
                    <div className="flex items-center gap-3 mb-2">
                      {post.category && (
                        <span className="text-coerver-green text-xs font-semibold uppercase tracking-wider">
                          {post.category.name}
                        </span>
                      )}
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span className="text-white/40 text-xs">
                        {formatDateShort(post.created_at)}
                      </span>
                    </div>

                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-coerver-green transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    <p className="text-white/50 text-sm line-clamp-2 hidden lg:block">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}

            {/* View All Card */}
            <Link
              href="/blog"
              className="group flex items-center justify-center gap-4 bg-coerver-green/20 hover:bg-coerver-green rounded-2xl p-6 transition-all duration-300 border border-coerver-green/30"
            >
              <div className="text-center">
                <p className="text-white font-bold text-lg group-hover:text-white transition-colors">
                  Pogledaj sve članke
                </p>
                <p className="text-white/50 text-sm group-hover:text-white/80 transition-colors">
                  Više od 50+ članaka
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white group-hover:text-coerver-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
