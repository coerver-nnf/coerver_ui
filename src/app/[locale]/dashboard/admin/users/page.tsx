"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getUsers, deleteUser, User, UserRole } from "@/lib/api/users";
import { formatDateShort } from "@/lib/utils";

const ROLE_LABELS: Record<UserRole, string> = {
  player: "Igrač",
  coach: "Trener",
  admin: "Administrator",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | UserRole>("all");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, [filter]);

  async function loadUsers() {
    setLoading(true);
    try {
      const options = filter !== "all" ? { role: filter } : {};
      const data = await getUsers(options);
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "full_name",
      header: "Korisnik",
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
                {row.original.full_name?.charAt(0).toUpperCase() ||
                  row.original.email.charAt(0).toUpperCase()}
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
      accessorKey: "role",
      header: "Uloga",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            row.original.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : row.original.role === "coach"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {ROLE_LABELS[row.original.role]}
        </span>
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
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/admin/users/${row.original.id}`}
            className="text-coerver-green hover:underline font-medium text-sm"
          >
            Detalji
          </Link>
          {row.original.role !== "admin" && (
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="text-red-600 hover:underline font-medium text-sm"
            >
              Obriši
            </button>
          )}
        </div>
      ),
    },
  ];

  const counts = {
    players: users.filter((u) => u.role === "player").length,
    coaches: users.filter((u) => u.role === "coach").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Korisnici</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte korisnicima sustava</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "all"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Svi ({users.length})
        </button>
        <button
          onClick={() => setFilter("player")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "player"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Igrači ({counts.players})
        </button>
        <button
          onClick={() => setFilter("coach")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "coach"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Treneri ({counts.coaches})
        </button>
        <button
          onClick={() => setFilter("admin")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "admin"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Administratori ({counts.admins})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : users.length === 0 ? (
        <EmptyState
          title="Nema korisnika"
          description="Još nema registriranih korisnika"
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={users} searchKey="full_name" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši korisnika"
        message={`Jeste li sigurni da želite obrisati korisnika "${deleteTarget?.full_name || deleteTarget?.email}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
