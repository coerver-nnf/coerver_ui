"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Post, Category } from "@/types";
import { cn } from "@/lib/utils";

// Sample blog posts data (will be replaced with Supabase data)
const samplePosts: Post[] = [
  {
    id: "1",
    title: "5 Ball Mastery Vježbi Za Svaki Dan",
    slug: "5-ball-mastery-vjezbi-za-svaki-dan",
    content: "",
    excerpt:
      "Jednostavne vježbe koje možeš raditi kod kuće za poboljšanje kontrole lopte. Ove vježbe su temelj Coerver metodologije.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-70.webp",
    author_id: "1",
    category_id: "1",
    published: true,
    created_at: "2024-02-15T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Ivan Perić", phone: null, approved: true, created_at: "" },
    category: { id: "1", name: "Treninzi", slug: "treninzi" },
  },
  {
    id: "2",
    title: "Kako Odabrati Pravu Nogometnu Akademiju",
    slug: "kako-odabrati-pravu-nogometnu-akademiju",
    content: "",
    excerpt:
      "Vodič za roditelje koji traže najbolju opciju za svoje dijete. Saznajte na što obratiti pažnju.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-60.webp",
    author_id: "1",
    category_id: "2",
    published: true,
    created_at: "2024-02-10T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Ana Kovačević", phone: null, approved: true, created_at: "" },
    category: { id: "2", name: "Savjeti", slug: "savjeti" },
  },
  {
    id: "3",
    title: "Uspjeh Naših Polaznika na Regionalnom Natjecanju",
    slug: "uspjeh-nasih-polaznika-na-regionalnom-natjecanju",
    content: "",
    excerpt:
      "Naši mladi nogometaši osvojili su drugo mjesto na regionalnom turniru u konkurenciji od 24 ekipe.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-15.webp",
    author_id: "1",
    category_id: "3",
    published: true,
    created_at: "2024-02-05T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Coerver Tim", phone: null, approved: true, created_at: "" },
    category: { id: "3", name: "Vijesti", slug: "vijesti" },
  },
  {
    id: "4",
    title: "Prehrana Mladog Nogometaša",
    slug: "prehrana-mladog-nogometasa",
    content: "",
    excerpt:
      "Što jesti prije, tijekom i nakon treninga za optimalne performanse i brži oporavak.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-25.webp",
    author_id: "1",
    category_id: "2",
    published: true,
    created_at: "2024-01-28T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Dr. Marko Horvat", phone: null, approved: true, created_at: "" },
    category: { id: "2", name: "Savjeti", slug: "savjeti" },
  },
  {
    id: "5",
    title: "Coerver Ljetni Kamp 2024 - Prijave Otvorene",
    slug: "coerver-ljetni-kamp-2024-prijave-otvorene",
    content: "",
    excerpt:
      "Prijave za najpopularnije nogometne kampove u Hrvatskoj su službeno otvorene! Osigurajte mjesto na vrijeme.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-45.webp",
    author_id: "1",
    category_id: "3",
    published: true,
    created_at: "2024-01-20T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Coerver Tim", phone: null, approved: true, created_at: "" },
    category: { id: "3", name: "Vijesti", slug: "vijesti" },
  },
  {
    id: "6",
    title: "Mentalna Priprema Mladih Igrača",
    slug: "mentalna-priprema-mladih-igraca",
    content: "",
    excerpt:
      "Kako pomoći djetetu da se nosi s pritiskom i razvije mentalnu snagu potrebnu za uspjeh.",
    featured_image: "/images/photoshoot/Coerver_Kustosija-5.webp",
    author_id: "1",
    category_id: "2",
    published: true,
    created_at: "2024-01-15T10:00:00Z",
    author: { id: "1", role: "admin", full_name: "Ana Kovačević", phone: null, approved: true, created_at: "" },
    category: { id: "2", name: "Savjeti", slug: "savjeti" },
  },
];

