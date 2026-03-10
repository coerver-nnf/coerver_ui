"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard, testimonials, type Testimonial } from "./TestimonialCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll(".animate-on-scroll");

    gsap.set(elements, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden"
    >
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-coerver-green/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-coerver-green/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-coerver-dark/70 font-medium text-sm">
              5.0 od naših polaznika
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-coerver-dark leading-tight">
            Što kažu naši{" "}
            <span className="text-coerver-green">polaznici</span>
          </h2>

          <p className="mt-6 text-gray-500 text-lg lg:text-xl">
            Priče igrača, roditelja i trenera koji su transformirali svoju igru
          </p>
        </div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-2 gap-6 animate-on-scroll">
          {/* Left - Large featured testimonial */}
          <div className="row-span-2">
            <div className="h-full bg-coerver-dark rounded-3xl p-10 relative overflow-hidden">
              {/* Background image */}
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="/images/training/training-01.webp"
                  alt="Background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-coerver-dark/90 to-coerver-dark/70" />

              {/* Content */}
              <div className="relative h-full flex flex-col">
                {/* Quote icon */}
                <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center mb-8">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Testimonial content with transition */}
                <div className="flex-1">
                  <p className="text-2xl lg:text-3xl text-white font-medium leading-relaxed">
                    "{testimonials[activeIndex].content}"
                  </p>
                </div>

                {/* Author */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-coerver-green flex items-center justify-center text-white text-xl font-bold">
                        {testimonials[activeIndex].name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{testimonials[activeIndex].name}</h4>
                        <p className="text-white/50">{testimonials[activeIndex].role}</p>
                      </div>
                    </div>

                    {/* Navigation dots */}
                    <div className="flex gap-2">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === activeIndex ? "w-8 bg-coerver-green" : "w-2 bg-white/30 hover:bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Smaller cards */}
          <div className="grid gap-6">
            <TestimonialCard testimonial={testimonials[1]} variant="light" />
            <TestimonialCard testimonial={testimonials[2]} variant="light" />
          </div>
        </div>

        {/* Testimonials - Mobile */}
        <div className="lg:hidden animate-on-scroll">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === activeIndex
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <TestimonialCard testimonial={testimonial} variant="light" />
              </div>
            ))}
          </div>

          {/* Mobile navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex ? "w-8 bg-coerver-green" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-on-scroll mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1000+", label: "Aktivnih Igrača" },
            { value: "30+", label: "Certificiranih Trenera" },
            { value: "10", label: "Partnerskih Klubova" },
            { value: "11", label: "Godina Iskustva" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-coerver-green">
                {stat.value}
              </div>
              <p className="mt-2 text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TestimonialCard, testimonials, type Testimonial };
