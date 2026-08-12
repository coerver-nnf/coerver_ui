import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { localeAlternates, OG_LOCALES } from "@/lib/i18n/seo";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguagePrompt } from "@/components/LanguagePrompt";
import { Analytics } from "@vercel/analytics/next";
import { ClarityAnalytics } from "@/components/ClarityAnalytics";

const messinaSans = localFont({
  src: [
    {
      path: "../fonts/MessinaSans-Book.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/MessinaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/MessinaSans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/MessinaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/MessinaSans-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-messina",
  display: "swap",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s | Coerver Coaching Croatia",
    },
    description: t("description"),
    keywords: t("keywords").split(", "),
    authors: [{ name: "Coerver Coaching Croatia" }],
    creator: "Coerver Coaching Croatia",
    metadataBase: new URL("https://coervercroatia.com"),
    alternates: localeAlternates("/", locale as Locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale as Locale] ?? "hr_HR",
      url: "https://coervercroatia.com",
      siteName: "Coerver Coaching Croatia",
      title: t("title"),
      description: t("ogDescription"),
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
      title: t("title"),
      description: t("ogDescription"),
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
}

async function buildJsonLd(locale: string) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Coerver Coaching Croatia",
    description: t("description"),
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
            name: t("jsonLd.academies"),
            description: t("jsonLd.academiesDesc"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t("jsonLd.camps"),
            description: t("jsonLd.campsDesc"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t("jsonLd.diploma"),
            description: t("jsonLd.diplomaDesc"),
          },
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const jsonLd = await buildJsonLd(locale);

  return (
    <html lang={locale} className={messinaSans.variable}>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://cshwyyvwwzzntmzzirja.supabase.co" />
        <link rel="preconnect" href="https://a.clarity.ms" />
        <link rel="dns-prefetch" href="https://scripts.clarity.ms" />

        {/* Preload hero image for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="/images/photoshoot/Miami-141-mobile.webp"
          type="image/webp"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CookieConsent />
          <LanguagePrompt />
        </NextIntlClientProvider>
        <Analytics />
        <ClarityAnalytics />
      </body>
    </html>
  );
}
