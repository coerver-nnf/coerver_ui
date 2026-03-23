"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  error?: string;
  maxImages?: number;
  maxSizeMB?: number;
}

export function MultiImageUpload({
  value = [],
  onChange,
  bucket = "images",
  folder = "uploads",
  label,
  error,
  maxImages = 20,
  maxSizeMB = 5,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (!files.length) return;

      const remainingSlots = maxImages - value.length;
      if (remainingSlots <= 0) {
        setUploadError(`Maksimalan broj slika je ${maxImages}`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      // Validate all files
      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          setUploadError("Molimo odaberite samo slike");
          return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setUploadError(`Maksimalna veličina datoteke je ${maxSizeMB}MB`);
          return;
        }
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const supabase = createClient();
        const uploadedUrls: string[] = [];

        for (const file of filesToUpload) {
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

          uploadedUrls.push(publicUrl);
        }

        onChange([...value, ...uploadedUrls]);
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError("Greška pri učitavanju slika. Pokušajte ponovno.");
      } finally {
        setIsUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [bucket, folder, maxSizeMB, maxImages, onChange, value]
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

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    },
    [value, onChange]
  );

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-coerver-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-coerver-gray-200 group"
            >
              <img
                src={url}
                alt={`Galerija ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="bg-white"
                >
                  Ukloni
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive
              ? "border-coerver-green bg-coerver-green/5"
              : error || uploadError
              ? "border-red-500"
              : "border-coerver-gray-300 hover:border-coerver-gray-400"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
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
                  Povucite slike ovdje ili{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-coerver-green hover:underline font-medium"
                  >
                    odaberite datoteke
                  </button>
                </p>
                <p className="text-xs text-coerver-gray-400">
                  PNG, JPG, GIF do {maxSizeMB}MB (max {maxImages} slika)
                </p>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {(error || uploadError) && (
        <p className="mt-1 text-sm text-red-600">{error || uploadError}</p>
      )}

      {value.length > 0 && (
        <p className="mt-2 text-xs text-coerver-gray-400">
          {value.length} / {maxImages} slika
        </p>
      )}
    </div>
  );
}
