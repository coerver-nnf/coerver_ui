"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PlayerRecommendation {
  id: string;
  name: string;
  title: string; // e.g., "Legenda Real Madrida" or "Bivši kapetan reprezentacije"
  club?: string;
  country?: string;
  quote: string;
  image?: string;
}

const playerRecommendations: PlayerRecommendation[] = [
  {
    id: "1",
    name: "Zinedine Zidane",
    title: "Legenda Real Madrida",
    club: "Real Madrid",
    country: "Francuska",
    quote:
      "Coerver metodologija je temelj za svakog mladog igrača koji želi razviti vrhunsku tehniku. To je način na koji sam i ja učio.",
  },
  {
    id: "2",
    name: "Ronaldinho",
    title: "Svjetski prvak 2002",
    club: "FC Barcelona",
    country: "Brazil",
    quote:
      "Kreativnost i tehnika koju Coerver razvija kod mladih igrača je upravo ono što nogomet čini lijepim.",
  },
  {
    id: "3",
    name: "Luka Modrić",
    title: "Zlatna lopta 2018",
    club: "Real Madrid",
    country: "Hrvatska",
    quote:
      "Rad na tehnici od malih nogu je ključan. Coerver pristup daje mladima temelje za uspjeh na najvišoj razini.",
  },
  {
    id: "4",
    name: "Davor Šuker",
    title: "Zlatna kopačka 1998",
    club: "Real Madrid",
    country: "Hrvatska",
    quote:
      "Coerver metodologija uči mlade igrače ono najvažnije - kako kontrolirati loptu u svakoj situaciji.",
  },
  {
    id: "5",
    name: "Andrés Iniesta",
    title: "Legenda FC Barcelone",
    club: "FC Barcelona",
    country: "Španjolska",
    quote:
      "Tehnika je jezik nogometa. Coerver uči mlade da govore taj jezik tečno od prvog dana.",
  },
  {
    id: "6",
    name: "Zvonimir Boban",
    title: "Legenda hrvatskog nogometa",
    club: "AC Milan",
    country: "Hrvatska",
    quote:
      "Individualni razvoj kakav nudi Coerver je nešto što nedostaje modernom nogometu. Svaki mladi igrač bi trebao proći kroz ovaj program.",
  },
];

interface RecommendationCardProps {
  recommendation: PlayerRecommendation;
  variant?: "default" | "large";
  className?: string;
}

export function RecommendationCard({
  recommendation,
  variant = "default",
  className,
}: RecommendationCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden",
        variant === "large" ? "md:col-span-2" : "",
        className
      )}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-coerver-green to-coerver-green-light" />

      <div className={cn(
        "p-6",
        variant === "large" ? "md:p-8 md:flex md:gap-8 md:items-center" : ""
      )}>
        {/* Player Image */}
        <div className={cn(
          "relative mb-6",
          variant === "large" ? "md:mb-0 md:flex-shrink-0" : ""
        )}>
          <div
            className={cn(
              "mx-auto rounded-full bg-gradient-to-br from-coerver-gray-200 to-coerver-gray-300 overflow-hidden border-4 border-coerver-green/20 group-hover:border-coerver-green/40 transition-colors",
              variant === "large" ? "w-32 h-32 md:w-40 md:h-40" : "w-24 h-24"
            )}
          >
            {recommendation.image ? (
              <img
                src={recommendation.image}
                alt={recommendation.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-coerver-green/20 to-coerver-green-light/20">
                <span className={cn(
                  "font-bold text-coerver-green",
                  variant === "large" ? "text-4xl" : "text-2xl"
                )}>
                  {recommendation.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            )}
          </div>

          {/* Country flag placeholder */}
          {recommendation.country && (
            <div className="absolute -bottom-1 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 bg-white rounded-full px-2 py-1 shadow-md text-xs font-medium text-coerver-gray-600">
              {recommendation.country}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "text-center",
          variant === "large" ? "md:text-left md:flex-1" : ""
        )}>
          {/* Quote */}
          <div className="relative mb-4">
            <svg
              className={cn(
                "absolute -top-2 -left-2 text-coerver-green/10",
                variant === "large" ? "w-12 h-12" : "w-8 h-8"
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p
              className={cn(
                "relative text-coerver-gray-600 leading-relaxed italic",
                variant === "large" ? "text-lg md:text-xl" : "text-sm"
              )}
            >
              &ldquo;{recommendation.quote}&rdquo;
            </p>
          </div>

          {/* Player Info */}
          <div>
            <h4
              className={cn(
                "font-bold text-coerver-dark",
                variant === "large" ? "text-xl md:text-2xl" : "text-lg"
              )}
            >
              {recommendation.name}
            </h4>
            <p className="text-coerver-green font-medium text-sm">
              {recommendation.title}
            </p>
            {recommendation.club && (
              <p className="text-coerver-gray-500 text-sm mt-1">
                {recommendation.club}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlayerRecommendationsProps {
  maxItems?: number;
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  className?: string;
}

export function PlayerRecommendations({
  maxItems,
  title = "Preporučuju Najbolji",
  subtitle = "Svjetske nogometne legende prepoznaju vrijednost Coerver metodologije.",
  showStats = true,
  className,
}: PlayerRecommendationsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const displayedRecommendations = maxItems
    ? playerRecommendations.slice(0, maxItems)
    : playerRecommendations;

  useEffect(() => {
    if (!sectionRef.current) return;

    const header = sectionRef.current.querySelector(".recommendations-header");
    const cards = sectionRef.current.querySelectorAll(".recommendation-card");

    gsap.set(header, { opacity: 0, y: 40 });
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.to(header, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
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
      className={cn(
        "section-padding bg-gradient-to-br from-coerver-dark via-coerver-gray-900 to-coerver-green-dark relative overflow-hidden",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-coerver-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-coerver-green/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="recommendations-header text-center max-w-3xl mx-auto mb-16">
          <span className="text-coerver-green-light font-semibold text-sm uppercase tracking-wider">
            Legende Nogometa
          </span>
          <h2 className="mt-4 text-white">{title}</h2>
          <p className="mt-4 text-white/70 text-lg">{subtitle}</p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedRecommendations.map((recommendation, index) => (
            <div
              key={recommendation.id}
              className={cn(
                "recommendation-card",
                index === 0 && displayedRecommendations.length > 3 ? "lg:col-span-2 lg:row-span-1" : ""
              )}
            >
              <RecommendationCard
                recommendation={recommendation}
                variant={index === 0 && displayedRecommendations.length > 3 ? "large" : "default"}
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-coerver-green mb-2">
                500+
              </div>
              <p className="text-white/70">Aktivnih Igrača</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-coerver-green mb-2">
                50+
              </div>
              <p className="text-white/70">Certificiranih Trenera</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-coerver-green mb-2">
                15+
              </div>
              <p className="text-white/70">Partnerskih Klubova</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-coerver-green mb-2">
                10+
              </div>
              <p className="text-white/70">Godina Iskustva</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export { playerRecommendations };
