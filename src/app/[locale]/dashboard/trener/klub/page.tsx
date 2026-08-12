"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/client";

interface Club {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  website: string | null;
  status: string;
}

interface ClubCoach {
  id: string;
  role: string;
  joined_at: string;
  coach: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

interface CategoryAccess {
  id: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function MyClubPage() {
  const { profile, loading: authLoading } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [coaches, setCoaches] = useState<ClubCoach[]>([]);
  const [categoryAccess, setCategoryAccess] = useState<CategoryAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRole, setMyRole] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && profile?.id) {
      loadData();
    }
  }, [authLoading, profile?.id]);

  async function loadData() {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // Check if coach belongs to a club
      const { data: membership, error: memberError } = await supabase
        .from("club_coaches")
        .select(`
          club_id,
          role,
          club:partner_clubs(*)
        `)
        .eq("coach_id", profile.id)
        .single();

      if (memberError || !membership) {
        // Coach doesn't belong to any club
        setLoading(false);
        return;
      }

      setClub(membership.club as unknown as Club);
      setMyRole(membership.role);

      // Fetch other coaches in the club
      const { data: clubCoaches } = await supabase
        .from("club_coaches")
        .select(`
          id,
          role,
          joined_at,
          coach:profiles!club_coaches_coach_id_fkey(id, full_name, email, avatar_url)
        `)
        .eq("club_id", membership.club_id)
        .order("joined_at");

      setCoaches((clubCoaches as unknown as ClubCoach[]) || []);

      // Fetch club's category access
      const { data: catAccess } = await supabase
        .from("club_category_access")
        .select(`
          id,
          category:exercise_categories(id, name, slug)
        `)
        .eq("club_id", membership.club_id);

      setCategoryAccess((catAccess as unknown as CategoryAccess[]) || []);
    } catch (error) {
      console.error("Error loading club data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!club) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-coerver-dark mb-2">
            Niste dio nijednog kluba
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Trenutno niste dodijeljeni nijednom partnerskom klubu.
            Kontaktirajte administratora za više informacija.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-coerver-dark">Moj Klub</h1>
        <p className="text-gray-500 mt-1">
          Informacije o vašem partnerskom klubu
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Club Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Club Card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-coerver-dark to-gray-900 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-coerver-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center gap-6">
                {club.logo_url ? (
                  <img
                    src={club.logo_url}
                    alt={club.name}
                    className="w-24 h-24 rounded-2xl object-contain bg-white p-2"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{club.name}</h2>
                  {club.city && (
                    <p className="text-white/60 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {club.city}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      club.status === 'active'
                        ? 'bg-coerver-green/20 text-coerver-green'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {club.status === 'active' ? 'Aktivan' : club.status === 'pending' ? 'Na čekanju' : 'Neaktivan'}
                    </span>
                    {myRole === 'head_coach' && (
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-400">
                        Glavni trener
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {club.description && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">O klubu</h3>
                <p className="text-gray-600">{club.description}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Kontakt</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {club.contact_name && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Kontakt osoba</p>
                      <p className="font-medium text-coerver-dark">{club.contact_name}</p>
                    </div>
                  </div>
                )}
                {club.contact_email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <a href={`mailto:${club.contact_email}`} className="font-medium text-coerver-green hover:underline">
                        {club.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                {club.contact_phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Telefon</p>
                      <a href={`tel:${club.contact_phone}`} className="font-medium text-coerver-dark">
                        {club.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
                {club.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Web stranica</p>
                      <a href={club.website} target="_blank" rel="noopener noreferrer" className="font-medium text-coerver-green hover:underline">
                        {club.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
                {club.address && (
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Adresa</p>
                      <p className="font-medium text-coerver-dark">{club.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coaches */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-coerver-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Treneri ({coaches.length})
            </h3>
            <div className="space-y-3">
              {coaches.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coerver-green to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.coach?.full_name?.charAt(0) || item.coach?.email?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-coerver-dark truncate">
                      {item.coach?.full_name || item.coach?.email}
                      {item.coach?.id === profile?.id && (
                        <span className="text-gray-400 text-sm ml-1">(Vi)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.role === 'head_coach' ? 'Glavni trener' : 'Trener'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Access */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-coerver-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pristup kategorijama
            </h3>
            {categoryAccess.length > 0 ? (
              <div className="space-y-2">
                {categoryAccess.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/trener/vjezbe/${item.category.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-coerver-green/10 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-coerver-green/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium text-coerver-dark group-hover:text-coerver-green transition-colors">
                      {item.category.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Klub nema dodijeljeni pristup kategorijama. Pristup se dodjeljuje na razini vježbi.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
