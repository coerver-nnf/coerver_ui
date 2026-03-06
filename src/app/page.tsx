import { HeroCarousel } from "@/components/home/HeroCarousel";
import { WhatIsCoerver } from "@/components/home/WhatIsCoerver";
import { AudienceCarousel } from "@/components/home/AudienceCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnersGallery } from "@/components/home/PartnersGallery";
import { BlogSection } from "@/components/home/BlogSection";
import { PartnerClubCTA } from "@/components/home/PartnerClubCTA";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroCarousel />

      {/* What is Coerver Section */}
      <WhatIsCoerver />

      {/* Audience Carousel Section */}
      <AudienceCarousel />

      {/* Blog Section */}
      <BlogSection />

      {/* Partner Club CTA */}
      <PartnerClubCTA />

      {/* Testimonials Section - Upgraded */}
      <Testimonials />

      {/* Partners Gallery */}
      <PartnersGallery />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
