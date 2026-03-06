"use client";

import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { hr } from "date-fns/locale";

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  label?: string;
  error?: string;
  minDate?: string;
  maxDate?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  error,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = parseISO(dateStr);
    if (!isValid(date)) return "";
    return format(date, "d. MMMM yyyy", { locale: hr });
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-coerver-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs text-coerver-gray-500 mb-1">
            Od
          </label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange(e.target.value || null)}
            min={minDate}
            max={endDate || maxDate}
            className={cn(
              "w-full px-4 py-2 border rounded-lg transition-colors",
              "text-coerver-gray-900 bg-white",
              "focus:outline-none focus:ring-2 focus:ring-coerver-green focus:border-coerver-green",
              error ? "border-red-500" : "border-coerver-gray-300"
            )}
          />
          {startDate && (
            <p className="text-xs text-coerver-gray-500 mt-1">
              {formatDisplayDate(startDate)}
            </p>
          )}
        </div>

        <div className="hidden sm:block text-coerver-gray-400 pt-4">→</div>

        <div className="flex-1 w-full">
          <label className="block text-xs text-coerver-gray-500 mb-1">
            Do
          </label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange(e.target.value || null)}
            min={startDate || minDate}
            max={maxDate}
            className={cn(
              "w-full px-4 py-2 border rounded-lg transition-colors",
              "text-coerver-gray-900 bg-white",
              "focus:outline-none focus:ring-2 focus:ring-coerver-green focus:border-coerver-green",
              error ? "border-red-500" : "border-coerver-gray-300"
            )}
          />
          {endDate && (
            <p className="text-xs text-coerver-gray-500 mt-1">
              {formatDisplayDate(endDate)}
            </p>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface SingleDatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  label?: string;
  error?: string;
  minDate?: string;
  maxDate?: string;
}

export function SingleDatePicker({
  value,
  onChange,
  label,
  error,
  minDate,
  maxDate,
}: SingleDatePickerProps) {
  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = parseISO(dateStr);
    if (!isValid(date)) return "";
    return format(date, "EEEE, d. MMMM yyyy", { locale: hr });
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-coerver-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        min={minDate}
        max={maxDate}
        className={cn(
          "w-full px-4 py-2 border rounded-lg transition-colors",
          "text-coerver-gray-900 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-coerver-green focus:border-coerver-green",
          error ? "border-red-500" : "border-coerver-gray-300"
        )}
      />

      {value && (
        <p className="text-xs text-coerver-gray-500 mt-1">
          {formatDisplayDate(value)}
        </p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
