"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ConfirmDialog, EmptyState, LoadingState } from "@/components/admin";
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  BlogCategory,
} from "@/lib/api/posts";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogCategory | null>(null);
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
      const data = await getBlogCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingCategory(null);
    reset({ name: "", slug: "" });
    setShowModal(true);
  }

  function openEditModal(category: BlogCategory) {
    setEditingCategory(category);
    reset({ name: category.name, slug: category.slug });
    setShowModal(true);
  }

  async function onSubmit(data: CategoryFormData) {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateBlogCategory(editingCategory.id, data);
      } else {
        await createBlogCategory(data);
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
      await deleteBlogCategory(deleteTarget.id);
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
            href="/dashboard/admin/blog"
            className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-coerver-gray-900">Kategorije bloga</h1>
            <p className="text-coerver-gray-500 mt-1">Upravljajte kategorijama</p>
          </div>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          Nova kategorija
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState rows={4} />
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
              <div>
                <h3 className="font-semibold text-coerver-gray-900">{category.name}</h3>
                <p className="text-sm text-coerver-gray-500">/{category.slug}</p>
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
            placeholder="Npr. Vijesti"
          />

          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
            helperText="URL putanja"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
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
