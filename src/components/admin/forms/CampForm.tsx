"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ImageUpload } from "./ImageUpload";
import { MultiImageUpload } from "./MultiImageUpload";
import { ArrayInput } from "./ArrayInput";
import { DateRangePicker, SingleDatePicker } from "./DateRangePicker";
import {
  DailyScheduleEditor,
  WeeklyProgramEditor,
  IncludedItemsEditor,
  FaqEditor,
  TestimonialsEditor,
} from "./JsonArrayEditor";
import { LocaleTabs, type EditLocale } from "./LocaleTabs";
import {
  createCamp,
  updateCamp,
  Camp,
  DailyScheduleItem,
  WeeklyProgramItem,
  IncludedItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/api/camps";
import type { Translations } from "@/lib/i18n/localize";
import { slugify } from "@/lib/utils";

const campSchema = z.object({
  title: z.string().min(1, "Naziv je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  map_url: z.string().optional(),
  start_date: z.string().min(1, "Datum početka je obavezan"),
  end_date: z.string().min(1, "Datum završetka je obavezan"),
  price: z.number().optional().nullable(),
  price_full_day: z.number().optional().nullable(),
  price_day_only: z.number().optional().nullable(),
  registration_deadline: z.string().optional().nullable(),
  capacity: z.number().optional().nullable(),
  spots: z.number().optional().nullable(),
  total_spots: z.number().optional().nullable(),
  age_min: z.number().optional().nullable(),
  age_max: z.number().optional().nullable(),
  image_url: z.string().optional(),
  hero_image: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
});

type CampFormData = z.infer<typeof campSchema>;

type TransLocale = Exclude<EditLocale, "hr">;

const TRANSLATION_HEADINGS: Record<TransLocale, string> = {
  sl: "Prijevod (slovenski)",
  en: "Prijevod (engleski)",
};

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Drops empty-string/empty-array overrides (they mean "fall back to Croatian"). */
function cleanTranslations(translations: Translations): Translations {
  const result: Translations = {};
  for (const locale of ["sl", "en"] as TransLocale[]) {
    const fields = translations[locale];
    if (!fields) continue;
    const cleaned: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(fields)) {
      if (!isEmptyValue(value)) cleaned[field] = value;
    }
    if (Object.keys(cleaned).length > 0) result[locale] = cleaned;
  }
  return result;
}

function CopyFromHrButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-medium text-coerver-green-dark hover:underline whitespace-nowrap"
    >
      Kopiraj iz HR
    </button>
  );
}

/** Wraps a field with a top-right "Kopiraj iz HR" button. */
function TranslatableField({
  onCopy,
  children,
}: {
  onCopy: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10">
        <CopyFromHrButton onClick={onCopy} />
      </div>
      {children}
    </div>
  );
}

interface CampFormProps {
  /** Existing camp for edit mode, or null for create mode. */
  camp: Camp | null;
}

