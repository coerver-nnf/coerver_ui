"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Partner {
  id: string;
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { id: "1", name: "Dinamo Zagreb", logo: "/images/clubs/Dinamov-grb.png" },
  { id: "2", name: "FC Lugano", logo: "/images/clubs/FC-Lugano-new-1.png" },
  { id: "3", name: "NK Olimpija Ljubljana", logo: "/images/clubs/NK_Olimpija_Ljubljana.png" },
  { id: "4", name: "NK Rudeš", logo: "/images/clubs/NK-RUDES.png" },
  { id: "5", name: "NK Triglav Kranj", logo: "/images/clubs/NK-Triglav-Kranj.png" },
  { id: "6", name: "NK Zelina", logo: "/images/clubs/NK-Zelina.png" },
  { id: "7", name: "Novi Marof", logo: "/images/clubs/Novi-Marof-png.png" },
  { id: "8", name: "ŠN Maksimir", logo: "/images/clubs/SN-Maksimir.jpg" },
];

export function PartnersGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !logosRef.current) return;

    const logos = logosRef.current.querySelectorAll(".partner-logo");

    gsap.set(logos, { opacity: 0, scale: 0.8 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to(logos, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-coerver-green font-semibold text-sm uppercase tracking-wider">
            Naši Partneri
          </span>
          <h3 className="mt-2 text-2xl lg:text-3xl font-bold text-coerver-dark">
            Klubovi s Kojima Surađujemo
          </h3>
        </div>

        {/* Partner Logos Grid */}
        <div
          ref={logosRef}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 lg:gap-6 items-center"
        >
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="partner-logo flex items-center justify-center p-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-coerver-gray-600 mb-4">
            Želite postati partner? Kontaktirajte nas!
          </p>
          <a
            href="/klubovi"
            className="inline-flex items-center gap-2 text-coerver-green font-semibold hover:gap-3 transition-all"
          >
            Saznajte više o partnerstvu
            <svg
              className="w-5 h-5"
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
          </a>
        </div>
      </div>
    </section>
  );
}
