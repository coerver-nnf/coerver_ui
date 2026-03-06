import { RegisterForm } from "@/components/forms/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registracija",
  description: "Kreirajte svoj Coerver Coaching Croatia račun.",
};

export default function RegistracijaPage() {
  return (
    <div className="min-h-screen flex auth-page">
      {/* Left Side - Form */}
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
              <div className="w-16 h-16 bg-gradient-to-br from-coerver-dark to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg className="w-8 h-8 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-coerver-dark mb-2">
                Postanite Coerver trener
              </h1>
              <p className="text-gray-500">
                Pridružite se globalnoj mreži certificiranih trenera
              </p>
            </div>

            <RegisterForm />
          </div>

          {/* Info Note */}
          <div className="mt-6 bg-coerver-green/5 border border-coerver-green/20 rounded-2xl p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-coerver-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-coerver-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-coerver-dark mb-1">Napomena</p>
                <p className="text-gray-500">
                  Nakon registracije, vaš račun će biti pregledan od strane
                  administratora. Dobit ćete email obavijest kada bude odobren.
                </p>
              </div>
            </div>
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
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-coerver-dark via-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Miami-148.webp"
            alt="Coerver Training"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-coerver-dark/90 via-coerver-dark/70 to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-coerver-green/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-coerver-green/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex justify-end">
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
          <div className="max-w-lg ml-auto text-right">
            <div className="flex items-center gap-3 mb-6 justify-end">
              <span className="text-coerver-green text-sm font-semibold uppercase tracking-widest">Pridružite nam se</span>
              <div className="h-1 w-12 bg-coerver-green rounded-full" />
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Postanite dio
              <span className="block text-coerver-green">globalne mreže</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Pridružite se tisućama trenera diljem svijeta koji koriste
              Coerver metodologiju za razvoj budućih nogometnih zvijezda.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              "Pristup ekskluzivnim vježbama i materijalima",
              "Certifikacija prepoznata diljem svijeta",
              "Podrška i edukacija od stručnjaka",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white/80">
                <div className="w-6 h-6 rounded-full bg-coerver-green/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
