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

const modules = [
  {
    title: "Speed & Agility",
    description: "Nogometno-specifični razvoj brzine i agilnosti.",
    topics: [
      "Eksplozivnost i ubrzanje",
      "Promjena smjera",
      "Brzina s loptom",
      "Periodizacija treninga brzine",
    ],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Finishing",
    description: "Kompletna metodologija treninga završnice.",
    topics: [
      "Tehnike udarca",
      "Završnica 1v1",
      "Udarci iz daljine",
      "Igra glavom",
    ],
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  {
    title: "Group Attack",
    description: "Koordinirani napad u malim grupama.",
    topics: [
      "Kombinacije u trokutu",
      "Probijanje linija",
      "Treći čovjek",
      "Igra u širinu i dubinu",
    ],
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Periodizacija i Planiranje",
    description: "Dugoročno planiranje razvoja igrača.",
    topics: [
      "Godišnji ciklusi",
      "Progresije po dobi",
      "Integracija svih elemenata",
      "Evaluacija napretka",
    ],
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

const pathway = [
  { name: "Coerver Intro", level: "Početni", levelNum: 1, completed: true },
  { name: "Youth Diploma 1", level: "Srednji", levelNum: 2, completed: true },
  { name: "Youth Diploma 2", level: "Napredni", levelNum: 3, current: true },
];

const upcomingDates = [
  {
    date: "05-06.04.2024",
    location: "Zagreb",
    venue: "Hotel Westin",
    spots: 8,
  },
  {
    date: "17-18.05.2024",
    location: "Split",
    venue: "Hotel Le Meridien",
    spots: 12,
  },
];

const whatYouGet = [
  "Youth Diploma 2 certifikat",
  "Status licenciranog Coerver trenera",
  "Doživotni pristup online platformi",
  "Komplet naprednih materijala",
  "Video biblioteka s 200+ vježbi",
  "Ručak i osvježenja oba dana",
  "Coerver premium komplet opreme",
  "Poziv na godišnju konferenciju",
  "Mogućnost rada na Coerver programima",
];

export default function YouthDiploma2Page() {
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
            src="/images/photoshoot/Coerver_Kustosija-70.webp"
            alt="Youth Diploma 2"
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
              <span className="text-coerver-green text-sm font-semibold">Youth Diploma 2</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-coerver-green/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
              <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
              <span className="text-coerver-green text-sm font-semibold">Napredna razina</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Youth
              <br />
              <span className="text-coerver-green">Diploma 2</span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-xl">
              Napredna razina Coerver certifikacije. Kompletan kurikulum koji
              pokriva brzinu, agilnost, završnicu i grupni napad.
            </p>

            {/* Quick info cards */}
            <div className="flex flex-wrap gap-4 mb-10">
              {[
                { label: "Trajanje", value: "2 dana (16 sati)" },
                { label: "Cijena", value: "450€" },
                { label: "Preduvjet", value: "Youth Diploma 1" },
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

      {/* Modules */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Napredni kurikulum</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Što ćeš naučiti?
            </h2>
            <p className="text-lg text-gray-600">
              YD2 proširuje tvoje znanje s naprednim tehnikama i taktičkim elementima.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {modules.map((module, index) => (
              <div
                key={module.title}
                className="animate-on-scroll group bg-gray-50 hover:bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={module.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-coerver-dark mb-2 group-hover:text-coerver-green transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <ul className="space-y-2">
                      {module.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-5 h-5 text-coerver-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Pathway */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Kompletna certifikacija</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Tvoj Coerver put
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto mb-12">
            {pathway.map((step, index) => (
              <div key={step.name} className="animate-on-scroll flex items-center gap-6" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className={`relative rounded-3xl p-6 min-w-[200px] text-center ${
                  step.current
                    ? "bg-coerver-green ring-4 ring-coerver-green/30"
                    : "bg-white/10 backdrop-blur-sm border border-white/10"
                }`}>
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    step.current ? "bg-white/20" : "bg-coerver-green/20"
                  }`}>
                    <span className={`font-bold text-lg ${step.current ? "text-white" : "text-coerver-green"}`}>
                      {step.levelNum}
                    </span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                    step.current ? "bg-white/20 text-white" : "bg-coerver-green/20 text-coerver-green"
                  }`}>
                    {step.level}
                  </span>
                  <div className={`font-bold ${step.current ? "text-white" : "text-white/80"}`}>
                    {step.name}
                  </div>
                  {step.completed && !step.current && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-coerver-green rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {index < pathway.length - 1 && (
                  <svg className="w-8 h-8 text-white/30 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="animate-on-scroll text-center">
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Nakon YD2 postajete potpuno certificirani Coerver trener s pristupom
              svim materijalima i globalnoj mreži.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Što dobivaš</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Kompletna certifikacija
              </h2>

              <div className="space-y-3">
                {whatYouGet.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-coerver-dark font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="animate-on-scroll">
              <div className="bg-gradient-to-br from-coerver-green/20 to-coerver-green/5 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-coerver-green rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="text-coerver-green font-black text-2xl mb-2">
                    COERVER COACHING
                  </div>
                  <div className="text-gray-500 mb-6">
                    Licencirani Trener
                  </div>
                  <div className="text-xl font-bold text-coerver-dark mb-2">
                    Youth Diploma 1 & 2
                  </div>
                  <div className="text-gray-500 text-sm">
                    Potpuna certifikacija
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-coerver-green text-sm font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Priznato u 50+ zemalja
                    </div>
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

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {upcomingDates.map((date, index) => (
              <div
                key={date.date}
                className="animate-on-scroll group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
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

      {/* Registration Form */}
      <section id="prijava" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coerver-green/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <div className="animate-on-scroll text-white">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Prijavi se na Youth Diploma 2
              </h2>
              <p className="text-lg text-white/70 mb-10">
                Završi svoju Coerver certifikaciju i postani dio globalne mreže
                licenciranih trenera.
              </p>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-6">
                <h4 className="font-bold text-lg mb-6">Preduvjeti:</h4>
                <div className="space-y-4">
                  {[
                    "Završen Youth Diploma 1 tečaj",
                    "Minimum 6 mjeseci praktičnog iskustva nakon YD1",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-coerver-green/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-coerver-green/20 rounded-2xl p-6 border border-coerver-green/30">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-coerver-green font-bold">Grupni popust</span>
                </div>
                <p className="text-white/70 text-sm">
                  Prijavite se zajedno s kolegom i ostvarite 10% popusta za oboje!
                </p>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="course" programId="youth-diploma-2" title="Prijava za YD2" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
