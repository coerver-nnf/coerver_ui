"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import {
  getExercises,
  getExerciseCategories,
  deleteExercise,
  Exercise,
  ExerciseCategory,
} from "@/lib/api/exercises";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  async function loadData() {
    setLoading(true);
    try {
      const [exercisesData, categoriesData] = await Promise.all([
        getExercises(selectedCategory !== "all" ? { category_id: selectedCategory } : {}),
        getExerciseCategories(),
      ]);
      setExercises(exercisesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteExercise(deleteTarget.id);
      await loadData();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<Exercise>[] = [
    {
      accessorKey: "title",
      header: "Naziv",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.thumbnail_url ? (
            <img
              src={row.original.thumbnail_url}
              alt={row.original.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-coerver-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-coerver-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-coerver-gray-900">{row.original.title}</p>
            {row.original.category && (
              <p className="text-sm text-coerver-gray-500">{row.original.category.name}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "difficulty",
      header: "Težina",
      cell: ({ row }) => {
        const difficultyLabels: Record<string, string> = {
          beginner: "Početnik",
          intermediate: "Srednji",
          advanced: "Napredni",
        };
        return row.original.difficulty ? (
          <span className="text-coerver-gray-600">
            {difficultyLabels[row.original.difficulty] || row.original.difficulty}
          </span>
        ) : (
          <span className="text-coerver-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "is_premium",
      header: "Premium",
      cell: ({ row }) => (
        row.original.is_premium ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Premium
          </span>
        ) : (
          <span className="text-coerver-gray-400">-</span>
        )
      ),
    },
    {
      accessorKey: "duration",
      header: "Trajanje",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">{row.original.duration || "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/admin/exercises/${row.original.id}`}
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
          <h1 className="text-2xl font-bold text-coerver-gray-900">Vježbe</h1>
          <p className="text-coerver-gray-500 mt-1">
            Upravljajte vježbama i kategorijama
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/exercises/categories">
            <Button variant="outline">Kategorije</Button>
          </Link>
          <Link href="/dashboard/admin/exercises/subcategories">
            <Button variant="outline">Potkategorije</Button>
          </Link>
          <Link href="/dashboard/admin/exercises/new">
            <Button variant="primary">Nova vježba</Button>
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedCategory === "all"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Sve ({exercises.length})
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedCategory === category.id
                ? "bg-coerver-green text-white"
                : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : exercises.length === 0 ? (
        <EmptyState
          title="Nema vježbi"
          description="Dodajte prvu vježbu klikom na gumb iznad"
          action={{
            label: "Nova vježba",
            onClick: () => window.location.href = "/dashboard/admin/exercises/new",
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={exercises} searchKey="title" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši vježbu"
        message={`Jeste li sigurni da želite obrisati vježbu "${deleteTarget?.title}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
