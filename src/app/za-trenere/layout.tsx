import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Za Trenere - Coerver Diploma Pathway",
  description:
    "Educiraj se po svjetski priznatoj Coerver metodologiji. Coerver Intro, Youth Diploma 1 i Youth Diploma 2 tečajevi za nogometne trenere.",
  openGraph: {
    title: "Za Trenere | Coerver Coaching Croatia",
    description:
      "Educiraj se po svjetski priznatoj Coerver metodologiji. Tečajevi za nogometne trenere.",
  },
}

export default function ZaTrenereLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
