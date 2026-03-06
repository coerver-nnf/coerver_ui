"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createClient } from "@/lib/supabase/client";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactInfo = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email",
    value: "info@coervercroatia.com",
    href: "mailto:info@coervercroatia.com",
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Telefon",
    value: "+385 98 1873 228",
    href: "tel:+385981873228",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Lokacija",
    value: "Zagreb, Hrvatska",
    href: null,
  },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll(".animate-on-scroll");

    gsap.set(elements, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        message: formData.message,
      });

      if (submitError) throw submitError;

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Došlo je do greške. Molimo pokušajte ponovno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-55.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark to-coerver-dark/80" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-coerver-green/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-coerver-green/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <div className="animate-on-scroll inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
              <span className="text-coerver-green text-sm font-semibold">Javite nam se</span>
            </div>

            <h2 className="animate-on-scroll text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
              Spremni za{" "}
              <span className="text-coerver-green">početak?</span>
            </h2>

            <p className="animate-on-scroll text-white/60 text-lg lg:text-xl mb-10 max-w-md">
              Pridružite se stotinama zadovoljnih igrača i trenera koji su već dio Coerver obitelji.
            </p>

            {/* Contact info */}
            <div className="animate-on-scroll space-y-4 mb-10">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-coerver-green transition-colors">
                    <svg className="w-5 h-5 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white font-medium hover:text-coerver-green transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="animate-on-scroll flex flex-wrap gap-3">
              <Link
                href="/za-igrace/akademije"
                className="inline-flex items-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
              >
                Prijavi igrača
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/za-trenere"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                Postani trener
              </Link>
            </div>
          </div>

          {/* Right - Form */}
          <div className="animate-on-scroll">
            {isSubmitted ? (
              <div className="bg-white rounded-3xl p-8 lg:p-10 text-center">
                <div className="w-20 h-20 bg-coerver-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-coerver-dark mb-3">
                  Hvala na upitu!
                </h3>
                <p className="text-gray-500 mb-6">
                  Vaša poruka je uspješno poslana. Javit ćemo vam se u najkraćem mogućem roku.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-coerver-green font-semibold hover:underline"
                >
                  Pošalji novu poruku
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-coerver-dark mb-2">Kontaktirajte nas</h3>
                <p className="text-gray-500 mb-8">Ispunite obrazac i javit ćemo vam se uskoro.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Ime i prezime
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Vaše ime"
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vas@email.com"
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Telefon (opcionalno)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+385 91 123 4567"
                      className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Poruka
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Kako vam možemo pomoći?"
                      rows={4}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400 resize-none"
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                  <p className="text-xs text-gray-400 text-center">
                    Slanjem ovog obrasca slažete se s našom{" "}
                    <Link href="/privatnost" className="text-coerver-green hover:underline">
                      politikom privatnosti
                    </Link>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
