"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { StatusBadge, ConfirmDialog, LoadingState } from "@/components/admin";
import {
  getUserById,
  updateUser,
  deleteUser,
  User,
  UserRole,
} from "@/lib/api/users";
import { formatDate } from "@/lib/utils";

const ROLE_LABELS: Record<UserRole, string> = {
  player: "Igrač",
  coach: "Trener",
  admin: "Administrator",
};

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {
    setLoading(true);
    try {
      const data = await getUserById(id);
      setUser(data);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(role: UserRole) {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser({ id, role });
      await loadUser();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleApprovalToggle() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser({ id, is_approved: !user.is_approved });
      await loadUser();
    } catch (error) {
      console.error("Error updating approval:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteUser(id);
      router.push("/dashboard/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-coerver-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <LoadingState rows={5} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-coerver-gray-500">Korisnik nije pronađen</p>
        <Link href="/dashboard/admin/users" className="text-coerver-green hover:underline mt-2 inline-block">
          Natrag na popis
        </Link>
      </div>
    );
  }

  const roleOptions = [
    { value: "player", label: "Igrač" },
    { value: "coach", label: "Trener" },
    { value: "admin", label: "Administrator" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/users"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-coerver-gray-900">
            {user.full_name || "Bez imena"}
          </h1>
          <p className="text-coerver-gray-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : user.role === "coach"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {ROLE_LABELS[user.role]}
          </span>
          <StatusBadge status={user.is_approved ? "approved" : "pending"} size="md" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Profil</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-coerver-gray-500">Ime i prezime</p>
            <p className="font-medium text-coerver-gray-900">{user.full_name || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-coerver-gray-500">Email</p>
            <p className="font-medium text-coerver-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-coerver-gray-500">Registriran</p>
            <p className="font-medium text-coerver-gray-900">{formatDate(user.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-coerver-gray-500">Zadnja izmjena</p>
            <p className="font-medium text-coerver-gray-900">{formatDate(user.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Upravljanje ulogom</h2>
        <div className="max-w-xs">
          <Select
            label="Uloga korisnika"
            options={roleOptions}
            value={user.role}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            disabled={saving}
          />
        </div>
        <p className="mt-2 text-sm text-coerver-gray-500">
          Promjena uloge utječe na pristup različitim dijelovima sustava.
        </p>
      </div>

      {/* Approval Status */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Status odobrenja</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-coerver-gray-900">
              {user.is_approved ? "Korisnik je odobren" : "Korisnik čeka odobrenje"}
            </p>
            <p className="text-sm text-coerver-gray-500">
              {user.is_approved
                ? "Korisnik ima pristup svim funkcijama svoje uloge."
                : "Korisnik nema pristup dok ne bude odobren."}
            </p>
          </div>
          <Button
            onClick={handleApprovalToggle}
            isLoading={saving}
            variant={user.is_approved ? "outline" : "primary"}
          >
            {user.is_approved ? "Ukloni odobrenje" : "Odobri"}
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      {user.role !== "admin" && (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-4">Opasna zona</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-coerver-gray-900">Obriši korisnika</p>
              <p className="text-sm text-coerver-gray-500">
                Trajno brisanje korisnika i svih povezanih podataka.
              </p>
            </div>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
            >
              Obriši korisnika
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Obriši korisnika"
        message={`Jeste li sigurni da želite obrisati korisnika "${user.full_name || user.email}"? Svi povezani podaci bit će trajno obrisani.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
