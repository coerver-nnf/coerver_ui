"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ImageUpload, ArrayInput, VideoUrlInput } from "@/components/admin/forms";
import {
  createExercise,
  getExerciseCategories,
  getExerciseSubcategories,
  ExerciseCategory,
  ExerciseSubcategory,
} from "@/lib/api/exercises";
import { slugify } from "@/lib/utils";

const exerciseSchema = z.object({
  title: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  video_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  is_premium: z.boolean(),
  order_index: z.number(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

export default function NewExercisePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ExerciseSubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<ExerciseSubcategory[]>([]);
  const [coachingPoints, setCoachingPoints] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      is_premium: false,
      order_index: 0,
    },
  });

  const title = watch("title");
  const videoUrl = watch("video_url");
  const thumbnailUrl = watch("thumbnail_url");
  const selectedCategoryId = watch("category_id");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (title) {
      setValue("slug", slugify(title));
    }
  }, [title, setValue]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = subcategories.filter((s) => s.category_id === selectedCategoryId);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
    // Reset subcategory when category changes
    setValue("subcategory_id", "");
  }, [selectedCategoryId, subcategories, setValue]);

  async function loadData() {
    try {
      const [categoriesData, subcategoriesData] = await Promise.all([
        getExerciseCategories(),
        getExerciseSubcategories(),
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async function onSubmit(data: ExerciseFormData) {
    setIsSubmitting(true);
    try {
      await createExercise({
        ...data,
        coaching_points: coachingPoints.length > 0 ? coachingPoints : undefined,
        equipment: equipment.length > 0 ? equipment : undefined,
      });
      router.push("/dashboard/admin/exercises");
    } catch (error) {
      console.error("Error creating exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const difficultyOptions = [
    { value: "", label: "Odaberi težinu" },
    { value: "beginner", label: "Početnik" },
    { value: "intermediate", label: "Srednji" },
    { value: "advanced", label: "Napredni" },
  ];

  const categoryOptions = [
    { value: "", label: "Odaberi kategoriju" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const subcategoryOptions = [
    { value: "", label: selectedCategoryId ? "Odaberi potkategoriju" : "Prvo odaberi kategoriju" },
    ...filteredSubcategories.map((sub) => ({ value: sub.id, label: sub.name })),
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/exercises"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Nova vježba</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Osnovne informacije</h2>

          <Input
            label="Naziv"
            {...register("title")}
            error={errors.title?.message}
            placeholder="Npr. Ball Mastery - Inside Outside"
          />

          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
            helperText="URL putanja (automatski generirana)"
          />

          <Textarea
            label="Opis"
            {...register("description")}
            error={errors.description?.message}
            placeholder="Opišite vježbu..."
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Kategorija"
              {...register("category_id")}
              options={categoryOptions}
              error={errors.category_id?.message}
            />

            <Select
              label="Potkategorija"
              {...register("subcategory_id")}
              options={subcategoryOptions}
              error={errors.subcategory_id?.message}
              disabled={!selectedCategoryId || filteredSubcategories.length === 0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Težina"
              {...register("difficulty")}
              options={difficultyOptions}
              error={errors.difficulty?.message}
            />

            <Input
              label="Trajanje"
              {...register("duration")}
              placeholder="Npr. 5 min"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Redoslijed"
              type="number"
              {...register("order_index", { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_premium"
              {...register("is_premium")}
              className="w-4 h-4 text-coerver-green border-coerver-gray-300 rounded
                         focus:ring-coerver-green"
            />
            <label htmlFor="is_premium" className="text-sm text-coerver-gray-700">
              Premium vježba (samo za pretplatnike)
            </label>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Mediji</h2>

          <VideoUrlInput
            label="Video URL"
            value={videoUrl || ""}
            onChange={(url) => setValue("video_url", url)}
            helperText="YouTube ili Vimeo URL"
          />

          <ImageUpload
            label="Thumbnail slika"
            value={thumbnailUrl}
            onChange={(url) => setValue("thumbnail_url", url || "")}
            folder="exercises"
          />
        </div>

        {/* Coaching Points & Equipment */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Detalji</h2>

          <ArrayInput
            label="Točke treniranja"
            value={coachingPoints}
            onChange={setCoachingPoints}
            placeholder="Dodaj točku i pritisni Enter"
            helperText="Ključne točke na koje trener treba obratiti pozornost"
          />

          <ArrayInput
            label="Potrebna oprema"
            value={equipment}
            onChange={setEquipment}
            placeholder="Dodaj opremu i pritisni Enter"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Spremi vježbu
          </Button>
          <Link href="/dashboard/admin/exercises">
            <Button type="button" variant="ghost">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
