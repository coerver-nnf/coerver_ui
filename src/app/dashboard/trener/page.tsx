"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  exercise_count: number;
  subcategory_count: number;
}

interface CoachAccess {
  category_id: string;
}

const categoryColors: Record<string, string> = {
  "ball-mastery": "from-coerver-green to-green-700",
  "1v1": "from-coerver-dark to-gray-800",
  "receiving-turning": "from-emerald-600 to-emerald-800",
  "passing": "from-coerver-green to-emerald-700",
  "finishing": "from-gray-700 to-coerver-dark",
  "speed": "from-lime-600 to-green-700",
};

const categoryIcons: Record<string, React.ReactNode> = {
  "ball-mastery": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeWidth={1.5} d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  "1v1": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  "receiving-turning": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  "passing": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  ),
  "finishing": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  "speed": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

export default function CoachDashboardPage() {
  const router = useRouter();
  const { profile, loading: authLoading, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [coachAccess, setCoachAccess] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/prijava");
        return;
      }
      loadData();
    }
  }, [authLoading, isAuthenticated, profile, router]);

  async function loadData() {
    const supabase = createClient();

    try {
      // Fetch categories with counts
      const { data: categoriesData, error: catError } = await supabase
        .from("exercise_categories")
        .select("*")
        .order("order_index");

      if (catError) throw catError;

      // Fetch exercise counts per category
      const { data: exerciseCounts } = await supabase
        .from("exercises")
        .select("category_id");

      // Fetch subcategory counts per category
      const { data: subcategoryCounts } = await supabase
        .from("exercise_subcategories")
        .select("category_id");

      // Calculate counts
      const exerciseCountMap = exerciseCounts?.reduce((acc, ex) => {
        if (ex.category_id) {
          acc[ex.category_id] = (acc[ex.category_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const subcategoryCountMap = subcategoryCounts?.reduce((acc, sub) => {
        if (sub.category_id) {
          acc[sub.category_id] = (acc[sub.category_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const categoriesWithCounts = categoriesData?.map((cat) => ({
        ...cat,
        exercise_count: exerciseCountMap[cat.id] || 0,
        subcategory_count: subcategoryCountMap[cat.id] || 0,
      })) || [];

      setCategories(categoriesWithCounts);

      // Fetch coach's category access if user is logged in
      if (profile?.id) {
        const { data: accessData } = await supabase
          .from("coach_category_access")
          .select("category_id")
          .eq("coach_id", profile.id);

        setCoachAccess(accessData?.map((a) => a.category_id) || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const accessibleCategories = categories.filter((cat) => coachAccess.includes(cat.id));
  const totalAccessibleExercises = accessibleCategories.reduce(
    (sum, cat) => sum + cat.exercise_count,
    0
  );
  const totalExercises = categories.reduce((sum, cat) => sum + cat.exercise_count, 0);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-coerver-dark">
              Dobrodošli natrag{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
            </h1>
            <p className="text-gray-500 mt-1">
              Pregledajte svoje Coerver vježbe i unaprijedite treninge
            </p>
          </div>
          <div className="hidden md:block">
            <Image
              src="/images/coerver-logo.png"
              alt="Coerver"
              width={120}
              height={40}
              className="h-8 w-auto opacity-20"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-coerver-green to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-coerver-green/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white/60 text-xs font-medium uppercase tracking-wide">Otključano</span>
          </div>
          <div className="text-4xl font-bold">{coachAccess.length}</div>
          <div className="text-white/80 text-sm mt-1">od {categories.length} kategorija</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-coerver-green/10 rounded-xl flex items-center justify-center text-coerver-green">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Dostupno</span>
          </div>
          <div className="text-4xl font-bold text-coerver-dark">{totalAccessibleExercises}</div>
          <div className="text-gray-500 text-sm mt-1">vježbi za vas</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Ukupno</span>
          </div>
          <div className="text-4xl font-bold text-coerver-dark">{categories.length}</div>
          <div className="text-gray-500 text-sm mt-1">kategorija vježbi</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Biblioteka</span>
          </div>
          <div className="text-4xl font-bold text-coerver-dark">{totalExercises}</div>
          <div className="text-gray-500 text-sm mt-1">ukupno vježbi</div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-coerver-dark">Kategorije Vježbi</h2>
            <p className="text-gray-500 text-sm mt-0.5">Odaberite kategoriju za pregled potkategorija i vježbi</p>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500">Nema dostupnih kategorija</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const hasAccess = coachAccess.includes(category.id);
              const color = categoryColors[category.slug] || "from-gray-500 to-gray-700";
              const icon = categoryIcons[category.slug];

              return (
                <Link
                  key={category.id}
                  href={hasAccess ? `/dashboard/trener/vjezbe/${category.slug}` : "#"}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    hasAccess
                      ? "bg-white hover:shadow-xl hover:shadow-coerver-green/10 hover:-translate-y-1 cursor-pointer border border-gray-100"
                      : "bg-gray-50 opacity-60 cursor-not-allowed border border-gray-100"
                  }`}
                  onClick={(e) => !hasAccess && e.preventDefault()}
                >
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
                        {icon || (
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                      </div>

                      {/* Status indicator */}
                      {hasAccess ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-coerver-green bg-coerver-green/10 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-coerver-green rounded-full" />
                          Dostupno
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Zaključano
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-coerver-dark text-lg mb-1 group-hover:text-coerver-green transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {category.description || "Coerver vježbe"}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          <span className="font-semibold text-coerver-dark">{category.subcategory_count}</span> potkategorija
                        </span>
                        <span className="text-sm text-gray-400">
                          <span className="font-semibold text-coerver-dark">{category.exercise_count}</span> vježbi
                        </span>
                      </div>
                      {hasAccess && (
                        <span className="text-coerver-green text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Otvori
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-coerver-dark to-gray-900 rounded-2xl p-6 md:p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-coerver-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-coerver-green/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Želite pristup svim kategorijama?
              </h3>
              <p className="text-white/70 text-sm max-w-xl">
                Pristup kategorijama vježbi dodjeljuje se na temelju vašeg napretka i završenih Coerver edukacija.
                Kontaktirajte nas za više informacija o proširenju pristupa.
              </p>
              <button className="mt-4 px-5 py-2.5 bg-coerver-green hover:bg-coerver-green/90 text-white rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2">
                Kontaktirajte nas
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
