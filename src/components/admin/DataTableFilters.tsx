"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface DataTableFiltersProps {
  filters: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function DataTableFilters({
  filters,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Pretraži...",
}: DataTableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      {onSearchChange && (
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coerver-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-coerver-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-coerver-green focus:border-coerver-green"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.key} className="flex items-center gap-2">
            <span className="text-sm text-coerver-gray-600">{filter.label}:</span>
            <div className="flex rounded-lg border border-coerver-gray-300 overflow-hidden">
              {filter.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => filter.onChange(option.value)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors",
                    filter.value === option.value
                      ? "bg-coerver-green text-white"
                      : "bg-white text-coerver-gray-700 hover:bg-coerver-gray-50"
                  )}
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                        filter.value === option.value
                          ? "bg-white/20"
                          : "bg-coerver-gray-100"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
