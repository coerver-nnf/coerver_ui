"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading, isAuthenticated, isApproved } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/prijava");
        return;
      }
      if (!isApproved) {
        return;
      }
      if (profile?.role === "coach") {
        router.push("/dashboard/trener");
      } else if (profile?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/igrac");
      }
    }
  }, [loading, isAuthenticated, isApproved, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coerver-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coerver-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  // TODO: Re-enable approval UI
  // if (!isApproved) {
  //   return (
  //     <div className="min-h-screen bg-coerver-gray-50 pt-24 pb-12">
  //       ...
  //     </div>
  //   );
  // }

  return null;
}
