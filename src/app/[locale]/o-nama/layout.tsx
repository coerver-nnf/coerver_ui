import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "O Nama",
  description:
    "Coerver Coaching Croatia - dio globalne mreže koja razvija vrhunske nogometaše već više od 40 godina. Saznajte više o našoj metodologiji i timu.",
  openGraph: {
    title: "O Nama | Coerver Coaching Croatia",
    description:
      "Coerver Coaching Croatia - dio globalne mreže koja razvija vrhunske nogometaše već više od 40 godina.",
  },
}

export default function ONamaLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  setRequestLocale(locale)
  return children
}
