"use client";

import { useState } from "react";
import Image from "next/image";

const countries = [
  {
    name: "Hrvatska",
    flag: "🇭🇷",
    coaches: "1000+",
    players: "5000+",
    cities: ["Zagreb", "Split", "Varaždin"],
    image: "/images/photoshoot/Coerver_Kustosija-10.webp",
  },
  {
    name: "Slovenija",
    flag: "🇸🇮",
    coaches: "500+",
    players: "1000+",
    cities: ["Ljubljana", "Kranj"],
    image: "/images/photoshoot/Coerver_Kustosija-30.webp",
  },
  {
    name: "Bosna i Hercegovina",
    flag: "🇧🇦",
    coaches: "100+",
    players: "1000+",
    cities: ["Široki Brijeg", "Sarajevo"],
    image: "/images/photoshoot/Coerver_Kustosija-50.webp",
  },
];

export function RegionMap() {
  const [activeCountry, setActiveCountry] = useState(0);

  return (
    <div className="relative h-full rounded-3xl lg:rounded-l-none overflow-hidden bg-coerver-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        {countries.map((country, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ${idx === activeCountry ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={country.image}
              alt={country.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coerver-dark via-coerver-dark/80 to-coerver-dark/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
        {/* Top - Country selector tabs */}
        <div className="flex gap-2">
          {countries.map((country, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCountry(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                idx === activeCountry
                  ? "bg-coerver-green text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <span className="text-lg">{country.flag}</span>
              <span className="hidden sm:inline">{country.name}</span>
            </button>
          ))}
        </div>

        {/* Middle - Stats grid */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-5xl lg:text-7xl font-black text-white mb-1">
                {countries[activeCountry].coaches}
              </div>
              <div className="text-white/50 text-sm lg:text-base font-medium">Educiranih trenera</div>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-7xl font-black text-coerver-green mb-1">
                {countries[activeCountry].players}
              </div>
              <div className="text-white/50 text-sm lg:text-base font-medium">Educiranih igrača</div>
            </div>
          </div>
        </div>

        {/* Bottom - Cities */}
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Lokacije</p>
          <div className="flex flex-wrap gap-2">
            {countries[activeCountry].cities.map((city, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-medium"
              >
                <span className="w-1.5 h-1.5 bg-coerver-green rounded-full" />
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-32 h-32 bg-coerver-green/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-coerver-green/10 rounded-full blur-[40px] pointer-events-none" />
    </div>
  );
}
