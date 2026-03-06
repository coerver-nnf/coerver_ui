"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (signInError) {
      setError("Neispravni podaci za prijavu. Pokušajte ponovno.");
      setIsLoading(false);
      return;
    }

    // Check if user is a coach or admin
    if (data?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "coach" && profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("Pristup je trenutno omogućen samo trenerima. Za više informacija kontaktirajte nas.");
        setIsLoading(false);
        return;
      }
    }

    router.push("/dashboard");
  };

  return (
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="vas@email.com"
            required
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Lozinka
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
            placeholder="••••••••"
            required
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark placeholder:text-gray-400"
          />
        </div>
        <div className="mt-2 text-right">
          <Link
            href="/zaboravljena-lozinka"
            className="text-sm text-gray-500 hover:text-coerver-green transition-colors"
          >
            Zaboravili ste lozinku?
          </Link>
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
            <span>Prijava u tijeku...</span>
          </>
        ) : (
          <>
            <span>Prijavi se</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">ili</span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gray-500">
          Nemate račun?{" "}
          <Link
            href="/registracija"
            className="text-coerver-green font-semibold hover:text-coerver-green/80 transition-colors"
          >
            Registrirajte se
          </Link>
        </p>
      </div>
    </form>
  );
}
