"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getCourses, deleteCourse, Course, COURSE_TYPE_LABELS } from "@/lib/api/courses";
import { formatDateShort } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [filter]);

  async function loadCourses() {
    setLoading(true);
    try {
      const options: { upcoming?: boolean; status?: string } = {};
      if (filter === "upcoming") options.upcoming = true;
      if (filter === "completed") options.status = "completed";
      const data = await getCourses(options);
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCourse(deleteTarget.id);
      await loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<Course>[] = [
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-coerver-gray-900">{row.original.title}</p>
            {row.original.type && (
              <p className="text-sm text-coerver-gray-500">
                {COURSE_TYPE_LABELS[row.original.type]}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Lokacija",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">{row.original.location || "-"}</span>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Datum",
      cell: ({ row }) => (
        <div className="text-coerver-gray-600">
          {row.original.start_date ? (
            <>
              <p>{formatDateShort(row.original.start_date)}</p>
              {row.original.end_date && (
                <p className="text-xs text-coerver-gray-400">
                  do {formatDateShort(row.original.end_date)}
                </p>
              )}
            </>
          ) : (
            "-"
          )}
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
            href={`/dashboard/admin/courses/${row.original.id}`}
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
          <h1 className="text-2xl font-bold text-coerver-gray-900">Tečajevi</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte tečajevima za trenere</p>
        </div>
        <Link href="/dashboard/admin/courses/new">
          <Button variant="primary">Novi tečaj</Button>
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
      ) : courses.length === 0 ? (
        <EmptyState
          title="Nema tečajeva"
          description="Kreirajte prvi tečaj klikom na gumb iznad"
          action={{
            label: "Novi tečaj",
            onClick: () => window.location.href = "/dashboard/admin/courses/new",
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={courses} searchKey="title" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši tečaj"
        message={`Jeste li sigurni da želite obrisati tečaj "${deleteTarget?.title}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
