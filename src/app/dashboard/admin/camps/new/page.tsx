"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import {
  ImageUpload,
  MultiImageUpload,
  DateRangePicker,
  SingleDatePicker,
  ArrayInput,
  DailyScheduleEditor,
  WeeklyProgramEditor,
  IncludedItemsEditor,
  FaqEditor,
  TestimonialsEditor,
} from "@/components/admin/forms";
import {
  createCamp,
  DailyScheduleItem,
  WeeklyProgramItem,
  IncludedItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/api/camps";
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
  price: z.number().optional(),
  price_day_only: z.number().optional(),
  registration_deadline: z.string().optional(),
  capacity: z.number().optional(),
  spots: z.number().optional(),
  total_spots: z.number().optional(),
  age_min: z.number().optional(),
  age_max: z.number().optional(),
  image_url: z.string().optional(),
  hero_image: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]),
});

type CampFormData = z.infer<typeof campSchema>;

export default function NewCampPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [registrationDeadline, setRegistrationDeadline] = useState<string | null>(null);

  // Array/JSON state
  const [gallery, setGallery] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [whatToBring, setWhatToBring] = useState<string[]>([]);
  const [dailySchedule, setDailySchedule] = useState<DailyScheduleItem[]>([]);
  const [weeklyProgram, setWeeklyProgram] = useState<WeeklyProgramItem[]>([]);
  const [included, setIncluded] = useState<IncludedItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

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
  const heroImage = watch("hero_image");

  useEffect(() => {
    if (title) {
      setValue("slug", slugify(title));
    }
  }, [title, setValue]);

  useEffect(() => {
    if (startDate) setValue("start_date", startDate);
    if (endDate) setValue("end_date", endDate);
    if (registrationDeadline) setValue("registration_deadline", registrationDeadline);
  }, [startDate, endDate, registrationDeadline, setValue]);

  async function onSubmit(data: CampFormData) {
    setIsSubmitting(true);
    try {
      await createCamp({
        ...data,
        gallery,
        highlights,
        age_groups: ageGroups,
        what_to_bring: whatToBring,
        daily_schedule: dailySchedule,
        weekly_program: weeklyProgram,
        included,
        faq,
        testimonials,
      });
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
    <div className="max-w-4xl space-y-6">
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
            placeholder="Npr. Ljetni kamp Zagreb 2024"
          />

          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
            helperText="URL putanja (automatski generirana)"
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
          <h2 className="text-lg font-semibold text-coerver-gray-900">Datumi</h2>

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
          <h2 className="text-lg font-semibold text-coerver-gray-900">Cijene</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="S noćenjem (€)"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="350.00"
              helperText="Cijena za puni kamp s noćenjem"
            />

            <Input
              label="Bez noćenja (€)"
              type="number"
              step="0.01"
              {...register("price_day_only", { valueAsNumber: true })}
              placeholder="250.00"
              helperText="Cijena samo za dnevni program"
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Kapacitet</h2>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Ukupni kapacitet"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="24"
            />

            <Input
              label="Ukupna mjesta"
              type="number"
              {...register("total_spots", { valueAsNumber: true })}
              placeholder="24"
            />

            <Input
              label="Preostala mjesta"
              type="number"
              {...register("spots", { valueAsNumber: true })}
              placeholder="24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimalna dob"
              type="number"
              {...register("age_min", { valueAsNumber: true })}
              placeholder="7"
            />

            <Input
              label="Maksimalna dob"
              type="number"
              {...register("age_max", { valueAsNumber: true })}
              placeholder="15"
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
          <h2 className="text-lg font-semibold text-coerver-gray-900">Slike</h2>

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
          <h2 className="text-lg font-semibold text-coerver-gray-900">Istaknuto</h2>

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
          <h2 className="text-lg font-semibold text-coerver-gray-900">Program</h2>

          <DailyScheduleEditor
            value={dailySchedule}
            onChange={setDailySchedule}
          />

          <WeeklyProgramEditor
            value={weeklyProgram}
            onChange={setWeeklyProgram}
          />
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Uključeno u cijenu</h2>

          <IncludedItemsEditor
            value={included}
            onChange={setIncluded}
          />

          <ArrayInput
            label="Što ponijeti"
            value={whatToBring}
            onChange={setWhatToBring}
            placeholder='npr. "Nogometne kopačke"'
          />
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <FaqEditor
            value={faq}
            onChange={setFaq}
          />
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <TestimonialsEditor
            value={testimonials}
            onChange={setTestimonials}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 sticky bottom-4 bg-white p-4 rounded-xl border border-coerver-gray-200 shadow-lg">
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
