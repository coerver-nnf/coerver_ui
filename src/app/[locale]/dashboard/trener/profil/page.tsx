"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/client";

interface CategoryAccess {
  id: string;
  name: string;
  slug: string;
  type: "full" | "partial";
}

interface ClubInfo {
  id: string;
  name: string;
  logo_url: string | null;
}

const categoryColors: Record<string, string> = {
  "ball-mastery": "from-coerver-green to-green-700",
  "1v1": "from-coerver-dark to-gray-800",
  "receiving-turning": "from-emerald-600 to-emerald-800",
  "passing": "from-coerver-green to-emerald-700",
  "finishing": "from-gray-700 to-coerver-dark",
  "speed": "from-lime-600 to-green-700",
};

export default function CoachProfilePage() {
  const { profile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [accessibleCategories, setAccessibleCategories] = useState<CategoryAccess[]>([]);
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [loadingAccess, setLoadingAccess] = useState(true);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && profile?.id) {
      loadAccessData();
    }
  }, [authLoading, profile?.id]);

  async function loadAccessData() {
    if (!profile?.id) {
      setLoadingAccess(false);
      return;
    }

    const supabase = createClient();
    const accessMap = new Map<string, CategoryAccess>();

    try {
      // Fetch all categories for reference
      const { data: allCategories } = await supabase
        .from("exercise_categories")
        .select("id, name, slug")
        .order("order_index");

      // Check individual category access
      const { data: individualAccess } = await supabase
        .from("coach_category_access")
        .select("category_id")
        .eq("coach_id", profile.id);

      individualAccess?.forEach((access) => {
        const cat = allCategories?.find((c) => c.id === access.category_id);
        if (cat) {
          accessMap.set(cat.id, { ...cat, type: "full" });
        }
      });

      // Check club membership
      const { data: clubMembership } = await supabase
        .from("club_coaches")
        .select("club_id, club:partner_clubs(id, name, logo_url)")
        .eq("coach_id", profile.id)
        .single();

      if (clubMembership?.club) {
        setClubInfo(clubMembership.club as ClubInfo);
        const clubId = clubMembership.club_id;

        // Check club category access
        const { data: clubCategoryAccess } = await supabase
          .from("club_category_access")
          .select("category_id")
          .eq("club_id", clubId);

        clubCategoryAccess?.forEach((access) => {
          const cat = allCategories?.find((c) => c.id === access.category_id);
          if (cat && !accessMap.has(cat.id)) {
            accessMap.set(cat.id, { ...cat, type: "full" });
          }
        });

        // Check club subcategory access (partial category access)
        const { data: clubSubcategoryAccess } = await supabase
          .from("club_subcategory_access")
          .select("subcategory:exercise_subcategories(category_id)")
          .eq("club_id", clubId);

        clubSubcategoryAccess?.forEach((access: any) => {
          const categoryId = access.subcategory?.category_id;
          if (categoryId && !accessMap.has(categoryId)) {
            const cat = allCategories?.find((c) => c.id === categoryId);
            if (cat) {
              accessMap.set(cat.id, { ...cat, type: "partial" });
            }
          }
        });

        // Check club exercise access (partial category access)
        const { data: clubExerciseAccess } = await supabase
          .from("club_exercise_access")
          .select("exercise:exercises(category_id)")
          .eq("club_id", clubId);

        clubExerciseAccess?.forEach((access: any) => {
          const categoryId = access.exercise?.category_id;
          if (categoryId && !accessMap.has(categoryId)) {
            const cat = allCategories?.find((c) => c.id === categoryId);
            if (cat) {
              accessMap.set(cat.id, { ...cat, type: "partial" });
            }
          }
        });
      }

      setAccessibleCategories(Array.from(accessMap.values()));
    } catch (error) {
      console.error("Error loading access data:", error);
    } finally {
      setLoadingAccess(false);
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement profile update with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-coerver-dark">Moj Profil</h1>
        <p className="text-gray-500 mt-1">
          Pregledajte i uredite svoje podatke
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-coerver-dark via-gray-900 to-coerver-dark p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-coerver-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-coerver-green/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-coerver-green to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {profile?.full_name?.charAt(0) || "T"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {profile?.full_name || "Trener"}
                  </h2>
                  <p className="text-white/60 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-coerver-green rounded-full" />
                    Coerver Trener
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-coerver-dark text-lg">Osobni podaci</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-coerver-green hover:bg-coerver-green/10 rounded-xl transition-colors"
                  >
                    Uredi profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Odustani
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 text-sm font-medium bg-coerver-green text-white rounded-xl hover:bg-coerver-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving && (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      Spremi
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Ime i prezime
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark font-medium disabled:text-gray-500"
                    placeholder="Vaše ime i prezime"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Email adresa
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-400 cursor-not-allowed"
                    placeholder="vas@email.com"
                  />
                  <p className="text-xs text-gray-400 mt-1.5 pl-1">Email adresa se ne može promijeniti</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark font-medium disabled:text-gray-500"
                    placeholder="+385 91 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-coerver-dark mb-5">Status računa</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Aktivan
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm">Uloga</span>
                <span className="text-coerver-dark font-semibold text-sm">Trener</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm">Član od</span>
                <span className="text-coerver-dark font-semibold text-sm">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("hr-HR", {
                        year: "numeric",
                        month: "long",
                      })
                    : "Siječanj 2024"}
                </span>
              </div>
            </div>
          </div>

          {/* Club Info */}
          {clubInfo && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-coerver-dark mb-4">Moj Klub</h3>
              <Link
                href="/dashboard/trener/klub"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {clubInfo.logo_url ? (
                  <img
                    src={clubInfo.logo_url}
                    alt={clubInfo.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coerver-green to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {clubInfo.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-coerver-dark font-semibold block">{clubInfo.name}</span>
                  <span className="text-gray-400 text-xs">Pogledaj detalje →</span>
                </div>
              </Link>
            </div>
          )}

          {/* Access */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-coerver-dark mb-5">Pristup kategorijama</h3>
            {loadingAccess ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : accessibleCategories.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Nemate dodijeljeni pristup</p>
              </div>
            ) : (
              <div className="space-y-3">
                {accessibleCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[cat.slug] || "from-gray-500 to-gray-700"} shadow-md`} />
                    <div className="flex-1">
                      <span className="text-coerver-dark font-medium block">{cat.name}</span>
                      {cat.type === "partial" && (
                        <span className="text-xs text-gray-400">Djelomičan pristup</span>
                      )}
                    </div>
                    {cat.type === "full" ? (
                      <svg
                        className="w-5 h-5 text-coerver-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              Za proširenje pristupa kontaktirajte administratora.
            </p>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-coerver-dark mb-5">Sigurnost</h3>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-coerver-dark rounded-xl transition-colors font-medium">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Promijeni lozinku
            </button>
          </div>

          {/* Coerver Logo */}
          <div className="flex justify-center pt-4">
            <Image
              src="/images/coerver-logo.png"
              alt="Coerver Coaching"
              width={120}
              height={40}
              className="h-8 w-auto opacity-20"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
