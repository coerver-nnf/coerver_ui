"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "coerver-cookie-consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay cookie banner to not interfere with LCP measurement
      // Hero image should be measured as LCP, not cookie banner text
      const timer = setTimeout(() => setShowBanner(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-coerver-dark rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Icon */}
            <div className="hidden md:flex w-12 h-12 rounded-full bg-coerver-green/20 items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">Koristimo kolačiće</h3>
              <p className="text-white/70 text-sm mb-4">
                Ova web stranica koristi nužne kolačiće za pravilno funkcioniranje i sigurnost vaše sesije.
                Ovi kolačići su potrebni za prijavu i korištenje korisničkog računa.
                Ne koristimo kolačiće za praćenje ili marketing.{" "}
                <Link href="/privatnost" className="text-coerver-green hover:underline">
                  Saznajte više
                </Link>
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptCookies}
                  className="inline-flex items-center justify-center gap-2 bg-coerver-green hover:bg-coerver-green/90 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prihvaćam
                </button>
                <button
                  onClick={declineCookies}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors border border-white/20"
                >
                  Samo nužni
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={declineCookies}
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Zatvori"
            >
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
