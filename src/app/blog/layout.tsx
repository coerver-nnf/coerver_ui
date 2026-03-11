import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Najnovije vijesti, savjeti i članci o nogometnom treningu, Coerver metodologiji i razvoju mladih igrača.",
  openGraph: {
    title: "Blog | Coerver Coaching Croatia",
    description:
      "Najnovije vijesti, savjeti i članci o nogometnom treningu i razvoju mladih igrača.",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
