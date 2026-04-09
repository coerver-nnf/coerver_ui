"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingState, EmptyState, ConfirmDialog } from "@/components/admin";
import {
  getClubCoaches,
  addCoachToClub,
  removeCoachFromClub,
  updateCoachRole,
  getCoachesWithoutClub,
} from "@/lib/api/clubs";
import { ClubCoach } from "@/types/clubs";
import { Profile } from "@/types";
import { formatDate } from "@/lib/utils";

interface ClubCoachesTabProps {
  clubId: string;
}

export function ClubCoachesTab({ clubId }: ClubCoachesTabProps) {
  const [coaches, setCoaches] = useState<ClubCoach[]>([]);
  const [availableCoaches, setAvailableCoaches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<ClubCoach | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

  useEffect(() => {
    loadCoaches();
  }, [clubId]);

  async function loadCoaches() {
    setLoading(true);
    try {
      const data = await getClubCoaches(clubId);
      console.log("Loaded club coaches:", data);
      setCoaches(data);
    } catch (error) {
      console.error("Error loading coaches:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableCoaches() {
    try {
      const data = await getCoachesWithoutClub();
      setAvailableCoaches(data);
    } catch (error) {
      console.error("Error loading available coaches:", error);
    }
  }

  async function handleOpenAddModal() {
    setShowAddModal(true);
    await loadAvailableCoaches();
  }

  async function handleAddCoach() {
    if (!selectedCoach) return;
    setIsAdding(true);
    try {
      await addCoachToClub(clubId, selectedCoach);
      await loadCoaches();
      setShowAddModal(false);
      setSelectedCoach(null);
    } catch (error) {
      console.error("Error adding coach:", error);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemoveCoach() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await removeCoachFromClub(clubId, removeTarget.coach_id);
      await loadCoaches();
      setRemoveTarget(null);
    } catch (error) {
      console.error("Error removing coach:", error);
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleToggleRole(coach: ClubCoach) {
    const newRole = coach.role === "head_coach" ? "member" : "head_coach";
    try {
      await updateCoachRole(clubId, coach.coach_id, newRole);
      await loadCoaches();
    } catch (error) {
      console.error("Error updating coach role:", error);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-coerver-gray-900">Treneri u klubu</h2>
          <p className="text-sm text-coerver-gray-500">
            {coaches.length} {coaches.length === 1 ? "trener" : "trenera"} u klubu
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
          Dodaj trenera
        </Button>
      </div>

      {/* Coaches List */}
      {coaches.length === 0 ? (
        <EmptyState
          title="Nema trenera"
          description="Dodajte prvog trenera u ovaj klub"
          action={{
            label: "Dodaj trenera",
            onClick: handleOpenAddModal,
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200 divide-y divide-coerver-gray-100">
          {coaches.map((clubCoach) => (
            <div
              key={clubCoach.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {clubCoach.coach?.avatar_url ? (
                  <img
                    src={clubCoach.coach.avatar_url}
                    alt={clubCoach.coach.full_name || ""}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-coerver-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-coerver-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium text-coerver-gray-900">
                    {clubCoach.coach?.full_name || "Bez imena"}
                  </p>
                  <p className="text-sm text-coerver-gray-500">
                    {clubCoach.coach?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Role Badge */}
                <button
                  onClick={() => handleToggleRole(clubCoach)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    clubCoach.role === "head_coach"
                      ? "bg-coerver-green/10 text-coerver-green hover:bg-coerver-green/20"
                      : "bg-coerver-gray-100 text-coerver-gray-600 hover:bg-coerver-gray-200"
                  }`}
                  title={
                    clubCoach.role === "head_coach"
                      ? "Klikni za prebacivanje na člana"
                      : "Klikni za prebacivanje na glavnog trenera"
                  }
                >
                  {clubCoach.role === "head_coach" ? "Glavni trener" : "Član"}
                </button>

                {/* Joined date */}
                <span className="text-xs text-coerver-gray-400">
                  Pridružen {formatDate(clubCoach.joined_at)}
                </span>

                {/* Remove button */}
                <button
                  onClick={() => setRemoveTarget(clubCoach)}
                  className="p-1.5 text-coerver-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Ukloni iz kluba"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Coach Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-coerver-gray-200">
              <h3 className="text-lg font-semibold text-coerver-gray-900">
                Dodaj trenera u klub
              </h3>
              <p className="text-sm text-coerver-gray-500 mt-1">
                Odaberite trenera koji još nije član nijednog kluba
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {availableCoaches.length === 0 ? (
                <p className="text-center text-coerver-gray-500 py-8">
                  Nema dostupnih trenera
                </p>
              ) : (
                <div className="space-y-2">
                  {availableCoaches.map((coach) => (
                    <button
                      key={coach.id}
                      onClick={() => setSelectedCoach(coach.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedCoach === coach.id
                          ? "border-coerver-green bg-coerver-green/5"
                          : "border-coerver-gray-200 hover:border-coerver-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {coach.avatar_url ? (
                          <img
                            src={coach.avatar_url}
                            alt={coach.full_name || ""}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-coerver-gray-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-coerver-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-coerver-gray-900">
                            {coach.full_name || "Bez imena"}
                          </p>
                          <p className="text-sm text-coerver-gray-500">
                            {coach.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-coerver-gray-200 flex gap-3">
              <Button
                variant="primary"
                onClick={handleAddCoach}
                isLoading={isAdding}
                disabled={!selectedCoach}
                className="flex-1"
              >
                Dodaj
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedCoach(null);
                }}
              >
                Odustani
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Dialog */}
      <ConfirmDialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveCoach}
        title="Ukloni trenera"
        message={`Jeste li sigurni da želite ukloniti trenera "${
          removeTarget?.coach?.full_name || "Bez imena"
        }" iz kluba? Trener više neće imati pristup vježbama preko kluba.`}
        variant="danger"
        confirmLabel="Ukloni"
        isLoading={isRemoving}
      />
    </div>
  );
}
