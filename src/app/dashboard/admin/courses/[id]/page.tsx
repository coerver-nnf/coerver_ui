"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ImageUpload, DateRangePicker } from "@/components/admin/forms";
import { FormLoadingState } from "@/components/admin";
import { getCourseById, updateCourse, COURSE_TYPE_LABELS } from "@/lib/api/courses";

const courseSchema = z.object({
  title: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  type: z.enum(["coerver-intro", "youth-diploma-1", "youth-diploma-2"]).optional().nullable(),
  location: z.string().optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  capacity: z.number().optional().nullable(),
  image_url: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const imageUrl = watch("image_url");

  useEffect(() => {
    loadCourse();
  }, [id]);

  useEffect(() => {
    if (startDate) setValue("start_date", startDate);
    if (endDate) setValue("end_date", endDate);
  }, [startDate, endDate, setValue]);

  async function loadCourse() {
    setLoading(true);
    try {
      const course = await getCourseById(id);
      setStartDate(course.start_date);
      setEndDate(course.end_date);
      reset({
        title: course.title,
        slug: course.slug,
        description: course.description || "",
        type: course.type,
        location: course.location || "",
        start_date: course.start_date,
        end_date: course.end_date,
        price: course.price,
        capacity: course.capacity,
        image_url: course.image_url || "",
        status: course.status,
      });
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: CourseFormData) {
    setIsSubmitting(true);
    try {
      await updateCourse({
        id,
        ...data,
        type: data.type || undefined,
        price: data.price || undefined,
        capacity: data.capacity || undefined,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
      });
      router.push("/dashboard/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const typeOptions = [
    { value: "", label: "Odaberi tip" },
    ...Object.entries(COURSE_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const statusOptions = [
    { value: "draft", label: "Skica" },
    { value: "published", label: "Objavljeno" },
    { value: "cancelled", label: "Otkazano" },
    { value: "completed", label: "Završeno" },
  ];

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-coerver-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-48 bg-coerver-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <FormLoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/courses"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Uredi tečaj</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Osnovne informacije</h2>

          <Input
            label="Naziv"
            {...register("title")}
            error={errors.title?.message}
          />

          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
          />

          <Textarea
            label="Opis"
            {...register("description")}
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tip tečaja"
              {...register("type")}
              options={typeOptions}
            />

            <Select
              label="Status"
              {...register("status")}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Location & Dates */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Lokacija i datumi</h2>

          <Input
            label="Lokacija"
            {...register("location")}
          />

          <DateRangePicker
            label="Trajanje tečaja"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Detalji</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cijena (€)"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />

            <Input
              label="Kapacitet"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <ImageUpload
            label="Slika tečaja"
            value={imageUrl}
            onChange={(url) => setValue("image_url", url || "")}
            folder="courses"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Spremi promjene
          </Button>
          <Link href="/dashboard/admin/courses">
            <Button type="button" variant="ghost">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
