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

const benefits = [
  {
    title: "Personalizirani Program",
    description: "Svaki trening je dizajniran specifično za tvoje potrebe i ciljeve.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    title: "Fleksibilan Raspored",
    description: "Ti biraš vrijeme i mjesto treninga koje ti najbolje odgovara.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Brži Napredak",
    description: "100% fokus trenera na tebe znači brže usvajanje novih vještina.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    title: "Video Analiza",
    description: "Snimanje i analiza tvojih treninga za dodatnu povratnu informaciju.",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
];

const coaches = [
  {
    name: "Ivan Perić",
    title: "Coerver Master Coach",
    specialization: "Ball Mastery, 1v1",
    experience: "15+ godina",
  },
  {
    name: "Marko Horvat",
    title: "Coerver Youth Coach",
    specialization: "Brzina, Agilnost",
    experience: "10+ godina",
  },
  {
    name: "Ana Kovačević",
    title: "Coerver Youth Coach",
    specialization: "Tehnika, Završnica",
    experience: "8+ godina",
  },
];

const steps = [
  { step: "1", title: "Kontaktiraj Nas", description: "Pošalji upit s informacijama o igraču i ciljevima." },
  { step: "2", title: "Procjena", description: "Početni sastanak za procjenu razine i definiranje plana." },
  { step: "3", title: "Dogovor Termina", description: "Odaberi termine koji ti odgovaraju." },
  { step: "4", title: "Započni Treninge", description: "Kreni s treninzima i prati svoj napredak." },
];

const pricing = [
  {
    name: "Pojedinačni",
    price: "50",
    period: "trening",
    features: ["60 min trajanje", "1-na-1 s trenerom", "Video snimka"],
  },
  {
    name: "Paket 5",
    price: "225",
    period: "5 treninga",
    features: ["Ušteda 25€", "Fleksibilna valjanost", "Video analiza"],
    highlighted: true,
    badge: "Najpopularnije",
  },
  {
    name: "Paket 10",
    price: "400",
    period: "10 treninga",
    features: ["Ušteda 100€", "Prioritet termina", "Mjesečni izvještaj"],
  },
];

export default function IndividualniTreninziPage() {
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
            src="/images/photoshoot/Coerver_Kustosija-20.jpg"
            alt="Individualni trening"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/30" />
        </div>

        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-coerver-green/30">
              <Link href="/za-igrace" className="text-white/60 hover:text-white text-sm">Za Igrače</Link>
              <span className="text-white/40">/</span>
              <span className="text-coerver-green text-sm font-semibold">Individualni treninzi</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
              1-na-1
              <br />
              <span className="text-coerver-green">Treninzi</span>
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-xl">
              Maksimalna pažnja, maksimalni rezultati. Personalizirani treninzi
              prilagođeni tvojim ciljevima i potrebama.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#prijava"
                className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                <span>Rezerviraj termin</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Prednosti</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Zašto individualni trening?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="animate-on-scroll group bg-gray-50 hover:bg-coerver-green rounded-3xl p-8 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-coerver-green/10 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors">
                  <svg className="w-7 h-7 text-coerver-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-coerver-dark group-hover:text-white mb-2 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/80 transition-colors">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Naši treneri</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Certificirani stručnjaci
            </h2>
            <p className="text-lg text-gray-600">
              Svi naši treneri su prošli rigoroznu Coerver edukaciju i imaju
              bogato iskustvo u radu s mladim igračima.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {coaches.map((coach, index) => (
              <div
                key={coach.name}
                className="animate-on-scroll bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-coerver-green to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-black mb-6">
                  {coach.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-coerver-dark mb-1">
                  {coach.name}
                </h3>
                <p className="text-coerver-green font-medium text-sm mb-4">
                  {coach.title}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <span className="font-medium">Specijalizacija:</span>
                    {coach.specialization}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <span className="font-medium">Iskustvo:</span>
                    {coach.experience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Kako funkcionira</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              4 jednostavna koraka
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="animate-on-scroll relative text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-coerver-green to-transparent" />
                )}

                <div className="w-20 h-20 mx-auto bg-coerver-green rounded-full flex items-center justify-center text-white text-3xl font-black mb-6">
                  {item.step}
                </div>
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-white/50 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Cijene</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Investiraj u svoj razvoj
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                    <li key={feature} className="flex items-center justify-center gap-3">
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
                  Rezerviraj
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="prijava" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Rezervacija</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Rezerviraj svoj termin
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Ispuni obrazac s osnovnim informacijama i javit ćemo ti se u
                roku 24 sata s dostupnim terminima.
              </p>

              <div className="bg-gray-50 rounded-3xl p-8">
                <h4 className="font-bold text-coerver-dark mb-6">Što trebamo znati:</h4>
                <ul className="space-y-4">
                  {[
                    "Dob i trenutna razina igrača",
                    "Ciljevi i područja za poboljšanje",
                    "Preferirana lokacija i termini",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="individual" title="Pošalji upit" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
