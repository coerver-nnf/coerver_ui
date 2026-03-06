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
import { getCampById, updateCamp } from "@/lib/api/camps";

const campSchema = z.object({
  title: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  start_date: z.string().min(1, "Datum početka je obavezan"),
  end_date: z.string().min(1, "Datum završetka je obavezan"),
  price: z.number().optional().nullable(),
  capacity: z.number().optional().nullable(),
  age_min: z.number().optional().nullable(),
  age_max: z.number().optional().nullable(),
  image_url: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
});

type CampFormData = z.infer<typeof campSchema>;

export default function EditCampPage({
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
  } = useForm<CampFormData>({
    resolver: zodResolver(campSchema),
  });

  const imageUrl = watch("image_url");

  useEffect(() => {
    loadCamp();
  }, [id]);

  useEffect(() => {
    if (startDate) setValue("start_date", startDate);
    if (endDate) setValue("end_date", endDate);
  }, [startDate, endDate, setValue]);

  async function loadCamp() {
    setLoading(true);
    try {
      const camp = await getCampById(id);
      setStartDate(camp.start_date);
      setEndDate(camp.end_date);
      reset({
        title: camp.title,
        slug: camp.slug,
        description: camp.description || "",
        location: camp.location || "",
        address: camp.address || "",
        start_date: camp.start_date,
        end_date: camp.end_date,
        price: camp.price,
        capacity: camp.capacity,
        age_min: camp.age_min,
        age_max: camp.age_max,
        image_url: camp.image_url || "",
        status: camp.status,
      });
    } catch (error) {
      console.error("Error loading camp:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: CampFormData) {
    setIsSubmitting(true);
    try {
      await updateCamp({
        id,
        ...data,
        price: data.price || undefined,
        capacity: data.capacity || undefined,
        age_min: data.age_min || undefined,
        age_max: data.age_max || undefined,
      });
      router.push("/dashboard/admin/camps");
    } catch (error) {
      console.error("Error updating camp:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

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
          href="/dashboard/admin/camps"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Uredi kamp</h1>
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

          <Select
            label="Status"
            {...register("status")}
            options={statusOptions}
          />
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Lokacija</h2>

          <Input
            label="Grad/Mjesto"
            {...register("location")}
          />

          <Input
            label="Adresa"
            {...register("address")}
          />
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Datumi</h2>

          <DateRangePicker
            label="Trajanje kampa"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            error={errors.start_date?.message || errors.end_date?.message}
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimalna dob"
              type="number"
              {...register("age_min", { valueAsNumber: true })}
            />

            <Input
              label="Maksimalna dob"
              type="number"
              {...register("age_max", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <ImageUpload
            label="Slika kampa"
            value={imageUrl}
            onChange={(url) => setValue("image_url", url || "")}
            folder="camps"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Spremi promjene
          </Button>
          <Link href="/dashboard/admin/camps">
            <Button type="button" variant="ghost">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
