"use client";

import { Modal } from "./Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Potvrdi",
  cancelLabel = "Odustani",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const iconColors = {
    danger: "text-red-600 bg-red-100",
    warning: "text-yellow-600 bg-yellow-100",
    info: "text-blue-600 bg-blue-100",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  };

  const icons = {
    danger: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full ${iconColors[variant]} mb-4`}>
          {icons[variant]}
        </div>
        <h3 className="text-lg font-semibold text-coerver-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-coerver-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-colors
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${buttonStyles[variant]}`}
          >
            {isLoading ? "Učitavanje..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
