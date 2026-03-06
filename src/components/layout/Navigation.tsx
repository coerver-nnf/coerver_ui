"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

const navigationItems: NavItem[] = [
  {
    label: "Za Igrače",
    href: "/za-igrace",
    children: [
      { label: "Akademije", href: "/za-igrace/akademije" },
      { label: "Individualni Treninzi", href: "/za-igrace/individualni-treninzi" },
      { label: "Kampovi", href: "/za-igrace/kampovi" },
    ],
  },
  {
    label: "Za Trenere",
    href: "/za-trenere",
    children: [
      { label: "Coerver Intro", href: "/za-trenere/coerver-intro" },
      { label: "Youth Diploma 1", href: "/za-trenere/youth-diploma-1" },
      { label: "Youth Diploma 2", href: "/za-trenere/youth-diploma-2" },
    ],
  },
  {
    label: "Klubovi",
    href: "/klubovi",
  },
  {
    label: "O Nama",
    href: "/o-nama",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

interface NavDropdownProps {
  item: NavItem;
  isActive: boolean;
}

function NavDropdown({ item, isActive }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
          isActive
            ? "text-coerver-green"
            : "text-coerver-gray-700 hover:text-coerver-green"
        )}
      >
        {item.label}
        {item.children && (
          <svg
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180"
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
        )}
      </Link>

      {item.children && isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-coerver-gray-100 py-2 z-50 animate-slide-down">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2 text-sm text-coerver-gray-700 hover:bg-coerver-gray-50 hover:text-coerver-green transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navigationItems.map((item) => {
        const isActive =
          pathname === item.href ||
          item.children?.some((child) => pathname.startsWith(child.href));

        if (item.children) {
          return <NavDropdown key={item.href} item={item} isActive={isActive || false} />;
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-coerver-green"
                : "text-coerver-gray-700 hover:text-coerver-green"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { navigationItems };
