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
  DateRangePicker,
  SingleDatePicker,
  ArrayInput,
  DailyScheduleEditor,
  WeeklyProgramEditor,
  IncludedItemsEditor,
  FaqEditor,
  TestimonialsEditor,
} from "@/components/admin/forms";
import { FormLoadingState } from "@/components/admin";
import {
  getCampById,
  updateCamp,
  DailyScheduleItem,
  WeeklyProgramItem,
  IncludedItem,
  FaqItem,
  TestimonialItem,
} from "@/lib/api/camps";

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
  early_bird_price: z.number().optional().nullable(),
  early_bird_deadline: z.string().optional().nullable(),
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

export default function EditCampPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState<string | null>(null);

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
    reset,
    formState: { errors },
  } = useForm<CampFormData>({
    resolver: zodResolver(campSchema),
  });

  const imageUrl = watch("image_url");
  const heroImage = watch("hero_image");

  useEffect(() => {
    loadCamp();
  }, [id]);

  useEffect(() => {
    if (startDate) setValue("start_date", startDate);
    if (endDate) setValue("end_date", endDate);
    if (earlyBirdDeadline) setValue("early_bird_deadline", earlyBirdDeadline);
  }, [startDate, endDate, earlyBirdDeadline, setValue]);

  async function loadCamp() {
    setLoading(true);
    try {
      const camp = await getCampById(id);
      setStartDate(camp.start_date);
      setEndDate(camp.end_date);
      setEarlyBirdDeadline(camp.early_bird_deadline || null);

      // Set array/JSON state
      setGallery(camp.gallery || []);
      setHighlights(camp.highlights || []);
      setAgeGroups(camp.age_groups || []);
      setWhatToBring(camp.what_to_bring || []);
      setDailySchedule(camp.daily_schedule || []);
      setWeeklyProgram(camp.weekly_program || []);
      setIncluded(camp.included || []);
      setFaq(camp.faq || []);
      setTestimonials(camp.testimonials || []);

      reset({
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
        early_bird_price: camp.early_bird_price,
        early_bird_deadline: camp.early_bird_deadline,
        capacity: camp.capacity,
        spots: camp.spots,
        total_spots: camp.total_spots,
        age_min: camp.age_min,
        age_max: camp.age_max,
        image_url: camp.image_url || "",
        hero_image: camp.hero_image || "",
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
        early_bird_price: data.early_bird_price || undefined,
        early_bird_deadline: data.early_bird_deadline || undefined,
        capacity: data.capacity || undefined,
        spots: data.spots || undefined,
        total_spots: data.total_spots || undefined,
        age_min: data.age_min || undefined,
        age_max: data.age_max || undefined,
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
      <div className="max-w-4xl space-y-6">
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

          <Input
            label="Podnaslov"
            {...register("subtitle")}
            placeholder="npr. 5 dana intenzivnog nogometnog treninga"
          />

          <Textarea
            label="Opis"
            {...register("description")}
            rows={4}
            placeholder="Detaljni opis kampa..."
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
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Cijene</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cijena (€)"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />

            <Input
              label="Early Bird cijena (€)"
              type="number"
              step="0.01"
              {...register("early_bird_price", { valueAsNumber: true })}
            />
          </div>

          <SingleDatePicker
            label="Early Bird rok"
            value={earlyBirdDeadline}
            onChange={setEarlyBirdDeadline}
          />
        </div>

        {/* Capacity */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-coerver-gray-900">Kapacitet</h2>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Ukupni kapacitet"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
            />

            <Input
              label="Ukupna mjesta"
              type="number"
              {...register("total_spots", { valueAsNumber: true })}
            />

            <Input
              label="Preostala mjesta"
              type="number"
              {...register("spots", { valueAsNumber: true })}
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

          <ArrayInput
            label="Galerija slika"
            value={gallery}
            onChange={setGallery}
            placeholder="URL slike..."
            helperText="Dodajte URL-ove slika za galeriju"
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
