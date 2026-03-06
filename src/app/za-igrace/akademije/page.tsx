"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const locations = [
  {
    id: "zagreb-zapad",
    name: "Zagreb - Zapad",
    address: "NK Kustošija, Sokolska 47a, 10000 Zagreb",
    schedule: "Uto, Čet, Pet, Sub, Ned",
    ageGroups: ["7-14"],
  },
  {
    id: "zagreb-east",
    name: "Zagreb - Istok",
    address: "NK Sesvete, Vladimira Vidrića 7, 10360 Sesvete",
    schedule: "Uto, Čet, Pet, Sub, Ned",
    ageGroups: ["7-14"],
  },
  {
    id: "split",
    name: "Split",
    address: "Spinut AFCU, Antuna Gustava Matoša 56, 21000 Split",
    schedule: "Sub, Ned",
    ageGroups: ["7-14"],
  },
  {
    id: "varazdin",
    name: "Varaždin",
    address: "Arena Varaždin, Šetalište Franje Tuđmana 1, 42000 Varaždin",
    schedule: "Uto, Sri, Čet",
    ageGroups: ["7-14"],
  },
  {
    id: "ilijas",
    name: "Ilijaš (Sarajevo)",
    address: "ŠF Tempo Ilijaš, 126. Ilijaške brigade bb, 71380 Ilijaš, Bosna i Hercegovina",
    schedule: "Sub, Ned",
    ageGroups: ["7-14"],
  },
  {
    id: "siroki-brijeg",
    name: "Široki Brijeg",
    address: "SC Pavković, Ugrovačka 4a, 88220 Široki Brijeg, Bosna i Hercegovina",
    schedule: "Sub, Ned",
    ageGroups: ["7-14"],
  },
];

const trainingPhases = [
  { time: "15 %", title: "Zagrijavanje", description: "Dinamičko zagrijavanje kroz ball mastery" },
  { time: "10 %", title: "Brzina", description: "Brzina sa i bez lopte" },
  { time: "15 %", title: "1v1", description: "Change of directions, stops & starts i faints" },
  { time: "25 %", title: "Small Group Play", description: "Vježbe primanja, dodavanja, suradnje i završnice" },
  { time: "30 %", title: "Small Sided Game", description: "Igre na skraćenom prostoru" },
  { time: "5 %", title: "Domaća zadaća", description: "Potezi za trening u slobodno vrijeme" },
];

const pricing = [
  {
    name: "Mjesečna",
    price: "80",
    period: "mjesec",
    features: ["8 treninga mjesečno", "Coerver oprema", "Praćenje napretka", "Pristup video sadržaju"],
    highlighted: false,
  },
  {
    name: "Polugodišnja",
    price: "400",
    period: "6 mjeseci",
    features: ["Svi mjesečni benefiti", "Ušteda 80€", "Prioritet upisa na kampove", "Coerver majica gratis"],
    highlighted: true,
    badge: "Najpopularnije",
  },
  {
    name: "Godišnja",
    price: "720",
    period: "godina",
    features: ["Svi polugodišnji benefiti", "Ušteda 240€", "Besplatan kamp", "Premium Coerver komplet"],
    highlighted: false,
  },
];

