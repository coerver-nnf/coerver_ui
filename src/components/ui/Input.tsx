"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-coerver-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border rounded-lg transition-colors duration-200",
            "text-coerver-gray-900 placeholder-coerver-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-coerver-gray-300 focus:ring-coerver-green focus:border-coerver-green",
            "disabled:bg-coerver-gray-100 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-coerver-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-coerver-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 border rounded-lg transition-colors duration-200 resize-none",
            "text-coerver-gray-900 placeholder-coerver-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-coerver-gray-300 focus:ring-coerver-green focus:border-coerver-green",
            "disabled:bg-coerver-gray-100 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-coerver-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-coerver-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border rounded-lg transition-colors duration-200",
            "text-coerver-gray-900 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-coerver-gray-300 focus:ring-coerver-green focus:border-coerver-green",
            "disabled:bg-coerver-gray-100 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-coerver-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Input, Textarea, Select };
