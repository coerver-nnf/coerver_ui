"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ImageUpload, ArrayInput } from "@/components/admin/forms";
import { FormLoadingState } from "@/components/admin";
import { getAcademyById, updateAcademy } from "@/lib/api/academies";

const academySchema = z.object({
  name: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  schedule: z.string().optional(),
  contact_email: z.string().email("Neispravna email adresa").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  image_url: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type AcademyFormData = z.infer<typeof academySchema>;

export default function EditAcademyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AcademyFormData>({
    resolver: zodResolver(academySchema),
  });

  const imageUrl = watch("image_url");

  useEffect(() => {
    loadAcademy();
  }, [id]);

  async function loadAcademy() {
    setLoading(true);
    try {
      const academy = await getAcademyById(id);
      setAgeGroups(academy.age_groups || []);
      reset({
        name: academy.name,
        slug: academy.slug,
        description: academy.description || "",
        location: academy.location || "",
        address: academy.address || "",
        schedule: academy.schedule || "",
        contact_email: academy.contact_email || "",
        contact_phone: academy.contact_phone || "",
        image_url: academy.image_url || "",
        status: academy.status,
      });
    } catch (error) {
      console.error("Error loading academy:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: AcademyFormData) {
    setIsSubmitting(true);
    try {
      await updateAcademy({
        id,
        ...data,
        contact_email: data.contact_email || undefined,
        age_groups: ageGroups.length > 0 ? ageGroups : undefined,
      });
      router.push("/dashboard/admin/academies");
    } catch (error) {
      console.error("Error updating academy:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusOptions = [
    { value: "active", label: "Aktivna" },
    { value: "inactive", label: "Neaktivna" },
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
          href="/dashboard/admin/academies"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Uredi akademiju</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Osnovne informacije</h2>

          <Input
            label="Naziv"
            {...register("name")}
            error={errors.name?.message}
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

        {/* Schedule & Age Groups */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Raspored i dobne skupine</h2>

          <Textarea
            label="Raspored"
            {...register("schedule")}
            placeholder="npr. Ponedjeljak i srijeda 17:00-18:30, Subota 10:00-12:00"
            rows={3}
          />

          <ArrayInput
            label="Dobne skupine"
            value={ageGroups}
            onChange={setAgeGroups}
            placeholder='npr. "5-7", "8-10", "11-13"'
            helperText="Dodajte dobne skupine koje akademija prima"
          />
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Kontakt</h2>

          <Input
            label="Email"
            type="email"
            {...register("contact_email")}
            error={errors.contact_email?.message}
          />

          <Input
            label="Telefon"
            {...register("contact_phone")}
          />
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <ImageUpload
            label="Slika akademije"
            value={imageUrl}
            onChange={(url) => setValue("image_url", url || "")}
            folder="academies"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Spremi promjene
          </Button>
          <Link href="/dashboard/admin/academies">
            <Button type="button" variant="ghost">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
