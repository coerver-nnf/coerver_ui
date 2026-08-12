"use client";

import { useState, useEffect, useMemo } from "react";
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

interface CampStats {
  id: string;
  name: string;
  total: number;
  new: number;
}

export default function InquiriesPage() {
  const [allInquiries, setAllInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>("all");
  const [campFilter, setCampFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setLoading(true);
    try {
      const data = await getInquiries();
      setAllInquiries(data);
    } catch (error) {
      console.error("Error loading inquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate camp stats from all inquiries
  const campStats = useMemo(() => {
    const stats: Record<string, CampStats> = {};

    allInquiries
      .filter(i => i.type === "camp" && i.program_id && i.program_name)
      .forEach(inquiry => {
        const id = inquiry.program_id!;
        if (!stats[id]) {
          stats[id] = {
            id,
            name: inquiry.program_name!,
            total: 0,
            new: 0,
          };
        }
        stats[id].total++;
        if (inquiry.status === "new") {
          stats[id].new++;
        }
      });

    return Object.values(stats).sort((a, b) => b.new - a.new || b.total - a.total);
  }, [allInquiries]);

  // Filter inquiries based on status and camp filters
  const inquiries = useMemo(() => {
    return allInquiries.filter(inquiry => {
      const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
      const matchesCamp = campFilter === "all" || inquiry.program_id === campFilter;
      return matchesStatus && matchesCamp;
    });
  }, [allInquiries, statusFilter, campFilter]);

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
      accessorKey: "program_name",
      header: "Program",
      cell: ({ row }) => (
        <div>
          <span className="text-coerver-gray-900 font-medium">
            {row.original.program_name || "-"}
          </span>
          <span className="text-coerver-gray-500 text-xs block">
            {INQUIRY_TYPE_LABELS[row.original.type]}
          </span>
        </div>
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

  // Calculate counts based on filtered inquiries (by camp) but not by status
  const inquiriesForCounts = useMemo(() => {
    return allInquiries.filter(inquiry => {
      return campFilter === "all" || inquiry.program_id === campFilter;
    });
  }, [allInquiries, campFilter]);

  const counts = {
    all: inquiriesForCounts.length,
    new: inquiriesForCounts.filter((i) => i.status === "new").length,
    in_progress: inquiriesForCounts.filter((i) => i.status === "in_progress").length,
    resolved: inquiriesForCounts.filter((i) => i.status === "resolved").length,
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

      {/* Camp Cards */}
      {campStats.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-coerver-gray-500 uppercase tracking-wider mb-3">
            Upiti po kampu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {campStats.map((camp) => (
              <button
                key={camp.id}
                onClick={() => {
                  setCampFilter(campFilter === camp.id ? "all" : camp.id);
                  setStatusFilter("all");
                }}
                className={`relative p-4 rounded-xl text-left transition-all ${
                  campFilter === camp.id
                    ? "bg-coerver-green text-white shadow-lg scale-[1.02]"
                    : "bg-white border border-coerver-gray-200 hover:border-coerver-green hover:shadow-md"
                }`}
              >
                {camp.new > 0 && campFilter !== camp.id && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {camp.new}
                  </span>
                )}
                <p className={`font-semibold text-sm truncate ${
                  campFilter === camp.id ? "text-white" : "text-coerver-gray-900"
                }`}>
                  {camp.name}
                </p>
                <p className={`text-xs mt-1 ${
                  campFilter === camp.id ? "text-white/80" : "text-coerver-gray-500"
                }`}>
                  {camp.total} upita{camp.new > 0 && ` · ${camp.new} novi${camp.new > 1 ? "h" : ""}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Camp Filter Indicator */}
      {campFilter !== "all" && (
        <div className="flex items-center gap-2 bg-coerver-green/10 text-coerver-green px-4 py-2 rounded-lg">
          <span className="text-sm font-medium">
            Filtrirano: {campStats.find(c => c.id === campFilter)?.name}
          </span>
          <button
            onClick={() => setCampFilter("all")}
            className="ml-auto text-sm hover:underline"
          >
            Prikaži sve
          </button>
        </div>
      )}

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            statusFilter === "all"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Svi ({counts.all})
        </button>
        <button
          onClick={() => setStatusFilter("new")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            statusFilter === "new"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Novi ({counts.new})
        </button>
        <button
          onClick={() => setStatusFilter("in_progress")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            statusFilter === "in_progress"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          U obradi ({counts.in_progress})
        </button>
        <button
          onClick={() => setStatusFilter("resolved")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            statusFilter === "resolved"
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
            statusFilter === "all" && campFilter === "all"
              ? "Još nema upita od posjetitelja"
              : "Nema upita s odabranim filterima"
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
