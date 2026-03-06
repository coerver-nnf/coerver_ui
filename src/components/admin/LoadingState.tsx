"use client";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar skeleton */}
      <div className="h-10 w-64 bg-coerver-gray-200 rounded-lg animate-pulse" />

      {/* Table skeleton */}
      <div className="rounded-lg border border-coerver-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-coerver-gray-50 px-4 py-3 flex gap-4">
          <div className="h-4 w-24 bg-coerver-gray-300 rounded animate-pulse" />
          <div className="h-4 w-32 bg-coerver-gray-300 rounded animate-pulse" />
          <div className="h-4 w-20 bg-coerver-gray-300 rounded animate-pulse" />
          <div className="h-4 w-28 bg-coerver-gray-300 rounded animate-pulse" />
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3 border-t border-coerver-gray-200 flex gap-4 items-center"
          >
            <div className="h-4 w-24 bg-coerver-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-coerver-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-coerver-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-coerver-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-coerver-gray-200 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-coerver-gray-200 rounded-lg animate-pulse" />
          <div className="h-9 w-24 bg-coerver-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CardLoadingState() {
  return (
    <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-coerver-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-coerver-gray-200 rounded mb-2" />
          <div className="h-6 w-16 bg-coerver-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FormLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-4 w-20 bg-coerver-gray-200 rounded mb-2" />
        <div className="h-10 w-full bg-coerver-gray-200 rounded-lg" />
      </div>
      <div>
        <div className="h-4 w-24 bg-coerver-gray-200 rounded mb-2" />
        <div className="h-10 w-full bg-coerver-gray-200 rounded-lg" />
      </div>
      <div>
        <div className="h-4 w-16 bg-coerver-gray-200 rounded mb-2" />
        <div className="h-32 w-full bg-coerver-gray-200 rounded-lg" />
      </div>
      <div className="flex gap-4">
        <div className="h-12 w-32 bg-coerver-gray-300 rounded-lg" />
        <div className="h-12 w-24 bg-coerver-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
