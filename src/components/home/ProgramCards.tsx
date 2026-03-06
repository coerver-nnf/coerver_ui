"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Program {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const programs: Program[] = [
  {
    id: "ball-mastery",
    title: "Ball Mastery",
    description:
      "Razvij vrhunsku kontrolu lopte kroz strukturirane vježbe koje grade samopouzdanje i tehničku izvrsnost.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
    color: "from-coerver-green to-coerver-green-light",
    href: "/za-igrace/akademije",
  },
  {
    id: "1v1-moves",
    title: "1v1 Potezi",
    description:
      "Nauči najučinkovitije driblinške poteze za nadmudriti bilo kojeg braniča u jedan-na-jedan situacijama.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    color: "from-blue-500 to-blue-600",
    href: "/za-igrace/akademije",
  },
  {
    id: "speed",
    title: "Brzina & Agilnost",
    description:
      "Poboljšaj svoju brzinu, agilnost i eksplozivnost kroz nogometno-specifične vježbe.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    ),
    color: "from-orange-500 to-red-500",
    href: "/za-igrace/akademije",
  },
  {
    id: "finishing",
    title: "Završnica",
    description:
      "Savladaj umijeće postizanja golova kroz raznolike tehničke vježbe završnice.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "from-purple-500 to-pink-500",
    href: "/za-igrace/akademije",
  },
  {
    id: "receiving",
    title: "Primanje & Okretanje",
    description:
      "Nauči kako učinkovito primiti loptu i okrenuti se prema golu u bilo kojoj situaciji.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    color: "from-teal-500 to-cyan-500",
    href: "/za-igrace/akademije",
  },
  {
    id: "passing",
    title: "Dodavanje",
    description:
      "Razvij preciznost i viziju dodavanja za kreiranje prilika svojoj ekipi.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    color: "from-indigo-500 to-purple-500",
    href: "/za-igrace/akademije",
  },
];

export function ProgramCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".program-card");

    gsap.set(cards, { opacity: 0, y: 60 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.to(cards, {
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

  return (
    <section ref={sectionRef} className="section-padding bg-coerver-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-coerver-green font-semibold text-sm uppercase tracking-wider">
            Coerver Metodologija
          </span>
          <h2 className="mt-4 text-coerver-dark">
            Programi Treninga
          </h2>
          <p className="mt-4 text-coerver-gray-600 text-lg">
            Naša provjerena metodologija razvija tehničke vještine kroz strukturirane
            programe prilagođene svakoj dobnoj skupini.
          </p>
        </div>

        {/* Program Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {programs.map((program) => (
            <Card
              key={program.id}
              className="program-card group"
              hover
              padding="none"
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {program.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-coerver-dark mb-3">
                  {program.title}
                </h3>
                <p className="text-coerver-gray-600 mb-6">{program.description}</p>

                {/* Link */}
                <Link
                  href={program.href}
                  className="inline-flex items-center text-coerver-green font-semibold group-hover:gap-3 gap-2 transition-all"
                >
                  Saznaj više
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/za-igrace/akademije">
            <Button size="lg" variant="primary">
              Pogledaj Sve Programe
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Audience Cards Component
interface AudienceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  features: string[];
}

const audienceCards: AudienceCard[] = [
  {
    id: "players",
    title: "Za Igrače",
    description:
      "Akademije, individualni treninzi i kampovi za mlade nogometaše svih razina.",
    image: "/images/players.jpg",
    href: "/za-igrace",
    features: ["Akademije", "Kampovi", "1-na-1 treninzi"],
  },
  {
    id: "coaches",
    title: "Za Trenere",
    description:
      "Postani certificirani Coerver trener kroz naš program edukacije i diploma.",
    image: "/images/coaches.jpg",
    href: "/za-trenere",
    features: ["Coerver Intro", "Youth Diploma 1", "Youth Diploma 2"],
  },
  {
    id: "clubs",
    title: "Za Klubove",
    description:
      "Partnerski programi za klubove koji žele implementirati Coerver metodologiju.",
    image: "/images/clubs.jpg",
    href: "/klubovi",
    features: ["Partnerstva", "Edukacija", "Programi"],
  },
];

export function AudienceCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".audience-card");

    gsap.set(cards, { opacity: 0, y: 80 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-coerver-green font-semibold text-sm uppercase tracking-wider">
            Odaberi Svoj Put
          </span>
          <h2 className="mt-4 text-coerver-dark">
            Za Koga Je Coerver?
          </h2>
          <p className="mt-4 text-coerver-gray-600 text-lg">
            Bilo da si igrač, trener ili klub, imamo program prilagođen tvojim potrebama.
          </p>
        </div>

        {/* Audience Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {audienceCards.map((card) => (
            <Link key={card.id} href={card.href} className="audience-card group">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                {/* Background placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-coerver-dark to-coerver-gray-800" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-coerver-green-light transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-white/80 mb-4">{card.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {card.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-coerver-green font-semibold group-hover:gap-4 transition-all">
                    Saznaj više
                    <svg
                      className="w-5 h-5 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
