"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InquiryForm } from "@/components/forms/InquiryForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const curriculum = [
  {
    time: "09:00 - 10:30",
    topic: "Uvod u Coerver Metodologiju",
    description: "Povijest, filozofija i principi Coerver Coachinga.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    time: "10:30 - 10:45",
    topic: "Pauza za kavu",
    description: "",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    time: "10:45 - 12:30",
    topic: "Ball Mastery - Teorija i Praksa",
    description: "Osnovne vježbe kontrole lopte i njihova primjena.",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  },
  {
    time: "12:30 - 13:30",
    topic: "Ručak",
    description: "",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    time: "13:30 - 15:00",
    topic: "1v1 Potezi - Osnove",
    description: "Uvod u temeljne driblinške poteze i metodiku učenja.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    time: "15:00 - 15:15",
    topic: "Pauza",
    description: "",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    time: "15:15 - 17:00",
    topic: "Praktična Radionica",
    description: "Praktična primjena naučenog u simuliranom treningu.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
];

const upcomingDates = [
  {
    date: "15.03.2024",
    location: "Zagreb",
    venue: "Hotel Westin",
    spots: 8,
  },
  {
    date: "12.04.2024",
    location: "Split",
    venue: "Hotel Le Meridien",
    spots: 12,
  },
  {
    date: "10.05.2024",
    location: "Osijek",
    venue: "Hotel Waldinger",
    spots: 15,
  },
];

const whatYouGet = [
  { item: "Coerver Intro certifikat", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { item: "Pristup online video biblioteci (3 mjeseca)", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { item: "Coerver priručnik", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { item: "Ručak i osvježenja", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
  { item: "Networking s drugim trenerima", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
];

const whatYoullLearn = [
  {
    title: "Coerver Filozofija",
    description: "Razumijevanje temeljnih principa koji čine Coerver metodologiju jedinstvenom.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Ball Mastery Osnove",
    description: "Temeljne vježbe kontrole lopte i kako ih implementirati u svoje treninge.",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  },
  {
    title: "1v1 Uvod",
    description: "Osnovni driblinški potezi i metodika njihovog učenja mladim igračima.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

export default function CoerverIntroPage() {
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
            src="/images/photoshoot/Coerver_Kustosija-10.webp"
            alt="Coerver Intro tečaj"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/40" />
        </div>

        {/* Background blur effects */}
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Link href="/za-trenere" className="text-white/60 hover:text-white text-sm transition-colors">Za Trenere</Link>
              <span className="text-white/40">/</span>
              <span className="text-coerver-green text-sm font-semibold">Coerver Intro</span>
            </nav>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Coerver
              <br />
              <span className="text-coerver-green">Intro</span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-xl">
              Jednodnevni uvod u Coerver metodologiju. Savršen prvi korak za trenere
              koji žele upoznati osnove najpoznatije metode individualnog razvoja igrača.
            </p>

            {/* Quick info cards */}
            <div className="flex flex-wrap gap-4 mb-10">
              {[
                { label: "Trajanje", value: "1 dan (8 sati)" },
                { label: "Cijena", value: "150€" },
                { label: "Razina", value: "Početni" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10"
                >
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="text-white font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <a
              href="#prijava"
              className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
            >
              <span>Prijavi se</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Sadržaj tečaja</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Što ćeš naučiti?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whatYoullLearn.map((item, index) => (
              <div
                key={item.title}
                className="animate-on-scroll group bg-gray-50 hover:bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-coerver-green/10 flex items-center justify-center mb-6 group-hover:bg-coerver-green group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-coerver-dark mb-3 group-hover:text-coerver-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Raspored</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Dnevni program
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {curriculum.map((item, index) => (
              <div
                key={item.time}
                className={`animate-on-scroll flex items-center gap-5 rounded-2xl p-5 transition-colors ${
                  item.description
                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                    : "bg-transparent"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  item.description ? "bg-coerver-green" : "bg-white/10"
                }`}>
                  <svg className={`w-6 h-6 ${item.description ? "text-white" : "text-white/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${item.description ? "text-white" : "text-white/50"}`}>
                    {item.topic}
                  </div>
                  {item.description && (
                    <div className="text-white/60 text-sm mt-1">{item.description}</div>
                  )}
                </div>
                <div className="text-white/40 text-sm font-medium">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Što dobivaš</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Uključeno u cijenu
              </h2>

              <div className="space-y-4">
                {whatYouGet.map((item, index) => (
                  <div
                    key={item.item}
                    className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-coerver-dark font-medium">{item.item}</span>
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
                      src="/images/photoshoot/Coerver_Kustosija-25.webp"
                      alt="Coerver trening"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-60.webp"
                      alt="Coerver edukacija"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-video rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-45.webp"
                      alt="Grupni trening"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/photoshoot/Coerver_Kustosija-70.webp"
                      alt="Coerver metodologija"
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

      {/* Upcoming Dates */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Termini</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Nadolazeći tečajevi
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {upcomingDates.map((date, index) => (
              <div
                key={date.date}
                className="animate-on-scroll group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-black text-coerver-dark mb-2">
                  {date.date}
                </div>
                <div className="text-coerver-green font-bold text-lg mb-4">
                  {date.location}
                </div>
                <div className="text-gray-500 text-sm mb-6">
                  {date.venue}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500">{date.spots} mjesta</span>
                  </div>
                  <a
                    href="#prijava"
                    className="text-coerver-green font-semibold text-sm hover:underline"
                  >
                    Prijavi se
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="animate-on-scroll max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Sljedeći koraci</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
              Nastavi svoj put
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Nakon Coerver Intro tečaja, možeš nastaviti s Youth Diploma 1 i 2 za
              potpunu Coerver certifikaciju.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/za-trenere/youth-diploma-1"
                className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>Youth Diploma 1</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/za-trenere/youth-diploma-2"
                className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-coerver-dark font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                Youth Diploma 2
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="prijava" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coerver-green/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <div className="animate-on-scroll text-white">
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
                <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                <span className="text-coerver-green text-sm font-semibold">Prijave otvorene</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Prijavi se na Coerver Intro
              </h2>
              <p className="text-lg text-white/60 mb-10">
                Ispuni obrazac i rezerviraj svoje mjesto na jednom od nadolazećih
                termina.
              </p>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h4 className="font-bold text-lg mb-6">Informacije o tečaju:</h4>
                <div className="space-y-4">
                  {[
                    { label: "Cijena: 150€", sublabel: "uključuje sve materijale" },
                    { label: "Max. 20 polaznika", sublabel: "po terminu" },
                    { label: "Nema preduvjeta", sublabel: "otvoren za sve trenere" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-white/50 text-sm">{item.sublabel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="course" programId="coerver-intro" title="Prijava" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
