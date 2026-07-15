import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createStaticClient } from "@/lib/supabase/static"
import { Camp } from "@/lib/api/camps"
import CampDetailContent from "./CampDetailContent"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCamp(slug: string): Promise<Camp | null> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("camps")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) return null
  return data as Camp
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const camp = await getCamp(slug)

  if (!camp) {
    return {
      title: "Kamp nije pronađen",
    }
  }

  const title = `${camp.title} - Nogometni Kamp`
  const description = camp.description
    ? camp.description.slice(0, 160)
    : `${camp.title} - Coerver nogometni kamp u ${camp.location || "Hrvatskoj"}. Prijavite se za nezaboravno nogometno iskustvo.`

  return {
    title,
    description,
    openGraph: {
      title: `${camp.title} | Coerver Coaching Croatia`,
      description,
      images: camp.image_url
        ? [{ url: camp.image_url, width: 1200, height: 630, alt: camp.title }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${camp.title} | Coerver Coaching Croatia`,
      description,
      images: camp.image_url ? [camp.image_url] : undefined,
    },
  }
}

export default async function CampDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const camp = await getCamp(slug)

  if (!camp) {
    notFound()
  }

  return <CampDetailContent camp={camp} />
}
