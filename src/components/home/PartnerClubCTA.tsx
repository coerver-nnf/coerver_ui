"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PartnerClubCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/photoshoot/Miami-144.png"
          alt="Coerver Partner Club"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Partner Club Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/PARTNER-KLUB-LOGO-NO-EDGES-300x155.png"
              alt="Coerver Partner Club"
              width={300}
              height={155}
              className="w-auto h-24 md:h-32"
            />
          </div>

          {/* Description */}
          <p className="text-white text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Coerver® Coaching nudi poseban partnerski program svim klubovima od amaterske do profesionalne razine, koji žele kontinuiranu edukaciju i prepoznatljivost u svom okruženju
          </p>

          {/* CTA Button */}
          <Link href="/klubovi">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-coerver-dark font-semibold px-8 py-4 text-base"
            >
              POSTANITE COERVER® PARTNER KLUB
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
