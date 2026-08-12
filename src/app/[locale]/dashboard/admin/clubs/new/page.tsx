"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ImageUpload } from "@/components/admin/forms";
import { createClub } from "@/lib/api/clubs";
import { slugify } from "@/lib/utils";

const clubSchema = z.object({
  name: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  description: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email("Nevažeća email adresa").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  website: z.string().url("Nevažeći URL").optional().or(z.literal("")),
  logo_url: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
});

type ClubFormData = z.infer<typeof clubSchema>;

export default function NewClubPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      status: "pending",
    },
  });

  const name = watch("name");
  const logoUrl = watch("logo_url");

  useEffect(() => {
    if (name) {
      setValue("slug", slugify(name));
    }
  }, [name, setValue]);

  async function onSubmit(data: ClubFormData) {
    setIsSubmitting(true);
    try {
      const clubData = {
        ...data,
        contact_email: data.contact_email || undefined,
        website: data.website || undefined,
      };
      await createClub(clubData);
      router.push("/dashboard/admin/clubs");
    } catch (error) {
      console.error("Error creating club:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusOptions = [
    { value: "pending", label: "Na čekanju" },
    { value: "active", label: "Aktivan" },
    { value: "inactive", label: "Neaktivan" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/clubs"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Novi partnerski klub</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Osnovni podaci</h2>

          <Input
            label="Naziv kluba"
            {...register("name")}
            error={errors.name?.message}
            placeholder="npr. NK Dinamo Zagreb"
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
            placeholder="Kratki opis kluba..."
            rows={3}
          />

          <Select
            label="Status"
            {...register("status")}
            options={statusOptions}
          />
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Kontakt</h2>

          <Input
            label="Kontakt osoba"
            {...register("contact_name")}
            placeholder="npr. Ivan Horvat"
          />

          <Input
            label="Email"
            type="email"
            {...register("contact_email")}
            error={errors.contact_email?.message}
            placeholder="npr. kontakt@nkdinamo.hr"
          />

          <Input
            label="Telefon"
            {...register("contact_phone")}
            placeholder="npr. +385 1 234 5678"
          />
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Lokacija</h2>

          <Input
            label="Adresa"
            {...register("address")}
            placeholder="npr. Maksimirska 128"
          />

          <Input
            label="Grad"
            {...register("city")}
            placeholder="npr. Zagreb"
          />

          <Input
            label="Web stranica"
            {...register("website")}
            error={errors.website?.message}
            placeholder="https://www.nkdinamo.hr"
          />
        </div>

        {/* Logo */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Logo</h2>

          <ImageUpload
            label="Logo kluba"
            value={logoUrl}
            onChange={(url) => setValue("logo_url", url || "")}
            folder="clubs"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 sticky bottom-4 bg-white p-4 rounded-xl border border-coerver-gray-200 shadow-lg">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Spremi klub
          </Button>
          <Link href="/dashboard/admin/clubs">
            <Button type="button" variant="ghost">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
