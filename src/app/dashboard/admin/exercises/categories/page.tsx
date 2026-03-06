"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal, ConfirmDialog, EmptyState, LoadingState } from "@/components/admin";
import {
  getExerciseCategoriesWithCount,
  createExerciseCategory,
  updateExerciseCategory,
  deleteExerciseCategory,
  ExerciseCategory,
} from "@/lib/api/exercises";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  icon: z.string().optional(),
  order_index: z.number(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function ExerciseCategoriesPage() {
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExerciseCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExerciseCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const name = watch("name");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (name && !editingCategory) {
      setValue("slug", slugify(name));
    }
  }, [name, editingCategory, setValue]);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await getExerciseCategoriesWithCount();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingCategory(null);
    reset({
      name: "",
      slug: "",
      description: "",
      icon: "",
      order_index: categories.length,
    });
    setShowModal(true);
  }

  function openEditModal(category: ExerciseCategory) {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      order_index: category.order_index,
    });
    setShowModal(true);
  }

  async function onSubmit(data: CategoryFormData) {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateExerciseCategory(editingCategory.id, data);
      } else {
        await createExerciseCategory(data);
      }
      await loadCategories();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteExerciseCategory(deleteTarget.id);
      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

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
            <h1 className="text-2xl font-bold text-coerver-gray-900">Kategorije vježbi</h1>
            <p className="text-coerver-gray-500 mt-1">Upravljajte kategorijama</p>
          </div>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          Nova kategorija
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState rows={6} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="Nema kategorija"
          description="Dodajte prvu kategoriju klikom na gumb iznad"
          action={{
            label: "Nova kategorija",
            onClick: openCreateModal,
          }}
        />
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-coerver-gray-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-coerver-green/10 rounded-lg flex items-center justify-center">
                  <span className="text-coerver-green font-bold">{category.order_index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-coerver-gray-900">{category.name}</h3>
                  <p className="text-sm text-coerver-gray-500">
                    {category.exercise_count || 0} vježbi · /{category.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-coerver-green hover:underline font-medium text-sm"
                >
                  Uredi
                </button>
                <button
                  onClick={() => setDeleteTarget(category)}
                  className="text-red-600 hover:underline font-medium text-sm"
                  disabled={(category.exercise_count || 0) > 0}
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "Uredi kategoriju" : "Nova kategorija"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Naziv"
            {...register("name")}
            error={errors.name?.message}
            placeholder="Npr. Ball Mastery"
          />

          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
            helperText="URL putanja"
          />

          <Textarea
            label="Opis"
            {...register("description")}
            placeholder="Kratki opis kategorije..."
            rows={3}
          />

          <Input
            label="Ikona"
            {...register("icon")}
            placeholder="Npr. ball"
            helperText="Naziv ikone ili emoji"
          />

          <Input
            label="Redoslijed"
            type="number"
            {...register("order_index", { valueAsNumber: true })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              Odustani
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingCategory ? "Spremi" : "Kreiraj"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši kategoriju"
        message={`Jeste li sigurni da želite obrisati kategoriju "${deleteTarget?.name}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
