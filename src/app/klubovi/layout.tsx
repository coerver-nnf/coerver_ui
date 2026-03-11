import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partner Klubovi",
  description:
    "Coerver Coaching Croatia surađuje s vodećim nogometnim klubovima. Postanite partner klub i unaprijedite razvoj mladih igrača.",
  openGraph: {
    title: "Partner Klubovi | Coerver Coaching Croatia",
    description:
      "Coerver Coaching Croatia surađuje s vodećim nogometnim klubovima.",
  },
}

export default function KluboviLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
