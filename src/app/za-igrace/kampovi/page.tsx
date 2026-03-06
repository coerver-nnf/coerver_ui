"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const upcomingCamps = [
  {
    id: "summer-2024",
    slug: "ljetni-kamp-zagreb-2024",
    name: "Ljetni Kamp Zagreb",
    dates: "24.06. - 28.06.2024",
    location: "SC Mladost, Zagreb",
    ageGroups: ["7-9", "10-12", "13-15"],
    price: "250",
    spots: 12,
    totalSpots: 24,
    description: "5 dana intenzivnog treninga, profesionalnih natjecanja i nogometne zabave.",
    image: "/images/photoshoot/Coerver_Kustosija-15.jpg",
  },
  {
    id: "summer-2024-split",
    slug: "ljetni-kamp-split-2024",
    name: "Ljetni Kamp Split",
    dates: "01.07. - 05.07.2024",
    location: "SC Gripe, Split",
    ageGroups: ["7-9", "10-12"],
    price: "250",
    spots: 8,
    totalSpots: 20,
    description: "Coerver kamp na sunčanoj obali Dalmacije. Nogomet + plaža!",
    image: "/images/photoshoot/Coerver_Kustosija-45.jpg",
  },
  {
    id: "autumn-2024",
    slug: "jesenski-kamp-zagreb-2024",
    name: "Jesenski Kamp Zagreb",
    dates: "28.10. - 01.11.2024",
    location: "SC Mladost, Zagreb",
    ageGroups: ["7-9", "10-12", "13-15"],
    price: "200",
    spots: 20,
    totalSpots: 24,
    description: "4 dana treninga tijekom jesenskih praznika.",
    image: "/images/photoshoot/Coerver_Kustosija-70.jpg",
  },
];

