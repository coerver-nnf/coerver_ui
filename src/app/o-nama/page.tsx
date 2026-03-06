"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const pyramidLevels = [
  {
    level: 1,
    title: "Ball Mastery",
    description: "Temelj svega - potpuna kontrola lopte u svim dijelovima stopala s obje noge.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    level: 2,
    title: "Primanje & Dodavanja",
    description: "Prvi dodir - ekipne vještine.",
    color: "from-coerver-green to-emerald-500",
  },
  {
    level: 3,
    title: "1v1 - napad i obrana",
    description: "Change of directions, stops & starts i faints.",
    color: "from-green-600 to-coerver-green",
  },
  {
    level: 4,
    title: "Brzina",
    description: "Brzina sa i bez lopte - brzina donošenja odluka.",
    color: "from-lime-500 to-green-500",
  },
  {
    level: 5,
    title: "Završnica",
    description: "Kreiranje šansi za pogodak i realizacija.",
    color: "from-yellow-500 to-lime-500",
  },
  {
    level: 6,
    title: "Grupni Napad",
    description: "Napad i obrana u manjim grupama.",
    color: "from-amber-500 to-yellow-500",
  },
];

const stats = [
  { value: "1984.", label: "Godina osnivanja", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { value: "60+", label: "Zemalja svijeta", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "1M+", label: "Igrača globalno", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { value: "40+", label: "Godina iskustva", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
];

const historyTimeline = [
  {
    year: "1984",
    title: "Osnivanje Coerver® Coachinga",
    description: "Wiel Coerver, legendarni nizozemski trener, razvija revolucionarnu metodologiju treninga fokusiranu na individualnu tehniku. Njegovi suradnici Alf Galustian i Charlie Cooke, osnivaju ono što danas znamo kao Coerver® Coaching.",
    image: "/images/photoshoot/Coerver_Kustosija-5.webp",
  },
  {
    year: "1990",
    title: "Globalna Ekspanzija",
    description: "Coerver® metodologija se širi na sve kontinente, postajući zlatni standard razvoja mladih igrača. S vremenom Coerver® Coaching se razvija od jednostavne ideje do strukturiranog kurikuluma.",
    image: "/images/photoshoot/Coerver_Kustosija-15.webp",
  },
  {
    year: "2015",
    title: "Dolazak u Hrvatsku",
    description: "Coerver® Coaching službeno dolazi u Hrvatsku, Sloveniju i BiH donoseći vrhunsku metodologiju našim mladim talentima i trenerima.",
    image: "/images/photoshoot/Coerver_Kustosija-45.webp",
  },
  {
    year: "Danas",
    title: "Kontinuirani Rast",
    description: "Više od 500 aktivnih igrača i 30+ certificiranih trenera u Hrvatskoj, Sloveniji i BiH.",
    image: "/images/photoshoot/Coerver_Kustosija-65.webp",
  },
];

const values = [
  {
    title: "Izvrsnost",
    description: "Težimo najvišim standardima u svemu što radimo",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    title: "Inovacija",
    description: "Konstantno unapređujemo metode treninga",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Predanost",
    description: "Posvećeni smo razvoju svakog pojedinca",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    title: "Zajednica",
    description: "Gradimo snažnu Coerver® obitelj",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
];

export default function ONamaPage() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 50 });

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
    <div className="bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-coerver-dark"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-55.webp"
            alt="Coerver Coaching"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/95 to-coerver-dark/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-coerver-green/15 rounded-full blur-[120px]" />

        {/* Content */}
        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-coerver-green rounded-full" />
                <span className="text-coerver-green text-sm font-semibold">O nama</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Što je Coerver<span className="text-coerver-green">®</span> Coaching?
              </h1>

              <p className="text-lg lg:text-xl text-white/60 max-w-xl mb-8">
                Globalno priznata metodologija razvoja mladih nogometaša,
                prisutna u preko 60 zemalja svijeta već više od 40 godina.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/za-igrace"
                  className="inline-flex items-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
                >
                  Programi za igrače
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/za-trenere"
                  className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors border border-white/20"
                >
                  Programi za trenere
                </Link>
              </div>
            </div>

            {/* Stats cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: "40+", label: "Godina iskustva" },
                { value: "60+", label: "Zemalja svijeta" },
                { value: "1M+", label: "Igrača globalno" },
                { value: "500+", label: "Aktivnih igrača u HR" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10"
                >
                  <div className="text-3xl font-black text-coerver-green mb-1">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-coerver-green/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="animate-on-scroll text-center">
                <div className="w-16 h-16 rounded-2xl bg-coerver-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-4xl lg:text-5xl font-black text-coerver-dark mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="animate-on-scroll relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="/images/photoshoot/Coerver_Kustosija-20.webp"
                  alt="Coerver trening"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-coerver-dark">Wiel Coerver</div>
                    <p className="text-gray-500 text-sm">Osnivač metodologije</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Naša priča</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark leading-tight mb-6">
                  Što je Coerver<span className="text-coerver-green">®</span> Coaching?
                </h2>
              </div>

              <div className="animate-on-scroll">
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Coerver® Coaching je globalno priznata metodologija razvoja mladih
                  nogometaša koju je razvio legendarni nizozemski trener{" "}
                  <strong className="text-coerver-dark">Wiel Coerver</strong>.
                </p>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Prisutni u preko <strong className="text-coerver-green">60 zemalja</strong> svijeta,
                  Coerver® metodologija je postala zlatni standard u razvoju mladih
                  igrača. U Hrvatskoj djelujemo s ciljem podizanja kvalitete
                  tehničke obuke na najvišu razinu.
                </p>
              </div>

              <div className="animate-on-scroll grid grid-cols-2 gap-4">
                {[
                  "Individualni pristup",
                  "Certificirani treneri",
                  "Dokazana metodologija",
                  "Globalna mreža",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-coerver-dark font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Naše vrijednosti</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark">
              Što nas pokreće
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="animate-on-scroll group p-8 rounded-3xl bg-gray-50 hover:bg-coerver-green transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-coerver-green/10 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors">
                  <svg className="w-7 h-7 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-coerver-dark group-hover:text-white mb-2 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-500 group-hover:text-white/80 transition-colors">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-28 bg-coerver-dark relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-coerver-green/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-coerver-green/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Naša povijest</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white">
              Put do izvrsnosti
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {historyTimeline.map((item, index) => (
              <div
                key={index}
                className="animate-on-scroll relative flex flex-col lg:flex-row gap-8 mb-12 last:mb-0"
              >
                {/* Timeline connector */}
                {index !== historyTimeline.length - 1 && (
                  <div className="hidden lg:block absolute left-[120px] top-24 w-0.5 h-full bg-gradient-to-b from-coerver-green to-transparent" />
                )}

                {/* Year */}
                <div className="lg:w-[240px] flex-shrink-0">
                  <div className="inline-flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-coerver-green flex items-center justify-center">
                      <span className="text-white font-black text-lg">{item.year}</span>
                    </div>
                    <div className="lg:hidden">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white/5 backdrop-blur rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative aspect-video md:aspect-auto">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 lg:p-8">
                    <h3 className="hidden lg:block text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pyramid System Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div>
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Coerver® sustav</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark leading-tight mb-6">
                  Piramida<br />razvoja igrača
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Progresivni sustav koji gradi tehničku izvrsnost od temelja.
                  Svaka razina nadograđuje prethodnu, stvarajući kompletnog igrača.
                </p>
              </div>

              {/* Pyramid levels */}
              <div className="space-y-3">
                {pyramidLevels.map((level, index) => (
                  <div
                    key={index}
                    className="animate-on-scroll flex items-center gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {level.level}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:bg-coerver-green/5 transition-colors">
                      <h4 className="font-bold text-coerver-dark">{level.title}</h4>
                      <p className="text-sm text-gray-500">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="animate-on-scroll relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src="/images/photoshoot/Coerver_Kustosija-25.webp"
                  alt="Coerver Training"
                  fill
                  className="object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark/60 via-transparent to-transparent rounded-3xl" />

                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-sm">Razina napretka</div>
                      <div className="text-white font-bold text-lg">6 koraka do izvrsnosti</div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-coerver-green flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll bg-coerver-dark rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left - Content */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6 w-fit">
                  <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                  <span className="text-coerver-green text-sm font-semibold">Započni danas</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                  Pridruži se Coerver® obitelji
                </h2>
                <p className="text-white/60 text-lg mb-8">
                  Bez obzira jesi li igrač koji želi unaprijediti tehniku ili trener
                  koji želi proširiti znanje, imamo program za tebe.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/za-igrace"
                    className="inline-flex items-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
                  >
                    Za igrače
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/za-trenere"
                    className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    Za trenere
                  </Link>
                </div>
              </div>

              {/* Right - Image */}
              <div className="relative min-h-[300px] lg:min-h-0">
                <Image
                  src="/images/photoshoot/Coerver_Kustosija-40.webp"
                  alt="Coerver Training"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/50 to-transparent lg:from-coerver-dark lg:via-transparent lg:to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
