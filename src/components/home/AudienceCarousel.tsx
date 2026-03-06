"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AudienceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const audienceCards: AudienceCard[] = [
  {
    id: "players",
    title: "IGRAČI",
    description:
      "Coerver® Coaching Performance Akademije namijenjene su igračima od 7 do 14 godina starosti koji već treniraju u klubovima, a žele poboljšati svoju izvedbu dodatno trenirajući po jedinstvenoj Coerver® metodi.",
    image: "/images/photoshoot/Miami-128.png",
    href: "/za-igrace",
  },
  {
    id: "coaches",
    title: "TRENERI",
    description:
      "Cilj Coerver® edukacija je pružiti trenerima teoretski i praktični pregled evolucije Coerver® metode od njenog osnivanja 1984. godine.",
    image: "/images/photoshoot/Miami-146.png",
    href: "/za-trenere",
  },
  {
    id: "clubs",
    title: "KLUBOVI",
    description:
      "Coerver® Coaching nudi poseban partnerski program svim klubovima od amaterske do profesionalne razine. Ovim programom pokrivaju se četiri temeljne komponente.",
    image: "/images/photoshoot/Miami-143.png",
    href: "/klubovi",
  },
  {
    id: "individual",
    title: "INDIVIDUALNI TRENINZI",
    description:
      "Coerver® Coaching ima poseban program za individualne treninge i rad u manjim grupama, koji su ključni za razvoj svih sportaša.",
    image: "/images/photoshoot/Miami-138.png",
    href: "/za-igrace/individualni-treninzi",
  },
  {
    id: "camps",
    title: "KAMPOVI",
    description:
      "Coerver® Coaching organizira kampove u trajanju od jednoga do pet dana na kojima kombinacijom učenja vještina i zabave želimo svakom polazniku pružiti nezaboravno iskustvo.",
    image: "/images/photoshoot/Miami-125.png",
    href: "/za-igrace/kampovi",
  },
];

export function AudienceCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const progress = maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".audience-card");

    gsap.set(cards, { opacity: 0, y: 60 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
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
    <section
      ref={sectionRef}
      className="pt-16 lg:pt-24 pb-16 lg:pb-24 bg-coerver-green relative overflow-visible"
    >
      {/* Full width carousel - edge to edge, negative margin to overlap above */}
      <div
        ref={carouselRef}
        className="flex gap-3 lg:gap-4 overflow-x-auto pb-8 scrollbar-hide scroll-smooth -mt-32 lg:-mt-44"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {audienceCards.map((card, index) => {
          // Cards 2, 4 (index 1, 3) at top, cards 1, 3, 5 (index 0, 2, 4) lower
          const isLower = index % 2 === 0;
          const offset = isLower ? 50 : 0;

          return (
            <Link
              key={card.id}
              href={card.href}
              className="audience-card flex-shrink-0 w-[300px] lg:w-[340px] xl:w-[380px] group first:ml-4 last:mr-4 lg:first:ml-8 lg:last:mr-8"
              style={{ marginTop: `${offset}px` }}
            >
              <div className="relative h-[420px] lg:h-[480px] xl:h-[520px] rounded-2xl overflow-hidden">
                {/* Background Image */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
                    {card.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-white"
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
            </Link>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex items-center justify-center gap-6">
          {/* Arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-coerver-green transition-all"
              aria-label="Prethodni"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-coerver-green transition-all"
              aria-label="Sljedeći"
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${Math.max(20, scrollProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-coerver-dark font-semibold rounded-full hover:bg-coerver-gray-100 transition-colors"
          >
            KONTAKTIRAJTE NAS
          </Link>
        </div>
      </div>
    </section>
  );
}
