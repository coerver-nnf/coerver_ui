"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  error?: string;
  aspectRatio?: "square" | "video" | "wide";
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "images",
  folder = "uploads",
  label,
  error,
  aspectRatio = "video",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  };

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Molimo odaberite sliku");
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`Maksimalna veličina datoteke je ${maxSizeMB}MB`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(fileName);

        onChange(publicUrl);
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError("Greška pri učitavanju slike. Pokušajte ponovno.");
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, folder, maxSizeMB, onChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files[0]);
      }
    },
    [handleUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleUpload(e.target.files[0]);
      }
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-coerver-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          aspectRatioClasses[aspectRatio],
          dragActive
            ? "border-coerver-green bg-coerver-green/5"
            : error || uploadError
            ? "border-red-500"
            : "border-coerver-gray-300 hover:border-coerver-gray-400",
          "overflow-hidden"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="absolute inset-0">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Zamijeni
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="bg-white"
              >
                Ukloni
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-8 w-8 text-coerver-green mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-coerver-gray-600">Učitavanje...</p>
              </>
            ) : (
              <>
                <svg
                  className="w-10 h-10 text-coerver-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-coerver-gray-600 text-center mb-1">
                  Povucite sliku ovdje ili{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-coerver-green hover:underline font-medium"
                  >
                    odaberite datoteku
                  </button>
                </p>
                <p className="text-xs text-coerver-gray-400">
                  PNG, JPG, GIF do {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {(error || uploadError) && (
        <p className="mt-1 text-sm text-red-600">{error || uploadError}</p>
      )}
    </div>
  );
}
