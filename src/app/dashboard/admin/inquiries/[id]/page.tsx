"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { StatusBadge, ConfirmDialog, LoadingState } from "@/components/admin";
import {
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  Inquiry,
  InquiryStatus,
  INQUIRY_TYPE_LABELS,
} from "@/lib/api/inquiries";
import { formatDate } from "@/lib/utils";

export default function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInquiry();
  }, [id]);

  async function loadInquiry() {
    setLoading(true);
    try {
      const data = await getInquiryById(id);
      setInquiry(data);
      setNotes(data.admin_notes || "");
    } catch (error) {
      console.error("Error loading inquiry:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(status: InquiryStatus) {
    if (!inquiry) return;
    try {
      await updateInquiry({ id, status });
      await loadInquiry();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function handleSaveNotes() {
    if (!inquiry) return;
    setSaving(true);
    try {
      await updateInquiry({ id, admin_notes: notes });
      await loadInquiry();
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteInquiry(id);
      router.push("/dashboard/admin/inquiries");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
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

  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-coerver-gray-500">Upit nije pronađen</p>
        <Link href="/dashboard/admin/inquiries" className="text-coerver-green hover:underline mt-2 inline-block">
          Natrag na popis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/inquiries"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-coerver-gray-900">Upit od {inquiry.name}</h1>
          <p className="text-coerver-gray-500">{formatDate(inquiry.created_at)}</p>
        </div>
        <StatusBadge status={inquiry.status} size="md" />
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Kontakt podaci</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-coerver-gray-500">Ime</p>
            <p className="font-medium text-coerver-gray-900">{inquiry.name}</p>
          </div>
          <div>
            <p className="text-sm text-coerver-gray-500">Email</p>
            <a href={`mailto:${inquiry.email}`} className="font-medium text-coerver-green hover:underline">
              {inquiry.email}
            </a>
          </div>
          {inquiry.phone && (
            <div>
              <p className="text-sm text-coerver-gray-500">Telefon</p>
              <a href={`tel:${inquiry.phone}`} className="font-medium text-coerver-green hover:underline">
                {inquiry.phone}
              </a>
            </div>
          )}
          <div>
            <p className="text-sm text-coerver-gray-500">Tip upita</p>
            <p className="font-medium text-coerver-gray-900">{INQUIRY_TYPE_LABELS[inquiry.type]}</p>
          </div>
          {inquiry.child_name && (
            <div>
              <p className="text-sm text-coerver-gray-500">Ime djeteta</p>
              <p className="font-medium text-coerver-gray-900">{inquiry.child_name}</p>
            </div>
          )}
          {inquiry.child_age && (
            <div>
              <p className="text-sm text-coerver-gray-500">Dob djeteta</p>
              <p className="font-medium text-coerver-gray-900">{inquiry.child_age} godina</p>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {inquiry.message && (
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Poruka</h2>
          <p className="text-coerver-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
        </div>
      )}

      {/* Admin Notes */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Bilješke</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dodajte bilješke o ovom upitu..."
          rows={4}
        />
        <div className="mt-4">
          <Button
            onClick={handleSaveNotes}
            isLoading={saving}
            disabled={notes === (inquiry.admin_notes || "")}
            variant="outline"
            size="sm"
          >
            Spremi bilješke
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h2 className="text-lg font-semibold text-coerver-gray-900 mb-4">Akcije</h2>
        <div className="flex flex-wrap gap-3">
          {inquiry.status === "new" && (
            <Button onClick={() => handleStatusChange("in_progress")} variant="primary">
              Označi kao "U obradi"
            </Button>
          )}
          {inquiry.status === "in_progress" && (
            <Button onClick={() => handleStatusChange("resolved")} variant="primary">
              Označi kao "Riješeno"
            </Button>
          )}
          {inquiry.status !== "new" && (
            <Button onClick={() => handleStatusChange("new")} variant="outline">
              Vrati na "Novo"
            </Button>
          )}
          <Button onClick={() => handleStatusChange("spam")} variant="ghost">
            Označi kao spam
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
          >
            Obriši
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Obriši upit"
        message={`Jeste li sigurni da želite obrisati ovaj upit? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