const categories: Category[] = [
  { id: "1", name: "Treninzi", slug: "treninzi" },
  { id: "2", name: "Savjeti", slug: "savjeti" },
  { id: "3", name: "Vijesti", slug: "vijesti" },
  { id: "4", name: "Uspjesi", slug: "uspjesi" },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "short",
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const posts = samplePosts;
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesCategory = !activeCategory || post.category?.slug === activeCategory;
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-coerver-dark overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-55.webp"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-coerver-dark via-coerver-dark/95 to-coerver-dark" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-coerver-green/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-coerver-green/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-coerver-green rounded-full" />
              <span className="text-coerver-green text-sm font-semibold">Blog</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Vijesti, savjeti i <span className="text-coerver-green">inspiracija</span>
            </h1>

            <p className="text-lg lg:text-xl text-white/60 max-w-xl">
              Savjeti za trenere i igrače, vijesti iz Coerver svijeta i priče o
              uspjehu naše zajednice.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-coerver-dark">Istaknuto</h2>
            <div className="h-px flex-1 bg-gray-200 ml-6" />
          </div>

          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                {featuredPost.featured_image ? (
                  <Image
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-coerver-green to-emerald-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {featuredPost.category && (
                  <span className="inline-flex items-center gap-2 text-coerver-green text-sm font-semibold mb-4">
                    <span className="w-8 h-px bg-coerver-green" />
                    {featuredPost.category.name}
                  </span>
                )}

                <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black text-coerver-dark mb-4 group-hover:text-coerver-green transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4">
                  {featuredPost.author && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center text-white font-bold">
                        {featuredPost.author.full_name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="text-coerver-dark font-medium text-sm">
                          {featuredPost.author.full_name || "Coerver Tim"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {formatDate(featuredPost.created_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-2 text-coerver-green font-semibold group-hover:gap-3 transition-all">
                      Pročitaj više
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl bg-white/90">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96 relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži članke..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-coerver-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coerver-green/20 focus:border-coerver-green transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  !activeCategory
                    ? "bg-coerver-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Sve
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category.slug
                      ? "bg-coerver-green text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-coerver-dark">Svi članci</h2>
            <p className="text-gray-500">
              {filteredPosts.length} {filteredPosts.length === 1 ? "članak" : "članaka"}
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5">
                      {post.featured_image ? (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-coerver-green to-emerald-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Category badge */}
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-coerver-dark text-xs font-semibold rounded-full">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span>{formatDateShort(post.created_at)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>5 min čitanja</span>
                      </div>

                      <h3 className="text-xl font-bold text-coerver-dark mb-3 group-hover:text-coerver-green transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Author */}
                      {post.author && (
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <div className="w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center text-coerver-green font-bold text-sm">
                            {post.author.full_name?.charAt(0) || "C"}
                          </div>
                          <span className="text-gray-600 text-sm">
                            {post.author.full_name || "Coerver Tim"}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-coerver-dark mb-2">Nema rezultata</h3>
              <p className="text-gray-500">
                Pokušajte s drugačijim pretraživanjem ili kategorijom.
              </p>
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-coerver-dark font-semibold rounded-full hover:bg-coerver-green hover:text-white transition-all duration-300">
                Učitaj više članaka
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-28 bg-coerver-dark relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-coerver-green/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-coerver-green/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-coerver-green text-sm font-semibold">Newsletter</span>
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-6">
              Ne propusti nove objave
            </h2>
            <p className="text-lg text-white/60 mb-10">
              Pretplati se na naš newsletter i primi najnovije vijesti, savjete i
              ekskluzivne sadržaje direktno u svoj inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Tvoja email adresa"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-coerver-green focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-coerver-green text-white font-semibold rounded-full hover:bg-coerver-green/90 transition-colors flex items-center justify-center gap-2"
              >
                Pretplati se
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>

            <p className="text-white/40 text-sm mt-6">
              Možeš se odjaviti u bilo kojem trenutku. Poštujemo tvoju privatnost.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 lg:p-16 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Postani dio priče</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-coerver-dark mb-4">
                  Imaš priču za podijeliti?
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Ako si trener, igrač ili roditelj s iskustvom koje želiš podijeliti
                  s našom zajednicom, javi nam se. Uvijek tražimo nove glasove i perspektive.
                </p>

                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
                >
                  Kontaktiraj nas
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src="/images/photoshoot/Coerver_Kustosija-40.webp"
                        alt="Coerver Training"
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/images/photoshoot/Coerver_Kustosija-20.webp"
                        alt="Coerver Training"
                        width={300}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/images/photoshoot/Coerver_Kustosija-65.webp"
                        alt="Coerver Training"
                        width={300}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src="/images/photoshoot/Coerver_Kustosija-50.webp"
                        alt="Coerver Training"
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
