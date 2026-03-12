"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RegionMap } from "./RegionMap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: "40+", label: "Godina Iskustva", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "60+", label: "Zemalja Svijeta", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "1M+", label: "Igrača Globalno", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
];

const features = [
  {
    title: "Za Igrače",
    description: "Individualni i grupni treninzi za sve uzraste",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    href: "/za-igrace",
  },
  {
    title: "Za Trenere",
    description: "Edukacija i certifikacija trenera",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    href: "/za-trenere",
  },
  {
    title: "Za Klubove",
    description: "Partnerstva i programi za klubove",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    href: "/za-klubove",
  },
];

const trustedBy = [
  { name: "Dinamo Zagreb", logo: "/images/clubs/Dinamov-grb.png" },
  { name: "FC Lugano", logo: "/images/clubs/FC-Lugano-new-1.png" },
  { name: "NK Olimpija Ljubljana", logo: "/images/clubs/NK_Olimpija_Ljubljana.png" },
  { name: "NK Rudeš", logo: "/images/clubs/NK-RUDES.png" },
  { name: "NK Triglav Kranj", logo: "/images/clubs/NK-Triglav-Kranj.png" },
  { name: "NK Zelina", logo: "/images/clubs/NK-Zelina.png" },
  { name: "Novi Marof", logo: "/images/clubs/Novi-Marof-png.png" },
  { name: "ŠN Maksimir", logo: "/images/clubs/SN-Maksimir.jpg" },
];

export function WhatIsCoerver() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll(".animate-on-scroll");

    gsap.set(elements, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
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

  // Animate stats counting
  useEffect(() => {
    if (!statsRef.current) return;

    const statValues = statsRef.current.querySelectorAll(".stat-value");

    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 85%",
      onEnter: () => {
        statValues.forEach((el) => {
          const target = el.getAttribute("data-value") || "0";
          const numericValue = parseInt(target.replace(/\D/g, ""));
          const suffix = target.replace(/[0-9]/g, "");

          gsap.fromTo(
            el,
            { innerText: "0" },
            {
              innerText: numericValue,
              duration: 2,
              ease: "power2.out",
              snap: { innerText: 1 },
              onUpdate: function () {
                el.textContent = Math.floor(parseFloat(el.textContent || "0")) + suffix;
              },
            }
          );
        });
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coerver-green/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-dark/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          {/* World's No.1 Badge */}
          <div className="animate-on-scroll flex justify-center mb-6">
            <Image
              src="/images/logo-variations/Worlds No1 Black (2).svg"
              alt="World's No.1 Soccer Skills Teaching Method"
              width={180}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="animate-on-scroll inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-coerver-green rounded-full" />
            <span className="text-coerver-green text-sm font-semibold">Globalna metoda #1</span>
          </div>
          <h2 className="animate-on-scroll text-4xl lg:text-5xl xl:text-6xl font-black text-coerver-dark leading-tight">
            Što je Coerver<span className="text-coerver-green">®</span> Coaching?
          </h2>
          <p className="animate-on-scroll mt-6 text-lg lg:text-xl text-gray-500 leading-relaxed">
            Globalna nogometna edukacijska tvrtka koja je razvila svjetsku metodu broj 1
            za učenje nogometnih vještina.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
          {/* Left - Image with overlay */}
          <div className="animate-on-scroll relative group">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/training/training-06.webp"
                alt="Coerver Training"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark/80 via-coerver-dark/20 to-transparent" />

              {/* Floating stats */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20">
                  <div className="text-3xl font-black text-white">40+</div>
                  <div className="text-white/70 text-sm">Godina</div>
                </div>
                <div className="bg-coerver-green rounded-2xl px-5 py-4">
                  <div className="text-3xl font-black text-white">60+</div>
                  <div className="text-white/80 text-sm">Zemalja</div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-coerver-green/20 rounded-2xl -z-10" />
          </div>

          {/* Right - Content */}
          <div className="animate-on-scroll">
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-6">
              <span className="text-coerver-green font-bold">Coerver® Coaching</span> je danas prisutna
              u preko <span className="font-semibold text-coerver-dark">60 zemalja</span> na svim
              kontinentima, a koriste ju neke od najpoznatijih nogometnih akademija i saveza.
            </p>

            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Arsenal, Bayern München, Benfica, Dinamo Zagreb, francuski nogometni savez,
              japanski nogometni savez – samo su neke od organizacija koje koriste našu metodologiju.
            </p>

            {/* Feature cards */}
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-coerver-green transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-coerver-green/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-6 h-6 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-coerver-dark group-hover:text-white transition-colors">{feature.title}</h4>
                    <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">{feature.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="animate-on-scroll bg-coerver-dark rounded-3xl p-8 lg:p-12 mb-20 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-coerver-green rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-coerver-green rounded-full blur-[80px]" />
          </div>

          {/* Since 1984 Badge */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 hidden md:block">
            <Image
              src="/images/logo-variations/SINCE 1984 BLACK.png"
              alt="Coerver Coaching Since 1984"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-coerver-green transition-colors duration-300">
                  <svg className="w-8 h-8 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div
                  className="stat-value text-5xl lg:text-6xl font-black text-white mb-2"
                  data-value={stat.value}
                >
                  {stat.value}
                </div>
                <p className="text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="animate-on-scroll mb-20">
          <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-wider mb-8">
            Klubovi koji nam vjeruju
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {trustedBy.map((partner, index) => (
              <div
                key={index}
                className="w-14 h-14 lg:w-16 lg:h-16 relative grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
                title={partner.name}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Map Section */}
        <div className="animate-on-scroll">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {/* Left Content */}
            <div className="lg:w-[40%] bg-coerver-green rounded-3xl lg:rounded-r-none p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white text-sm font-semibold">Regionalna mreža</span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                  Prisutni<br />u regiji
                </h3>
                <p className="text-white/80 text-lg mb-8">
                  Naši certificirani treneri provode programe diljem tri zemlje regije.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { country: "Hrvatska", flag: "🇭🇷" },
                    { country: "Slovenija", flag: "🇸🇮" },
                    { country: "BiH", flag: "🇧🇦" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                      <span className="text-2xl">{item.flag}</span>
                      <span className="font-semibold text-white">{item.country}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 bg-white text-coerver-green font-bold px-6 py-3 rounded-full hover:bg-white/90 transition-all group"
                >
                  Pronađi program
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Map */}
            <div className="lg:w-[60%] min-h-[400px] lg:min-h-[550px] mt-4 lg:mt-0">
              <RegionMap />
            </div>
          </div>
        </div>
      </div>

      {/* Moving Text Rows */}
      <div className="overflow-hidden mt-20 lg:mt-24">
        {/* Row 1 - Left to Right */}
        <div className="overflow-hidden mb-2">
          <div className="animate-marquee-right flex whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 lg:gap-12 px-4">
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-gray-100 uppercase tracking-tight">Ball Mastery</span>
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-transparent uppercase tracking-tight" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.1)' }}>1v1 Potezi</span>
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-gray-100 uppercase tracking-tight">Završnica</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden">
          <div className="animate-marquee-left flex whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 lg:gap-12 px-4">
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-transparent uppercase tracking-tight" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.1)' }}>Primanje</span>
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-gray-100 uppercase tracking-tight">Dodavanje</span>
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-transparent uppercase tracking-tight" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.1)' }}>Brzina</span>
                <span className="text-5xl lg:text-7xl xl:text-8xl font-black text-gray-100 uppercase tracking-tight">Grupni Napad</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
