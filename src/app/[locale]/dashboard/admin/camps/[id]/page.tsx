"use client";

import { useState, useEffect } from "react";
import { CampForm } from "@/components/admin/forms";
import { FormLoadingState } from "@/components/admin";
import { getCampById, Camp } from "@/lib/api/camps";

export default function EditCampPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [camp, setCamp] = useState<Camp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCamp() {
      setLoading(true);
      try {
        const data = await getCampById(id);
        setCamp(data);
      } catch (error) {
        console.error("Error loading camp:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCamp();
  }, [id]);

  if (loading || !camp) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-coerver-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-48 bg-coerver-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <FormLoadingState />
        </div>
      </div>
    );
  }

  return <CampForm camp={camp} />;
}
