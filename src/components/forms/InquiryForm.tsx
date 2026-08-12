"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { getAcademies, Academy } from "@/lib/api/academies";
import { getCamps, Camp } from "@/lib/api/camps";
import { getCourses, Course } from "@/lib/api/courses";
import { trackEvent } from "@/lib/tracking";

interface InquiryFormProps {
  type: "academy" | "camp" | "course" | "club" | "individual" | "general";
  programId?: string;
  programName?: string; // Human-readable name of the program (camp title, academy name, etc.)
  title?: string;
  className?: string;
  hasAccommodation?: boolean; // For camps: true if sleepover option exists
  hasFullDay?: boolean; // For camps: true if full day (no sleep) option exists
  hasTrainingOnly?: boolean; // For camps: true if training-only option exists
}

export function InquiryForm({
  type,
  programId,
  programName,
  title,
  className = "",
  hasAccommodation = true,
  hasFullDay = false,
  hasTrainingOnly = false,
}: InquiryFormProps) {
  const t = useTranslations("forms.inquiry");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState(programId || "");
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const formStartTracked = useRef(false);

  // Track form start on first field focus
  const handleFormStart = () => {
    if (!formStartTracked.current) {
      formStartTracked.current = true;
      trackEvent.formStart(`${type}_inquiry`);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    childAge: "",
    birthYear: "",
    jerseySize: "",
    club: "",
    position: "",
    format: "",
    accommodationType: "",
    note: "",
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Fetch programs based on type
  useEffect(() => {
    async function fetchPrograms() {
      if (programId) return; // Skip if programId is already provided

      setLoadingPrograms(true);
      try {
        if (type === "academy") {
          const data = await getAcademies({ status: "active" });
          setAcademies(data);
        } else if (type === "camp") {
          const data = await getCamps({ status: "published" });
          setCamps(data);
        } else if (type === "course") {
          const data = await getCourses({ status: "published" });
          setCourses(data);
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoadingPrograms(false);
      }
    }
    fetchPrograms();
  }, [type, programId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Build message with club and position info
      let fullMessage = formData.message;
      if (type === "camp") {
        const extras = [];
        if (formData.accommodationType) {
          const typeLabels: Record<string, string> = {
            with_accommodation: t("summary.withAccommodation"),
            full_day: t("summary.fullDay"),
            training_only: t("summary.trainingOnly"),
            day_only: t("summary.dayOnly"), // legacy support
          };
          extras.push(`${t("summary.type")}: ${typeLabels[formData.accommodationType] || formData.accommodationType}`);
        }
        if (formData.birthYear) extras.push(`${t("summary.birthYear")}: ${formData.birthYear}`);
        if (formData.jerseySize) extras.push(`${t("summary.jerseySize")}: ${formData.jerseySize}`);
        if (formData.club) extras.push(`${t("summary.club")}: ${formData.club}`);
        if (formData.position) extras.push(`${t("summary.position")}: ${formData.position}`);
        if (extras.length > 0) {
          fullMessage = `${extras.join(", ")}\n\n${formData.message}`;
        }
        if (formData.note) {
          fullMessage = fullMessage ? `${fullMessage}\n\n${t("summary.note")}: ${formData.note}` : `${t("summary.note")}: ${formData.note}`;
        }
      } else if (type === "course" || type === "club") {
        const extras = [];
        if (formData.format) extras.push(`${t("summary.format")}: ${formData.format}`);
        if (formData.club) extras.push(`${t("summary.club")}: ${formData.club}`);
        if (extras.length > 0) {
          fullMessage = `${extras.join(", ")}\n\n${formData.message}`;
        }
      }

      // Add program slug to message if it's not a UUID
      const programValue = selectedProgramId || programId || null;
      const isUUID = programValue && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(programValue);

      if (programValue && !isUUID) {
        fullMessage = `${t("summary.program")}: ${programValue}\n\n${fullMessage}`;
      }

      // Insert into Supabase (client-side with proper RLS permissions)
      const { error: submitError } = await supabase.from("inquiries").insert({
        type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: fullMessage,
        program_id: isUUID ? programValue : null,
      });

      if (submitError) throw submitError;

      // Track successful form submission
      trackEvent.formSubmit(`${type}_inquiry`);

      // Send email notification via API (fire and forget)
      // Use programName if provided, otherwise fall back to programValue (slug or UUID)
      fetch("/api/inquiries/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: fullMessage,
          program: programName || programValue,
          childAge: formData.childAge || null,
        }),
      }).catch(console.error);

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        childAge: "",
        birthYear: "",
        jerseySize: "",
        club: "",
        position: "",
        format: "",
        accommodationType: "",
        note: "",
      });
      setPrivacyConsent(false);
    } catch {
      setError(t("error"));
      trackEvent.formError(`${type}_inquiry`, "submission_failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-coerver-green/10 rounded-xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-coerver-green rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-coerver-dark mb-2">
          {t("success.title")}
        </h3>
        <p className="text-coerver-gray-600">
          {t("success.message")}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSubmitted(false)}
        >
          {t("success.newInquiry")}
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 md:p-8 shadow-lg ${className}`}>
      <h3 className="text-2xl font-bold text-coerver-dark mb-6">{title ?? t("title")}</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={type === "camp" ? t("fields.childName.label") : t("fields.name.label")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={handleFormStart}
          placeholder={type === "camp" ? t("fields.childName.placeholder") : t("fields.name.placeholder")}
          required
        />

        <Input
          label={t("fields.email.label")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("fields.email.placeholder")}
          required
        />

        <Input
          label={t("fields.phone.label")}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+385 91 123 4567"
        />

        {type === "academy" && !programId && (
          <Select
            label={t("fields.academy.label")}
            name="academy"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            options={
              loadingPrograms
                ? [{ value: "", label: t("loading") }]
                : academies.length > 0
                ? [
                    { value: "", label: t("fields.academy.placeholder") },
                    ...academies.map((a) => ({ value: a.id, label: a.name + (a.location ? ` - ${a.location}` : "") })),
                  ]
                : [{ value: "", label: t("fields.academy.empty") }]
            }
            required
            disabled={loadingPrograms || academies.length === 0}
          />
        )}

        {type === "camp" && !programId && (
          <Select
            label={t("fields.camp.label")}
            name="camp"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            options={
              loadingPrograms
                ? [{ value: "", label: t("loading") }]
                : camps.length > 0
                ? [
                    { value: "", label: t("fields.camp.placeholder") },
                    ...camps.map((c) => ({ value: c.id, label: c.title + (c.location ? ` - ${c.location}` : "") })),
                  ]
                : [{ value: "", label: t("fields.camp.empty") }]
            }
            required
            disabled={loadingPrograms || camps.length === 0}
          />
        )}

        {type === "course" && !programId && (
          <Select
            label={t("fields.course.label")}
            name="course"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            options={
              loadingPrograms
                ? [{ value: "", label: t("loading") }]
                : courses.length > 0
                ? [
                    { value: "", label: t("fields.course.placeholder") },
                    ...courses.map((c) => ({ value: c.id, label: c.title + (c.location ? ` - ${c.location}` : "") })),
                  ]
                : [{ value: "", label: t("fields.course.empty") }]
            }
            required
            disabled={loadingPrograms || courses.length === 0}
          />
        )}

        {(type === "academy" || type === "individual") && (
          <Select
            label={t("fields.childAge.label")}
            name="childAge"
            value={formData.childAge}
            onChange={handleChange}
            options={[
              { value: "", label: t("fields.childAge.placeholder") },
              { value: "5-6", label: t("fields.childAge.years", { range: "5-6" }) },
              { value: "7-8", label: t("fields.childAge.years", { range: "7-8" }) },
              { value: "9-10", label: t("fields.childAge.years", { range: "9-10" }) },
              { value: "11-12", label: t("fields.childAge.years", { range: "11-12" }) },
              { value: "13-14", label: t("fields.childAge.years", { range: "13-14" }) },
              { value: "15+", label: t("fields.childAge.years", { range: "15+" }) },
            ]}
          />
        )}

        {type === "camp" && (
          <>
            {(hasAccommodation || hasFullDay || hasTrainingOnly) && (
              <Select
                label={t("fields.accommodationType.label")}
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                options={[
                  { value: "", label: t("fields.accommodationType.placeholder") },
                  ...(hasAccommodation ? [{ value: "with_accommodation", label: t("fields.accommodationType.withAccommodation") }] : []),
                  ...(hasFullDay ? [{ value: "full_day", label: t("fields.accommodationType.fullDay") }] : []),
                  ...(hasTrainingOnly ? [{ value: "training_only", label: t("fields.accommodationType.trainingOnly") }] : []),
                ]}
                required
              />
            )}

            <Select
              label={t("fields.birthYear.label")}
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              options={[
                { value: "", label: t("fields.birthYear.placeholder") },
                { value: "2019", label: "2019" },
                { value: "2018", label: "2018" },
                { value: "2017", label: "2017" },
                { value: "2016", label: "2016" },
                { value: "2015", label: "2015" },
                { value: "2014", label: "2014" },
                { value: "2013", label: "2013" },
                { value: "2012", label: "2012" },
                { value: "2011", label: "2011" },
              ]}
              required
            />

            <Select
              label={t("fields.jerseySize.label")}
              name="jerseySize"
              value={formData.jerseySize}
              onChange={handleChange}
              options={[
                { value: "", label: t("fields.jerseySize.placeholder") },
                { value: "128", label: "128" },
                { value: "140", label: "140" },
                { value: "152", label: "152" },
                { value: "164", label: "164" },
                { value: "176", label: "176" },
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
              ]}
              required
            />

            <Input
              label={t("fields.club.label")}
              name="club"
              value={formData.club}
              onChange={handleChange}
              placeholder={t("fields.club.placeholder")}
            />

            <Select
              label={t("fields.position.label")}
              name="position"
              value={formData.position}
              onChange={handleChange}
              options={[
                { value: "", label: t("fields.position.placeholder") },
                { value: t("fields.position.goalkeeper"), label: t("fields.position.goalkeeper") },
                { value: t("fields.position.defender"), label: t("fields.position.defender") },
                { value: t("fields.position.midfielder"), label: t("fields.position.midfielder") },
                { value: t("fields.position.forward"), label: t("fields.position.forward") },
              ]}
            />

            <Textarea
              label={t("fields.note.label")}
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder={t("fields.note.placeholder")}
              rows={3}
            />
          </>
        )}

        {type === "course" && (
          <Input
            label={t("fields.clubCourse.label")}
            name="club"
            value={formData.club}
            onChange={handleChange}
            placeholder={t("fields.clubCourse.placeholder")}
          />
        )}

        {type === "course" && programId === "youth-diploma-1" && (
          <Select
            label={t("fields.format.label")}
            name="format"
            value={formData.format}
            onChange={handleChange}
            options={[
              { value: "", label: t("fields.format.placeholder") },
              { value: t("fields.format.live"), label: t("fields.format.live") },
              { value: "Online", label: "Online" },
            ]}
            required
          />
        )}

        {type === "club" && (
          <Input
            label={t("fields.clubName.label")}
            name="club"
            value={formData.club}
            onChange={handleChange}
            placeholder={t("fields.clubName.placeholder")}
            required
          />
        )}

        {type !== "camp" && (
          <Textarea
            label={t("fields.message.label")}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("fields.message.placeholder")}
            rows={4}
            required
          />
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* GDPR Consent Checkbox */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              required
              className="mt-1 w-5 h-5 rounded border-gray-300 text-coerver-green focus:ring-coerver-green cursor-pointer"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800">
              {t("consent.textStart")}{" "}
              <a
                href="/privatnost"
                target="_blank"
                className="text-coerver-green hover:underline font-medium"
              >
                {t("consent.privacyLink")}
              </a>{" "}
              {t("consent.textEnd")}
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!privacyConsent}
        >
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
