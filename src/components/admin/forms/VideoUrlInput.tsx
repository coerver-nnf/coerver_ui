"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface VideoUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

function getVideoThumbnail(url: string): string | null {
  if (!url) return null;

  // YouTube
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }

  return null;
}

export function VideoUrlInput({
  value,
  onChange,
  label,
  placeholder = "https://www.youtube.com/watch?v=...",
  error,
  helperText,
}: VideoUrlInputProps) {
  const [showPreview, setShowPreview] = useState(false);
  const embedUrl = useMemo(() => getVideoEmbedUrl(value), [value]);
  const thumbnail = useMemo(() => getVideoThumbnail(value), [value]);

  const isValidUrl = embedUrl !== null;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-coerver-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Input field */}
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full px-4 py-3 border rounded-lg transition-colors",
              "text-coerver-gray-900 placeholder-coerver-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-coerver-gray-300 focus:ring-coerver-green focus:border-coerver-green",
              value && isValidUrl && "pr-24"
            )}
          />
          {value && isValidUrl && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1
                         text-sm font-medium text-coerver-green hover:bg-coerver-green/10
                         rounded-md transition-colors"
            >
              {showPreview ? "Sakrij" : "Pregled"}
            </button>
          )}
        </div>

        {/* Thumbnail preview (when not showing video) */}
        {value && isValidUrl && !showPreview && thumbnail && (
          <div
            className="relative aspect-video max-w-xs rounded-lg overflow-hidden
                       border border-coerver-gray-200 cursor-pointer group"
            onClick={() => setShowPreview(true)}
          >
            <img
              src={thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-black/30 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-coerver-gray-900 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Video embed preview */}
        {value && isValidUrl && showPreview && embedUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-coerver-gray-200">
            <iframe
              src={embedUrl}
              title="Video preview"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Invalid URL warning */}
        {value && !isValidUrl && (
          <p className="text-sm text-yellow-600 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Unesite validan YouTube ili Vimeo URL
          </p>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-coerver-gray-500">{helperText}</p>
      )}
    </div>
  );
}
