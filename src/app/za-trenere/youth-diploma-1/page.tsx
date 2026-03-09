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
    title: "Zagrijavanje",
    description: "Vježbe kako koristiti ball mastery u zagrijavanju.",
    topics: [],
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  },
  {
    title: "Brzina",
    description: "Vježbe brzine s loptom.",
    topics: [],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "1v1",
    description: "1v1 potezi i 1v1 i 2v2 igre.",
    topics: [],
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    title: "Small Group Play",
    description: "Igre u manjim grupama. Vježbe igre usmjerene na primanja, dodavanja, suradnju i završnicu.",
    topics: [],
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
  {
    title: "Igre na Skraćenom Prostoru",
    description: "Tematske i slobodne igre za razvoj svih vještina pod punim pritiskom.",
    topics: [],
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
];

const daySchedule = {
  day1: {
    title: "Ball Mastery & 1v1",
    items: [
      { time: "09:00 - 10:30", activity: "Ball Mastery teorija" },
      { time: "11:00 - 12:30", activity: "Ball Mastery praksa" },
      { time: "13:30 - 15:00", activity: "1v1 potezi - teorija" },
      { time: "15:30 - 17:00", activity: "1v1 potezi - praksa" },
    ],
  },
  day2: {
    title: "Receiving, Turning & Passing",
    items: [
      { time: "09:00 - 10:30", activity: "Receiving & Turning" },
      { time: "11:00 - 12:30", activity: "Passing tehnika" },
      { time: "13:30 - 15:00", activity: "Praktična radionica" },
      { time: "15:30 - 17:00", activity: "Evaluacija i certifikati" },
    ],
  },
};

const upcomingDates = [
  {
    date: "22-23.03.2024",
    location: "Zagreb",
    venue: "Hotel Westin",
    spots: 5,
  },
  {
    date: "19-20.04.2024",
    location: "Split",
    venue: "Hotel Le Meridien",
    spots: 10,
  },
];

const whatYouGet = [
  "Youth Diploma 1 certifikat",
  "Komplet priručnika i materijala",
  "Ručak i osvježenja",
  "25 vježbi sa varijacijama",
];

export default function YouthDiploma1Page() {
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
            src="/images/photoshoot/Coerver_Kustosija-60.webp"
            alt="Youth Diploma 1"
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
              <span className="text-coerver-green text-sm font-semibold">Youth Diploma 1</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-coerver-green/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
              <span className="text-coerver-green text-sm font-semibold">Srednja razina</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Youth
              <br />
              <span className="text-coerver-green">Diploma 1</span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-xl">
              Dvodnevni intenzivni program u kojem će treneri naučiti kako kreirati Coerver trening uz pomoć Coerver trening planera.
            </p>

            {/* Quick info cards */}
            <div className="flex flex-wrap gap-4 mb-10">
              {[
                { label: "Trajanje", value: "2 dana" },
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
              <span className="text-coerver-green text-sm font-semibold">Kurikulum</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Što ćeš naučiti?
            </h2>
            <p className="text-lg text-gray-600">
              Youth Diploma 1 pokriva pet ključnih modula Coerver metodologije.
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

      {/* Schedule */}
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
              Program po danima
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Day 1 */}
            <div className="animate-on-scroll bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10">
              <div className="bg-coerver-green p-6">
                <span className="text-white font-bold text-xl">Dan 1</span>
                <div className="text-white/80 text-sm mt-1">{daySchedule.day1.title}</div>
              </div>
              <div className="p-6 space-y-4">
                {daySchedule.day1.items.map((item, index) => (
                  <div key={item.time} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-coerver-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-coerver-green font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.activity}</div>
                      <div className="text-white/50 text-sm">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day 2 */}
            <div className="animate-on-scroll bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10" style={{ transitionDelay: "100ms" }}>
              <div className="bg-coerver-green p-6">
                <span className="text-white font-bold text-xl">Dan 2</span>
                <div className="text-white/80 text-sm mt-1">{daySchedule.day2.title}</div>
              </div>
              <div className="p-6 space-y-4">
                {daySchedule.day2.items.map((item, index) => (
                  <div key={item.time} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-coerver-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-coerver-green font-bold text-sm">{index + 5}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.activity}</div>
                      <div className="text-white/50 text-sm">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                Uključeno u cijenu
              </h2>

              <div className="space-y-4">
                {whatYouGet.map((item) => (
                  <div key={item} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
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

            {/* Image */}
            <div className="animate-on-scroll relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/photoshoot/Coerver_Kustosija-70.webp"
                alt="Coerver edukacija"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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

      {/* Next Steps */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="animate-on-scroll max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Sljedeći korak</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
              Nastavi s Youth Diploma 2
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Nakon uspješno položenog YD1, možeš nastaviti s Youth Diploma 2 za
              kompletnu Coerver certifikaciju.
            </p>

            <Link
              href="/za-trenere/youth-diploma-2"
              className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
            >
              <span>Youth Diploma 2</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="prijava" className="py-24 lg:py-32 bg-coerver-green relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <div className="animate-on-scroll text-white">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Prijavi se na Youth Diploma 1
              </h2>
              <p className="text-lg text-white/80 mb-10">
                Ispuni obrazac i započni svoj put prema Coerver certifikaciji.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h4 className="font-bold text-lg mb-6">Preduvjeti:</h4>
                <div className="space-y-4">
                  {[
                    "Završen Coerver Intro tečaj",
                    "Aktivno iskustvo u trenerskom radu",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="course" programId="youth-diploma-1" title="Prijava za YD1" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
