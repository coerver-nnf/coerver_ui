"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";

export function RegisterForm() {
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "coach" as UserRole,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne podudaraju.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Lozinka mora imati najmanje 8 znakova.");
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.role,
      formData.fullName,
      formData.phone || undefined
    );

    if (signUpError) {
      setError("Greška pri registraciji. Pokušajte ponovno.");
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-gradient-to-br from-coerver-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-coerver-green/25">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-coerver-dark mb-3">
          Registracija uspješna!
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Provjerite svoj email za potvrdu registracije. Nakon potvrde, vaš račun
          će biti pregledan od strane administratora.
        </p>
        <Link
          href="/prijava"
          className="inline-flex items-center gap-2 px-6 py-3 bg-coerver-dark text-white rounded-xl font-medium hover:bg-coerver-dark/90 transition-colors"
        >
          Prijavi se
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Ime i prezime *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Vaše ime i prezime"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Email adresa *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="vas@email.com"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Telefon
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+385 91 123 4567"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Coach Badge */}
      <div className="bg-coerver-green/5 border border-coerver-green/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coerver-green/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-coerver-dark text-sm">Registracija za trenere</span>
            <p className="text-xs text-gray-500">Trenutno je omogućena samo registracija za trenere</p>
          </div>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Lozinka *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Najmanje 8 znakova"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Potvrda lozinke *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Ponovite lozinku"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
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
        className="w-full py-4 bg-gradient-to-r from-coerver-dark to-gray-800 hover:from-coerver-dark/90 hover:to-gray-800/90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Registracija u tijeku...</span>
          </>
        ) : (
          <>
            <span>Registriraj se</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      {/* Terms */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Registracijom se slažete s našim{" "}
        <Link href="/uvjeti" className="text-coerver-green hover:underline">
          uvjetima korištenja
        </Link>{" "}
        i{" "}
        <Link href="/privatnost" className="text-coerver-green hover:underline">
          politikom privatnosti
        </Link>
      </p>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">ili</span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-500">
          Već imate račun?{" "}
          <Link
            href="/prijava"
            className="text-coerver-green font-semibold hover:text-coerver-green/80 transition-colors"
          >
            Prijavite se
          </Link>
        </p>
      </div>
    </form>
  );
}
