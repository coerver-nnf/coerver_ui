"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getCamps, deleteCamp, Camp } from "@/lib/api/camps";
import { formatDateShort } from "@/lib/utils";

export default function CampsPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [deleteTarget, setDeleteTarget] = useState<Camp | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCamps();
  }, [filter]);

  async function loadCamps() {
    setLoading(true);
    try {
      const options: { upcoming?: boolean; status?: string } = {};
      if (filter === "upcoming") options.upcoming = true;
      if (filter === "completed") options.status = "completed";
      const data = await getCamps(options);
      setCamps(data);
    } catch (error) {
      console.error("Error loading camps:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCamp(deleteTarget.id);
      await loadCamps();
    } catch (error) {
      console.error("Error deleting camp:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<Camp>[] = [
    {
      accessorKey: "title",
      header: "Naziv",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image_url ? (
            <img
              src={row.original.image_url}
              alt={row.original.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-coerver-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-coerver-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-coerver-gray-900">{row.original.title}</p>
            <p className="text-sm text-coerver-gray-500">{row.original.location}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Datum",
      cell: ({ row }) => (
        <div className="text-coerver-gray-600">
          <p>{formatDateShort(row.original.start_date)}</p>
          <p className="text-xs text-coerver-gray-400">do {formatDateShort(row.original.end_date)}</p>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Cijena",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">
          {row.original.price ? `${row.original.price} €` : "-"}
        </span>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Kapacitet",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">
          {row.original.capacity || "-"}
        </span>
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
            href={`/dashboard/admin/camps/${row.original.id}`}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Kampovi</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte kampovima</p>
        </div>
        <Link href="/dashboard/admin/camps/new">
          <Button variant="primary">Novi kamp</Button>
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
          Svi
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "upcoming"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Nadolazeći
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "completed"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Završeni
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : camps.length === 0 ? (
        <EmptyState
          title="Nema kampova"
          description="Kreirajte prvi kamp klikom na gumb iznad"
          action={{
            label: "Novi kamp",
            onClick: () => window.location.href = "/dashboard/admin/camps/new",
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={camps} searchKey="title" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši kamp"
        message={`Jeste li sigurni da želite obrisati kamp "${deleteTarget?.title}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
