"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image?: string;
  rating?: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive?: boolean;
  variant?: "light" | "dark";
  className?: string;
}

export function TestimonialCard({
  testimonial,
  isActive = false,
  variant = "light",
  className,
}: TestimonialCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "relative h-full",
        className
      )}
    >
      <div
        className={cn(
          "relative h-full rounded-3xl p-8 transition-all duration-300",
          isDark
            ? "bg-white/5 backdrop-blur-sm border border-white/10"
            : "bg-white shadow-xl shadow-gray-200/50"
        )}
      >
        {/* Quote mark */}
        <div className={cn(
          "absolute top-6 right-6 text-6xl font-serif leading-none",
          isDark ? "text-white/10" : "text-coerver-green/10"
        )}>
          "
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                "w-5 h-5",
                i < (testimonial.rating || 5) ? "text-yellow-400" : "text-gray-300"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Content */}
        <p className={cn(
          "text-lg leading-relaxed mb-8",
          isDark ? "text-white/80" : "text-gray-600"
        )}>
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 mt-auto">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
            isDark
              ? "bg-coerver-green text-white"
              : "bg-coerver-green/10 text-coerver-green"
          )}>
            {testimonial.image ? (
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              testimonial.name.split(" ").map((n) => n[0]).join("")
            )}
          </div>
          <div>
            <h4 className={cn(
              "font-bold",
              isDark ? "text-white" : "text-coerver-dark"
            )}>
              {testimonial.name}
            </h4>
            <p className={cn(
              "text-sm",
              isDark ? "text-white/50" : "text-gray-500"
            )}>
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonials data
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marko Horvat",
    role: "Roditelj igrača, U12",
    content:
      "Coerver Coaching mi je pomogao podići igru na višu razinu. Treninzi tehnika u kombinaciji sa brzim donošenjem odluka bilo je ono što mi je trebalo da se bolje adaptiram na nogomet u Europi.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ana Kovačević",
    role: "Igračica, 16 godina",
    content:
      "Nakon godinu dana na Coerver programu, moja kontrola lopte i samopouzdanje su nevjerojatno napredovali. Treneri su fantastični i uvijek potiču na bolji rad.",
    rating: 5,
  },
  {
    id: "3",
    name: "Ivan Perić",
    role: "Trener NK Dinamo Mladi",
    content:
      "Coerver diploma mi je otvorila oči za nove metode treninga. Moji igrači sada uživaju na treninzima i napreduju brže nego ikad.",
    rating: 5,
  },
  {
    id: "4",
    name: "Petra Novak",
    role: "Mama igračice, U10",
    content:
      "Moja kći obožava Coerver treninge! Svaki put se vraća sretna i uzbuđena pokazati nove trikove. Profesionalnost trenera je iznad svih očekivanja.",
    rating: 5,
  },
];
