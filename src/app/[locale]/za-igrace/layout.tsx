import { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "Za Igrače - Akademije, Kampovi i Treninzi",
  description:
    "Razvij svoj puni potencijal s Coerver programima. Akademije, kampovi i individualni treninzi za mlade nogometaše od 6 do 16 godina.",
  openGraph: {
    title: "Za Igrače | Coerver Coaching Croatia",
    description:
      "Razvij svoj puni potencijal s Coerver programima. Akademije, kampovi i individualni treninzi za mlade nogometaše.",
  },
}

export default function ZaIgraceLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  setRequestLocale(locale)
  return children
}
