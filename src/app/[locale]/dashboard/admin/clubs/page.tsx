"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getClubs, deleteClub } from "@/lib/api/clubs";
import { PartnerClub } from "@/types/clubs";

type FilterType = "all" | "active" | "inactive" | "pending";

export default function ClubsPage() {
  const [clubs, setClubs] = useState<PartnerClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [deleteTarget, setDeleteTarget] = useState<PartnerClub | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadClubs();
  }, [filter]);

  async function loadClubs() {
    setLoading(true);
    try {
      const options: { status?: string } = {};
      if (filter !== "all") {
        options.status = filter;
      }
      const data = await getClubs(options);
      setClubs(data);
    } catch (error) {
      console.error("Error loading clubs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteClub(deleteTarget.id);
      await loadClubs();
    } catch (error) {
      console.error("Error deleting club:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<PartnerClub>[] = [
    {
      accessorKey: "name",
      header: "Klub",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.logo_url ? (
            <img
              src={row.original.logo_url}
              alt={row.original.name}
              className="w-10 h-10 rounded-lg object-contain bg-white border border-coerver-gray-200"
            />
          ) : (
            <div className="w-10 h-10 bg-coerver-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-coerver-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-coerver-gray-900">{row.original.name}</p>
            {row.original.city && (
              <p className="text-sm text-coerver-gray-500">{row.original.city}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact_email",
      header: "Kontakt",
      cell: ({ row }) => (
        <div className="text-coerver-gray-600">
          {row.original.contact_name && (
            <p className="font-medium">{row.original.contact_name}</p>
          )}
          {row.original.contact_email && (
            <p className="text-sm text-coerver-gray-500">{row.original.contact_email}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "coach_count",
      header: "Treneri",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">
          {row.original.coach_count || 0}
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
            href={`/dashboard/admin/clubs/${row.original.id}`}
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

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all", label: "Svi" },
    { key: "active", label: "Aktivni" },
    { key: "inactive", label: "Neaktivni" },
    { key: "pending", label: "Na čekanju" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Partnerski Klubovi</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte partnerskim klubovima i njihovim trenerima</p>
        </div>
        <Link href="/dashboard/admin/clubs/new">
          <Button variant="primary">Novi klub</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === btn.key
                ? "bg-coerver-green text-white"
                : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : clubs.length === 0 ? (
        <EmptyState
          title="Nema klubova"
          description={
            filter === "all"
              ? "Dodajte prvi partnerski klub klikom na gumb iznad"
              : "Nema klubova s odabranim filterom"
          }
          action={
            filter === "all"
              ? {
                  label: "Novi klub",
                  onClick: () => (window.location.href = "/dashboard/admin/clubs/new"),
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={clubs} searchKey="name" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši klub"
        message={`Jeste li sigurni da želite obrisati klub "${deleteTarget?.name}"? Svi treneri će biti uklonjeni iz kluba. Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
