"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const programs = [
  {
    id: "academies",
    href: "/za-igrace/akademije",
    image: "/images/training/training-01.webp",
    featureCount: 2,
    color: "from-emerald-500 to-coerver-green",
  },
  {
    id: "individual",
    href: "/za-igrace/individualni-treninzi",
    image: "/images/training/training-06.webp",
    featureCount: 3,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "camps",
    href: "/za-igrace/kampovi",
    image: "/images/training/training-09.webp",
    featureCount: 3,
    color: "from-orange-500 to-red-500",
  },
];

const pyramidColors = [
  "from-emerald-500 to-emerald-600",
  "from-coerver-green to-emerald-500",
  "from-green-600 to-coerver-green",
  "from-lime-500 to-green-500",
  "from-yellow-500 to-lime-500",
  "from-amber-500 to-yellow-500",
];

const statValues = ["500+", "30+", "98%", "10+"];

export default function ZaIgracePage() {
  const t = useTranslations("players.index");
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
            src="/images/training/training-13.webp"
            alt={t("heroAlt")}
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
              <span className="text-coerver-green text-sm font-semibold">{t("badge")}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              {t("heroTitle1")}
              <br />
              <span className="text-coerver-green">{t("heroTitle2")}</span>
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-xl">
              {t("heroText")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/za-igrace/akademije"
                className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>{t("signUp")}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a
                href="#programs"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
              >
                {t("viewPrograms")}
              </a>
            </div>
          </div>

          {/* Stats floating */}
          <div className="hidden lg:flex absolute bottom-12 right-8 gap-8">
            {statValues.slice(0, 3).map((value, index) => (
              <div key={index} className="text-right">
                <div className="text-4xl font-black text-white">{value}</div>
                <div className="text-white/50 text-sm">{t(`stats.${index}`)}</div>
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
              <span className="text-coerver-green text-sm font-semibold">{t("programs.badge")}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              {t("programs.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("programs.text")}
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
                      alt={t(`programs.${index}.title`)}
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
                        {t(`programs.${index}.subtitle`)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-coerver-dark mb-3 group-hover:text-coerver-green transition-colors">
                      {t(`programs.${index}.title`)}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      {t(`programs.${index}.description`)}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Array.from({ length: program.featureCount }, (_, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-coerver-green/10 text-coerver-green text-sm font-medium rounded-full"
                        >
                          {t(`programs.${index}.features.${i}`)}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-coerver-green font-semibold">
                      <span>{t("programs.learnMore")}</span>
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
              <span className="text-coerver-green text-sm font-semibold">{t("ageGroups.badge")}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              {t("ageGroups.title1")} <span className="text-coerver-green">{t("ageGroups.title2")}</span>
            </h2>
            <p className="text-lg text-white/60">
              {t("ageGroups.text")}
            </p>
          </div>

          {/* Player Pathway Image */}
          <div className="animate-on-scroll flex justify-center">
            <Image
              src="/images/Player Pathway.png"
              alt={t("ageGroups.imageAlt")}
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
                  <span className="text-coerver-green text-sm font-semibold">{t("skills.badge")}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                  {t("skills.title")}
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  {t("skills.text")}
                </p>
              </div>

              <div className="space-y-3">
                {pyramidColors.map((color, index) => (
                  <div
                    key={index}
                    className="animate-on-scroll flex items-center gap-4 group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:bg-coerver-green/5 transition-colors">
                      <h4 className="font-bold text-coerver-dark">{t(`pyramid.${index}.title`)}</h4>
                      <p className="text-sm text-gray-500">{t(`pyramid.${index}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="animate-on-scroll relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/training/training-05.webp"
                  alt={t("skills.imageAlt")}
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
                    <p className="font-bold text-coerver-dark text-sm">{t("skills.recommend1")}</p>
                    <p className="text-gray-500 text-xs">{t("skills.recommend2")}</p>
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
                    <p className="font-bold text-sm">{t("skills.players1")}</p>
                    <p className="text-white/70 text-xs">{t("skills.players2")}</p>
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
                src="/images/training/training-08.webp"
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
                  <span className="text-coerver-green text-sm font-semibold">{t("cta.badge")}</span>
                </div>

                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-6">
                  {t("cta.title")}
                </h2>
                <p className="text-lg text-white/60 mb-8">
                  {t("cta.text")}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/za-igrace/akademije"
                    className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                  >
                    <span>{t("cta.signUpNow")}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/kontakt"
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
                  >
                    {t("cta.contactUs")}
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {statValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
                  >
                    <div className="text-4xl lg:text-5xl font-black text-coerver-green mb-2">
                      {value}
                    </div>
                    <div className="text-white/50 text-sm">{t(`stats.${index}`)}</div>
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
