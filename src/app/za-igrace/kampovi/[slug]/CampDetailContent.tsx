"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Camp } from "@/lib/api/camps";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 mb-6">
      <div className="text-white/80 text-sm mb-2">Rok za prijavu istječe za:</div>
      <div className="flex items-center gap-2">
        {[
          { value: timeLeft.days, label: "d" },
          { value: timeLeft.hours, label: "h" },
          { value: timeLeft.minutes, label: "m" },
          { value: timeLeft.seconds, label: "s" },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[45px]">
              <span className="text-xl font-black text-white">{item.value.toString().padStart(2, "0")}</span>
              <span className="text-xs text-white/70 ml-0.5">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Signup notification toast
function SignupNotification({ show, name }: { show: boolean; name: string }) {
  return (
    <div className={cn(
      "fixed bottom-24 left-4 lg:bottom-8 bg-white rounded-2xl shadow-2xl p-4 max-w-sm z-50 transition-all duration-500 flex items-center gap-3",
      show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
    )}>
      <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-coerver-dark">{name}</span> se upravo prijavio/la
        </p>
        <p className="text-xs text-gray-400">na ovaj kamp</p>
      </div>
    </div>
  );
}

const fakeNames = ["Marko", "Ivan", "Luka", "Ana", "Petra", "Matej", "Filip", "Sara", "Mia", "David"];

const defaultTestimonials = [
  {
    text: "Moj sin se vratio s kampa pun entuzijazma! Napredak u tehnici je nevjerojatan.",
    name: "Marina K.",
    role: "Mama Luke (9 god)",
  },
  {
    text: "Profesionalan pristup, izvrsna organizacija. Preporučujem svima!",
    name: "Tomislav B.",
    role: "Tata Ivana (11 god)",
  },
];

interface CampDetailContentProps {
  camp: Camp;
}

export default function CampDetailContent({ camp }: CampDetailContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [viewingCount, setViewingCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationName, setNotificationName] = useState("");

  // Set random viewing count on client only to avoid hydration mismatch
  useEffect(() => {
    setViewingCount(Math.floor(Math.random() * 12) + 5);
  }, []);

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
  }, [camp]);

  // Fake signup notifications
  useEffect(() => {
    const showRandomNotification = () => {
      const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      setNotificationName(randomName);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    const initialTimeout = setTimeout(showRandomNotification, 15000);
    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 40000 + 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Format dates
  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "dd.MM.yyyy", { locale: hr });
  };

  const dates = `${formatDate(camp.start_date)} - ${formatDate(camp.end_date)}`;

  // Calculate spots and percentages
  const totalSpots = camp.total_spots || camp.capacity || 24;
  const availableSpots = camp.spots ?? totalSpots;
  const spotsPercentage = ((totalSpots - availableSpots) / totalSpots) * 100;
  const isAlmostFull = availableSpots <= 5;
  const isFull = availableSpots === 0;

  // Get age groups display
  const ageGroupsDisplay = camp.age_groups?.length
    ? camp.age_groups.join(", ") + " god"
    : camp.age_min && camp.age_max
    ? `${camp.age_min}-${camp.age_max} god`
    : "Sve uzrasti";

  // Determine pricing options available
  const hasAccommodation = (camp.price ?? 0) > 0;
  const hasFullDay = (camp.price_full_day ?? 0) > 0;
  const hasTrainingOnly = (camp.price_day_only ?? 0) > 0;
  const displayPrice = hasAccommodation
    ? camp.price
    : hasFullDay
    ? camp.price_full_day
    : camp.price_day_only;

  // Build all prices string for display
  const allPrices = [
    hasAccommodation ? `${camp.price}€` : null,
    hasFullDay ? `${camp.price_full_day}€` : null,
    hasTrainingOnly ? `${camp.price_day_only}€` : null,
  ].filter(Boolean).join(" / ");

  // Default values for arrays
  const highlights = camp.highlights || [];
  const dailySchedule = camp.daily_schedule || [];
  const weeklyProgram = camp.weekly_program || [];
  const included = camp.included || [];
  const whatToBring = camp.what_to_bring || [];
  const gallery = camp.gallery || [];
  const faq = camp.faq || [];
  const testimonials = camp.testimonials?.length ? camp.testimonials : defaultTestimonials;
  const heroImage = camp.hero_image || camp.image_url || "/images/training/training-08.webp";

  return (
    <div className="min-h-screen bg-white">
      {/* Signup notification toast */}
      <SignupNotification show={showNotification} name={notificationName} />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/385981873228?text=Pozdrav!%20Zanima%20me%20kamp%20${encodeURIComponent(camp.title)}.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-white text-gray-700 text-sm font-medium px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Pitaj nas na WhatsApp
        </span>
      </a>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={camp.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coerver-dark via-coerver-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-transparent to-coerver-dark/40" />
        </div>

        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 lg:px-8 relative py-32">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Link href="/za-igrace" className="text-white/60 hover:text-white text-sm transition-colors">Za Igrače</Link>
            <span className="text-white/40">/</span>
            <Link href="/za-igrace/kampovi" className="text-white/60 hover:text-white text-sm transition-colors">Kampovi</Link>
            <span className="text-white/40">/</span>
            <span className="text-coerver-green text-sm font-semibold">{camp.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Urgency badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Popularno badge - always show if not full */}
                {!isFull && spotsPercentage >= 20 && (
                  <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-500/30">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                    </svg>
                    <span className="text-orange-300 text-sm font-semibold">Popularno - brzo se puni!</span>
                  </div>
                )}
                {isAlmostFull && !isFull && (
                  <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-300 text-sm font-semibold">Još samo {availableSpots} mjesta!</span>
                  </div>
                )}
                {isFull && (
                  <div className="inline-flex items-center gap-2 bg-gray-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-500/30">
                    <span className="text-gray-300 text-sm font-semibold">Popunjeno</span>
                  </div>
                )}
                {!isFull && viewingCount > 0 && (
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-white/80 text-sm">{viewingCount} osoba gleda ovaj kamp</span>
                  </div>
                )}
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6">
                {camp.title.split(" ").slice(0, -1).join(" ")}
                <br />
                <span className="text-coerver-green">{camp.title.split(" ").slice(-1)}</span>
              </h1>

              <p className="text-xl text-white/70 mb-6 max-w-xl">
                {camp.subtitle || "Pridruži se stotinama mladih nogometaša na nezaboravnom tjednu treninga, igre i novih prijateljstava."}
              </p>

              {/* Trust stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-coerver-green/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">500+ polaznika godišnje</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">4.9 ocjena</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-coerver-green/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">98% se vraća</span>
                </div>
              </div>

              {/* Quick info cards */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Datum", value: dates, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                  { label: "Lokacija", value: camp.location || "TBD", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                  { label: "Dob", value: ageGroupsDisplay, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
                  { label: "Cijena", value: allPrices || "TBD", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-coerver-green/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white/50 text-xs uppercase tracking-wider">{item.label}</div>
                        <div className="text-white font-semibold">{item.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#prijava"
                  className={cn(
                    "group inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-full transition-all duration-300",
                    isFull
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-coerver-green hover:bg-coerver-green/90 text-white shadow-lg shadow-coerver-green/30"
                  )}
                >
                  <span>{isFull ? "Popunjeno" : "Prijavi se odmah"}</span>
                  {!isFull && (
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </a>
                <a
                  href={`https://wa.me/385981873228?text=Pozdrav!%20Imam%20pitanje%20o%20kampu%20${encodeURIComponent(camp.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pitaj odmah
                </a>
              </div>
            </div>

            {/* Stats card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                {/* Last year sold out notice */}
                <div className="bg-yellow-500/20 rounded-xl p-3 mb-6 border border-yellow-500/30">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-yellow-300 text-sm font-medium">Prošle godine rasprodano u 2 tjedna!</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-xl">Popunjenost kampa</h3>
                  <span className={cn(
                    "font-bold text-2xl",
                    isAlmostFull ? "text-red-400" : "text-coerver-green"
                  )}>{availableSpots} mjesta</span>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        spotsPercentage >= 80
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : spotsPercentage >= 50
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                          : "bg-gradient-to-r from-coerver-green to-emerald-400"
                      )}
                      style={{ width: `${spotsPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-white/50 text-sm">{Math.round(spotsPercentage)}% popunjeno</span>
                    {spotsPercentage >= 30 && <span className="text-orange-400 text-sm font-medium">Požurite s prijavom!</span>}
                  </div>
                </div>

                {/* Countdown timer */}
                {camp.registration_deadline && (
                  <CountdownTimer deadline={camp.registration_deadline} />
                )}

                {/* Prices */}
                <div className="space-y-3 mb-6">
                  {hasAccommodation && (
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                      <span className="text-white/70">S noćenjem</span>
                      <span className="text-white font-bold text-xl">{camp.price}€</span>
                    </div>
                  )}
                  {hasFullDay && (
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                      <span className="text-white/70">Cjelodnevni</span>
                      <span className="text-white font-bold text-xl">{camp.price_full_day}€</span>
                    </div>
                  )}
                  {hasTrainingOnly && (
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                      <span className="text-white/70">Samo treninzi</span>
                      <span className="text-white font-bold text-xl">{camp.price_day_only}€</span>
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-white/60 text-sm">Osiguranje uključeno</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/60 text-sm">Oprema uključena</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Highlights */}
      {(camp.description || highlights.length > 0) && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {camp.description && (
                <div className="animate-on-scroll">
                  <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                    <span className="text-coerver-green text-sm font-semibold">O kampu</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                    Što vas očekuje?
                  </h2>
                  <div className="prose prose-lg text-gray-600">
                    {camp.description.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph.trim()}</p>
                    ))}
                  </div>
                </div>
              )}

              {highlights.length > 0 && (
                <div className="animate-on-scroll">
                  <div className="bg-gray-50 rounded-3xl p-8">
                    <h3 className="text-2xl font-black text-coerver-dark mb-6">Zašto odabrati ovaj kamp?</h3>
                    <div className="space-y-4">
                      {highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-coerver-dark font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Weekly Program */}
      {weeklyProgram.length > 0 && (
        <section id="program" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/20 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Program kampa</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Tjedni raspored
              </h2>
              <p className="text-lg text-white/60">
                Svaki dan donosi novu temu i nove vještine
              </p>
            </div>

            <div className={cn(
              "grid gap-4 max-w-6xl mx-auto",
              weeklyProgram.length <= 5 ? "md:grid-cols-5" : "md:grid-cols-4"
            )}>
              {weeklyProgram.map((day, index) => (
                <div
                  key={day.day}
                  className="animate-on-scroll group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-coerver-green/50 transition-all duration-300 h-full">
                    <div className="bg-coerver-green p-4 text-center">
                      <span className="text-white font-bold text-lg">Dan {index + 1}</span>
                    </div>
                    <div className="p-6">
                      <div className="text-white/50 text-sm mb-2">{day.day}</div>
                      <h4 className="text-white font-bold text-lg mb-3 group-hover:text-coerver-green transition-colors">{day.theme}</h4>
                      <p className="text-white/60 text-sm">{day.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Schedule */}
      {dailySchedule.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Dnevni raspored</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-6">
                  Tipičan dan na kampu
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Svaki dan je pažljivo isplaniran da pruži optimalan balans treninga, odmora i zabave.
                </p>

                <div className="space-y-4">
                  {dailySchedule.map((item, index) => (
                    <div
                      key={item.time}
                      className="flex items-center gap-5 bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon || "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-coerver-dark">{item.activity}</div>
                        <div className="text-gray-500 text-sm">{item.time}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center">
                        <span className="text-coerver-green font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-on-scroll relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[0] ? (
                        <Image src={gallery[0]} alt="Trening na kampu" fill className="object-cover" />
                      ) : (
                        <Image src="/images/training/training-01.webp" alt="Trening" fill className="object-cover" />
                      )}
                    </div>
                    <div className="aspect-video rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[1] ? (
                        <Image src={gallery[1]} alt="Kamp aktivnosti" fill className="object-cover" />
                      ) : (
                        <Image src="/images/training/training-05.webp" alt="Aktivnosti" fill className="object-cover" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-video rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[2] ? (
                        <Image src={gallery[2]} alt="Grupni trening" fill className="object-cover" />
                      ) : (
                        <Image src="/images/training/training-03.webp" alt="Grupni trening" fill className="object-cover" />
                      )}
                    </div>
                    <div className="aspect-square rounded-3xl overflow-hidden relative bg-gray-100">
                      {gallery[3] ? (
                        <Image src={gallery[3]} alt="Zabava na kampu" fill className="object-cover" />
                      ) : (
                        <Image src="/images/training/training-13.webp" alt="Zabava" fill className="object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What's Included & What to Bring */}
      {(included.length > 0 || whatToBring.length > 0) && (
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {included.length > 0 && (
                <div className="animate-on-scroll bg-white rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-coerver-green flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-coerver-dark">Što je uključeno</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {included.map((item) => (
                      <div key={item.item} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-8 h-8 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon || "M5 13l4 4L19 7"} />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {whatToBring.length > 0 && (
                <div className="animate-on-scroll bg-coerver-dark rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-white">Što ponijeti</h3>
                  </div>
                  <div className="space-y-3">
                    {whatToBring.map((item) => (
                      <div key={item} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                        <svg className="w-5 h-5 text-coerver-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">Galerija</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                Fotografije s kampova
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "animate-on-scroll relative rounded-3xl overflow-hidden group aspect-square",
                    index === 0 && "md:col-span-2 md:row-span-2"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Image
                    src={image}
                    alt={`Galerija ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <span className="text-coerver-green text-sm font-semibold">Iskustva</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
              Što kažu roditelji
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="animate-on-scroll bg-white rounded-3xl p-8 shadow-sm"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg italic">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-coerver-green/10 flex items-center justify-center text-coerver-green font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-coerver-dark">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google rating */}
          <div className="animate-on-scroll mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-coerver-dark font-semibold">4.9</span>
              <span className="text-gray-500 text-sm">na Google recenzijama</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="animate-on-scroll text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                <span className="text-coerver-green text-sm font-semibold">FAQ</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                Česta pitanja
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faq.map((faqItem, index) => (
                <div
                  key={index}
                  className="animate-on-scroll bg-gray-50 rounded-2xl overflow-hidden"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h4 className="font-bold text-coerver-dark pr-4">{faqItem.question}</h4>
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-coerver-green/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300",
                      openFaq === index && "rotate-180"
                    )}>
                      <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    openFaq === index ? "max-h-40" : "max-h-0"
                  )}>
                    <p className="px-6 pb-6 text-gray-600">{faqItem.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {camp.location && (
        <section className="py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-on-scroll">
                <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-coerver-green text-sm font-semibold">Lokacija</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-coerver-dark mb-4">
                  {camp.location}
                </h2>
                {camp.address && (
                  <p className="text-lg text-gray-600 mb-8">{camp.address}</p>
                )}

                {camp.map_url && (
                  <a
                    href={camp.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-coerver-dark text-white font-semibold px-6 py-4 rounded-full hover:bg-coerver-dark/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Otvori u Google Maps
                  </a>
                )}
              </div>

              <div className="animate-on-scroll relative aspect-video lg:aspect-square rounded-3xl overflow-hidden">
                <Image
                  src={heroImage}
                  alt="Lokacija kampa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {camp.address && (
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 text-white">
                        <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">{camp.address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Registration Section */}
      <section id="prijava" className="py-24 lg:py-32 bg-coerver-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coerver-green/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coerver-green/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="animate-on-scroll text-white">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 bg-red-500/20 rounded-full px-4 py-2 border border-red-500/30">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-300 text-sm font-semibold">
                    {isAlmostFull ? `Još samo ${availableSpots} mjesta!` : "Ograničen broj mjesta"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 rounded-full px-4 py-2 border border-yellow-500/30">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-yellow-300 text-sm font-semibold">Prošle godine rasprodano!</span>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-4">
                Rezerviraj svoje mjesto
              </h2>
              <p className="text-lg text-white/60 mb-6">
                Ne čekaj - prijave se zatvaraju, a mjesta se brzo pune!
              </p>

              {/* Quick benefits */}
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Besplatno otkazivanje 14 dana prije</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Plaćanje na rate</span>
                </div>
              </div>

              {/* Price card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
                <h3 className="text-white font-bold text-xl mb-6">Cijene</h3>

                <div className="space-y-4 mb-6">
                  {hasAccommodation && (
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                      <div>
                        <div className="text-white font-semibold">S noćenjem</div>
                        <div className="text-white/50 text-sm">Puni kamp sa smještajem</div>
                      </div>
                      <span className="text-3xl font-black text-white">{camp.price}€</span>
                    </div>
                  )}
                  {hasFullDay && (
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                      <div>
                        <div className="text-white font-semibold">Cjelodnevni</div>
                        <div className="text-white/50 text-sm">Sve aktivnosti bez spavanja</div>
                      </div>
                      <span className="text-3xl font-black text-white">{camp.price_full_day}€</span>
                    </div>
                  )}
                  {hasTrainingOnly && (
                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                      <div>
                        <div className="text-white font-semibold">Samo treninzi</div>
                        <div className="text-white/50 text-sm">Samo trening sessioni</div>
                      </div>
                      <span className="text-3xl font-black text-white">{camp.price_day_only}€</span>
                    </div>
                  )}
                </div>

                {camp.registration_deadline && (
                  <CountdownTimer deadline={camp.registration_deadline} />
                )}

                <div className="space-y-3">
                  {["Svi obroci uključeni", "Coerver oprema uključena", "Osiguranje uključeno"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-coerver-green flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spots */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60">Slobodna mjesta</span>
                  <span className={cn(
                    "font-bold text-xl",
                    isAlmostFull ? "text-red-400" : "text-white"
                  )}>{availableSpots} / {totalSpots}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      spotsPercentage >= 80
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : spotsPercentage >= 50
                        ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                        : "bg-gradient-to-r from-coerver-green to-emerald-400"
                    )}
                    style={{ width: `${spotsPercentage}%` }}
                  />
                </div>
                <p className="text-orange-400 text-sm mt-3 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {spotsPercentage >= 50
                    ? "Više od polovice mjesta već popunjeno!"
                    : "Prijavite se danas i osigurajte mjesto!"}
                </p>
              </div>
            </div>

            <div className="animate-on-scroll">
              <InquiryForm type="camp" programId={camp.id} programName={camp.title} title="Prijava na kamp" hasAccommodation={hasAccommodation} hasFullDay={hasFullDay} hasTrainingOnly={hasTrainingOnly} />
            </div>
          </div>
        </div>
      </section>

      {/* Back to camps */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <Link
            href="/za-igrace/kampovi"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-coerver-green font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Povratak na sve kampove
          </Link>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      {!isFull && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-40 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500">Cijena od</div>
              <div className="text-xl font-black text-coerver-dark">{displayPrice}€</div>
            </div>
            <a
              href="#prijava"
              className="flex-1 flex items-center justify-center gap-2 bg-coerver-green text-white font-bold py-4 rounded-full"
            >
              Prijavi se
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
