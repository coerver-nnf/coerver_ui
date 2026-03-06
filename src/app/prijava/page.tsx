import { LoginForm } from "@/components/forms/LoginForm";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijava",
  description: "Prijavite se na svoj Coerver Coaching Croatia račun.",
};

export default function PrijavaPage() {
  return (
    <div className="min-h-screen flex auth-page">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-coerver-dark via-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Miami-146.png"
            alt="Coerver Training"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-coerver-dark/90 via-coerver-dark/70 to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-coerver-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-coerver-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/images/coerver-logo.png"
                alt="Coerver Coaching"
                width={180}
                height={60}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Main Content */}
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-coerver-green rounded-full" />
              <span className="text-coerver-green text-sm font-semibold uppercase tracking-widest">Trenerski Portal</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Razvijajte buduće
              <span className="block text-coerver-green">prvake</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Pristupite ekskluzivnim Coerver vježbama, materijalima za trenere i
              naprednim tehnikama koje koriste najbolji treneri diljem svijeta.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-12">
            <div>
              <div className="text-4xl font-bold text-white">60+</div>
              <div className="text-white/40 text-sm">Zemalja</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white">40</div>
              <div className="text-white/40 text-sm">Godina iskustva</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white">1M+</div>
              <div className="text-white/40 text-sm">Treniranih igrača</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8faf8]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/images/coerver-logo.png"
                alt="Coerver Coaching"
                width={160}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-coerver-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-coerver-green/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-coerver-dark mb-2">
                Dobrodošli natrag!
              </h1>
              <p className="text-gray-500">
                Prijavite se za pristup trenerskom portalu
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Trebate pomoć?{" "}
              <Link href="/kontakt" className="text-coerver-green hover:text-coerver-green/80 font-medium transition-colors">
                Kontaktirajte nas
              </Link>
            </p>
          </div>

          {/* Mobile Footer Stats */}
          <div className="lg:hidden mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-coerver-dark">60+</div>
                <div className="text-gray-400 text-xs">Zemalja</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-coerver-dark">40</div>
                <div className="text-gray-400 text-xs">Godina</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-coerver-dark">1M+</div>
                <div className="text-gray-400 text-xs">Igrača</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