const dailySchedule = [
  { time: "08:30 - 09:00", activity: "Dolazak i registracija", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { time: "09:00 - 10:30", activity: "Jutarnji trening - Ball Mastery", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" },
  { time: "10:30 - 11:00", activity: "Užina i odmor", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { time: "11:00 - 12:30", activity: "Tehničke vježbe i 1v1", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { time: "12:30 - 13:30", activity: "Ručak", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
  { time: "13:30 - 15:00", activity: "Popodnevni trening - Igra", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" },
  { time: "15:00 - 15:30", activity: "Završetak dana, odlazak", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
];

const included = [
  { item: "Profesionalni Coerver treneri", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { item: "Coerver majica i shorts", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { item: "Ručak i užine", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { item: "Osiguranje", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { item: "Certifikat sudjelovanja", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { item: "Video snimke treninga", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { item: "Završno natjecanje s nagradama", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
  { item: "Fotografije s kampa", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

const faqs = [
  {
    question: "Što dijete treba ponijeti na kamp?",
    answer: "Nogometne kopačke ili tenisice, štucne, štitnike, bocu vode i dobru volju! Coerver opremu dobivate na kampu.",
  },
  {
    question: "Je li uključen ručak?",
    answer: "Da, svi obroci i užine su uključeni u cijenu kampa. Molimo vas da nas obavijestite o eventualnim alergijama.",
  },
  {
    question: "Što ako dijete nema prethodnog iskustva?",
    answer: "Naši kampovi su prilagođeni svim razinama - od potpunih početnika do naprednih igrača. Grupe se formiraju po dobi i razini.",
  },
  {
    question: "Kako mogu otkazati prijavu?",
    answer: "Besplatno otkazivanje do 14 dana prije početka kampa. Nakon toga zadržavamo 50% uplaćenog iznosa.",
  },
];

export default function KampoviPage() {
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
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-45.jpg"
            alt="Nogometni kamp"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/30" />
        </div>

        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
              <Link href="/za-igrace" className="text-white/60 hover:text-white text-sm">Za Igrače</Link>
              <span className="text-white/40">/</span>
              <span className="text-coerver-green text-sm font-semibold">Kampovi</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Nogometni
              <br />
              <span className="text-coerver-green">Kampovi</span>
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-xl">
              Intenzivni višednevni programi tijekom školskih praznika. Nogomet,
              učenje, nove prijateljstva i nezaboravna iskustva.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#camps"
                className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>Pogledaj kampove</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Floating stats */}
          <div className="hidden lg:flex absolute bottom-12 right-8 gap-6">
            {[
              { value: "5+", label: "Kampova godišnje" },
              { value: "200+", label: "Sudionika" },
              { value: "100%", label: "Zabave" },
            ].map((stat, index) => (
              <div key={index} className="text-right">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Camps */}
      <section id="camps" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Nadolazeći kampovi</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Rezerviraj svoje mjesto
            </h2>
            <p className="text-lg text-gray-600">
              Broj mjesta je ograničen - osiguraj svoje mjesto na vrijeme!
            </p>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {upcomingCamps.map((camp, index) => (
              <div
                key={camp.id}
                className="animate-on-scroll group bg-gray-50 hover:bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="grid lg:grid-cols-3">
                  {/* Image */}
                  <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                    <Image
                      src={camp.image}
                      alt={camp.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 bg-coerver-green text-white text-sm font-bold rounded-full">
                        {camp.price}€
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-coerver-dark mb-2 group-hover:text-coerver-green transition-colors">
                          {camp.name}
                        </h3>
                        <p className="text-gray-600">{camp.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Datum</div>
                        <div className="font-semibold text-coerver-dark">{camp.dates}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lokacija</div>
                        <div className="font-semibold text-coerver-dark">{camp.location}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dob</div>
                        <div className="font-semibold text-coerver-dark">{camp.ageGroups.join(", ")} god</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Slobodna mjesta</div>
                        <div className="font-semibold text-coerver-dark">{camp.spots} / {camp.totalSpots}</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-coerver-green to-emerald-400 rounded-full transition-all"
                          style={{ width: `${((camp.totalSpots - camp.spots) / camp.totalSpots) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(((camp.totalSpots - camp.spots) / camp.totalSpots) * 100)}% popunjeno
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/za-igrace/kampovi/${camp.slug}`}
                        className="inline-flex items-center gap-2 bg-coerver-dark text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-dark/90 transition-colors"
                      >
                        Saznaj više
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                      <a
                        href="#prijava"
                        className="inline-flex items-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
                      >
                        Prijavi se
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Dnevni raspored</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Tipičan dan na kampu
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {dailySchedule.map((item, index) => (
                <div
                  key={item.time}
                  className="animate-on-scroll flex items-center gap-5 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{item.activity}</div>
                    <div className="text-white/50 text-sm">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Sve uključeno</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Što je uključeno u cijenu?
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Naši kampovi su sveobuhvatni - sve što treba za nezaboravno
                nogometno iskustvo je uključeno u cijenu.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {included.map((item, index) => (
                  <div
                    key={item.item}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Grid */}
            <div className="animate-on-scroll relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-60.jpg"
                      alt="Trening na kampu"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-25.jpg"
                      alt="Kamp aktivnosti"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-video rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-10.jpg"
                      alt="Grupni trening"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-70.jpg"
                      alt="Zabava na kampu"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
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
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="animate-on-scroll bg-white rounded-2xl overflow-hidden"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h4 className="font-bold text-coerver-dark pr-4">{faq.question}</h4>
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0 transition-transform",
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
                  <p className="px-6 pb-6 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="prijava" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coerver-green/15 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-on-scroll text-white">
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                <span className="text-coerver-green text-sm font-semibold">Prijave otvorene</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Prijavi se na kamp
              </h2>
              <p className="text-lg text-white/60 mb-10">
                Ispuni obrazac i osiguraj svoje mjesto na jednom od naših kampova.
                Broj mjesta je ograničen!
              </p>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h4 className="font-bold mb-6">Potrebne informacije:</h4>
                <ul className="space-y-4">
                  {[
                    "Ime i prezime djeteta",
                    "Dob djeteta",
                    "Željeni kamp (datum i lokacija)",
                    "Kontakt podatke roditelja",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="camp" title="Prijava na kamp" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
