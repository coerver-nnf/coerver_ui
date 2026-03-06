"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-lozinke`,
      });

      if (resetError) {
        setError("Greška pri slanju emaila. Pokušajte ponovno.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Došlo je do greške. Pokušajte ponovno.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex auth-page">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-coerver-dark via-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Miami-141.png"
            alt="Coerver Training"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-coerver-dark/95 via-coerver-dark/80 to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-coerver-green/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

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
          <div className="max-w-md">
            <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
              <svg className="w-10 h-10 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Zaboravili ste lozinku?
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Bez brige! Unesite svoju email adresu i poslat ćemo vam upute
              za resetiranje lozinke.
            </p>
          </div>

          {/* Bottom info */}
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Sigurno resetiranje lozinke putem emaila</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
            {isSuccess ? (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-gradient-to-br from-coerver-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-coerver-green/25">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-coerver-dark mb-3">
                  Provjerite email!
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Poslali smo vam upute za resetiranje lozinke na{" "}
                  <span className="font-medium text-coerver-dark">{email}</span>
                </p>
                <div className="space-y-3">
                  <Link
                    href="/prijava"
                    className="block w-full py-3.5 bg-coerver-dark text-white rounded-xl font-medium hover:bg-coerver-dark/90 transition-colors text-center"
                  >
                    Povratak na prijavu
                  </Link>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="block w-full py-3.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Pošalji ponovno
                  </button>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/25">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-coerver-dark mb-2">
                    Resetirajte lozinku
                  </h1>
                  <p className="text-gray-500">
                    Unesite email adresu povezanu s vašim računom
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Email adresa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vas@email.com"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-coerver-green to-emerald-600 hover:from-coerver-green/90 hover:to-emerald-600/90 text-white font-semibold rounded-xl shadow-lg shadow-coerver-green/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Slanje u tijeku...</span>
                      </>
                    ) : (
                      <>
                        <span>Pošalji upute</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400">ili</span>
                  </div>
                </div>

                {/* Back to Login */}
                <Link
                  href="/prijava"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Povratak na prijavu
                </Link>
              </>
            )}
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
    </div>
  );
}
