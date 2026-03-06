"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const courses = [
  {
    id: "intro",
    name: "Coerver Intro",
    description:
      "Uvodni tečaj u Coerver metodologiju. Idealan za trenere koji žele upoznati osnove.",
    duration: "1 dan (8 sati)",
    price: "150€",
    href: "/za-trenere/coerver-intro",
    level: "Početni",
    levelNum: 1,
    image: "/images/photoshoot/Coerver_Kustosija-10.webp",
  },
  {
    id: "yd1",
    name: "Youth Diploma 1",
    description:
      "Prva razina Coerver diplome. Dubinski uvid u Ball Mastery i 1v1 metodologiju.",
    duration: "2 dana (16 sati)",
    price: "350€",
    href: "/za-trenere/youth-diploma-1",
    level: "Srednji",
    levelNum: 2,
    image: "/images/photoshoot/Coerver_Kustosija-60.webp",
  },
  {
    id: "yd2",
    name: "Youth Diploma 2",
    description:
      "Napredna razina diplome. Kompletan Coerver kurikulum za sve dobne skupine.",
    duration: "2 dana (16 sati)",
    price: "450€",
    href: "/za-trenere/youth-diploma-2",
    level: "Napredni",
    levelNum: 3,
    image: "/images/photoshoot/Coerver_Kustosija-70.webp",
  },
];

const benefits = [
  {
    title: "Globalno Priznata Licenca",
    description: "Coerver certifikat prepoznat u preko 50 zemalja svijeta.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Pristup Materijalima",
    description: "Ekskluzivni video sadržaji, vježbe i planovi treninga.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    title: "Mreža Trenera",
    description: "Postani dio globalne mreže Coerver trenera.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Kontinuirani Razvoj",
    description: "Pristup godišnjim konferencijama i radionicama.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

const testimonials = [
  {
    name: "Tomislav Matić",
    role: "Trener NK Osijek U15",
    content:
      "Coerver diploma je promijenila način na koji pristupam treningu. Moji igrači su napredovali brže nego ikad.",
    image: "/images/photoshoot/Coerver_Kustosija-25.webp",
  },
  {
    name: "Ana Bašić",
    role: "Trenerica NK Hajduk U12",
    content:
      "Strukturirani pristup Ball Masteryju dao mi je alate koje koristim svakodnevno. Nezamjenjivo iskustvo.",
    image: "/images/photoshoot/Coerver_Kustosija-45.webp",
  },
];

const stats = [
  { value: "30,000+", label: "Certificiranih trenera" },
  { value: "50+", label: "Zemalja svijeta" },
  { value: "40+", label: "Godina tradicije" },
];

export default function ZaTrenerePage() {
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
      <section className="relative min-h-[90vh] flex items-center bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Coerver_Kustosija-45.webp"
            alt="Coerver trener"
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
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
              <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
              <span className="text-coerver-green text-sm font-semibold">Za Trenere</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Postani
              <br />
              <span className="text-coerver-green">Coerver</span> Trener
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-xl">
              Stekni globalno priznatu Coerver licencu i podigne svoje trenerske
              vještine na novu razinu. Pridruži se mreži od preko 30,000 certificiranih
              Coerver trenera diljem svijeta.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#courses"
                className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>Pogledaj tečajeve</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="#benefits"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
              >
                Zašto Coerver?
              </a>
            </div>
          </div>

          {/* Floating stats */}
          <div className="hidden lg:flex absolute bottom-12 right-8 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-right">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diploma Path */}
      <section id="courses" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Put do diplome</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Coerver Diploma Pathway
            </h2>
            <p className="text-lg text-gray-600">
              Progresivan sustav edukacije koji te vodi od osnova do ekspertize u
              Coerver metodologiji.
            </p>
          </div>

          {/* Path Timeline */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <div className="hidden lg:block absolute top-1/2 left-0 h-1 bg-coerver-green -translate-y-1/2 z-0" style={{ width: '33%' }} />

            <div className="grid lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="animate-on-scroll relative"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Step Number */}
                  <div className="hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-coerver-green rounded-full items-center justify-center text-coerver-green font-bold z-10 shadow-lg">
                    {index + 1}
                  </div>

                  <Link href={course.href} className="group block mt-8">
                    <div className="bg-gray-50 hover:bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={course.image}
                          alt={course.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="px-4 py-2 bg-coerver-green text-white text-sm font-bold rounded-full">
                            {course.level}
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className="text-white font-bold text-lg">{course.price}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-black text-coerver-dark mb-2 group-hover:text-coerver-green transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration}
                        </div>

                        <div className="flex items-center gap-2 text-coerver-green font-semibold group-hover:gap-3 transition-all">
                          <span>Saznaj više</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-coerver-green/5 rounded-full blur-[120px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Prednosti</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Zašto postati <span className="text-coerver-green">Coerver</span> trener?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="animate-on-scroll group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-coerver-green transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-white/60 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Courses Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Naši tečajevi</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Odaberi svoj tečaj
            </h2>
          </div>

          <div className="space-y-8 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className={cn(
                  "animate-on-scroll grid lg:grid-cols-2 gap-8 items-center",
                  index % 2 === 1 && "lg:grid-flow-dense"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={cn(index % 2 === 1 && "lg:col-start-2")}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-coerver-green flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{course.levelNum}</span>
                    </div>
                    <span className="px-4 py-2 bg-coerver-green/10 text-coerver-green text-sm font-bold rounded-full">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-coerver-dark mb-4">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{course.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Trajanje</div>
                      <div className="font-bold text-coerver-dark">{course.duration}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cijena</div>
                      <div className="font-bold text-coerver-green text-xl">{course.price}</div>
                    </div>
                  </div>

                  <Link
                    href={course.href}
                    className="inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                  >
                    <span>Prijavi se</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>

                <div className={cn(
                  "relative aspect-video rounded-3xl overflow-hidden",
                  index % 2 === 1 && "lg:col-start-1 lg:row-start-1"
                )}>
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Iskustva</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Što kažu naši treneri?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="animate-on-scroll bg-gray-50 rounded-3xl p-8"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-lg mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
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

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-coerver-green relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <div className="animate-on-scroll max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Spreman za sljedeći korak?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Pridruži se mreži certificiranih Coerver trenera i transformiraj način
              na koji treniraš mlade igrače.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/za-trenere/coerver-intro"
                className="group inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-coerver-green font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>Započni s Intro tečajem</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/30"
              >
                Kontaktiraj nas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
