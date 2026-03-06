"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

// Sample data
const trainingContent = [
  {
    id: "1",
    title: "Ball Mastery Osnove",
    category: "Ball Mastery",
    duration: "15 min",
    difficulty: "Početnik",
    completed: true,
  },
  {
    id: "2",
    title: "Tick Tock Progresija",
    category: "Ball Mastery",
    duration: "12 min",
    difficulty: "Početnik",
    completed: true,
  },
  {
    id: "3",
    title: "Inside-Outside Dribble",
    category: "1v1 Potezi",
    duration: "18 min",
    difficulty: "Srednji",
    completed: false,
  },
  {
    id: "4",
    title: "Step Over Tutorial",
    category: "1v1 Potezi",
    duration: "20 min",
    difficulty: "Srednji",
    completed: false,
  },
];

const upcomingSessions = [
  {
    id: "1",
    title: "Grupni Trening - Ball Mastery",
    date: "Pon, 19.02.2024",
    time: "17:00 - 18:30",
    location: "SC Mladost",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Grupni Trening - 1v1",
    date: "Sri, 21.02.2024",
    time: "17:00 - 18:30",
    location: "SC Mladost",
    status: "confirmed",
  },
];

const stats = [
  { label: "Završenih Lekcija", value: "12", icon: "📚" },
  { label: "Sati Treninga", value: "24", icon: "⏱️" },
  { label: "Ball Mastery Razina", value: "3", icon: "⚽" },
  { label: "Tjedni Streak", value: "4", icon: "🔥" },
];

export default function PlayerDashboardPage() {
  const router = useRouter();
  const { profile, loading, isAuthenticated, isApproved, signOut } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/prijava");
        return;
      }
      if (!isApproved) {
        router.push("/dashboard");
        return;
      }
      if (profile?.role !== "player") {
        router.push("/dashboard");
      }
    }
  }, [loading, isAuthenticated, isApproved, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-coerver-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-coerver-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-coerver-green to-coerver-green-dark py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Pozdrav, {profile?.full_name?.split(" ")[0] || "Igrač"}! 👋
              </h1>
              <p className="text-white/80">Spreman za danas?</p>
            </div>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-coerver-green"
              onClick={handleSignOut}
            >
              Odjava
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-coerver-dark">
                  {stat.value}
                </div>
                <div className="text-sm text-coerver-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Training Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Trening Sadržaji</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center gap-4 p-4 bg-coerver-gray-50 rounded-lg"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="w-24 h-16 bg-coerver-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-8 h-8 text-coerver-green"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-coerver-dark">
                            {content.title}
                          </h4>
                          {content.completed && (
                            <span className="w-5 h-5 bg-coerver-green rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-coerver-gray-500 mt-1">
                          <span>{content.category}</span>
                          <span>{content.duration}</span>
                          <span>{content.difficulty}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        {content.completed ? "Ponovi" : "Započni"}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/dashboard/igrac/treninzi">
                    <Button variant="primary">Pogledaj Sve Sadržaje</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Nadolazeći Treninzi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border border-coerver-gray-200 rounded-lg"
                    >
                      <h4 className="font-semibold text-coerver-dark">
                        {session.title}
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-coerver-gray-600">
                        <p className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {session.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {session.time}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          {session.location}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Potvrđeno
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard/igrac/raspored"
                  className="block mt-4 text-center text-coerver-green font-medium hover:underline"
                >
                  Pogledaj Puni Raspored
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Brze Poveznice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/dashboard/igrac/profil"
                  className="flex items-center gap-3 p-3 hover:bg-coerver-gray-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-coerver-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-coerver-gray-700">Moj Profil</span>
                </Link>
                <Link
                  href="/dashboard/igrac/napredak"
                  className="flex items-center gap-3 p-3 hover:bg-coerver-gray-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-coerver-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="text-coerver-gray-700">Moj Napredak</span>
                </Link>
                <Link
                  href="/za-igrace/kampovi"
                  className="flex items-center gap-3 p-3 hover:bg-coerver-gray-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-coerver-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                  <span className="text-coerver-gray-700">Kampovi</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
