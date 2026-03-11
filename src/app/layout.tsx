import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const messinaSans = localFont({
  src: [
    {
      path: "./fonts/MessinaSans-Book.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/MessinaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MessinaSans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/MessinaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/MessinaSans-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-messina",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Coerver Coaching Croatia | Nogometna Akademija",
    template: "%s | Coerver Coaching Croatia",
  },
  description:
    "Razvijamo vrhunske nogometaše kroz provjerenu Coerver metodologiju. Akademije, kampovi, individualni treninzi i edukacija trenera.",
  keywords: [
    "nogomet",
    "nogometna akademija",
    "Coerver",
    "trening",
    "djeca",
    "mladi nogometaši",
    "Zagreb",
    "Hrvatska",
    "treneri",
    "diploma",
  ],
  authors: [{ name: "Coerver Coaching Croatia" }],
  creator: "Coerver Coaching Croatia",
  metadataBase: new URL("https://coervercroatia.com"),
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: "https://coervercroatia.com",
    siteName: "Coerver Coaching Croatia",
    title: "Coerver Coaching Croatia | Nogometna Akademija",
    description:
      "Razvijamo vrhunske nogometaše kroz provjerenu Coerver metodologiju.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Coerver Coaching Croatia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coerver Coaching Croatia | Nogometna Akademija",
    description:
      "Razvijamo vrhunske nogometaše kroz provjerenu Coerver metodologiju.",
    images: ["/og-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Coerver Coaching Croatia",
  description:
    "Razvijamo vrhunske nogometaše kroz provjerenu Coerver metodologiju. Akademije, kampovi, individualni treninzi i edukacija trenera.",
  url: "https://coervercroatia.com",
  logo: "https://coervercroatia.com/images/coerver-logo.png",
  image: "https://coervercroatia.com/og-image",
  telephone: "+385 98 1873 228",
  email: "info@coervercroatia.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Zagreb",
    addressCountry: "HR",
  },
  sameAs: [
    "https://www.facebook.com/coervercroatia",
    "https://www.instagram.com/coervercroatia",
  ],
  sport: "Soccer",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Coerver Programs",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Coerver Akademije",
          description: "Redovni grupni treninzi po provjerenoj Coerver metodologiji",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Nogometni Kampovi",
          description: "Intenzivni višednevni programi tijekom školskih praznika",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Coerver Diploma Pathway",
          description: "Edukacija trenera po Coerver metodologiji",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className={messinaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
