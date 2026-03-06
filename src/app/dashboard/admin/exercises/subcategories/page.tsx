"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, Modal, ConfirmDialog, EmptyState, LoadingState } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  getExerciseCategories,
  getExerciseSubcategoriesWithCount,
  createExerciseSubcategory,
  updateExerciseSubcategory,
  deleteExerciseSubcategory,
  ExerciseCategory,
  ExerciseSubcategory,
} from "@/lib/api/exercises";

const subcategorySchema = z.object({
  category_id: z.string().min(1, "Kategorija je obavezna"),
  name: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  order_index: z.coerce.number().optional(),
});

type SubcategoryFormData = z.infer<typeof subcategorySchema>;

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<ExerciseSubcategory[]>([]);
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<ExerciseSubcategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExerciseSubcategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      order_index: 0,
    },
  });

  const watchName = watch("name");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (watchName && !editingSubcategory) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [watchName, setValue, editingSubcategory]);

  async function loadData() {
    setLoading(true);
    try {
      const [subcatsData, catsData] = await Promise.all([
        getExerciseSubcategoriesWithCount(),
        getExerciseCategories(),
      ]);
      setSubcategories(subcatsData);
      setCategories(catsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingSubcategory(null);
    reset({
      category_id: filterCategoryId !== "all" ? filterCategoryId : "",
      name: "",
      slug: "",
      description: "",
      image_url: "",
      order_index: 0,
    });
    setIsModalOpen(true);
  }

  function openEditModal(subcategory: ExerciseSubcategory) {
    setEditingSubcategory(subcategory);
    reset({
      category_id: subcategory.category_id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
      image_url: subcategory.image_url || "",
      order_index: subcategory.order_index,
    });
    setIsModalOpen(true);
  }

  async function onSubmit(data: SubcategoryFormData) {
    try {
      if (editingSubcategory) {
        await updateExerciseSubcategory(editingSubcategory.id, data);
      } else {
        await createExerciseSubcategory(data);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteExerciseSubcategory(deleteTarget.id);
      await loadData();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const filteredSubcategories = filterCategoryId === "all"
    ? subcategories
    : subcategories.filter((s) => s.category_id === filterCategoryId);

  const columns: ColumnDef<ExerciseSubcategory>[] = [
    {
      accessorKey: "name",
      header: "Naziv",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-coerver-gray-900">{row.original.name}</p>
          <p className="text-sm text-coerver-gray-500">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategorija",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-coerver-green/10 text-coerver-green rounded-lg text-sm font-medium">
          {row.original.category?.name || "-"}
        </span>
      ),
    },
    {
      accessorKey: "exercise_count",
      header: "Vježbe",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">{row.original.exercise_count || 0}</span>
      ),
    },
    {
      accessorKey: "order_index",
      header: "Redoslijed",
      cell: ({ row }) => (
        <span className="text-coerver-gray-500">{row.original.order_index}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row.original)}
            className="text-coerver-green hover:underline font-medium text-sm"
          >
            Uredi
          </button>
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

  const categoryOptions = [
    { value: "", label: "Odaberi kategoriju" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const filterOptions = [
    { value: "all", label: "Sve kategorije" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/exercises"
            className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-coerver-gray-900">Potkategorije vježbi</h1>
            <p className="text-coerver-gray-500 mt-1">Upravljajte potkategorijama unutar kategorija</p>
          </div>
        </div>
        <Button onClick={openCreateModal}>Nova potkategorija</Button>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <div className="w-64">
          <Select
            label="Filtriraj po kategoriji"
            options={filterOptions}
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : filteredSubcategories.length === 0 ? (
        <EmptyState
          title="Nema potkategorija"
          description={filterCategoryId !== "all" ? "Nema potkategorija za ovu kategoriju" : "Dodajte prvu potkategoriju"}
          actionLabel="Nova potkategorija"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={filteredSubcategories} searchKey="name" />
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubcategory ? "Uredi potkategoriju" : "Nova potkategorija"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Kategorija"
            options={categoryOptions}
            error={errors.category_id?.message}
            {...register("category_id")}
          />

          <Input
            label="Naziv"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Slug"
            error={errors.slug?.message}
            {...register("slug")}
          />

          <Input
            label="Opis"
            error={errors.description?.message}
            {...register("description")}
          />

          <Input
            label="URL slike"
            error={errors.image_url?.message}
            {...register("image_url")}
          />

          <Input
            label="Redoslijed"
            type="number"
            error={errors.order_index?.message}
            {...register("order_index")}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Odustani
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingSubcategory ? "Spremi" : "Dodaj"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši potkategoriju"
        message={`Jeste li sigurni da želite obrisati potkategoriju "${deleteTarget?.name}"? Sve vježbe u ovoj potkategoriji ostat će bez potkategorije.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
