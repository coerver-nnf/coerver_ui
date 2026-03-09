"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

interface InquiryFormProps {
  type: "academy" | "camp" | "course" | "club" | "individual" | "general";
  programId?: string;
  title?: string;
  className?: string;
}

export function InquiryForm({
  type,
  programId,
  title = "Pošalji Upit",
  className = "",
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    childAge: "",
    club: "",
    position: "",
  });

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
        if (formData.club) extras.push(`Klub: ${formData.club}`);
        if (formData.position) extras.push(`Pozicija: ${formData.position}`);
        if (extras.length > 0) {
          fullMessage = `${extras.join(", ")}\n\n${formData.message}`;
        }
      } else if ((type === "course" || type === "club") && formData.club) {
        fullMessage = `Klub: ${formData.club}\n\n${formData.message}`;
      }

      const { error: submitError } = await supabase.from("inquiries").insert({
        type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: fullMessage,
        program_id: programId || null,
      });

      if (submitError) throw submitError;

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        childAge: "",
        club: "",
        position: "",
      });
    } catch {
      setError("Došlo je do greške. Molimo pokušajte ponovno.");
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
          Hvala na upitu!
        </h3>
        <p className="text-coerver-gray-600">
          Vaš upit je uspješno poslan. Javit ćemo vam se u najkraćem mogućem roku.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSubmitted(false)}
        >
          Pošalji novi upit
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 md:p-8 shadow-lg ${className}`}>
      <h3 className="text-2xl font-bold text-coerver-dark mb-6">{title}</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Ime i prezime *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Unesite vaše ime i prezime"
          required
        />

        <Input
          label="Email adresa *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="vas@email.com"
          required
        />

        <Input
          label="Telefon"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+385 91 123 4567"
        />

        {(type === "academy" || type === "camp" || type === "individual") && (
          <Select
            label="Dob djeteta"
            name="childAge"
            value={formData.childAge}
            onChange={handleChange}
            options={[
              { value: "", label: "Odaberite dob" },
              { value: "5-6", label: "5-6 godina" },
              { value: "7-8", label: "7-8 godina" },
              { value: "9-10", label: "9-10 godina" },
              { value: "11-12", label: "11-12 godina" },
              { value: "13-14", label: "13-14 godina" },
              { value: "15+", label: "15+ godina" },
            ]}
          />
        )}

        {type === "camp" && (
          <>
            <Input
              label="Klub"
              name="club"
              value={formData.club}
              onChange={handleChange}
              placeholder="Naziv kluba u kojem igra"
            />

            <Select
              label="Pozicija"
              name="position"
              value={formData.position}
              onChange={handleChange}
              options={[
                { value: "", label: "Odaberite poziciju" },
                { value: "Golman", label: "Golman" },
                { value: "Branič", label: "Branič" },
                { value: "Vezni", label: "Vezni" },
                { value: "Napadač", label: "Napadač" },
              ]}
            />
          </>
        )}

        {type === "course" && (
          <Input
            label="Klub"
            name="club"
            value={formData.club}
            onChange={handleChange}
            placeholder="Naziv kluba iz kojeg se prijavljujete"
          />
        )}

        {type === "club" && (
          <Input
            label="Naziv kluba *"
            name="club"
            value={formData.club}
            onChange={handleChange}
            placeholder="Naziv vašeg kluba"
            required
          />
        )}

        <Textarea
          label="Poruka *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Napišite vašu poruku ili pitanje..."
          rows={4}
          required
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Pošalji Upit
        </Button>

        <p className="text-xs text-coerver-gray-500 text-center">
          Slanjem ovog obrasca slažete se s našom{" "}
          <a href="/privatnost" className="text-coerver-green hover:underline">
            politikom privatnosti
          </a>
          .
        </p>
      </form>
    </div>
  );
}
