"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const partnershipTypes = [
  {
    title: "Coerver Partner Klub",
    description:
      "Osnovni partnerski paket za klubove koji žele uvesti Coerver metodologiju.",
    features: [
      "Edukacija trenera (Intro tečaj)",
      "Pristup osnovnim materijalima",
      "Coerver badge za korištenje",
      "Godišnja evaluacija",
    ],
    price: "od 2.000€",
    period: "godišnje",
    level: 1,
  },
  {
    title: "Coerver Premium Partner",
    description:
      "Napredni partnerski program s kompletnom implementacijom metodologije.",
    features: [
      "Edukacija svih trenera (YD1)",
      "Puni pristup platformi",
      "Kvartalni supervizijski posjeti",
      "Coerver oprema za akademiju",
      "Marketing podrška",
    ],
    price: "od 5.000€",
    period: "godišnje",
    highlighted: true,
    level: 2,
  },
  {
    title: "Coerver Elite Partner",
    description:
      "Ekskluzivni partnerski status za vodeće klubove s najvišim standardima.",
    features: [
      "Certifikacija svih trenera (YD1 + YD2)",
      "Ekskluzivni regionalni status",
      "Mjesečni supervizijski posjeti",
      "Kompletna Coerver infrastruktura",
      "Pristup međunarodnoj mreži",
      "Sudjelovanje na globalnim događajima",
    ],
    price: "Po dogovoru",
    period: "",
    level: 3,
  },
];

