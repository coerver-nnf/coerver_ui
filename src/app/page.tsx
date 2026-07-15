import { HeroCarousel } from "@/components/home/HeroCarousel";
import { WhatIsCoerver } from "@/components/home/WhatIsCoerver";
import { AudienceCarousel } from "@/components/home/AudienceCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnersGallery } from "@/components/home/PartnersGallery";
import { BlogSection } from "@/components/home/BlogSection";
import { PartnerClubCTA } from "@/components/home/PartnerClubCTA";
import { ContactSection } from "@/components/home/ContactSection";
import { createStaticClient } from "@/lib/supabase/static";
import type { Post } from "@/lib/api/posts";

export const revalidate = 3600;

async function getRecentPosts(): Promise<Post[]> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        category:blog_categories(id, name, slug),
        author:profiles(id, full_name)
      `
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) throw error;
    return (data as Post[]) || [];
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <>
      {/* Hero Section */}
      <HeroCarousel />

      {/* What is Coerver Section */}
      <WhatIsCoerver />

      {/* Audience Carousel Section */}
      <AudienceCarousel />

      {/* Blog Section */}
      <BlogSection posts={posts} />

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
