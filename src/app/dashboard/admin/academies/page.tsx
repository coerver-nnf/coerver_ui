"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getAcademies, deleteAcademy, Academy } from "@/lib/api/academies";

export default function AcademiesPage() {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [deleteTarget, setDeleteTarget] = useState<Academy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAcademies();
  }, [filter]);

  async function loadAcademies() {
    setLoading(true);
    try {
      const options = filter !== "all" ? { status: filter } : {};
      const data = await getAcademies(options);
      setAcademies(data);
    } catch (error) {
      console.error("Error loading academies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAcademy(deleteTarget.id);
      await loadAcademies();
    } catch (error) {
      console.error("Error deleting academy:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<Academy>[] = [
    {
      accessorKey: "name",
      header: "Naziv",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image_url ? (
            <img
              src={row.original.image_url}
              alt={row.original.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-coerver-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-coerver-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-coerver-gray-900">{row.original.name}</p>
            <p className="text-sm text-coerver-gray-500">{row.original.location}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact_email",
      header: "Kontakt",
      cell: ({ row }) => (
        <div className="text-coerver-gray-600">
          <p>{row.original.contact_email || "-"}</p>
          {row.original.contact_phone && (
            <p className="text-sm text-coerver-gray-400">{row.original.contact_phone}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/admin/academies/${row.original.id}`}
            className="text-coerver-green hover:underline font-medium text-sm"
          >
            Uredi
          </Link>
          <button
            onClick={() => setDeleteTarget(row.original)}
            className="text-red-600 hover:underline font-medium text-sm"
          >
            Obriši
          </button>
        </div>
      ),
    },
  ];

  const activeCount = academies.filter((a) => a.status === "active").length;
  const inactiveCount = academies.filter((a) => a.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Akademije</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte akademijama</p>
        </div>
        <Link href="/dashboard/admin/academies/new">
          <Button variant="primary">Nova akademija</Button>
        </Link>
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
          Sve ({academies.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "active"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Aktivne ({activeCount})
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "inactive"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Neaktivne ({inactiveCount})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : academies.length === 0 ? (
        <EmptyState
          title="Nema akademija"
          description="Dodajte prvu akademiju klikom na gumb iznad"
          action={{
            label: "Nova akademija",
            onClick: () => window.location.href = "/dashboard/admin/academies/new",
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={academies} searchKey="name" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši akademiju"
        message={`Jeste li sigurni da želite obrisati akademiju "${deleteTarget?.name}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
