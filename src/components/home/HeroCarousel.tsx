"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  imageMobile: string;
  accent: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Champions",
    subtitle: "Start Here",
    accent: "Prisutna u preko 60 zemalja",
    image: "/images/photoshoot/Miami-141.webp",
    imageMobile: "/images/photoshoot/Miami-141-mobile.webp",
  },
  {
    id: 2,
    title: "Develop",
    subtitle: "Your Skills",
    accent: "Osnovana 1984. godine",
    image: "/images/photoshoot/Miami-081.webp",
    imageMobile: "/images/photoshoot/Miami-081-mobile.webp",
  },
  {
    id: 3,
    title: "Train Like",
    subtitle: "The Pros",
    accent: "Razvijamo buduće prvake",
    image: "/images/photoshoot/Miami-083.webp",
    imageMobile: "/images/photoshoot/Miami-083-mobile.webp",
  },
];

const stats = [
  { value: "60+", label: "Zemalja" },
  { value: "40+", label: "Godina" },
  { value: "1M+", label: "Igrača" },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0]));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);

    // Preload the next image if not loaded
    if (!imagesLoaded.has(index)) {
      setImagesLoaded(prev => new Set([...prev, index]));
    }

    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 300);
  }, [currentSlide, isTransitioning, imagesLoaded]);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, [currentSlide, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide]);

  // Preload next slide image
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    if (!imagesLoaded.has(nextIndex)) {
      const timer = setTimeout(() => {
        setImagesLoaded(prev => new Set([...prev, nextIndex]));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, imagesLoaded]);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen overflow-hidden bg-coerver-dark">
      {/* Background Images - only load images that have been preloaded */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          {(index === 0 || imagesLoaded.has(index)) && (
            <picture>
              <source
                media="(max-width: 640px)"
                srcSet={slide.imageMobile}
                type="image/webp"
              />
              <Image
                src={slide.image}
                alt="Coerver Training"
                fill
                className="object-cover"
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 100vw"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAHxAAAgICAgMBAAAAAAAAAAAAAQIDBAARBRIGITFB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQEAAwEBAAAAAAAAAAAAAAABAAIRITH/2gAMAwEAAhEDEEA/ANJ4jydrj+Ls2Z4oJZJJGdmWMgE+/wBxk1eSvyN6eeazK0srcpHZj2J9k5MydKuw4iZ//9k="
              />
            </picture>
          )}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark/70 via-coerver-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark/60 via-transparent to-coerver-dark/20" />
        </div>
      ))}

      {/* Decorative Elements - only on large screens */}
      <div className="hidden lg:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="hidden lg:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-coerver-green rounded-full animate-pulse" />
                <span className="text-white/80 text-sm font-medium">Coerver Coaching Croatia</span>
              </div>

              {/* Main Title - CSS transitions instead of GSAP */}
              <h1 className="mb-6">
                <span
                  className={cn(
                    "block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight transition-all duration-500",
                    isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  )}
                >
                  {currentSlideData.title}
                </span>
                <span
                  className={cn(
                    "block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-coerver-green transition-all duration-500 delay-75",
                    isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  )}
                >
                  {currentSlideData.subtitle}
                </span>
              </h1>

              {/* Accent Text */}
              <p className={cn(
                "text-lg sm:text-xl md:text-2xl text-white/60 mb-8 sm:mb-10 max-w-md transition-all duration-500 delay-100",
                isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              )}>
                {currentSlideData.accent}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link
                  href="/za-igrace/akademije"
                  className="group inline-flex items-center gap-2 sm:gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-colors duration-200"
                >
                  <span>Pridruži se</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/o-nama"
                  className="group inline-flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-colors duration-200 border border-white/20"
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
                  aria-label={`Prikaži slajd ${index + 1} od ${slides.length}: ${slides[index].title} ${slides[index].subtitle}`}
                  aria-current={index === currentSlide ? "true" : undefined}
                >
                  {index === currentSlide && (
                    <span className="absolute inset-0 bg-coerver-green rounded-full origin-left animate-[progress_6s_linear]" aria-hidden="true" />
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
