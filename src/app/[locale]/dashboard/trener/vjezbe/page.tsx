"use client";

import { useEffect, useState } from "react";
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
  category?: Category;
}

interface Exercise {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  category_id: string | null;
  subcategory_id: string | null;
  category?: Category;
  subcategory?: Subcategory;
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
  beginner: { label: "Početnik", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  intermediate: { label: "Srednji", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  advanced: { label: "Napredni", color: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
};

export default function ExercisesPage() {
  const { profile, loading: authLoading } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coachAccess, setCoachAccess] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [profile]);

  async function loadData() {
    const supabase = createClient();

    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("exercise_categories")
        .select("id, name, slug")
        .order("order_index");

      setCategories(categoriesData || []);

      // Fetch coach's category access
      if (profile?.id) {
        const { data: accessData } = await supabase
          .from("coach_category_access")
          .select("category_id")
          .eq("coach_id", profile.id);

        const accessIds = accessData?.map((a) => a.category_id) || [];
        setCoachAccess(accessIds);

        // Fetch exercises only from accessible categories
        if (accessIds.length > 0) {
          const { data: exercisesData } = await supabase
            .from("exercises")
            .select(`
              id, title, slug, description, thumbnail_url, duration, difficulty, category_id, subcategory_id,
              category:exercise_categories(id, name, slug),
              subcategory:exercise_subcategories(id, name, slug, category_id)
            `)
            .in("category_id", accessIds)
            .order("order_index")
            .order("created_at", { ascending: false });

          setExercises(exercisesData || []);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter exercises
  const accessibleCategories = categories.filter((cat) => coachAccess.includes(cat.id));

  const filteredExercises = exercises.filter((ex) => {
    const categoryMatch = selectedCategory === "all" || ex.category_id === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || ex.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded-2xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-coerver-dark">Sve vježbe</h1>
        <p className="text-gray-500 mt-1">
          Pregledajte sve dostupne Coerver vježbe
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Kategorija
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark font-medium"
            >
              <option value="all">Sve kategorije</option>
              {accessibleCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Težina
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark font-medium"
            >
              <option value="all">Sve težine</option>
              <option value="beginner">Početnik</option>
              <option value="intermediate">Srednji</option>
              <option value="advanced">Napredni</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Prikazano <span className="font-semibold text-coerver-dark">{filteredExercises.length}</span> od {exercises.length} vježbi
        </p>
      </div>

      {/* Exercise Grid */}
      {coachAccess.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-coerver-dark mb-1">
            Nemate pristup nijednoj kategoriji
          </h3>
          <p className="text-gray-500">
            Kontaktirajte administratora za dodjelu pristupa kategorijama vježbi.
          </p>
        </div>
      ) : filteredExercises.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((exercise) => {
            const category = exercise.category as Category | null;
            const subcategory = exercise.subcategory as Subcategory | null;
            const difficulty = exercise.difficulty ? difficultyConfig[exercise.difficulty] : null;
            const color = category?.slug ? categoryColors[category.slug] || "from-gray-400 to-gray-500" : "from-gray-400 to-gray-500";

            // Build the link URL
            const exerciseUrl = subcategory && category
              ? `/dashboard/trener/vjezbe/${category.slug}/${subcategory.slug}/${exercise.slug}`
              : `/dashboard/trener/vjezbe/${category?.slug || 'unknown'}`;

            return (
              <Link
                key={exercise.id}
                href={exerciseUrl}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <div className={`h-44 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                  {exercise.thumbnail_url ? (
                    <img
                      src={exercise.thumbnail_url}
                      alt={exercise.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  )}
                  {/* Duration badge */}
                  {exercise.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                      {exercise.duration}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {difficulty && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${difficulty.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${difficulty.dot}`} />
                        {difficulty.label}
                      </span>
                    )}
                    {category && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">
                        {category.name}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-coerver-dark group-hover:text-coerver-green transition-colors mb-2">
                    {exercise.title}
                  </h3>

                  {/* Description */}
                  {exercise.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {exercise.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-coerver-dark mb-1">
            Nema pronađenih vježbi
          </h3>
          <p className="text-gray-500">
            Pokušajte promijeniti filtere za pretragu.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
