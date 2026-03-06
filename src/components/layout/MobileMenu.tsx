"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationItems } from "./Navigation";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden transition-transform duration-300 ease-out shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-coerver-gray-100">
          <span className="text-lg font-bold text-coerver-dark">Izbornik</span>
          <button
            onClick={onClose}
            className="p-2 text-coerver-gray-500 hover:text-coerver-dark transition-colors"
            aria-label="Zatvori izbornik"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              item.children?.some((child) => pathname.startsWith(child.href));
            const isExpanded = expandedItems.includes(item.href);

            return (
              <div key={item.href} className="mb-2">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.href)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 text-left font-medium rounded-lg transition-colors",
                        isActive
                          ? "text-coerver-green bg-coerver-green/10"
                          : "text-coerver-gray-700 hover:bg-coerver-gray-50"
                      )}
                    >
                      {item.label}
                      <svg
                        className={cn(
                          "w-5 h-5 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isExpanded ? "max-h-96" : "max-h-0"
                      )}
                    >
                      <div className="ml-4 mt-1 space-y-1">
                        <Link
                          href={item.href}
                          className="block px-4 py-2 text-sm text-coerver-gray-600 hover:text-coerver-green rounded-lg hover:bg-coerver-gray-50 transition-colors"
                        >
                          Pregled
                        </Link>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm rounded-lg transition-colors",
                              pathname === child.href
                                ? "text-coerver-green bg-coerver-green/10"
                                : "text-coerver-gray-600 hover:text-coerver-green hover:bg-coerver-gray-50"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 font-medium rounded-lg transition-colors",
                      isActive
                        ? "text-coerver-green bg-coerver-green/10"
                        : "text-coerver-gray-700 hover:bg-coerver-gray-50"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-coerver-gray-100 bg-white">
          <Link href="/prijava">
            <Button variant="primary" className="w-full">
              Prijava
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
