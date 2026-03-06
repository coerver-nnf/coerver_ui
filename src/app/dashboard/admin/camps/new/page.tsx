"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ImageUpload, DateRangePicker } from "@/components/admin/forms";
import { createCamp } from "@/lib/api/camps";
import { slugify } from "@/lib/utils";

const campSchema = z.object({
  title: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  start_date: z.string().min(1, "Datum početka je obavezan"),
  end_date: z.string().min(1, "Datum završetka je obavezan"),
  price: z.number().optional(),
  capacity: z.number().optional(),
  age_min: z.number().optional(),
  age_max: z.number().optional(),
  image_url: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
});

type CampFormData = z.infer<typeof campSchema>;

export default function NewCampPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampFormData>({
    resolver: zodResolver(campSchema),
    defaultValues: {
      status: "draft",
    },
  });

  const title = watch("title");
  const imageUrl = watch("image_url");

  useEffect(() => {
    if (title) {
      setValue("slug", slugify(title));
    }
  }, [title, setValue]);

  useEffect(() => {
    if (startDate) setValue("start_date", startDate);
    if (endDate) setValue("end_date", endDate);
  }, [startDate, endDate, setValue]);

  async function onSubmit(data: CampFormData) {
    setIsSubmitting(true);
    try {
      await createCamp(data);
      router.push("/dashboard/admin/camps");
    } catch (error) {
      console.error("Error creating camp:", error);
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
        <h1 className="text-2xl font-bold text-coerver-gray-900">Novi kamp</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Osnovne informacije</h2>

          <Input
            label="Naziv"
            {...register("title")}
            error={errors.title?.message}
            placeholder="Npr. Ljetni kamp 2024"
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
            placeholder="Opišite kamp..."
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
            placeholder="Npr. Zagreb"
          />

          <Input
            label="Adresa"
            {...register("address")}
            placeholder="Puna adresa..."
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
              placeholder="0.00"
            />

            <Input
              label="Kapacitet"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="Broj sudionika"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimalna dob"
              type="number"
              {...register("age_min", { valueAsNumber: true })}
              placeholder="6"
            />

            <Input
              label="Maksimalna dob"
              type="number"
              {...register("age_max", { valueAsNumber: true })}
              placeholder="16"
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
            Spremi kamp
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
