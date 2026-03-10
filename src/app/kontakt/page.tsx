"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const contactInfo = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email",
    value: "info@coervercroatia.com",
    href: "mailto:info@coerver.hr",
    description: "Pišite nam bilo kada",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Telefon",
    value: "+385 98 1873 228",
    href: "tel:+385981873228",
    description: "Pon - Pet, 9:00 - 17:00",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Adresa",
    value: "Zagreb",
    href: "",
    description: "10000 Zagreb, Hrvatska",
  },
];

const faqs = [
  {
    question: "Za koje uzraste su namijenjeni Coerver programi?",
    answer: "Naši programi su prilagođeni svim uzrastima, i odraslima i mlađima. Svaka dobna skupina ima posebno dizajniran program koji odgovara njihovom razvojnom stupnju.",
  },
  {
    question: "Koliko traju treninzi?",
    answer: "Treninzi traju 60-90 minuta, ovisno o dobnoj skupini i vrsti programa. Mlađi polaznici imaju kraće treninge prilagođene njihovoj koncentraciji.",
  },
  {
    question: "Kako se mogu prijaviti?",
    answer: "Možete se prijaviti putem kontakt obrasca na ovoj stranici, emailom ili telefonom. Nakon prijave, javit ćemo vam se s detaljima o dostupnim terminima.",
  },
  {
    question: "Trebam li donijeti vlastitu opremu?",
    answer: "Ovisno o progamu treneri će naponenuti je li oprema vlastita ili je pružamo mi.",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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

      const { error: submitError } = await supabase.from("inquiries").insert({
        type: "general",
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `[${formData.subject}] ${formData.message}`,
      });

      if (submitError) throw submitError;

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Došlo je do greške. Molimo pokušajte ponovno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-coerver-dark overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/training/training-10.webp"
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-coerver-dark via-coerver-dark/95 to-coerver-dark" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-coerver-green/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-coerver-green/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-coerver-green text-sm font-semibold">Stupite u kontakt</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
              Kako vam možemo{" "}
              <span className="text-coerver-green">pomoći?</span>
            </h1>

            <p className="text-white/60 text-lg lg:text-xl max-w-2xl">
              Imate pitanje o našim programima? Želite prijaviti dijete na trening?
              Tu smo za vas - javite nam se!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-coerver-dark mb-8">Kontakt informacije</h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href || "#"}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-coerver-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-coerver-green transition-colors">
                      <svg className="w-5 h-5 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="font-semibold text-coerver-dark group-hover:text-coerver-green transition-colors">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Pratite nas</h3>
                <div className="flex gap-3">
                  {[
                    { name: "Instagram", href: "https://www.instagram.com/coerver_croatia/", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z" },
                    { name: "Facebook", href: "https://web.facebook.com/coervercroatia", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                    { name: "YouTube", href: "https://www.youtube.com/@coervercoachingcroatia2240", icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" },
                    { name: "TikTok", href: "https://www.tiktok.com/@coerverbcs", icon: "M9 12a4 4 0 104 4V4a5 5 0 005 5" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-coerver-green hover:text-white transition-colors"
                      title={social.name}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 text-center">
                  <div className="w-20 h-20 bg-coerver-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-coerver-dark mb-3">
                    Hvala na poruci!
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Vaša poruka je uspješno poslana. Javit ćemo vam se u najkraćem mogućem roku.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-2 bg-coerver-dark text-white font-semibold px-6 py-3 rounded-xl hover:bg-coerver-dark/90 transition-colors"
                  >
                    Pošalji novu poruku
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                  <h2 className="text-2xl font-bold text-coerver-dark mb-2">Pošaljite nam poruku</h2>
                  <p className="text-gray-500 mb-8">Ispunite obrazac i javit ćemo vam se uskoro.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ime i prezime *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Vaše ime i prezime"
                          required
                          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coerver-green focus:border-transparent transition-all text-coerver-dark placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email adresa *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="vas@email.com"
                          required
                          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coerver-green focus:border-transparent transition-all text-coerver-dark placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+385 91 123 4567"
                          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coerver-green focus:border-transparent transition-all text-coerver-dark placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tema *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coerver-green focus:border-transparent transition-all text-coerver-dark"
                        >
                          <option value="">Odaberite temu</option>
                          <option value="Upis igrača">Upis igrača</option>
                          <option value="Edukacija trenera">Edukacija trenera</option>
                          <option value="Partnerstvo s klubom">Partnerstvo s klubom</option>
                          <option value="Opći upit">Opći upit</option>
                          <option value="Ostalo">Ostalo</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Poruka *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Opišite vaš upit..."
                        rows={5}
                        required
                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coerver-green focus:border-transparent transition-all text-coerver-dark placeholder:text-gray-400 resize-none"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <p className="text-sm text-gray-500">
                        * Obavezna polja
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-4 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Slanje...
                          </>
                        ) : (
                          <>
                            Pošalji poruku
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-coerver-dark mb-4">
                Često postavljana pitanja
              </h2>
              <p className="text-gray-500 text-lg">
                Pronađite odgovore na najčešća pitanja
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-coerver-dark pr-4">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === index ? "bg-coerver-green" : ""}`}>
                      <svg
                        className={`w-4 h-4 transition-all ${openFaq === index ? "rotate-180 text-white" : "text-gray-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-48" : "max-h-0"}`}
                  >
                    <p className="px-6 pb-6 text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 mb-4">Niste pronašli odgovor?</p>
              <Link
                href="mailto:info@coerver.hr"
                className="inline-flex items-center gap-2 text-coerver-green font-semibold hover:underline"
              >
                Pošaljite nam email
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-coerver-green">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Spremni za prvi trening?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Pridružite se stotinama zadovoljnih igrača koji su već dio Coerver obitelji
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/za-igrace/akademije"
              className="inline-flex items-center gap-2 bg-white text-coerver-green font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-colors"
            >
              Pronađi akademiju
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/za-trenere"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Postani trener
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