export default function AkademijePage() {
  const [activeLocation, setActiveLocation] = useState(0);

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
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-60.webp"
            alt="Coerver akademija"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/90 to-coerver-dark/70" />
        </div>

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-coerver-green/15 rounded-full blur-[150px]" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
                <Link href="/za-igrace" className="text-white/60 hover:text-white text-sm">Za Igrače</Link>
                <span className="text-white/40">/</span>
                <span className="text-coerver-green text-sm font-semibold">Akademije</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Coerver<span className="text-coerver-green">®</span> Akademije
              </h1>

              <p className="text-lg lg:text-xl text-white/60 mb-8 max-w-lg">
                Redovni grupni treninzi po provjerenoj Coerver metodologiji. Pronađi
                akademiju u svom gradu i započni put prema nogometnoj izvrsnosti.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#prijava"
                  className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                >
                  <span>Prijavi se</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href="#lokacije"
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
                >
                  Pronađi lokaciju
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: "6", label: "Lokacija" },
                { value: "5", label: "Gradova" },
                { value: "12", label: "Max igrača po grupi" },
                { value: "75", label: "Minuta po treningu" },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl font-black text-coerver-green mb-1">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="lokacije" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Lokacije</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Pronađi akademiju
            </h2>
            <p className="text-lg text-gray-600">
              Coerver akademije su prisutne u svim većim gradovima Hrvatske.
            </p>
          </div>

          <div className="animate-on-scroll grid lg:grid-cols-3 gap-8">
            {/* Location tabs */}
            <div className="space-y-3">
              {locations.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocation(index)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl transition-all duration-300",
                    activeLocation === index
                      ? "bg-coerver-green text-white shadow-lg shadow-coerver-green/20"
                      : "bg-gray-50 text-coerver-dark hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{location.name}</h3>
                      <p className={cn("text-sm", activeLocation === index ? "text-white/70" : "text-gray-500")}>
                        {location.schedule}
                      </p>
                    </div>
                    <svg
                      className={cn("w-5 h-5 transition-transform", activeLocation === index ? "rotate-0" : "-rotate-90")}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Location details */}
            <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 lg:p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-coerver-dark mb-2">
                    {locations[activeLocation].name}
                  </h3>
                  <p className="text-gray-600">{locations[activeLocation].address}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-coerver-green/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-coerver-green/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-coerver-dark">Raspored</span>
                  </div>
                  <p className="text-gray-600">{locations[activeLocation].schedule}</p>
                </div>

                <div className="bg-white rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-coerver-green/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-coerver-dark">Dobne skupine</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {locations[activeLocation].ageGroups.map((age) => (
                      <span key={age} className="px-3 py-1 bg-coerver-green/10 text-coerver-green text-sm font-medium rounded-full">
                        {age} god
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="#prijava"
                className="inline-flex items-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
              >
                Prijavi se na ovu lokaciju
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Training Structure */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Struktura treninga</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Što te čeka na treningu?
            </h2>
            <p className="text-lg text-white/60">
              90 minuta strukturiranog treninga po provjerenoj Coerver metodologiji.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 mx-auto">
            {trainingPhases.map((phase, index) => (
              <div
                key={phase.title}
                className="animate-on-scroll"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 lg:p-6 border border-white/10 text-center hover:bg-white/10 transition-colors h-full flex flex-col">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-coerver-green rounded-2xl flex items-center justify-center text-white font-black text-lg lg:text-xl mb-4 flex-shrink-0">
                    {phase.time}
                  </div>
                  <h4 className="font-bold text-white mb-2 text-sm lg:text-base">{phase.title}</h4>
                  <p className="text-white/50 text-xs lg:text-sm flex-grow">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Cijene</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Odaberi svoj plan
            </h2>
            <p className="text-lg text-gray-600">
              Transparentne cijene bez skrivenih troškova. Duža pretplata = veća ušteda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div
                key={plan.name}
                className={cn(
                  "animate-on-scroll relative bg-white rounded-3xl p-8 transition-all duration-300",
                  plan.highlighted
                    ? "ring-2 ring-coerver-green shadow-xl shadow-coerver-green/10 scale-105"
                    : "hover:shadow-lg"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-coerver-green text-white text-sm font-semibold rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-coerver-dark mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-coerver-green">{plan.price}</span>
                    <span className="text-2xl font-bold text-coerver-green">€</span>
                  </div>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#prijava"
                  className={cn(
                    "block w-full py-4 text-center font-semibold rounded-full transition-all duration-300",
                    plan.highlighted
                      ? "bg-coerver-green text-white hover:bg-coerver-green/90"
                      : "bg-gray-100 text-coerver-dark hover:bg-coerver-green hover:text-white"
                  )}
                >
                  Odaberi plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Inquiry Form Section */}
      <section id="prijava" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Prijava</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Prijavi se u akademiju
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Ispuni obrazac i javit ćemo ti se s dostupnim terminima i svim
                potrebnim informacijama. Možeš doći i na besplatni probni trening!
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-coerver-green/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-coerver-dark">Email</div>
                    <div className="text-gray-600">info@coervercroatia.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-coerver-green/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-coerver-dark">Telefon</div>
                    <div className="text-gray-600">+385 98 1873 228</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="academy" title="Pošalji upit" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
