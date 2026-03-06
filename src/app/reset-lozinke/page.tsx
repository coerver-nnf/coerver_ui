"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      // User should have a session from the recovery link
      setIsValidSession(!!session);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Lozinke se ne podudaraju.");
      return;
    }

    if (password.length < 8) {
      setError("Lozinka mora imati najmanje 8 znakova.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError("Greška pri promjeni lozinke. Pokušajte ponovno.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Došlo je do greške. Pokušajte ponovno.");
    }

    setIsLoading(false);
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] auth-page">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coerver-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Učitavanje...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] p-8 auth-page">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-coerver-dark mb-3">
              Link je istekao
            </h3>
            <p className="text-gray-500 mb-6">
              Link za resetiranje lozinke je istekao ili nije valjan.
              Zatražite novi link za resetiranje.
            </p>
            <Link
              href="/zaboravljena-lozinka"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-coerver-dark text-white rounded-xl font-medium hover:bg-coerver-dark/90 transition-colors"
            >
              Zatraži novi link
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex auth-page">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-coerver-dark via-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/Miami-133.webp"
            alt="Coerver Training"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-coerver-dark/95 via-coerver-dark/80 to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-coerver-green/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Nova lozinka
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Odaberite novu, sigurnu lozinku za svoj račun. Preporučujemo
              korištenje kombinacije slova, brojeva i simbola.
            </p>
          </div>

          {/* Security Tips */}
          <div className="space-y-3">
            <p className="text-white/40 text-sm font-medium uppercase tracking-wide mb-2">Savjeti za sigurnost</p>
            {[
              "Koristite najmanje 8 znakova",
              "Kombinirajte velika i mala slova",
              "Dodajte brojeve i simbole",
            ].map((tip, index) => (
              <div key={index} className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-5 h-5 rounded-full bg-coerver-green/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{tip}</span>
              </div>
            ))}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-coerver-dark mb-3">
                  Lozinka promijenjena!
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Vaša lozinka je uspješno promijenjena. Sada se možete prijaviti
                  s novom lozinkom.
                </p>
                <Link
                  href="/prijava"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-coerver-green to-emerald-600 text-white rounded-xl font-medium hover:from-coerver-green/90 hover:to-emerald-600/90 transition-colors shadow-lg shadow-coerver-green/25"
                >
                  Prijavi se
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              /* Form State */
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-coerver-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-coerver-green/25">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-coerver-dark mb-2">
                    Postavite novu lozinku
                  </h1>
                  <p className="text-gray-500">
                    Unesite i potvrdite svoju novu lozinku
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Nova lozinka
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Najmanje 8 znakova"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Potvrda lozinke
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ponovite novu lozinku"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Zahtjevi za lozinku</p>
                    <div className="space-y-2">
                      {[
                        { check: password.length >= 8, label: "Najmanje 8 znakova" },
                        { check: /[A-Z]/.test(password), label: "Jedno veliko slovo" },
                        { check: /[0-9]/.test(password), label: "Jedan broj" },
                      ].map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.check ? 'bg-coerver-green' : 'bg-gray-200'}`}>
                            {req.check && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={req.check ? 'text-coerver-dark' : 'text-gray-400'}>{req.label}</span>
                        </div>
                      ))}
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
                        <span>Spremanje...</span>
                      </>
                    ) : (
                      <>
                        <span>Spremi novu lozinku</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
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
