"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getCoaches, approveCoach, rejectCoach, Coach } from "@/lib/api/coaches";
import { formatDateShort } from "@/lib/utils";

const columns: ColumnDef<Coach>[] = [
  {
    accessorKey: "full_name",
    header: "Ime i prezime",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-coerver-gray-100 rounded-full flex items-center justify-center">
          {row.original.avatar_url ? (
            <img
              src={row.original.avatar_url}
              alt={row.original.full_name || ""}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-coerver-gray-600 font-medium">
              {row.original.full_name?.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-coerver-gray-900">
            {row.original.full_name || "Bez imena"}
          </p>
          <p className="text-sm text-coerver-gray-500">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "is_approved",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.is_approved ? "approved" : "pending"} />
    ),
  },
  {
    accessorKey: "created_at",
    header: "Registriran",
    cell: ({ row }) => (
      <span className="text-coerver-gray-500">
        {formatDateShort(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/admin/coaches/${row.original.id}`}
        className="text-coerver-green hover:underline font-medium text-sm"
      >
        Detalji
      </Link>
    ),
  },
];

export default function CoachesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    (filterParam as "all" | "pending" | "approved") || "all"
  );
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCoaches();
  }, [filter]);

  async function loadCoaches() {
    setLoading(true);
    try {
      const options: { is_approved?: boolean } = {};
      if (filter === "pending") options.is_approved = false;
      if (filter === "approved") options.is_approved = true;

      const data = await getCoaches(options);
      setCoaches(data);
    } catch (error) {
      console.error("Error loading coaches:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction() {
    if (!selectedCoach || !actionType) return;

    setIsProcessing(true);
    try {
      if (actionType === "approve") {
        await approveCoach(selectedCoach.id);
      } else {
        await rejectCoach(selectedCoach.id);
      }
      await loadCoaches();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
      setSelectedCoach(null);
      setActionType(null);
    }
  }

  const pendingCount = coaches.filter((c) => !c.is_approved).length;
  const approvedCount = coaches.filter((c) => c.is_approved).length;

  const filteredCoaches =
    filter === "all"
      ? coaches
      : filter === "pending"
      ? coaches.filter((c) => !c.is_approved)
      : coaches.filter((c) => c.is_approved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Treneri</h1>
          <p className="text-coerver-gray-500 mt-1">
            Upravljajte trenerima i njihovim pristupom
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "all"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Svi ({coaches.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "pending"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Na čekanju ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "approved"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Odobreni ({approvedCount})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : filteredCoaches.length === 0 ? (
        <EmptyState
          title="Nema trenera"
          description={
            filter === "pending"
              ? "Nema trenera koji čekaju odobrenje"
              : filter === "approved"
              ? "Nema odobrenih trenera"
              : "Još nema registriranih trenera"
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={filteredCoaches} searchKey="full_name" />
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!selectedCoach && !!actionType}
        onClose={() => {
          setSelectedCoach(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        title={actionType === "approve" ? "Odobri trenera" : "Odbij trenera"}
        message={
          actionType === "approve"
            ? `Jeste li sigurni da želite odobriti trenera ${selectedCoach?.full_name}?`
            : `Jeste li sigurni da želite odbiti trenera ${selectedCoach?.full_name}?`
        }
        variant={actionType === "approve" ? "info" : "danger"}
        confirmLabel={actionType === "approve" ? "Odobri" : "Odbij"}
        isLoading={isProcessing}
      />
    </div>
  );
}
