"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./SidebarNav";
import gsap from "gsap";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrolled = currentScrollY > 50;

      // Update scroll direction visibility
      if (scrollingDown && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Update scrolled state for background
      setIsScrolled(scrolled);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animations for show/hide
  useEffect(() => {
    if (!headerRef.current) return;

    if (isVisible) {
      gsap.to(headerRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(headerRef.current, {
        y: -100,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isVisible]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 z-40 p-4 md:p-6 main-site-header"
      >
        {/* Logo Container */}
        <Link
          href="/"
          className={cn(
            "flex items-center transition-all duration-500 ease-out",
            isScrolled
              ? "bg-white px-4 py-2.5 rounded-full shadow-lg shadow-black/10"
              : "px-0 py-0"
          )}
        >
          <Image
            src="/images/coerver-logo.png"
            alt="Coerver Coaching Croatia"
            width={180}
            height={48}
            className={cn(
              "transition-all duration-500",
              isScrolled
                ? "h-8 md:h-9 w-auto brightness-0"
                : "h-10 md:h-12 w-auto"
            )}
            priority
          />
        </Link>
      </header>

      {/* Sidebar Navigation */}
      <SidebarNav />
    </>
  );
}
