import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin";
import { formatDateShort } from "@/lib/utils";

async function getDashboardStats() {
  const supabase = await createClient();

  const [
    postsResult,
    exercisesResult,
    coachesResult,
    pendingCoachesResult,
    campsResult,
    academiesResult,
    coursesResult,
    inquiriesResult,
    recentInquiriesResult,
    usersResult,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact" }),
    supabase.from("exercises").select("id", { count: "exact" }),
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "coach"),
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "coach").eq("is_approved", false),
    supabase.from("camps").select("id", { count: "exact" }),
    supabase.from("academies").select("id", { count: "exact" }),
    supabase.from("courses").select("id", { count: "exact" }),
    supabase.from("inquiries").select("id", { count: "exact" }).eq("status", "new"),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("id", { count: "exact" }),
  ]);

  return {
    posts: postsResult.count || 0,
    exercises: exercisesResult.count || 0,
    coaches: coachesResult.count || 0,
    pendingCoaches: pendingCoachesResult.count || 0,
    camps: campsResult.count || 0,
    academies: academiesResult.count || 0,
    courses: coursesResult.count || 0,
    newInquiries: inquiriesResult.count || 0,
    recentInquiries: recentInquiriesResult.data || [],
    totalUsers: usersResult.count || 0,
  };
}

function StatCard({
  title,
  value,
  icon,
  href,
  accent = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl border transition-all hover:shadow-md ${
        accent
          ? "bg-coerver-green text-white border-coerver-green"
          : "bg-white border-coerver-gray-200 hover:border-coerver-green"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${accent ? "text-white/80" : "text-coerver-gray-500"}`}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${accent ? "bg-white/20" : "bg-coerver-gray-100"}`}>
          {icon}
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Admin Panel</h1>
        <p className="text-coerver-gray-500 mt-1">Dobrodošli u administrativnu ploču</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Novi upiti"
          value={stats.newInquiries}
          href="/dashboard/admin/inquiries"
          accent={stats.newInquiries > 0}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Treneri na čekanju"
          value={stats.pendingCoaches}
          href="/dashboard/admin/coaches?filter=pending"
          accent={stats.pendingCoaches > 0}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Ukupno trenera"
          value={stats.coaches}
          href="/dashboard/admin/coaches"
          icon={
            <svg className="w-6 h-6 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Ukupno korisnika"
          value={stats.totalUsers}
          href="/dashboard/admin/users"
          icon={
            <svg className="w-6 h-6 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vježbe"
          value={stats.exercises}
          href="/dashboard/admin/exercises"
          icon={
            <svg className="w-6 h-6 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Blog postovi"
          value={stats.posts}
          href="/dashboard/admin/blog"
          icon={
            <svg className="w-6 h-6 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          title="Kampovi"
          value={stats.camps}
          href="/dashboard/admin/camps"
          icon={
            <svg className="w-6 h-6 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          }
        />
        <StatCard
          title="Akademije"
          value={stats.academies}
          href="/dashboard/admin/academies"
          icon={
            <svg className="w-6 h-6 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-coerver-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-coerver-gray-900">Nedavni upiti</h2>
          <Link
            href="/dashboard/admin/inquiries"
            className="text-sm text-coerver-green hover:underline font-medium"
          >
            Vidi sve
          </Link>
        </div>
        {stats.recentInquiries.length > 0 ? (
          <div className="divide-y divide-coerver-gray-100">
            {stats.recentInquiries.map((inquiry: {
              id: string;
              name: string;
              email: string;
              type: string;
              status: string;
              created_at: string;
            }) => (
              <Link
                key={inquiry.id}
                href={`/dashboard/admin/inquiries/${inquiry.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-coerver-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-coerver-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-coerver-gray-600 font-medium">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-coerver-gray-900">{inquiry.name}</p>
                    <p className="text-sm text-coerver-gray-500">{inquiry.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={inquiry.status} />
                  <span className="text-sm text-coerver-gray-400">
                    {formatDateShort(inquiry.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-coerver-gray-500">Nema nedavnih upita</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/exercises/new"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-coerver-gray-200
                     hover:border-coerver-green hover:shadow-md transition-all"
        >
          <div className="p-3 bg-coerver-green/10 rounded-lg">
            <svg className="w-6 h-6 text-coerver-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-coerver-gray-900">Nova vježba</p>
            <p className="text-sm text-coerver-gray-500">Dodaj novu vježbu u bazu</p>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/blog/new"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-coerver-gray-200
                     hover:border-coerver-green hover:shadow-md transition-all"
        >
          <div className="p-3 bg-coerver-green/10 rounded-lg">
            <svg className="w-6 h-6 text-coerver-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-coerver-gray-900">Novi članak</p>
            <p className="text-sm text-coerver-gray-500">Napiši novi blog post</p>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/camps/new"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-coerver-gray-200
                     hover:border-coerver-green hover:shadow-md transition-all"
        >
          <div className="p-3 bg-coerver-green/10 rounded-lg">
            <svg className="w-6 h-6 text-coerver-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-coerver-gray-900">Novi kamp</p>
            <p className="text-sm text-coerver-gray-500">Kreiraj novi kamp</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
