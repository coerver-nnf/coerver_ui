"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge, ConfirmDialog, LoadingState } from "@/components/admin";
import {
  getCoachById,
  approveCoach,
  rejectCoach,
  updateCategoryAccess,
  Coach,
} from "@/lib/api/coaches";
import { getExerciseCategories, ExerciseCategory } from "@/lib/api/exercises";
import { formatDate } from "@/lib/utils";

export default function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [coach, setCoach] = useState<Coach | null>(null);
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const [coachData, categoriesData] = await Promise.all([
        getCoachById(id),
        getExerciseCategories(),
      ]);
      setCoach(coachData);
      setCategories(categoriesData);
      setSelectedCategories(
        coachData.category_access?.map((a) => a.category_id) || []
      );
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    try {
      await approveCoach(id);
      await loadData();
      setShowApproveDialog(false);
    } catch (error) {
      console.error("Error approving coach:", error);
    }
  }

  async function handleReject() {
    try {
      await rejectCoach(id);
      await loadData();
      setShowRejectDialog(false);
    } catch (error) {
      console.error("Error rejecting coach:", error);
    }
  }

  async function handleSaveAccess() {
    setSaving(true);
    try {
      await updateCategoryAccess(id, selectedCategories);
      await loadData();
    } catch (error) {
      console.error("Error saving access:", error);
    } finally {
      setSaving(false);
    }
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-coerver-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <LoadingState rows={3} />
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="text-center py-12">
        <p className="text-coerver-gray-500">Trener nije pronađen</p>
        <Link href="/dashboard/admin/coaches" className="text-coerver-green hover:underline mt-2 inline-block">
          Natrag na popis
        </Link>
      </div>
    );
  }

  const hasChanges =
    JSON.stringify(selectedCategories.sort()) !==
    JSON.stringify((coach.category_access?.map((a) => a.category_id) || []).sort());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/coaches"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-coerver-gray-900">
            {coach.full_name || "Bez imena"}
          </h1>
          <p className="text-coerver-gray-500">{coach.email}</p>
        </div>
        <StatusBadge status={coach.is_approved ? "approved" : "pending"} size="md" />
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Profil</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-coerver-gray-500">Email</p>
            <p className="font-medium text-coerver-gray-900">{coach.email}</p>
          </div>
          <div>
            <p className="text-sm text-coerver-gray-500">Registriran</p>
            <p className="font-medium text-coerver-gray-900">
              {formatDate(coach.created_at)}
            </p>
          </div>
          <div>
            <p className="text-sm text-coerver-gray-500">Status</p>
            <p className="font-medium text-coerver-gray-900">
              {coach.is_approved ? "Odobren" : "Na čekanju"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-coerver-gray-200 flex gap-3">
          {!coach.is_approved ? (
            <>
              <Button onClick={() => setShowApproveDialog(true)} variant="primary">
                Odobri trenera
              </Button>
              <Button onClick={() => setShowRejectDialog(true)} variant="outline">
                Odbij
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowRejectDialog(true)} variant="outline">
              Ukloni odobrenje
            </Button>
          )}
        </div>
      </div>

      {/* Category Access */}
      {coach.is_approved && (
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-coerver-gray-900">
                Pristup kategorijama
              </h2>
              <p className="text-sm text-coerver-gray-500">
                Odaberite kategorije vježbi kojima trener ima pristup
              </p>
            </div>
            {hasChanges && (
              <Button
                onClick={handleSaveAccess}
                isLoading={saving}
                variant="primary"
                size="sm"
              >
                Spremi promjene
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-coerver-green bg-coerver-green/5"
                      : "border-coerver-gray-200 hover:border-coerver-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-coerver-green border-coerver-green"
                          : "border-coerver-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-coerver-gray-900">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="text-xs text-coerver-gray-500 mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Odobri trenera"
        message={`Jeste li sigurni da želite odobriti trenera ${coach.full_name}? Nakon odobrenja, trener će moći pristupiti portalu.`}
        variant="info"
        confirmLabel="Odobri"
      />

      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        title={coach.is_approved ? "Ukloni odobrenje" : "Odbij trenera"}
        message={
          coach.is_approved
            ? `Jeste li sigurni da želite ukloniti odobrenje treneru ${coach.full_name}? Trener više neće moći pristupiti portalu.`
            : `Jeste li sigurni da želite odbiti trenera ${coach.full_name}?`
        }
        variant="danger"
        confirmLabel={coach.is_approved ? "Ukloni" : "Odbij"}
      />
    </div>
  );
}
