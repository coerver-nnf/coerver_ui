"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { getCamps, Camp } from "@/lib/api/camps";
import { trackEvent, createScrollTracker } from "@/lib/tracking";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * easeOut));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, start, hasAnimated]);

  return { count, ref };
}

// Countdown timer component
function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline).getTime() - new Date().getTime();
      if (difference <= 0) {
        setIsExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (isExpired) return null;

  return (
    <div className="flex items-center gap-2">
      {[
        { value: timeLeft.days, label: "dana" },
        { value: timeLeft.hours, label: "sati" },
        { value: timeLeft.minutes, label: "min" },
        { value: timeLeft.seconds, label: "sek" },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
            <span className="text-xl font-black text-white">{item.value.toString().padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-white/50 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Quick inquiry form
function QuickInquiryForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formStartTracked = useRef(false);

  const handleFormStart = () => {
    if (!formStartTracked.current) {
      formStartTracked.current = true;
      trackEvent.formStart("quick_inquiry_camps");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    trackEvent.formSubmit("quick_inquiry_camps");
  };

  if (isSubmitted) {
    return (
      <div className="bg-coerver-green/10 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-coerver-green flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="font-bold text-coerver-dark mb-1">Hvala na upitu!</h4>
        <p className="text-sm text-gray-600">Javit ćemo vam se u najkraćem roku.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Ime i prezime"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        onFocus={handleFormStart}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coerver-green focus:ring-2 focus:ring-coerver-green/20 outline-none transition-all text-sm"
      />
      <input
        type="email"
        placeholder="Email adresa"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coerver-green focus:ring-2 focus:ring-coerver-green/20 outline-none transition-all text-sm"
      />
      <input
        type="tel"
        placeholder="Broj mobitela"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coerver-green focus:ring-2 focus:ring-coerver-green/20 outline-none transition-all text-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Šaljem..." : "Pošalji upit"}
      </button>
    </form>
  );
}

const trustStats = [
  { value: 500, suffix: "+", label: "Polaznika godišnje" },
  { value: 15, suffix: "+", label: "Godina iskustva" },
  { value: 98, suffix: "%", label: "Zadovoljnih roditelja" },
];

const partnerLogos = [
  { src: "/images/adidas-logo.png", alt: "Adidas", width: 100 },
];

const benefits = [
  {
    title: "Coerver metodologija",
    description: "Svjetski priznata metoda razvoja tehničkih vještina",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Licencirani treneri",
    description: "UEFA licencirani treneri s Coerver certifikatom",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    title: "Male grupe",
    description: "Maksimalno 12 igrača po treneru za individualan pristup",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Sve uključeno",
    description: "Oprema, obroci, osiguranje i certifikat",
    icon: "M5 13l4 4L19 7",
  },
];

const testimonials = [
  {
    text: "Moj sin se vratio s kampa pun entuzijazma! Napredak u tehnici je nevjerojatan, a stekao je i nova prijateljstva.",
    name: "Marina K.",
    role: "Mama Luke (9 god)",
    image: null,
  },
  {
    text: "Profesionalan pristup, izvrsna organizacija. Djeca su stalno aktivna i uče kroz igru. Preporučujem svima!",
    name: "Tomislav B.",
    role: "Tata Ivana (11 god)",
    image: null,
  },
  {
    text: "Treći put za redom šaljemo sina na Coerver kamp. Svake godine se vrati s novim vještinama i još većom ljubavi prema nogometu.",
    name: "Ana M.",
    role: "Mama Petra (12 god)",
    image: null,
  },
];

const galleryImages = [
  "/images/training/training-01.webp",
  "/images/training/training-03.webp",
  "/images/training/training-05.webp",
  "/images/training/training-08.webp",
  "/images/training/training-09.webp",
  "/images/training/training-13.webp",
];

const faqs = [
  {
    question: "Što dijete treba ponijeti na kamp?",
    answer: "Nogometne kopačke ili tenisice, štitnike, bocu vode, potrepštine za osobnu higijenu i dobru volju! Coerver opremu dobivate na kampu.",
  },
  {
    question: "Je li uključen ručak?",
    answer: "Ovisno o vremenskom trajanju kampa igrači imaju uključen obrok odnosno ručak i/ili užinu.",
  },
  {
    question: "Što ako dijete nema prethodnog iskustva?",
    answer: "Naši kampovi su prilagođeni svim razinama - od potpunih početnika do naprednih igrača. Grupe se formiraju po dobi i sposobnosti igrača.",
  },
  {
    question: "Kako mogu otkazati prijavu?",
    answer: "Besplatno otkazivanje do 14 dana prije početka kampa. Nakon toga zadržavamo 50% uplaćenog iznosa.",
  },
];

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDay = start.getDate().toString().padStart(2, "0");
  const startMonth = (start.getMonth() + 1).toString().padStart(2, "0");
  const endDay = end.getDate().toString().padStart(2, "0");
  const endMonth = (end.getMonth() + 1).toString().padStart(2, "0");
  const year = end.getFullYear();
  return `${startDay}.${startMonth}. - ${endDay}.${endMonth}.${year}`;
}

function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function CampCard({ camp, featured = false }: { camp: Camp; featured?: boolean }) {
  const [viewingCount, setViewingCount] = useState(0);

  useEffect(() => {
    setViewingCount(Math.floor(Math.random() * 8) + 3);
  }, []);
  const daysUntil = getDaysUntil(camp.start_date);
  const spotsLeft = camp.spots ?? camp.total_spots ?? 0;
  const totalSpots = camp.total_spots ?? camp.capacity ?? 24;
  const spotsPercentage = totalSpots > 0 ? ((totalSpots - spotsLeft) / totalSpots) * 100 : 0;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
  const isFull = spotsLeft === 0;

  // Show lowest available price for "od X€" display
  const availablePrices = [camp.price_day_only, camp.price_full_day, camp.price].filter(p => p && p > 0);
  const displayPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null;

  return (
    <div className={cn(
      "group relative bg-white rounded-3xl overflow-hidden transition-all duration-300",
      featured ? "shadow-xl hover:shadow-2xl" : "shadow-md hover:shadow-xl",
      featured && "ring-2 ring-coerver-green"
    )}>
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-coerver-green text-white text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Sljedeći kamp
          </span>
        </div>
      )}

      {/* Viewing now indicator */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        {(isAlmostFull || isFull) && (
          <span className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full",
            isFull ? "bg-gray-800 text-white" : "bg-red-500 text-white"
          )}>
            {isFull ? "Popunjeno" : `Još samo ${spotsLeft} mjesta!`}
          </span>
        )}
        {!isFull && viewingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {viewingCount} osoba gleda
          </span>
        )}
      </div>

      <div className={cn("grid", featured ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden",
          featured ? "aspect-[4/3] lg:aspect-auto" : "aspect-video lg:aspect-auto"
        )}>
          <Image
            src={camp.image_url || "/images/training/training-08.webp"}
            alt={camp.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Price badge */}
          {displayPrice && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
                <div className="text-xs text-gray-500">od</div>
                <div className="text-2xl font-black text-coerver-dark">{displayPrice}€</div>
              </div>
            </div>
          )}

          {/* Days countdown */}
          {daysUntil > 0 && daysUntil <= 30 && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-coerver-dark/90 backdrop-blur-sm text-white rounded-xl px-3 py-2 text-center">
                <div className="text-2xl font-black">{daysUntil}</div>
                <div className="text-xs opacity-80">dana do</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn("p-6 lg:p-8", featured ? "" : "lg:col-span-2")}>
          <h3 className={cn(
            "font-black text-coerver-dark mb-2 group-hover:text-coerver-green transition-colors",
            featured ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
          )}>
            {camp.title}
          </h3>

          {camp.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{camp.description}</p>
          )}

          {/* Quick info */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Datum</div>
                <div className="text-sm font-semibold text-coerver-dark">{formatDateRange(camp.start_date, camp.end_date)}</div>
              </div>
            </div>
            {camp.location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Lokacija</div>
                  <div className="text-sm font-semibold text-coerver-dark">{camp.location}</div>
                </div>
              </div>
            )}
            {camp.age_groups && camp.age_groups.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Uzrast</div>
                  <div className="text-sm font-semibold text-coerver-dark">{camp.age_groups.join(", ")} god</div>
                </div>
              </div>
            )}
            {spotsLeft > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Mjesta</div>
                  <div className="text-sm font-semibold text-coerver-dark">{spotsLeft} slobodnih</div>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {totalSpots > 0 && spotsPercentage > 0 && (
            <div className="mb-5">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    spotsPercentage >= 80 ? "bg-red-500" : "bg-gradient-to-r from-coerver-green to-emerald-400"
                  )}
                  style={{ width: `${spotsPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-500">{Math.round(spotsPercentage)}% popunjeno</span>
                {spotsPercentage >= 50 && <span className="text-xs text-red-500 font-medium">Požurite!</span>}
              </div>
            </div>
          )}

          {/* Registration deadline countdown for featured */}
          {featured && camp.registration_deadline && (
            <div className="mb-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-white/80 text-sm">Rok za prijavu istječe za:</div>
                </div>
                <CountdownTimer deadline={camp.registration_deadline} />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/za-igrace/kampovi/${camp.slug}`}
              onClick={() => trackEvent.ctaClick("prijavi_se", "camp_card")}
              className={cn(
                "inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full transition-all",
                isFull
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-coerver-green hover:bg-coerver-green/90 text-white"
              )}
            >
              {isFull ? "Popunjeno" : "Prijavi se"}
              {!isFull && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gallery carousel
function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl aspect-[16/9]">
        <div
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {galleryImages.map((src, index) => (
            <div key={index} className="min-w-full h-full relative">
              <Image src={src} alt={`Galerija ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-coerver-green w-6" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function KampoviPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);

  // Animated counters
  const stat1 = useAnimatedCounter(500, 2000);
  const stat2 = useAnimatedCounter(15, 1500);
  const stat3 = useAnimatedCounter(98, 2000);
  const animatedStats = [stat1, stat2, stat3];

  useEffect(() => {
    async function loadCamps() {
      try {
        const data = await getCamps({ status: "published" });
        setCamps(data);
      } catch (error) {
        console.error("Error loading camps:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCamps();
  }, []);

  // Scroll depth tracking
  useEffect(() => {
    const handleScroll = createScrollTracker("camps_listing");
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (loading) return;

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
  }, [loading]);

  // Sort camps by date and get the featured (next upcoming) camp
  const sortedCamps = [...camps].sort((a, b) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  const featuredCamp = sortedCamps[0];
  const otherCamps = sortedCamps.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/training/training-09.webp"
            alt="Nogometni kamp"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/80 to-coerver-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/30" />
        </div>

        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-red-500/30">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-300 text-sm font-semibold">Ograničen broj mjesta - Ljeto 2025</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
                Osiguraj
                <br />
                <span className="text-coerver-green">Mjesto Danas</span>
              </h1>

              <p className="text-xl text-white/70 mb-8 max-w-xl">
                Mjesta se brzo pune. Prijavite svoje dijete na nogometni kamp
                koji razvija tehničke vještine, gradi samopouzdanje i stvara prijateljstva za cijeli život.
              </p>

              {/* Animated trust stats */}
              <div className="flex flex-wrap gap-8 mb-10">
                {trustStats.map((stat, index) => (
                  <div key={index} ref={animatedStats[index].ref}>
                    <div className="text-3xl font-black text-white">
                      {animatedStats[index].count}{stat.suffix}
                    </div>
                    <div className="text-white/50 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#camps"
                  onClick={() => trackEvent.ctaClick("rezerviraj_mjesto", "hero")}
                  className="group inline-flex items-center gap-3 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-coerver-green/30"
                >
                  <span>Rezerviraj mjesto</span>
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                {/* Mobile quick contact - one tap call */}
                <a
                  href="tel:+385981873228"
                  onClick={() => trackEvent.ctaClick("nazovi_nas", "hero_mobile")}
                  className="lg:hidden inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-4 rounded-full transition-all border border-white/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Nazovi nas</span>
                </a>
              </div>

              {/* Mobile quick contact card */}
              <div className="lg:hidden mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Imate pitanja?</div>
                    <div className="text-white/60 text-sm">Javimo se u roku 24h</div>
                  </div>
                  <a
                    href="mailto:info@coervercroatia.com"
                    onClick={() => trackEvent.ctaClick("posalji_email", "hero_mobile")}
                    className="bg-white text-coerver-dark font-semibold px-4 py-2 rounded-lg text-sm hover:bg-white/90 transition-colors"
                  >
                    Email
                  </a>
                </div>
              </div>

              {/* Partner logos */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Službeni partneri</p>
                <div className="flex items-center gap-8">
                  {partnerLogos.map((logo, index) => (
                    <div key={index} className="opacity-60 hover:opacity-100 transition-opacity">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={40}
                        className="object-contain h-8 w-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick inquiry form - desktop only */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-coerver-green/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-coerver-dark">Brzi upit</h3>
                    <p className="text-sm text-gray-500">Javimo se u roku 24h</p>
                  </div>
                </div>
                <QuickInquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Camps Section */}
      <section id="camps" className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Nadolazeći kampovi</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Rezerviraj svoje mjesto
            </h2>
            <p className="text-lg text-gray-600">
              Broj mjesta je ograničen - osiguraj svoje mjesto na vrijeme!
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-coerver-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : camps.length === 0 ? (
            <div className="text-center py-16 max-w-xl mx-auto">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-coerver-dark mb-3">Trenutno nema nadolazećih kampova</h3>
              <p className="text-gray-500 mb-8">
                Pratite nas na društvenim mrežama ili nam ostavite kontakt za obavijest o novim kampovima.
              </p>

              {/* Quick form for empty state */}
              <div className="bg-white rounded-2xl p-6 shadow-sm max-w-sm mx-auto mb-6">
                <h4 className="font-semibold text-coerver-dark mb-4">Obavijestite me o novim kampovima</h4>
                <QuickInquiryForm />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.instagram.com/coervercroatia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Pratite nas
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured camp */}
              {featuredCamp && (
                <div className="animate-on-scroll">
                  <CampCard camp={featuredCamp} featured />
                </div>
              )}

              {/* Other camps */}
              {otherCamps.length > 0 && (
                <div className="grid gap-6">
                  {otherCamps.map((camp, index) => (
                    <div
                      key={camp.id}
                      className="animate-on-scroll"
                      style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                    >
                      <CampCard camp={camp} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Galerija</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Pogledajte atmosferu naših kampova
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Svaki kamp je prilika za učenje, zabavu i stvaranje nezaboravnih uspomena.
                Pogledajte kako to izgleda u praksi.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/coervercroatia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Više na Instagramu
                </a>
              </div>
            </div>
            <div className="animate-on-scroll">
              <GalleryCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll order-2 lg:order-1">
              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/training/training-01.webp"
                      alt="Trening na kampu"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/training/training-05.webp"
                      alt="Kamp aktivnosti"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-video rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/training/training-03.webp"
                      alt="Grupni trening"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden relative">
                    <Image
                      src="/images/training/training-13.webp"
                      alt="Zabava na kampu"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-on-scroll order-1 lg:order-2">
              {/* Camps Logo */}
              <div className="mb-8">
                <Image
                  src="/images/logo-variations/Camps_Dark.png"
                  alt="Coerver Camps"
                  width={280}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Zašto odabrati Coerver kamp?
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Više od 35 godina Coerver metodologija razvija tehničke vještine
                mladih nogometaša diljem svijeta.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-coerver-dark mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Iskustva roditelja</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Što kažu roditelji?
            </h2>
            <p className="text-lg text-white/60">
              Više od 500 zadovoljnih obitelji godišnje
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="animate-on-scroll bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 mb-6 text-sm leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-white/50 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google rating */}
          <div className="animate-on-scroll mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-semibold">4.9</span>
              <span className="text-white/60 text-sm">na Google recenzijama</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">FAQ</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                Česta pitanja
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Imate dodatnih pitanja? Slobodno nas kontaktirajte putem emaila ili telefona.
              </p>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <h4 className="font-semibold text-coerver-dark pr-4 text-sm">{faq.question}</h4>
                      <div className={cn(
                        "w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0 transition-transform",
                        openFaq === index && "rotate-180"
                      )}>
                        <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className={cn(
                      "overflow-hidden transition-all duration-300",
                      openFaq === index ? "max-h-40" : "max-h-0"
                    )}>
                      <p className="px-5 pb-5 text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="animate-on-scroll">
              <div className="bg-coerver-dark rounded-3xl p-8 sticky top-8">
                <h3 className="text-2xl font-black text-white mb-4">Imate pitanja?</h3>
                <p className="text-white/60 mb-8">
                  Naš tim je tu za vas. Javite nam se i rado ćemo odgovoriti na sva vaša pitanja.
                </p>

                <div className="space-y-4 mb-8">
                  <a
                    href="mailto:info@coervercroatia.com"
                    className="flex items-center gap-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl p-4 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-white/60 text-sm">info@coervercroatia.com</div>
                    </div>
                  </a>

                  <a
                    href="tel:+385981873228"
                    className="flex items-center gap-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl p-4 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Telefon</div>
                      <div className="text-white/60 text-sm">+385 98 1873 228</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28 bg-coerver-green relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Spremi svoje dijete za nezaboravno ljeto
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Prijavite se danas i osigurajte mjesto na jednom od naših kampova.
              Broj mjesta je ograničen!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#camps"
                onClick={() => trackEvent.ctaClick("prijavi_se_sada", "final_cta")}
                className="inline-flex items-center gap-3 bg-white text-coerver-green font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all shadow-lg"
              >
                <span>Prijavi se sada</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      {camps.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-40 shadow-lg">
          <a
            href="#camps"
            onClick={() => trackEvent.ctaClick("prijavi_se_na_kamp", "mobile_sticky")}
            className="flex items-center justify-center gap-2 w-full bg-coerver-green text-white font-bold py-4 rounded-full"
          >
            <span>Prijavi se na kamp</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
