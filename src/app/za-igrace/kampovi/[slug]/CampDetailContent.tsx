"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Camp } from "@/lib/api/camps";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CampDetailContentProps {
  camp: Camp;
}

export default function CampDetailContent({ camp }: CampDetailContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [camp]);

  // Format dates
  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "dd.MM.yyyy", { locale: hr });
  };

  const dates = `${formatDate(camp.start_date)} - ${formatDate(camp.end_date)}`;

  // Calculate spots and percentages
  const totalSpots = camp.total_spots || camp.capacity || 24;
  const availableSpots = camp.spots || totalSpots;
  const spotsPercentage = ((totalSpots - availableSpots) / totalSpots) * 100;
  const isAlmostFull = availableSpots <= 5;

  // Get age groups display
  const ageGroupsDisplay = camp.age_groups?.length
    ? camp.age_groups.join(", ") + " god"
    : camp.age_min && camp.age_max
    ? `${camp.age_min}-${camp.age_max} god`
    : "Sve uzrasti";

  // Default values for arrays
  const highlights = camp.highlights || [];
  const dailySchedule = camp.daily_schedule || [];
  const weeklyProgram = camp.weekly_program || [];
  const included = camp.included || [];
  const whatToBring = camp.what_to_bring || [];
  const gallery = camp.gallery || [];
  const faq = camp.faq || [];
  const testimonials = camp.testimonials || [];
  const heroImage = camp.hero_image || camp.image_url || "/images/training/training-08.webp";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={camp.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/40" />
        </div>

        {/* Background blur effects */}
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Link href="/za-igrace" className="text-white/60 hover:text-white text-sm transition-colors">Za Igrače</Link>
            <span className="text-white/40">/</span>
            <Link href="/za-igrace/kampovi" className="text-white/60 hover:text-white text-sm transition-colors">Kampovi</Link>
            <span className="text-white/40">/</span>
            <span className="text-coerver-green text-sm font-semibold">{camp.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Camps Logo */}
              <div className="mb-6">
                <Image
                  src="/images/logo-variations/Camps_White.png"
                  alt="Coerver Camps"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </div>

              {isAlmostFull && (
                <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-red-500/30">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-300 text-sm font-semibold">Još samo {availableSpots} mjesta!</span>
                </div>
              )}

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
                {camp.title.split(" ").slice(0, -1).join(" ")}
                <br />
                <span className="text-coerver-green">{camp.title.split(" ").slice(-1)}</span>
              </h1>

              {camp.subtitle && (
                <p className="text-xl text-white/70 mb-8 max-w-xl">
                  {camp.subtitle}
                </p>
              )}

              {/* Quick info cards */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Datum", value: dates, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                  { label: "Lokacija", value: camp.location || "TBD", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                  { label: "Dob", value: ageGroupsDisplay, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
                  { label: "Cijena", value: camp.price ? `${camp.price}€` : "TBD", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-coerver-green/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/50 text-xs uppercase tracking-wider">{item.label}</div>
                        <div className="text-white font-semibold">{item.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#prijava"
                  className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                >
                  <span>Prijavi se odmah</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                {weeklyProgram.length > 0 && (
                  <a
                    href="#program"
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
                  >
                    Pogledaj program
                  </a>
                )}
              </div>
            </div>

            {/* Stats card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-xl">Popunjenost kampa</h3>
                  <span className="text-coerver-green font-bold text-2xl">{availableSpots} mjesta</span>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-coerver-green to-emerald-400 rounded-full transition-all"
                      style={{ width: `${spotsPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-white/50 text-sm">{Math.round(spotsPercentage)}% popunjeno</span>
                    <span className="text-white/50 text-sm">{totalSpots - availableSpots} / {totalSpots}</span>
                  </div>
                </div>

                {/* Early bird */}
                {camp.early_bird_price && camp.early_bird_deadline && (
                  <div className="bg-coerver-green/20 rounded-2xl p-4 border border-coerver-green/30">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-coerver-green font-semibold">Early Bird ponuda</span>
                    </div>
                    <p className="text-white text-lg font-bold mb-1">{camp.early_bird_price}€ <span className="text-white/50 line-through text-sm">{camp.price}€</span></p>
                    <p className="text-white/60 text-sm">Do {formatDate(camp.early_bird_deadline)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Highlights */}
      {(camp.description || highlights.length > 0) && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {camp.description && (
                <div className="animate-on-scroll">
                  <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                    <span className="text-coerver-green text-sm font-semibold">O kampu</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                    Što vas očekuje?
                  </h2>
                  <div className="prose prose-lg text-gray-600">
                    {camp.description.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph.trim()}</p>
                    ))}
                  </div>
                </div>
              )}

              {highlights.length > 0 && (
                <div className="animate-on-scroll">
                  <div className="bg-gray-50 rounded-3xl p-8">
                    <h3 className="text-2xl font-black text-coerver-dark mb-6">Zašto odabrati ovaj kamp?</h3>
                    <div className="space-y-4">
                      {highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-coerver-dark font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Weekly Program */}
      {weeklyProgram.length > 0 && (
        <section id="program" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Program kampa</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Tjedni raspored
              </h2>
              <p className="text-lg text-white/60">
                Svaki dan donosi novu temu i nove vještine
              </p>
            </div>

            <div className={cn(
              "grid gap-4 max-w-6xl mx-auto",
              weeklyProgram.length <= 5 ? "md:grid-cols-5" : "md:grid-cols-4"
            )}>
              {weeklyProgram.map((day, index) => (
                <div
                  key={day.day}
                  className="animate-on-scroll group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-coerver-green/50 transition-all duration-300 h-full">
                    <div className="bg-coerver-green p-4 text-center">
                      <span className="text-white font-bold text-lg">Dan {index + 1}</span>
                    </div>
                    <div className="p-6">
                      <div className="text-white/50 text-sm mb-2">{day.day}</div>
                      <h4 className="text-white font-bold text-lg mb-3 group-hover:text-coerver-green transition-colors">{day.theme}</h4>
                      <p className="text-white/60 text-sm">{day.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Schedule */}
      {dailySchedule.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Dnevni raspored</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                  Tipičan dan na kampu
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Svaki dan je pažljivo isplaniran da pruži optimalan balans treninga, odmora i zabave.
                </p>

                <div className="space-y-4">
                  {dailySchedule.map((item, index) => (
                    <div
                      key={item.time}
                      className="flex items-center gap-5 bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon || "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-coerver-dark">{item.activity}</div>
                        <div className="text-gray-500 text-sm">{item.time}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center">
                        <span className="text-coerver-green font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Grid */}
              <div className="animate-on-scroll relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[0] ? (
                        <Image src={gallery[0]} alt="Trening na kampu" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-coerver-green/10 flex items-center justify-center">
                          <svg className="w-12 h-12 text-coerver-green/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="aspect-video rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[1] ? (
                        <Image src={gallery[1]} alt="Kamp aktivnosti" fill className="object-cover" />
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-video rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[2] ? (
                        <Image src={gallery[2]} alt="Grupni trening" fill className="object-cover" />
                      ) : null}
                    </div>
                    <div className="aspect-square rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[3] ? (
                        <Image src={gallery[3]} alt="Zabava na kampu" fill className="object-cover" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What's Included & What to Bring */}
      {(included.length > 0 || whatToBring.length > 0) && (
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Included */}
              {included.length > 0 && (
                <div className="animate-on-scroll bg-white rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-coerver-dark">Što je uključeno</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {included.map((item) => (
                      <div key={item.item} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon || "M5 13l4 4L19 7"} />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What to Bring */}
              {whatToBring.length > 0 && (
                <div className="animate-on-scroll bg-coerver-dark rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-white">Što ponijeti</h3>
                  </div>
                  <div className="space-y-3">
                    {whatToBring.map((item) => (
                      <div key={item} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                        <svg className="w-5 h-5 text-coerver-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Galerija</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                Fotografije s kampova
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "animate-on-scroll relative rounded-3xl overflow-hidden group",
                    index === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-video"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Image
                    src={image}
                    alt={`Galerija ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Iskustva</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                Što kažu roditelji
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="animate-on-scroll bg-white rounded-3xl p-8 shadow-sm"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 text-lg italic">&quot;{testimonial.text}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-coerver-green/10 flex items-center justify-center text-coerver-green font-bold text-lg">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-coerver-dark">{testimonial.name}</div>
                      <div className="text-gray-500 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">FAQ</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                Česta pitanja
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faq.map((faqItem, index) => (
                <div
                  key={index}
                  className="animate-on-scroll bg-gray-50 rounded-2xl overflow-hidden"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h4 className="font-bold text-coerver-dark pr-4">{faqItem.question}</h4>
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300",
                      openFaq === index && "rotate-180"
                    )}>
                      <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    openFaq === index ? "max-h-40" : "max-h-0"
                  )}>
                    <p className="px-6 pb-6 text-gray-600">{faqItem.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {camp.location && (
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Lokacija</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                  {camp.location}
                </h2>
                {camp.address && (
                  <p className="text-lg text-gray-600 mb-8">{camp.address}</p>
                )}

                {camp.map_url && (
                  <a
                    href={camp.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-coerver-dark text-white font-semibold px-6 py-4 rounded-full hover:bg-coerver-dark/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Otvori u Google Maps
                  </a>
                )}
              </div>

              {/* Map placeholder with image */}
              <div className="animate-on-scroll relative aspect-video lg:aspect-square rounded-3xl overflow-hidden">
                <Image
                  src={heroImage}
                  alt="Lokacija kampa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {camp.address && (
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 text-white">
                        <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">{camp.address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Registration Section */}
      <section id="prijava" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coerver-green/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="animate-on-scroll text-white">
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
                <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                <span className="text-coerver-green text-sm font-semibold">Prijave otvorene</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Prijavi se na {camp.title}
              </h2>
              <p className="text-lg text-white/60 mb-10">
                Osiguraj svoje mjesto - broj mjesta je ograničen!
              </p>

              {/* Price card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black">{camp.price || "TBD"}€</span>
                  <span className="text-white/50 mb-2">po igraču</span>
                </div>

                {camp.early_bird_price && camp.early_bird_deadline && (
                  <div className="bg-coerver-green/20 rounded-2xl p-4 mb-6 border border-coerver-green/30">
                    <div className="flex items-center gap-2 text-coerver-green font-semibold mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Early Bird: {camp.early_bird_price}€
                    </div>
                    <p className="text-white/60 text-sm">
                      Za prijave do {formatDate(camp.early_bird_deadline)}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {["Svi obroci uključeni", "Coerver oprema uključena", "Osiguranje uključeno"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spots */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60">Slobodna mjesta</span>
                  <span className="text-white font-bold text-xl">{availableSpots} / {totalSpots}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-coerver-green to-emerald-400 rounded-full transition-all"
                    style={{ width: `${spotsPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="camp" programId={camp.id} title="Prijava na kamp" />
            </div>
          </div>
        </div>
      </section>

      {/* Back to camps */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <Link
            href="/za-igrace/kampovi"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-coerver-green font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Povratak na sve kampove
          </Link>
        </div>
      </section>
    </div>
  );
}
