"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
  exercise_count: number;
}

const categoryColors: Record<string, string> = {
  "ball-mastery": "from-coerver-green to-green-700",
  "1v1": "from-coerver-dark to-gray-800",
  "receiving-turning": "from-emerald-600 to-emerald-800",
  "passing": "from-coerver-green to-emerald-700",
  "finishing": "from-gray-700 to-coerver-dark",
  "speed": "from-lime-600 to-green-700",
};

export default function CategorySubcategoriesPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.categoryId as string;
  const { profile, loading: authLoading } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!authLoading && profile?.id) {
      loadData();
    }
  }, [categorySlug, authLoading, profile?.id]);

  async function loadData() {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // Fetch category by slug
      const { data: categoryData, error: catError } = await supabase
        .from("exercise_categories")
        .select("*")
        .eq("slug", categorySlug)
        .single();

      if (catError) throw catError;
      setCategory(categoryData);

      // Check access (individual + club-based)
      let hasFullCategoryAccess = false;
      let hasAnyAccess = false;
      let clubId: string | null = null;

      if (profile?.id && categoryData) {
        // Check individual category access
        const { data: individualAccess } = await supabase
          .from("coach_category_access")
          .select("id")
          .eq("coach_id", profile.id)
          .eq("category_id", categoryData.id)
          .single();

        if (individualAccess) {
          hasFullCategoryAccess = true;
          hasAnyAccess = true;
        } else {
          // Check club-based access
          const { data: clubMembership } = await supabase
            .from("club_coaches")
            .select("club_id")
            .eq("coach_id", profile.id)
            .single();

          if (clubMembership?.club_id) {
            clubId = clubMembership.club_id;

            // Check club category access
            const { data: clubCategoryAccess } = await supabase
              .from("club_category_access")
              .select("id")
              .eq("club_id", clubMembership.club_id)
              .eq("category_id", categoryData.id)
              .single();

            if (clubCategoryAccess) {
              hasFullCategoryAccess = true;
              hasAnyAccess = true;
            } else {
              // Check club subcategory access (any subcategory in this category)
              const { data: clubSubcategoryAccess } = await supabase
                .from("club_subcategory_access")
                .select("id, subcategory:exercise_subcategories!inner(category_id)")
                .eq("club_id", clubMembership.club_id)
                .eq("subcategory.category_id", categoryData.id)
                .limit(1);

              if (clubSubcategoryAccess && clubSubcategoryAccess.length > 0) {
                hasAnyAccess = true;
              } else {
                // Check club exercise access (any exercise in this category)
                const { data: clubExerciseAccess } = await supabase
                  .from("club_exercise_access")
                  .select("id, exercise:exercises!inner(category_id)")
                  .eq("club_id", clubMembership.club_id)
                  .eq("exercise.category_id", categoryData.id)
                  .limit(1);

                if (clubExerciseAccess && clubExerciseAccess.length > 0) {
                  hasAnyAccess = true;
                }
              }
            }
          }
        }

        setHasAccess(hasAnyAccess);
      }

      // Fetch all subcategories
      const { data: allSubcategories, error: subError } = await supabase
        .from("exercise_subcategories")
        .select("*")
        .eq("category_id", categoryData.id)
        .order("order_index");

      if (subError) throw subError;

      // Fetch exercise counts per subcategory
      const { data: exerciseCounts } = await supabase
        .from("exercises")
        .select("subcategory_id")
        .eq("category_id", categoryData.id);

      const countMap = exerciseCounts?.reduce((acc, ex) => {
        if (ex.subcategory_id) {
          acc[ex.subcategory_id] = (acc[ex.subcategory_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      // Filter subcategories based on access
      let accessibleSubcategories = allSubcategories || [];

      // If no full category access, filter to accessible subcategories
      if (!hasFullCategoryAccess && clubId) {
        // Get subcategories with direct club access
        const { data: clubSubAccess } = await supabase
          .from("club_subcategory_access")
          .select("subcategory_id")
          .eq("club_id", clubId);

        const accessibleSubIds = new Set(
          clubSubAccess?.map((a) => a.subcategory_id) || []
        );

        // Get subcategories that have exercises with club access
        const { data: clubExAccess } = await supabase
          .from("club_exercise_access")
          .select("exercise:exercises!inner(subcategory_id)")
          .eq("club_id", clubId);

        clubExAccess?.forEach((a: any) => {
          if (a.exercise?.subcategory_id) {
            accessibleSubIds.add(a.exercise.subcategory_id);
          }
        });

        accessibleSubcategories = (allSubcategories || []).filter(
          (sub) => accessibleSubIds.has(sub.id)
        );
      }

      const subcategoriesWithCounts = accessibleSubcategories.map((sub) => ({
        ...sub,
        exercise_count: countMap[sub.id] || 0,
      }));

      setSubcategories(subcategoriesWithCounts);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const color = categoryColors[categorySlug] || "from-gray-500 to-gray-700";

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-coerver-dark">
            Kategorija nije pronađena
          </h1>
          <Link href="/dashboard/trener" className="text-coerver-green mt-4 inline-block">
            ← Povratak na pregled
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasAccess && profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-coerver-dark mb-2">
            Nemate pristup ovoj kategoriji
          </h1>
          <p className="text-gray-500 mb-4">
            Kontaktirajte administratora za proširenje pristupa.
          </p>
          <Link href="/dashboard/trener" className="text-coerver-green hover:underline">
            ← Povratak na pregled
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const totalExercises = subcategories.reduce((sum, sub) => sum + sub.exercise_count, 0);

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard/trener"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-coerver-green transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Povratak na kategorije
        </Link>
      </div>

      {/* Header Card */}
      <div className={`rounded-3xl bg-gradient-to-br ${color} p-8 mb-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.name}</h1>
          <p className="text-white/80 max-w-xl">{category.description || "Coerver vježbe"}</p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium">
              {subcategories.length} potkategorija
            </span>
            <span className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium">
              {totalExercises} vježbi ukupno
            </span>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      {subcategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-coerver-dark mb-1">
            Nema potkategorija
          </h3>
          <p className="text-gray-500">
            Ova kategorija još nema potkategorija.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/dashboard/trener/vjezbe/${categorySlug}/${subcategory.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image or Placeholder */}
              <div className={`h-32 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                {subcategory.image_url ? (
                  <img
                    src={subcategory.image_url}
                    alt={subcategory.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </>
                )}
                {/* Exercise count badge */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                  {subcategory.exercise_count} vježbi
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-coerver-dark text-lg mb-1 group-hover:text-coerver-green transition-colors">
                  {subcategory.name}
                </h3>
                {subcategory.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {subcategory.description}
                  </p>
                )}

                <div className="flex items-center justify-end mt-4">
                  <span className="text-coerver-green text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Pregledaj vježbe
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
