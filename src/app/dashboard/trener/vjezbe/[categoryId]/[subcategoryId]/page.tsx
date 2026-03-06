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
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
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
  order_index: number;
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
  beginner: { label: "Početnik", color: "bg-emerald-500", bgLight: "bg-emerald-100 text-emerald-700" },
  intermediate: { label: "Srednji", color: "bg-amber-500", bgLight: "bg-amber-100 text-amber-700" },
  advanced: { label: "Napredni", color: "bg-rose-500", bgLight: "bg-rose-100 text-rose-700" },
};

export default function SubcategoryExercisesPage() {
  const params = useParams();
  const categorySlug = params.categoryId as string;
  const subcategorySlug = params.subcategoryId as string;
  const { profile, loading: authLoading } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [categorySlug, subcategorySlug]);

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

      // Fetch subcategory by slug and category
      const { data: subcategoryData, error: subError } = await supabase
        .from("exercise_subcategories")
        .select("*")
        .eq("category_id", categoryData.id)
        .eq("slug", subcategorySlug)
        .single();

      if (subError) throw subError;
      setSubcategory(subcategoryData);

      // Fetch exercises in this subcategory
      const { data: exercisesData, error: exError } = await supabase
        .from("exercises")
        .select("id, title, slug, description, video_url, thumbnail_url, duration, difficulty, order_index")
        .eq("subcategory_id", subcategoryData.id)
        .order("order_index")
        .order("created_at", { ascending: false });

      if (exError) throw exError;
      setExercises(exercisesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const color = categoryColors[categorySlug] || "from-gray-500 to-gray-700";

  const filteredExercises = exercises.filter(
    (ex) => selectedDifficulty === "all" || ex.difficulty === selectedDifficulty
  );

  const difficultyStats = {
    beginner: exercises.filter((ex) => ex.difficulty === "beginner").length,
    intermediate: exercises.filter((ex) => ex.difficulty === "intermediate").length,
    advanced: exercises.filter((ex) => ex.difficulty === "advanced").length,
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!category || !subcategory) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-coerver-dark">
            Potkategorija nije pronađena
          </h1>
          <Link href="/dashboard/trener" className="text-coerver-green mt-4 inline-block">
            ← Povratak na pregled
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/trener" className="hover:text-coerver-green transition-colors">
            Kategorije
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/dashboard/trener/vjezbe/${categorySlug}`} className="hover:text-coerver-green transition-colors">
            {category.name}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-coerver-dark font-medium">{subcategory.name}</span>
        </div>
      </div>

      {/* Header Card */}
      <div className={`rounded-3xl bg-gradient-to-br ${color} p-8 mb-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">{category.name}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{subcategory.name}</h1>
              {subcategory.description && (
                <p className="text-white/80 max-w-xl">{subcategory.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium">
              {exercises.length} vježbi
            </span>
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {difficultyStats.beginner} početnik
            </span>
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              {difficultyStats.intermediate} srednji
            </span>
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-400 rounded-full" />
              {difficultyStats.advanced} napredni
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 mb-6 inline-flex gap-1 shadow-sm border border-gray-100">
        {[
          { key: "all", label: "Sve", count: exercises.length },
          { key: "beginner", label: "Početnik", count: difficultyStats.beginner },
          { key: "intermediate", label: "Srednji", count: difficultyStats.intermediate },
          { key: "advanced", label: "Napredni", count: difficultyStats.advanced },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedDifficulty(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedDifficulty === tab.key
                ? "bg-coerver-dark text-white shadow-md"
                : "text-gray-500 hover:text-coerver-dark hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${selectedDifficulty === tab.key ? "text-white/70" : "text-gray-400"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Exercise List */}
      {filteredExercises.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-coerver-dark mb-1">
            {exercises.length === 0 ? "Nema vježbi" : "Nema pronađenih vježbi"}
          </h3>
          <p className="text-gray-500">
            {exercises.length === 0
              ? "Ova potkategorija još nema vježbi."
              : "Pokušajte promijeniti filtere za pretragu."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExercises.map((exercise, index) => {
            const difficulty = exercise.difficulty ? difficultyConfig[exercise.difficulty] : null;

            return (
              <Link
                key={exercise.id}
                href={`/dashboard/trener/vjezbe/${categorySlug}/${subcategorySlug}/${exercise.slug}`}
                className="flex items-center gap-5 bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 hover:border-coerver-green/30 transition-all duration-300 group"
              >
                {/* Order number */}
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-lg flex-shrink-0 group-hover:bg-coerver-green/10 group-hover:text-coerver-green transition-colors">
                  {index + 1}
                </div>

                {/* Thumbnail placeholder */}
                <div className={`w-28 h-20 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}>
                  {exercise.thumbnail_url ? (
                    <img
                      src={exercise.thumbnail_url}
                      alt={exercise.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-coerver-dark group-hover:text-coerver-green transition-colors truncate">
                      {exercise.title}
                    </h3>
                    {difficulty && (
                      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-lg ${difficulty.bgLight}`}>
                        {difficulty.label}
                      </span>
                    )}
                  </div>
                  {exercise.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {exercise.description}
                    </p>
                  )}
                </div>

                {/* Duration & Arrow */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  {exercise.duration && (
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-coerver-dark">{exercise.duration}</div>
                      <div className="text-xs text-gray-400">trajanje</div>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-coerver-green group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
