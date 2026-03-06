"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Exercise {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  coaching_points: string[] | null;
  equipment: string[] | null;
}

const categoryColors: Record<string, string> = {
  "ball-mastery": "from-coerver-green to-green-700",
  "1v1": "from-coerver-dark to-gray-800",
  "receiving-turning": "from-emerald-600 to-emerald-800",
  "passing": "from-coerver-green to-emerald-700",
  "finishing": "from-gray-700 to-coerver-dark",
  "speed": "from-lime-600 to-green-700",
};

const difficultyConfig = {
  beginner: { label: "Početnik", bgLight: "bg-emerald-100 text-emerald-700" },
  intermediate: { label: "Srednji", bgLight: "bg-amber-100 text-amber-700" },
  advanced: { label: "Napredni", bgLight: "bg-rose-100 text-rose-700" },
};

function getVideoEmbedUrl(url: string | null): string | null {
  if (!url) return null;

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

export default function ExerciseDetailPage() {
  const params = useParams();
  const categorySlug = params.categoryId as string;
  const subcategorySlug = params.subcategoryId as string;
  const exerciseSlug = params.exerciseSlug as string;
  const { loading: authLoading } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categorySlug, subcategorySlug, exerciseSlug]);

  async function loadData() {
    const supabase = createClient();

    try {
      // Fetch category by slug
      const { data: categoryData, error: catError } = await supabase
        .from("exercise_categories")
        .select("id, name, slug")
        .eq("slug", categorySlug)
        .single();

      if (catError) throw catError;
      setCategory(categoryData);

      // Fetch subcategory by slug
      const { data: subcategoryData, error: subError } = await supabase
        .from("exercise_subcategories")
        .select("id, name, slug")
        .eq("category_id", categoryData.id)
        .eq("slug", subcategorySlug)
        .single();

      if (subError) throw subError;
      setSubcategory(subcategoryData);

      // Fetch exercise by slug
      const { data: exerciseData, error: exError } = await supabase
        .from("exercises")
        .select("*")
        .eq("subcategory_id", subcategoryData.id)
        .eq("slug", exerciseSlug)
        .single();

      if (exError) throw exError;
      setExercise(exerciseData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const color = categoryColors[categorySlug] || "from-gray-500 to-gray-700";
  const embedUrl = exercise ? getVideoEmbedUrl(exercise.video_url) : null;

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="aspect-video bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!category || !subcategory || !exercise) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-coerver-dark">
            Vježba nije pronađena
          </h1>
          <Link href="/dashboard/trener" className="text-coerver-green mt-4 inline-block">
            ← Povratak na pregled
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const difficulty = exercise.difficulty ? difficultyConfig[exercise.difficulty] : null;

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/dashboard/trener" className="hover:text-coerver-green transition-colors">
            Kategorije
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/dashboard/trener/vjezbe/${categorySlug}`} className="hover:text-coerver-green transition-colors">
            {category.name}
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/dashboard/trener/vjezbe/${categorySlug}/${subcategorySlug}`} className="hover:text-coerver-green transition-colors">
            {subcategory.name}
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-coerver-dark font-medium truncate">{exercise.title}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : exercise.thumbnail_url ? (
              <div className="relative w-full h-full">
                <img
                  src={exercise.thumbnail_url}
                  alt={exercise.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm opacity-80">Video nije dostupan</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${color} flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm opacity-80">Video nije dostupan</p>
                </div>
              </div>
            )}
          </div>

          {/* Exercise Title & Description */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-coerver-dark">{exercise.title}</h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                {difficulty && (
                  <span className={`px-3 py-1 text-sm font-medium rounded-lg ${difficulty.bgLight}`}>
                    {difficulty.label}
                  </span>
                )}
                {exercise.duration && (
                  <span className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                    {exercise.duration}
                  </span>
                )}
              </div>
            </div>
            {exercise.description && (
              <p className="text-gray-600 leading-relaxed">{exercise.description}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coaching Points */}
          {exercise.coaching_points && exercise.coaching_points.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-coerver-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Točke treniranja
              </h3>
              <ul className="space-y-3">
                {exercise.coaching_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-coerver-green/10 text-coerver-green rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipment */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-coerver-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Potrebna oprema
              </h3>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <Link
            href={`/dashboard/trener/vjezbe/${categorySlug}/${subcategorySlug}`}
            className="block w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 text-coerver-dark rounded-xl text-center font-medium transition-colors"
          >
            ← Natrag na popis vježbi
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
