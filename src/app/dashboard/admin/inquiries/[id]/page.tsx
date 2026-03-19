"use client";

import { useState, useEffect } from "react";
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
import { getAcademyById } from "@/lib/api/academies";
import { getCampById } from "@/lib/api/camps";
import { getCourseById } from "@/lib/api/courses";
import { formatDate } from "@/lib/utils";

// Helper to extract format from message (e.g., "Format: Uživo, Klub: ..." -> "Uživo")
function extractFormatFromMessage(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/^Format:\s*(Uživo|Online)/i);
  return match ? match[1] : null;
}

export default function InquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [programName, setProgramName] = useState<string | null>(null);
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

      // Fetch program name if program_id exists
      if (data.program_id) {
        try {
          let name = null;
          if (data.type === "academy") {
            const academy = await getAcademyById(data.program_id);
            name = academy?.name || null;
          } else if (data.type === "camp") {
            const camp = await getCampById(data.program_id);
            name = camp?.title || null;
          } else if (data.type === "course") {
            const course = await getCourseById(data.program_id);
            name = course?.title || null;
          }
          setProgramName(name);
        } catch (err) {
          console.error("Error loading program:", err);
          setProgramName(null);
        }
      }
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
          {programName && (
            <div>
              <p className="text-sm text-coerver-gray-500">
                {inquiry.type === "academy" ? "Akademija" : inquiry.type === "camp" ? "Kamp" : "Tečaj"}
              </p>
              <p className="font-medium text-coerver-gray-900">{programName}</p>
            </div>
          )}
          {extractFormatFromMessage(inquiry.message) && (
            <div>
              <p className="text-sm text-coerver-gray-500">Format sudjelovanja</p>
              <p className="font-medium text-coerver-gray-900">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  extractFormatFromMessage(inquiry.message) === "Online"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {extractFormatFromMessage(inquiry.message) === "Online" ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {extractFormatFromMessage(inquiry.message)}
                </span>
              </p>
            </div>
          )}
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
