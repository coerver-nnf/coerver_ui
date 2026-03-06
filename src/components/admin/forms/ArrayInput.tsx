"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  maxItems?: number;
}

export function ArrayInput({
  value = [],
  onChange,
  label,
  placeholder = "Dodaj stavku i pritisni Enter",
  error,
  helperText,
  maxItems,
}: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed && !value.includes(trimmed)) {
          if (maxItems && value.length >= maxItems) {
            return;
          }
          onChange([...value, trimmed]);
          setInputValue("");
        }
      }
    },
    [inputValue, value, onChange, maxItems]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    },
    [value, onChange]
  );

  const handleAdd = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      if (maxItems && value.length >= maxItems) {
        return;
      }
      onChange([...value, trimmed]);
      setInputValue("");
    }
  }, [inputValue, value, onChange, maxItems]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-coerver-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={cn(
          "border rounded-lg p-3 min-h-[80px]",
          error ? "border-red-500" : "border-coerver-gray-300",
          "focus-within:ring-2 focus-within:ring-coerver-green focus-within:border-coerver-green"
        )}
      >
        {/* Tags */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {value.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-coerver-gray-100
                           text-coerver-gray-700 rounded-md text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-coerver-gray-400 hover:text-coerver-gray-600 transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={maxItems ? value.length >= maxItems : false}
            className="flex-1 border-0 p-0 focus:ring-0 text-sm text-coerver-gray-900
                       placeholder-coerver-gray-400 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim() || (maxItems ? value.length >= maxItems : false)}
            className="px-3 py-1 text-sm font-medium text-coerver-green
                       hover:bg-coerver-green/10 rounded-md transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dodaj
          </button>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-coerver-gray-500">{helperText}</p>
      )}
      {maxItems && (
        <p className="mt-1 text-xs text-coerver-gray-400">
          {value.length} / {maxItems} stavki
        </p>
      )}
    </div>
  );
}
