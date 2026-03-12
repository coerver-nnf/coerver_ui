"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Champions",
    subtitle: "Start Here",
    accent: "Prisutna u preko 60 zemalja",
    image: "/images/photoshoot/Miami-141.webp",
  },
  {
    id: 2,
    title: "Develop",
    subtitle: "Your Skills",
    accent: "Osnovana 1984. godine",
    image: "/images/photoshoot/Miami-081.webp",
  },
  {
    id: 3,
    title: "Train Like",
    subtitle: "The Pros",
    accent: "Razvijamo buduće prvake",
    image: "/images/photoshoot/Miami-083.webp",
  },
];

const stats = [
  { value: "60+", label: "Zemalja" },
  { value: "40+", label: "Godina" },
  { value: "1M+", label: "Igrača" },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const animateContent = useCallback((direction: 'in' | 'out', onComplete?: () => void) => {
    const tl = gsap.timeline({ onComplete });

    // Check if refs are available
    if (!titleRef.current || !subtitleRef.current || !accentRef.current) {
      onComplete?.();
      return tl;
    }

    if (direction === 'out') {
      tl.to([titleRef.current, subtitleRef.current], {
        y: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.in",
      })
      .to(accentRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }, "-=0.2");
    } else {
      tl.fromTo([titleRef.current, subtitleRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      )
      .fromTo(accentRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        }, "-=0.3");
    }

    return tl;
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isAnimating) return;

    setIsAnimating(true);
    animateContent('out', () => {
      setCurrentSlide(index);
      animateContent('in', () => setIsAnimating(false));
    });
  }, [currentSlide, isAnimating, animateContent]);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide]);

  useEffect(() => {
    // Initial animation
    gsap.fromTo(heroRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
    animateContent('in');
  }, [animateContent]);

  const currentSlideData = slides[currentSlide];

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-coerver-dark">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <Image
            src={slide.image}
            alt="Coerver Training"
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark/70 via-coerver-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark/60 via-transparent to-coerver-dark/20" />
        </div>
      ))}

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Main Content */}
      <div className="relative h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                <span className="text-white/80 text-sm font-medium">Coerver Coaching Croatia</span>
              </div>

              {/* Main Title */}
              <h1 className="mb-6">
                <span
                  ref={titleRef}
                  className="block text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight"
                >
                  {currentSlideData.title}
                </span>
                <span
                  ref={subtitleRef}
                  className="block text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-coerver-green"
                >
                  {currentSlideData.subtitle}
                </span>
              </h1>

              {/* Accent Text */}
              <p ref={accentRef} className="text-xl md:text-2xl text-white/60 mb-10 max-w-md">
                {currentSlideData.accent}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/za-igrace/akademije"
                  className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                >
                  <span>Pridruži se</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/o-nama"
                  className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Saznaj više</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 lg:gap-12">
                {stats.map((stat, index) => (
                  <div key={index} className="relative">
                    <div className="text-4xl lg:text-5xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-white/50 font-medium uppercase tracking-wider">{stat.label}</div>
                    {index < stats.length - 1 && (
                      <div className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Empty for image focus on desktop */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="w-full px-6 md:px-12 lg:px-16">
          {/* Slide Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "relative h-1 rounded-full transition-all duration-500 overflow-hidden",
                    index === currentSlide ? "w-16 bg-white/20" : "w-8 bg-white/10 hover:bg-white/20"
                  )}
                  aria-label={`Slide ${index + 1}`}
                >
                  {index === currentSlide && (
                    <span className="absolute inset-0 bg-coerver-green rounded-full origin-left animate-[progress_6s_linear]" />
                  )}
                </button>
              ))}
            </div>
            <span className="text-white/40 text-sm font-medium">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Centered */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center">
        <div className="w-5 h-9 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-coerver-green rounded-full animate-bounce" />
        </div>
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
