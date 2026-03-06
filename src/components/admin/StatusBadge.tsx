"use client";

import { cn } from "@/lib/utils";

type StatusType =
  | "draft"
  | "published"
  | "archived"
  | "active"
  | "inactive"
  | "cancelled"
  | "completed"
  | "new"
  | "in_progress"
  | "resolved"
  | "spam"
  | "pending"
  | "approved"
  | "rejected";

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "sm" | "md";
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  draft: {
    label: "Skica",
    className: "bg-gray-100 text-gray-700",
  },
  published: {
    label: "Objavljeno",
    className: "bg-green-100 text-green-700",
  },
  archived: {
    label: "Arhivirano",
    className: "bg-gray-100 text-gray-600",
  },
  active: {
    label: "Aktivno",
    className: "bg-green-100 text-green-700",
  },
  inactive: {
    label: "Neaktivno",
    className: "bg-gray-100 text-gray-600",
  },
  cancelled: {
    label: "Otkazano",
    className: "bg-red-100 text-red-700",
  },
  completed: {
    label: "Završeno",
    className: "bg-blue-100 text-blue-700",
  },
  new: {
    label: "Novo",
    className: "bg-yellow-100 text-yellow-700",
  },
  in_progress: {
    label: "U tijeku",
    className: "bg-blue-100 text-blue-700",
  },
  resolved: {
    label: "Riješeno",
    className: "bg-green-100 text-green-700",
  },
  spam: {
    label: "Spam",
    className: "bg-red-100 text-red-700",
  },
  pending: {
    label: "Na čekanju",
    className: "bg-yellow-100 text-yellow-700",
  },
  approved: {
    label: "Odobreno",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Odbijeno",
    className: "bg-red-100 text-red-700",
  },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
