"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Pregled",
    href: "/dashboard/trener",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
  {
    name: "Vježbe",
    href: "/dashboard/trener/vjezbe",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Moj Profil",
    href: "/dashboard/trener/profil",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-coerver-dark via-[#1a1a1a] to-[#0d0d0d] transform transition-transform duration-300 ease-out lg:translate-x-0 shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6">
            <Link href="/dashboard/trener" className="block">
              <Image
                src="/images/coerver-logo.png"
                alt="Coerver Coaching"
                width={160}
                height={56}
                className="h-12 w-auto"
              />
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-8 bg-coerver-green rounded-full" />
              <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Trenerski Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-4">
            <p className="px-4 mb-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold">Navigacija</p>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard/trener" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-coerver-green text-white shadow-lg shadow-coerver-green/25"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className={cn(
                      "transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <span className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 mt-auto">
            {/* Quick Link */}
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Povratak na stranicu</span>
            </Link>

            {/* User Card */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coerver-green to-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {profile?.full_name?.charAt(0) || "T"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {profile?.full_name || "Trener"}
                  </p>
                  <p className="text-white/40 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-coerver-green rounded-full" />
                    Coerver Trener
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Odjava
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 -ml-2 text-gray-500 hover:text-coerver-dark hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile logo */}
            <div className="lg:hidden">
              <Image
                src="/images/coerver-logo.png"
                alt="Coerver"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop: Breadcrumb area */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-gray-400">Dashboard</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-coerver-dark font-medium">Trener</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Notification bell placeholder */}
              <button className="p-2.5 text-gray-400 hover:text-coerver-dark hover:bg-gray-100 rounded-xl transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-coerver-green rounded-full" />
              </button>

              {/* User avatar (desktop) */}
              <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-coerver-dark">{profile?.full_name || "Trener"}</p>
                  <p className="text-xs text-gray-400">Coerver Trener</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coerver-green to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                  {profile?.full_name?.charAt(0) || "T"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