const benefits = [
  {
    title: "Provjerena Metodologija",
    description: "40+ godina razvoja i unapređivanja tehničkog treninga.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Strukturirani Kurikulum",
    description: "Jasna progresija za sve dobne skupine i razine.",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    title: "Kontinuirana Podrška",
    description: "Stručna podrška i redovite evaluacije napretka.",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    title: "Globalno Priznanje",
    description: "Pridružite se mreži od 3000+ partnerskih klubova.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Pristup Coerver Croatia Platformi",
    description: "Ekskluzivan pristup digitalnoj platformi s vježbama i materijalima.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
];

const currentPartners = [
  { name: "GNK Dinamo Zagreb", type: "Elite Partner", image: "/images/clubs/Dinamov-grb.png" },
  { name: "NK Olimpija Ljubljana", type: "Premium Partner", image: "/images/clubs/NK_Olimpija_Ljubljana.png" },
  { name: "FC Lugano", type: "Premium Partner", image: "/images/clubs/FC-Lugano-new-1.png" },
  { name: "NK Rudeš", type: "Partner Klub", image: "/images/clubs/NK-RUDES.png" },
  { name: "NK Triglav Kranj", type: "Partner Klub", image: "/images/clubs/NK-Triglav-Kranj.png" },
  { name: "NK Zelina", type: "Partner Klub", image: "/images/clubs/NK-Zelina.png" },
  { name: "NK Novi Marof", type: "Partner Klub", image: "/images/clubs/Novi-Marof-png.png" },
  { name: "ŠN Maksimir", type: "Partner Klub", image: "/images/clubs/SN-Maksimir.jpg" },
];

const testimonials = [
  {
    quote:
      "Coerver partnerstvo je transformiralo našu omladinsku školu. Naši igrači su tehnički superiorniji od konkurencije.",
    author: "Marko Babić",
    role: "Direktor omladinske škole, NK Dinamo Zagreb",
    image: "/images/photoshoot/Coerver_Kustosija-25.webp",
  },
  {
    quote:
      "Strukturirani pristup i kvalitetni materijali su olakšali rad našim trenerima i podigli kvalitetu treninga.",
    author: "Ivan Leko",
    role: "Sportski direktor, NK Hajduk Split",
    image: "/images/photoshoot/Coerver_Kustosija-60.webp",
  },
];

const processSteps = [
  {
    step: "1",
    title: "Inicijalni razgovor",
    description: "Upoznajemo se s vašim klubom i potrebama.",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    step: "2",
    title: "Procjena i prijedlog",
    description: "Analiziramo situaciju i predlažemo optimalni model.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    step: "3",
    title: "Edukacija trenera",
    description: "Vaši treneri prolaze Coerver certifikaciju.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    step: "4",
    title: "Implementacija",
    description: "Kontinuirana podrška i praćenje napretka.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const stats = [
  { value: "1,000+", label: "Partnerskih klubova" },
  { value: "60+", label: "Zemalja" },
  { value: "40+", label: "Godina iskustva" },
];

export default function KluboviPage() {
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
            src="/images/photoshoot/Coerver_Kustosija-60.webp"
            alt="Profesionalni trening"
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
              <span className="text-coerver-green text-sm font-semibold">Za Klubove</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              Partnerski
              <br />
              <span className="text-coerver-green">Programi</span>
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-xl">
              Pridružite se mreži od preko 1000 partnerskih klubova diljem svijeta.
              Implementirajte provjerenu Coerver metodologiju u vašu omladinsku školu.
            </p>

            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
            >
              <span>Zatražite ponudu</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
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

      {/* Benefits */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Zašto Coerver?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Prednosti partnerstva
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="animate-on-scroll group bg-gray-50 hover:bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-coerver-green/10 flex items-center justify-center mb-6 group-hover:bg-coerver-green group-hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-coerver-dark mb-3 group-hover:text-coerver-green transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types - commented out for now
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-coerver-green/5 rounded-full blur-[120px]" />
        </div>

        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Partnerski programi</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Odaberite pravi program
            </h2>
            <p className="text-lg text-white/60">
              Tri razine partnerstva prilagođene potrebama i ambicijama vašeg kluba.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {partnershipTypes.map((type, index) => (
              <div
                key={type.title}
                className={cn(
                  "animate-on-scroll relative rounded-3xl overflow-hidden transition-all duration-300",
                  type.highlighted
                    ? "bg-coerver-green ring-4 ring-coerver-green/30"
                    : "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {type.highlighted && (
                  <div className="absolute -top-px left-0 right-0 h-1 bg-white" />
                )}

                <div className="p-8">
                  {type.highlighted && (
                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-4">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-semibold">Najpopularnije</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      type.highlighted ? "bg-white/20" : "bg-coerver-green/20"
                    )}>
                      <span className={cn(
                        "font-bold text-xl",
                        type.highlighted ? "text-white" : "text-coerver-green"
                      )}>
                        {type.level}
                      </span>
                    </div>
                    <h3 className={cn(
                      "text-xl font-bold",
                      type.highlighted ? "text-white" : "text-white"
                    )}>
                      {type.title}
                    </h3>
                  </div>

                  <p className={cn(
                    "text-sm mb-6",
                    type.highlighted ? "text-white/80" : "text-white/60"
                  )}>
                    {type.description}
                  </p>

                  <div className="mb-6">
                    <span className={cn(
                      "text-3xl font-black",
                      type.highlighted ? "text-white" : "text-coerver-green"
                    )}>
                      {type.price}
                    </span>
                    {type.period && (
                      <span className={cn(
                        "text-sm ml-2",
                        type.highlighted ? "text-white/60" : "text-white/40"
                      )}>
                        {type.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          type.highlighted ? "bg-white/20" : "bg-coerver-green/20"
                        )}>
                          <svg className={cn(
                            "w-3 h-3",
                            type.highlighted ? "text-white" : "text-coerver-green"
                          )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={cn(
                          "text-sm",
                          type.highlighted ? "text-white/90" : "text-white/70"
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={cn(
                      "block w-full py-4 px-6 text-center font-semibold rounded-full transition-all duration-300",
                      type.highlighted
                        ? "bg-white text-coerver-green hover:bg-gray-100"
                        : "bg-coerver-green text-white hover:bg-coerver-green/90"
                    )}
                  >
                    Saznaj više
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Current Partners */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Naši partneri</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Klubovi koji nam vjeruju
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {currentPartners.map((partner, index) => (
              <div
                key={partner.name}
                className="animate-on-scroll group bg-white rounded-3xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="font-bold text-coerver-dark text-sm mb-1">
                  {partner.name}
                </div>
                <div className="text-xs text-coerver-green font-medium">{partner.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Proces</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Kako postati partner?
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connection line */}
            <div className="hidden md:block absolute top-20 left-[12%] right-[12%] h-1 bg-coerver-green/20" />

            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((item, index) => (
                <div
                  key={item.step}
                  className="animate-on-scroll relative text-center"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative z-10 w-16 h-16 mx-auto bg-coerver-green rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-coerver-green/30">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-coerver-green font-bold text-sm border-4 border-coerver-green z-20">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-coerver-dark text-lg mb-2 mt-4">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Iskustva</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Što kažu naši partneri?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className="animate-on-scroll bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.author}</div>
                    <div className="text-white/50 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 lg:py-32 bg-coerver-green relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <div className="animate-on-scroll text-white">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Kontaktirajte nas
              </h2>
              <p className="text-xl text-white/80 mb-10">
                Zainteresirani za partnerstvo? Ispunite obrazac i naš tim će vas
                kontaktirati s prilagođenom ponudom.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Email</div>
                    <div className="text-white font-medium">info@coervercroatia.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Telefon</div>
                    <div className="text-white font-medium">+385 98 1873 228</div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-10 pt-10 border-t border-white/20">
                <div className="text-white/60 text-sm mb-4">Pridružite se vodećim klubovima</div>
                <div className="flex flex-wrap gap-4">
                  {["1000+ partnera", "60+ zemalja", "40+ godina"].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="club" title="Zatražite ponudu" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
