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
import { LoadingState, StatusBadge } from "@/components/admin";
import { ClubCoachesTab } from "@/components/admin/clubs/ClubCoachesTab";
import { ClubAccessTab } from "@/components/admin/clubs/ClubAccessTab";
import { getClubById, updateClub } from "@/lib/api/clubs";
import { PartnerClub } from "@/types/clubs";
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

type TabType = "details" | "coaches" | "access";

export default function ClubDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  const [club, setClub] = useState<PartnerClub | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
  });

  const logoUrl = watch("logo_url");

  useEffect(() => {
    loadClub();
  }, [id]);

  async function loadClub() {
    setLoading(true);
    try {
      const data = await getClubById(id);
      setClub(data);
      reset({
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        contact_name: data.contact_name || "",
        contact_email: data.contact_email || "",
        contact_phone: data.contact_phone || "",
        address: data.address || "",
        city: data.city || "",
        website: data.website || "",
        logo_url: data.logo_url || "",
        status: data.status,
      });
    } catch (error) {
      console.error("Error loading club:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ClubFormData) {
    setIsSubmitting(true);
    try {
      const clubData = {
        id,
        ...data,
        contact_email: data.contact_email || undefined,
        website: data.website || undefined,
      };
      await updateClub(clubData);
      await loadClub();
    } catch (error) {
      console.error("Error updating club:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusOptions = [
    { value: "pending", label: "Na čekanju" },
    { value: "active", label: "Aktivan" },
    { value: "inactive", label: "Neaktivan" },
  ];

  const tabs: { key: TabType; label: string }[] = [
    { key: "details", label: "Detalji" },
    { key: "coaches", label: "Treneri" },
    { key: "access", label: "Pristup vježbama" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-coerver-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <LoadingState rows={3} />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <p className="text-coerver-gray-500">Klub nije pronađen</p>
        <Link href="/dashboard/admin/clubs" className="text-coerver-green hover:underline mt-2 inline-block">
          Natrag na popis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-3 flex-1">
          {club.logo_url && (
            <img
              src={club.logo_url}
              alt={club.name}
              className="w-10 h-10 rounded-lg object-contain bg-white border border-coerver-gray-200"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-coerver-gray-900">{club.name}</h1>
            {club.city && <p className="text-coerver-gray-500">{club.city}</p>}
          </div>
        </div>
        <StatusBadge status={club.status} size="md" />
      </div>

      {/* Tabs */}
      <div className="border-b border-coerver-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-coerver-green text-coerver-green"
                  : "border-transparent text-coerver-gray-500 hover:text-coerver-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">Osnovni podaci</h2>

            <Input
              label="Naziv kluba"
              {...register("name")}
              error={errors.name?.message}
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
            />

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

          {/* Location */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">Lokacija</h2>

            <Input
              label="Adresa"
              {...register("address")}
            />

            <Input
              label="Grad"
              {...register("city")}
            />

            <Input
              label="Web stranica"
              {...register("website")}
              error={errors.website?.message}
            />
          </div>

          {/* Logo */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">Logo</h2>

            <ImageUpload
              label="Logo kluba"
              value={logoUrl}
              onChange={(url) => setValue("logo_url", url || "", { shouldDirty: true })}
              folder="clubs"
            />
          </div>

          {/* Submit */}
          {isDirty && (
            <div className="flex items-center gap-4 sticky bottom-4 bg-white p-4 rounded-xl border border-coerver-gray-200 shadow-lg">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Spremi promjene
              </Button>
              <Button type="button" variant="ghost" onClick={() => reset()}>
                Poništi
              </Button>
            </div>
          )}
        </form>
      )}

      {activeTab === "coaches" && <ClubCoachesTab clubId={id} />}

      {activeTab === "access" && <ClubAccessTab clubId={id} />}
    </div>
  );
}
