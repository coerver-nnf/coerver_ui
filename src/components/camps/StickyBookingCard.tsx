"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/tracking";

interface StickyBookingCardProps {
  lowestPrice: number | null;
  availableSpots: number;
  totalSpots: number;
  isFull: boolean;
  registrationDeadline?: string;
}

export function StickyBookingCard({
  lowestPrice,
  availableSpots,
  totalSpots,
  isFull,
  registrationDeadline,
}: StickyBookingCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [isExpired, setIsExpired] = useState(false);

  const spotsPercentage = ((totalSpots - availableSpots) / totalSpots) * 100;
  const isAlmostFull = availableSpots <= 5 && availableSpots > 0;

  // Show sticky card after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!registrationDeadline) return;

    const calculateTimeLeft = () => {
      const difference = new Date(registrationDeadline).getTime() - new Date().getTime();
      if (difference <= 0) {
        setIsExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [registrationDeadline]);

  if (isFull) return null;

  return (
    <div
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-300",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
      )}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden">
        {/* Urgency header */}
        {(isAlmostFull || (registrationDeadline && !isExpired)) && (
          <div className={cn(
            "px-4 py-2 text-center text-sm font-semibold",
            isAlmostFull ? "bg-red-500 text-white" : "bg-orange-500 text-white"
          )}>
            {isAlmostFull ? (
              <span>Još samo {availableSpots} mjesta!</span>
            ) : (
              <span>Prijave zatvaraju za {timeLeft.days}d {timeLeft.hours}h</span>
            )}
          </div>
        )}

        <div className="p-5">
          {/* Price */}
          <div className="mb-4">
            <div className="text-sm text-gray-500">Cijena od</div>
            <div className="text-3xl font-black text-coerver-dark">{lowestPrice}€</div>
          </div>

          {/* Spots indicator */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-500">Popunjenost</span>
              <span className={cn(
                "font-semibold",
                spotsPercentage >= 80 ? "text-red-500" : "text-coerver-dark"
              )}>{availableSpots} slobodnih</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  spotsPercentage >= 80
                    ? "bg-red-500"
                    : spotsPercentage >= 50
                    ? "bg-orange-500"
                    : "bg-coerver-green"
                )}
                style={{ width: `${spotsPercentage}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          <a
            href="#prijava"
            onClick={() => trackEvent.ctaClick("prijavi_se", "sticky_sidebar")}
            className="block w-full bg-coerver-green hover:bg-coerver-green/90 text-white font-bold py-3.5 rounded-xl text-center transition-colors"
          >
            Prijavi se odmah
          </a>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Besplatno otkazivanje
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