export function CampForm({ camp }: CampFormProps) {
  const isNew = !camp;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editLocale, setEditLocale] = useState<EditLocale>("hr");
  const [startDate, setStartDate] = useState<string | null>(
    camp?.start_date ?? null
  );
  const [endDate, setEndDate] = useState<string | null>(camp?.end_date ?? null);
  const [registrationDeadline, setRegistrationDeadline] = useState<
    string | null
  >(camp?.registration_deadline ?? null);

  // Array/JSON state (base Croatian content)
  const [gallery, setGallery] = useState<string[]>(camp?.gallery || []);
  const [highlights, setHighlights] = useState<string[]>(
    camp?.highlights || []
  );
  const [ageGroups, setAgeGroups] = useState<string[]>(camp?.age_groups || []);
  const [whatToBring, setWhatToBring] = useState<string[]>(
    camp?.what_to_bring || []
  );
  const [dailySchedule, setDailySchedule] = useState<DailyScheduleItem[]>(
    camp?.daily_schedule || []
  );
  const [weeklyProgram, setWeeklyProgram] = useState<WeeklyProgramItem[]>(
    camp?.weekly_program || []
  );
  const [included, setIncluded] = useState<IncludedItem[]>(
    camp?.included || []
  );
  const [faq, setFaq] = useState<FaqItem[]>(camp?.faq || []);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    camp?.testimonials || []
  );

  // Translation overrides: { sl: {...}, en: {...} }
  const [translations, setTranslations] = useState<Translations>(
    camp?.translations ?? {}
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CampFormData>({
    resolver: zodResolver(campSchema),
    defaultValues: isNew
      ? { status: "draft" }
      : {
          title: camp.title,
          slug: camp.slug,
          subtitle: camp.subtitle || "",
          description: camp.description || "",
          location: camp.location || "",
          address: camp.address || "",
          map_url: camp.map_url || "",
          start_date: camp.start_date,
          end_date: camp.end_date,
          price: camp.price,
          price_full_day: camp.price_full_day,
          price_day_only: camp.price_day_only,
          registration_deadline: camp.registration_deadline,
          capacity: camp.capacity,
          spots: camp.spots,
          total_spots: camp.total_spots,
          age_min: camp.age_min,
          age_max: camp.age_max,
          image_url: camp.image_url || "",
          hero_image: camp.hero_image || "",
          status: camp.status,
        },
  });

  const title = watch("title");
  const imageUrl = watch("image_url");
  const heroImage = watch("hero_image");
  // HR values shown as placeholders on translation tabs
  const hrSubtitle = watch("subtitle");
  const hrDescription = watch("description");
  const hrLocation = watch("location");

  // Auto-generate slug from title (create mode only)
  useEffect(() => {
    if (isNew && title) {
      setValue("slug", slugify(title));
    }
  }, [isNew, title, setValue]);

  useEffect(() => {
    if (startDate) setValue("start_date", startDate);
    if (endDate) setValue("end_date", endDate);
    if (registrationDeadline)
      setValue("registration_deadline", registrationDeadline);
  }, [startDate, endDate, registrationDeadline, setValue]);

  // Helpers to convert NaN for numeric fields
  const toNumberOrUndefined = (
    val: number | null | undefined
  ): number | undefined => {
    if (val === null || val === undefined || Number.isNaN(val))
      return undefined;
    return val;
  };

  const toNumberOrNull = (val: number | null | undefined): number | null => {
    if (val === null || val === undefined || Number.isNaN(val)) return null;
    return val;
  };

  // ----- Translation state helpers -----

  const getOverrideString = (locale: TransLocale, field: string): string => {
    const value = translations[locale]?.[field];
    return typeof value === "string" ? value : "";
  };

  const getOverrideArray = <T,>(locale: TransLocale, field: string): T[] => {
    const value = translations[locale]?.[field];
    return Array.isArray(value) ? (value as T[]) : [];
  };

  const setOverride = (locale: TransLocale, field: string, value: unknown) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const copyFromHr = (locale: TransLocale, field: string, hrValue: unknown) => {
    // Deep-copy so editing the translation never mutates the HR value
    const copied =
      hrValue && typeof hrValue === "object"
        ? JSON.parse(JSON.stringify(hrValue))
        : hrValue ?? "";
    setOverride(locale, field, copied);
  };

  const localeHasContent = (locale: TransLocale): boolean => {
    const fields = translations[locale];
    if (!fields) return false;
    return Object.values(fields).some((value) => !isEmptyValue(value));
  };

  async function onSubmit(data: CampFormData) {
    setIsSubmitting(true);
    try {
      const cleanedTranslations = cleanTranslations(translations);
      if (isNew) {
        await createCamp({
          ...data,
          price: toNumberOrUndefined(data.price),
          price_full_day: toNumberOrUndefined(data.price_full_day),
          price_day_only: toNumberOrUndefined(data.price_day_only),
          registration_deadline: data.registration_deadline || undefined,
          capacity: toNumberOrUndefined(data.capacity),
          spots: toNumberOrUndefined(data.spots),
          total_spots: toNumberOrUndefined(data.total_spots),
          age_min: toNumberOrUndefined(data.age_min),
          age_max: toNumberOrUndefined(data.age_max),
          gallery,
          highlights,
          age_groups: ageGroups,
          what_to_bring: whatToBring,
          daily_schedule: dailySchedule,
          weekly_program: weeklyProgram,
          included,
          faq,
          testimonials,
          translations: cleanedTranslations,
        });
      } else {
        await updateCamp({
          id: camp.id,
          ...data,
          price: toNumberOrNull(data.price),
          price_full_day: toNumberOrNull(data.price_full_day),
          price_day_only: toNumberOrNull(data.price_day_only),
          registration_deadline: data.registration_deadline || null,
          capacity: toNumberOrNull(data.capacity),
          spots: toNumberOrNull(data.spots),
          total_spots: toNumberOrNull(data.total_spots),
          age_min: toNumberOrNull(data.age_min),
          age_max: toNumberOrNull(data.age_max),
          gallery,
          highlights,
          age_groups: ageGroups,
          what_to_bring: whatToBring,
          daily_schedule: dailySchedule,
          weekly_program: weeklyProgram,
          included,
          faq,
          testimonials,
          translations: cleanedTranslations,
        });
      }
      router.push("/dashboard/admin/camps");
    } catch (error) {
      console.error(
        isNew ? "Error creating camp:" : "Error updating camp:",
        error
      );
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

  function renderTranslationFields(locale: TransLocale) {
    return (
      <>
        {/* Basic Info (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Osnovne informacije
          </h2>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "title", getValues("title"))}
          >
            <Input
              label="Naziv"
              value={getOverrideString(locale, "title")}
              onChange={(e) => setOverride(locale, "title", e.target.value)}
              placeholder={title || ""}
            />
          </TranslatableField>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "subtitle", getValues("subtitle"))}
          >
            <Input
              label="Podnaslov"
              value={getOverrideString(locale, "subtitle")}
              onChange={(e) => setOverride(locale, "subtitle", e.target.value)}
              placeholder={hrSubtitle || ""}
            />
          </TranslatableField>

          <TranslatableField
            onCopy={() =>
              copyFromHr(locale, "description", getValues("description"))
            }
          >
            <Textarea
              label="Opis"
              value={getOverrideString(locale, "description")}
              onChange={(e) =>
                setOverride(locale, "description", e.target.value)
              }
              placeholder={hrDescription || ""}
              rows={4}
            />
          </TranslatableField>
        </div>

        {/* Location (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Lokacija
          </h2>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "location", getValues("location"))}
          >
            <Input
              label="Grad/Mjesto"
              value={getOverrideString(locale, "location")}
              onChange={(e) => setOverride(locale, "location", e.target.value)}
              placeholder={hrLocation || ""}
            />
          </TranslatableField>
        </div>

        {/* Age groups (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Kapacitet
          </h2>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "age_groups", ageGroups)}
          >
            <ArrayInput
              label="Dobne skupine"
              value={getOverrideArray<string>(locale, "age_groups")}
              onChange={(value) => setOverride(locale, "age_groups", value)}
              placeholder='npr. "7-9", "10-12", "13-15"'
            />
          </TranslatableField>
        </div>

        {/* Highlights (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Istaknuto
          </h2>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "highlights", highlights)}
          >
            <ArrayInput
              label="Prednosti kampa"
              value={getOverrideArray<string>(locale, "highlights")}
              onChange={(value) => setOverride(locale, "highlights", value)}
              placeholder='npr. "5 dana profesionalnog treninga"'
            />
          </TranslatableField>
        </div>

        {/* Program (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Program
          </h2>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "daily_schedule", dailySchedule)}
          >
            <DailyScheduleEditor
              value={getOverrideArray<DailyScheduleItem>(
                locale,
                "daily_schedule"
              )}
              onChange={(value) => setOverride(locale, "daily_schedule", value)}
            />
          </TranslatableField>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "weekly_program", weeklyProgram)}
          >
            <WeeklyProgramEditor
              value={getOverrideArray<WeeklyProgramItem>(
                locale,
                "weekly_program"
              )}
              onChange={(value) => setOverride(locale, "weekly_program", value)}
            />
          </TranslatableField>
        </div>

        {/* What's Included (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Uključeno u cijenu
          </h2>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "included", included)}
          >
            <IncludedItemsEditor
              value={getOverrideArray<IncludedItem>(locale, "included")}
              onChange={(value) => setOverride(locale, "included", value)}
            />
          </TranslatableField>

          <TranslatableField
            onCopy={() => copyFromHr(locale, "what_to_bring", whatToBring)}
          >
            <ArrayInput
              label="Što ponijeti"
              value={getOverrideArray<string>(locale, "what_to_bring")}
              onChange={(value) => setOverride(locale, "what_to_bring", value)}
              placeholder='npr. "Nogometne kopačke"'
            />
          </TranslatableField>
        </div>

        {/* FAQ (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <TranslatableField onCopy={() => copyFromHr(locale, "faq", faq)}>
            <FaqEditor
              value={getOverrideArray<FaqItem>(locale, "faq")}
              onChange={(value) => setOverride(locale, "faq", value)}
            />
          </TranslatableField>
        </div>

        {/* Testimonials (translated) */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <TranslatableField
            onCopy={() => copyFromHr(locale, "testimonials", testimonials)}
          >
            <TestimonialsEditor
              value={getOverrideArray<TestimonialItem>(locale, "testimonials")}
              onChange={(value) => setOverride(locale, "testimonials", value)}
            />
          </TranslatableField>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/camps"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-coerver-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">
          {isNew ? "Novi kamp" : "Uredi kamp"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Locale tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <LocaleTabs
            value={editLocale}
            onChange={setEditLocale}
            completeness={{
              sl: localeHasContent("sl"),
              en: localeHasContent("en"),
            }}
          />
          {editLocale !== "hr" && (
            <p className="text-sm text-coerver-gray-500">
              {TRANSLATION_HEADINGS[editLocale]} — prazna polja koriste hrvatski
              sadržaj
            </p>
          )}
        </div>

        {/* HR (base) fields — hidden but mounted on translation tabs so
            react-hook-form state and validation stay intact */}
        <div
          className={editLocale === "hr" ? "space-y-6" : "hidden"}
          aria-hidden={editLocale !== "hr"}
        >
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Osnovne informacije
            </h2>

            <Input
              label="Naziv"
              {...register("title")}
              error={errors.title?.message}
              placeholder={isNew ? "Npr. Ljetni kamp Zagreb 2024" : undefined}
            />

            <Input
              label="Slug"
              {...register("slug")}
              error={errors.slug?.message}
              helperText={isNew ? "URL putanja (automatski generirana)" : undefined}
            />

            <Input
              label="Podnaslov"
              {...register("subtitle")}
              placeholder="npr. 5 dana intenzivnog nogometnog treninga"
            />

            <Textarea
              label="Opis"
              {...register("description")}
              placeholder="Detaljni opis kampa..."
              rows={4}
            />

            <Select label="Status" {...register("status")} options={statusOptions} />
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Lokacija
            </h2>

            <Input
              label="Grad/Mjesto"
              {...register("location")}
              placeholder="npr. SC Mladost, Zagreb"
            />

            <Input
              label="Adresa"
              {...register("address")}
              placeholder="npr. Jarunska ul. 5, 10000 Zagreb"
            />

            <Input
              label="Google Maps URL"
              {...register("map_url")}
              placeholder="https://maps.google.com/..."
            />
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Datumi
            </h2>

            <DateRangePicker
              label="Trajanje kampa"
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              error={errors.start_date?.message || errors.end_date?.message}
            />

            <SingleDatePicker
              label="Rok za prijavu"
              value={registrationDeadline}
              onChange={setRegistrationDeadline}
            />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Cijene
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="S noćenjem (€)"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder={isNew ? "450.00" : undefined}
                helperText="Puni kamp sa smještajem"
              />

              <Input
                label="Cjelodnevni (€)"
                type="number"
                step="0.01"
                {...register("price_full_day", { valueAsNumber: true })}
                placeholder={isNew ? "350.00" : undefined}
                helperText="Sve aktivnosti bez spavanja"
              />

              <Input
                label="Samo treninzi (€)"
                type="number"
                step="0.01"
                {...register("price_day_only", { valueAsNumber: true })}
                placeholder={isNew ? "250.00" : undefined}
                helperText="Samo trening sessioni"
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Kapacitet
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Ukupni kapacitet"
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                placeholder={isNew ? "24" : undefined}
              />

              <Input
                label="Ukupna mjesta"
                type="number"
                {...register("total_spots", { valueAsNumber: true })}
                placeholder={isNew ? "24" : undefined}
              />

              <Input
                label="Preostala mjesta"
                type="number"
                {...register("spots", { valueAsNumber: true })}
                placeholder={isNew ? "24" : undefined}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimalna dob"
                type="number"
                {...register("age_min", { valueAsNumber: true })}
                placeholder={isNew ? "7" : undefined}
              />

              <Input
                label="Maksimalna dob"
                type="number"
                {...register("age_max", { valueAsNumber: true })}
                placeholder={isNew ? "15" : undefined}
              />
            </div>

            <ArrayInput
              label="Dobne skupine"
              value={ageGroups}
              onChange={setAgeGroups}
              placeholder='npr. "7-9", "10-12", "13-15"'
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Slike
            </h2>

            <ImageUpload
              label="Glavna slika (thumbnail)"
              value={imageUrl}
              onChange={(url) => setValue("image_url", url || "")}
              folder="camps"
            />

            <ImageUpload
              label="Hero slika (pozadina)"
              value={heroImage}
              onChange={(url) => setValue("hero_image", url || "")}
              folder="camps"
            />

            <MultiImageUpload
              label="Galerija slika"
              value={gallery}
              onChange={setGallery}
              folder="camps"
            />
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Istaknuto
            </h2>

            <ArrayInput
              label="Prednosti kampa"
              value={highlights}
              onChange={setHighlights}
              placeholder='npr. "5 dana profesionalnog treninga"'
              helperText="Dodajte ključne prednosti i karakteristike kampa"
            />
          </div>

          {/* Program */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Program
            </h2>

            <DailyScheduleEditor value={dailySchedule} onChange={setDailySchedule} />

            <WeeklyProgramEditor value={weeklyProgram} onChange={setWeeklyProgram} />
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-coerver-gray-900">
              Uključeno u cijenu
            </h2>

            <IncludedItemsEditor value={included} onChange={setIncluded} />

            <ArrayInput
              label="Što ponijeti"
              value={whatToBring}
              onChange={setWhatToBring}
              placeholder='npr. "Nogometne kopačke"'
            />
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
            <FaqEditor value={faq} onChange={setFaq} />
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
            <TestimonialsEditor value={testimonials} onChange={setTestimonials} />
          </div>
        </div>

        {/* SL/EN translation fields */}
        {editLocale !== "hr" && renderTranslationFields(editLocale)}

        {/* Submit */}
        <div className="flex items-center gap-4 sticky bottom-4 bg-white p-4 rounded-xl border border-coerver-gray-200 shadow-lg">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isNew ? "Spremi kamp" : "Spremi promjene"}
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
