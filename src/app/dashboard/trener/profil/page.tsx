"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CoachProfilePage() {
  const router = useRouter();
  const { profile, loading, isAuthenticated, isApproved } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // TODO: Re-enable auth checks when Supabase is connected

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement profile update with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  // Mock data for demonstration
  const accessibleCategories = [
    { name: "Ball Mastery", color: "from-coerver-green to-green-700" },
    { name: "1v1 Potezi", color: "from-coerver-dark to-gray-800" },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-coerver-dark">Moj Profil</h1>
        <p className="text-gray-500 mt-1">
          Pregledajte i uredite svoje podatke
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-coerver-dark via-gray-900 to-coerver-dark p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-coerver-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-coerver-green/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-coerver-green to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {profile?.full_name?.charAt(0) || "T"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {profile?.full_name || "Trener"}
                  </h2>
                  <p className="text-white/60 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-coerver-green rounded-full" />
                    Coerver Trener
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-coerver-dark text-lg">Osobni podaci</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-coerver-green hover:bg-coerver-green/10 rounded-xl transition-colors"
                  >
                    Uredi profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Odustani
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 text-sm font-medium bg-coerver-green text-white rounded-xl hover:bg-coerver-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving && (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      Spremi
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Ime i prezime
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark font-medium disabled:text-gray-500"
                    placeholder="Vaše ime i prezime"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Email adresa
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl text-gray-400 cursor-not-allowed"
                    placeholder="vas@email.com"
                  />
                  <p className="text-xs text-gray-400 mt-1.5 pl-1">Email adresa se ne može promijeniti</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-coerver-green focus:bg-white transition-all text-coerver-dark font-medium disabled:text-gray-500"
                    placeholder="+385 91 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-coerver-dark mb-5">Status računa</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Aktivan
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm">Uloga</span>
                <span className="text-coerver-dark font-semibold text-sm">Trener</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 text-sm">Član od</span>
                <span className="text-coerver-dark font-semibold text-sm">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("hr-HR", {
                        year: "numeric",
                        month: "long",
                      })
                    : "Siječanj 2024"}
                </span>
              </div>
            </div>
          </div>

          {/* Access */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-coerver-dark mb-5">Pristup kategorijama</h3>
            <div className="space-y-3">
              {accessibleCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} shadow-md`} />
                  <span className="text-coerver-dark font-medium flex-1">{cat.name}</span>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Za proširenje pristupa kontaktirajte administratora.
            </p>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-coerver-dark mb-5">Sigurnost</h3>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-coerver-dark rounded-xl transition-colors font-medium">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Promijeni lozinku
            </button>
          </div>

          {/* Coerver Logo */}
          <div className="flex justify-center pt-4">
            <Image
              src="/images/coerver-logo.png"
              alt="Coerver Coaching"
              width={120}
              height={40}
              className="h-8 w-auto opacity-20"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
