"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import {
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  Inquiry,
  InquiryStatus,
  INQUIRY_TYPE_LABELS,
} from "@/lib/api/inquiries";
import { formatDateShort } from "@/lib/utils";

// Helper to extract format from message
function extractFormatFromMessage(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/^Format:\s*(Uživo|Online)/i);
  return match ? match[1] : null;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, [filter]);

  async function loadInquiries() {
    setLoading(true);
    try {
      const options = filter !== "all" ? { status: filter } : {};
      const data = await getInquiries(options);
      setInquiries(data);
    } catch (error) {
      console.error("Error loading inquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: InquiryStatus) {
    try {
      await updateInquiryStatus(id, status);
      await loadInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteInquiry(deleteTarget.id);
      await loadInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<Inquiry>[] = [
    {
      accessorKey: "name",
      header: "Ime",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-coerver-gray-900">{row.original.name}</p>
          <p className="text-sm text-coerver-gray-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Tip",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">
          {INQUIRY_TYPE_LABELS[row.original.type]}
        </span>
      ),
    },
    {
      id: "format",
      header: "Format",
      cell: ({ row }) => {
        const format = extractFormatFromMessage(row.original.message);
        if (!format) return <span className="text-coerver-gray-400">-</span>;
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            format === "Online"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}>
            {format}
          </span>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Poruka",
      cell: ({ row }) => (
        <p className="text-coerver-gray-600 line-clamp-2 max-w-xs">
          {row.original.message || "-"}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Datum",
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
            href={`/dashboard/admin/inquiries/${row.original.id}`}
            className="text-coerver-green hover:underline font-medium text-sm"
          >
            Detalji
          </Link>
          {row.original.status === "new" && (
            <button
              onClick={() => handleStatusChange(row.original.id, "in_progress")}
              className="text-blue-600 hover:underline font-medium text-sm"
            >
              U obradi
            </button>
          )}
          {row.original.status === "in_progress" && (
            <button
              onClick={() => handleStatusChange(row.original.id, "resolved")}
              className="text-green-600 hover:underline font-medium text-sm"
            >
              Riješeno
            </button>
          )}
        </div>
      ),
    },
  ];

  const counts = {
    new: inquiries.filter((i) => i.status === "new").length,
    in_progress: inquiries.filter((i) => i.status === "in_progress").length,
    resolved: inquiries.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Upiti</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte upitima posjetitelja</p>
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
          Svi ({inquiries.length})
        </button>
        <button
          onClick={() => setFilter("new")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "new"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Novi ({counts.new})
        </button>
        <button
          onClick={() => setFilter("in_progress")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "in_progress"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          U obradi ({counts.in_progress})
        </button>
        <button
          onClick={() => setFilter("resolved")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "resolved"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Riješeni ({counts.resolved})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : inquiries.length === 0 ? (
        <EmptyState
          title="Nema upita"
          description={
            filter === "all"
              ? "Još nema upita od posjetitelja"
              : `Nema upita sa statusom "${filter}"`
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={inquiries} searchKey="name" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši upit"
        message={`Jeste li sigurni da želite obrisati upit od "${deleteTarget?.name}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
