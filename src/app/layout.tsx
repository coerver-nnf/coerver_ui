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
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: "https://coerver.hr",
    siteName: "Coerver Coaching Croatia",
    title: "Coerver Coaching Croatia | Nogometna Akademija",
    description:
      "Razvijamo vrhunske nogometaše kroz provjerenu Coerver metodologiju.",
    images: [
      {
        url: "/images/og-image.jpg",
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
    images: ["/images/og-image.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className={messinaSans.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
