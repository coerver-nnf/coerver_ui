"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const programs = [
  {
    id: "academies",
    title: "Akademije",
    subtitle: "Redovni treninzi",
    description:
      "Redovni grupni treninzi u vašem gradu. Strukturirani programi za sve dobne skupine od 7 do 14 godina.",
    href: "/za-igrace/akademije",
    image: "/images/photoshoot/Coerver_Kustosija-60.webp",
    features: ["Male grupe", "Svi gradovi"],
    color: "from-emerald-500 to-coerver-green",
  },
  {
    id: "individual",
    title: "Individualni treninzi",
    subtitle: "1-na-1 treninzi",
    description:
      "Personalizirani treninzi prilagođeni specifičnim potrebama i ciljevima svakog igrača.",
    href: "/za-igrace/individualni-treninzi",
    image: "/images/photoshoot/Coerver_Kustosija-20.webp",
    features: ["Fleksibilno", "Brži napredak", "Osobni plan"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "camps",
    title: "Kampovi",
    subtitle: "Intenzivni programi",
    description:
      "Intenzivni nogometni kampovi tijekom školskih praznika. Višednevni programi puni nogometa i zabave.",
    href: "/za-igrace/kampovi",
    image: "/images/photoshoot/Coerver_Kustosija-45.webp",
    features: ["Ljeto & Zima", "Cjelodnevno", "Prijateljstva"],
    color: "from-orange-500 to-red-500",
  },
];

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
  { value: "500+", label: "Aktivnih igrača" },
  { value: "30+", label: "Trenera" },
  { value: "98%", label: "Zadovoljstvo" },
  { value: "10+", label: "Lokacija" },
];

export default function ZaIgracePage() {
  const heroRef = useRef<HTMLElement>(null);

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
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden bg-coerver-dark"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-70.webp"
            alt="Mladi igrač u akciji"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/30" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
              <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
              <span className="text-coerver-green text-sm font-semibold">Za Igrače</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Razvij svoj
              <br />
              <span className="text-coerver-green">puni potencijal</span>
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-xl">
              Bez obzira na tvoj trenutni nivo, imamo program koji će te odvesti na
              sljedeću razinu. Pridruži se tisućama mladih nogometaša.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/za-igrace/akademije"
                className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>Prijavi se</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#programs"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
              >
                Pogledaj programe
              </Link>
            </div>
          </div>

          {/* Stats floating */}
          <div className="hidden lg:flex absolute bottom-12 right-8 gap-8">
            {stats.slice(0, 3).map((stat, index) => (
              <div key={index} className="text-right">
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-coerver-green rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Programi</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Odaberi svoj put
            </h2>
            <p className="text-lg text-gray-600">
              Tri načina za razvoj tvoje nogometne karijere - odaberi onaj koji ti najbolje odgovara.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {programs.map((program, index) => (
              <Link
                key={program.id}
                href={program.href}
                className="animate-on-scroll group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full bg-gray-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        "px-4 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r",
                        program.color
                      )}>
                        {program.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-coerver-dark mb-3 group-hover:text-coerver-green transition-colors">
                      {program.title}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      {program.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {program.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 bg-coerver-green/10 text-coerver-green text-sm font-medium rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-coerver-green font-semibold">
                      <span>Saznaj više</span>
                      <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-coerver-green/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          {/* Header */}
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Dobne skupine</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Program za <span className="text-coerver-green">svaku dob</span>
            </h2>
            <p className="text-lg text-white/60">
              Naši programi su pažljivo dizajnirani za svaku razvojnu fazu mladog nogometaša.
            </p>
          </div>

          {/* Player Pathway Image */}
          <div className="animate-on-scroll flex justify-center">
            <Image
              src="/images/Player Pathway.png"
              alt="Coerver Player Pathway - program za svaku dob"
              width={1200}
              height={600}
              className="w-full max-w-5xl h-auto"
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div>
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Što ćeš naučiti</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                  Vještine koje čine razliku
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Naši programi su dizajnirani da razviju kompletnog igrača - tehnički
                  izvrsnog, mentalno jakog i taktički svjesnog.
                </p>
              </div>

              <div className="space-y-3">
                {pyramidLevels.map((level, index) => (
                  <div
                    key={level.title}
                    className="animate-on-scroll flex items-center gap-4 group"
                    style={{ transitionDelay: `${index * 100}ms` }}
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

            {/* Image */}
            <div className="animate-on-scroll relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/photoshoot/Coerver_Kustosija-25.webp"
                  alt="Coerver trening"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark/40 via-transparent to-transparent" />
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-5 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-black text-white">98%</span>
                  </div>
                  <div>
                    <p className="font-bold text-coerver-dark text-sm">Roditelja preporučuje</p>
                    <p className="text-gray-500 text-xs">Coerver programe</p>
                  </div>
                </div>
              </div>

              {/* Second floating element */}
              <div className="absolute -top-4 -right-4 bg-coerver-green rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-sm">500+ igrača</p>
                    <p className="text-white/70 text-xs">aktivno trenira</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll bg-coerver-dark rounded-3xl overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0">
              <Image
                src="/images/photoshoot/Coerver_Kustosija-15.webp"
                alt=""
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/90 to-coerver-dark/70" />
            </div>

            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-coerver-green/20 rounded-full blur-[150px]" />

            <div className="relative grid lg:grid-cols-2 gap-12 p-10 lg:p-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                  <span className="text-coerver-green text-sm font-semibold">Besplatni probni trening</span>
                </div>

                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-6">
                  Spreman za početak?
                </h2>
                <p className="text-lg text-white/60 mb-8">
                  Prijavi se na besplatni probni trening i otkrij zašto tisuće mladih
                  nogometaša biraju Coerver. Bez obaveza.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/za-igrace/akademije"
                    className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                  >
                    <span>Prijavi se sada</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/kontakt"
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
                  >
                    Kontaktiraj nas
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                  >
                    <div className="text-4xl lg:text-5xl font-black text-coerver-green mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/50 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
