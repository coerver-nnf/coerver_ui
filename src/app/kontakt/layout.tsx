import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktirajte Coerver Coaching Croatia. Pošaljite upit za akademije, kampove ili edukaciju trenera. Tu smo za sva vaša pitanja.",
  openGraph: {
    title: "Kontakt | Coerver Coaching Croatia",
    description:
      "Kontaktirajte Coerver Coaching Croatia. Tu smo za sva vaša pitanja.",
  },
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
