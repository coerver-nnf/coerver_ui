"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/coerver_croatia/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@coerverbcs",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://web.facebook.com/coervercroatia",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@coervercoachingcroatia2240",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const navigationItems = [
  { label: "POČETNA", href: "/" },
  { label: "O NAMA", href: "/o-nama" },
  {
    label: "IGRAČI",
    href: "/za-igrace",
    children: [
      { label: "SVI PROGRAMI", href: "/za-igrace" },
      { label: "AKADEMIJE", href: "/za-igrace/akademije" },
      { label: "INDIVIDUALNI TRENINZI", href: "/za-igrace/individualni-treninzi" },
      { label: "KAMPOVI", href: "/za-igrace/kampovi" },
    ],
  },
  {
    label: "TRENERI",
    href: "/za-trenere",
    children: [
      { label: "SVI PROGRAMI", href: "/za-trenere" },
      { label: "COERVER® INTRO", href: "/za-trenere/coerver-intro" },
      { label: "YOUTH DIPLOMA 1", href: "/za-trenere/youth-diploma-1" },
      { label: "YOUTH DIPLOMA 2", href: "/za-trenere/youth-diploma-2" },
    ],
  },
  { label: "KLUBOVI", href: "/klubovi" },
  { label: "BLOG", href: "/blog" },
];

interface FullscreenNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function FullscreenNav({ isOpen, onClose }: FullscreenNavProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
      setActiveItem(null);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Animated background panels */}
      <div className="absolute inset-0 flex">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 bg-coerver-dark transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform",
              isAnimating ? "translate-y-0" : "-translate-y-full"
            )}
            style={{
              transitionDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className={cn(
          "relative h-full transition-opacity duration-300 delay-200",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Decorative elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-32 top-1/4 w-96 h-96 bg-coerver-green/20 rounded-full blur-[120px]" />
          <div className="absolute -left-32 bottom-1/4 w-80 h-80 bg-coerver-green/10 rounded-full blur-[100px]" />
        </div>

        {/* Grid layout */}
        <div className="relative h-full grid xl:grid-cols-12 overflow-hidden">
          {/* Left - Navigation */}
          <div className="xl:col-span-7 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3 sm:p-6 lg:p-8 flex-shrink-0">
              <Link href="/" onClick={onClose}>
                <Image
                  src="/images/coerver-logo.png"
                  alt="Coerver Coaching"
                  width={180}
                  height={48}
                  className="h-8 sm:h-10 lg:h-12 w-auto"
                />
              </Link>

              <button
                onClick={onClose}
                className="xl:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
                aria-label="Zatvori"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-10 xl:px-16 py-2">
              <div className="w-full max-w-full">
                {navigationItems.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    item.children?.some((child) => pathname.startsWith(child.href));
                  const isExpanded = activeItem === item.href;

                  return (
                    <div
                      key={item.href}
                      className={cn(
                        "border-b border-white/10 transition-all duration-700",
                        isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      )}
                      style={{
                        transitionDelay: isAnimating ? `${300 + index * 40}ms` : '0ms'
                      }}
                    >
                      {item.children ? (
                        <div
                          onMouseEnter={() => setActiveItem(item.href)}
                          onMouseLeave={() => setActiveItem(null)}
                        >
                          <button
                            onClick={() => setActiveItem(isExpanded ? null : item.href)}
                            className="w-full flex items-center justify-between gap-2 py-2 sm:py-3 md:py-4 lg:py-5 group"
                          >
                            <span className={cn(
                              "text-4xl sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-black uppercase tracking-tighter transition-all duration-300 truncate",
                              isActive || isExpanded
                                ? "text-white"
                                : "text-white/30 group-hover:text-white"
                            )}>
                              {item.label}
                            </span>
                            <div className={cn(
                              "w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-auto",
                              isExpanded ? "bg-coerver-green rotate-45" : "bg-white/10 group-hover:bg-white/20"
                            )}>
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </button>

                          {/* Sub-items */}
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-500 ease-out",
                              isExpanded ? "max-h-40 pb-2 sm:pb-4" : "max-h-0"
                            )}
                          >
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {item.children.map((child, childIdx) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className={cn(
                                    "px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full border border-white/20 text-white/70 hover:bg-coerver-green hover:border-coerver-green hover:text-white transition-all duration-300",
                                    isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                  )}
                                  style={{
                                    transitionDelay: isExpanded ? `${childIdx * 50}ms` : '0ms'
                                  }}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center justify-between gap-2 py-2 sm:py-3 md:py-4 lg:py-5 group"
                        >
                          <span className={cn(
                            "text-4xl sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-black uppercase tracking-tighter transition-all duration-300",
                            isActive
                              ? "text-white"
                              : "text-white/30 group-hover:text-white"
                          )}>
                            {item.label}
                          </span>
                          <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4 flex-shrink-0">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div
              className={cn(
                "px-3 py-3 sm:p-6 lg:p-8 flex items-center justify-between transition-all duration-500 flex-shrink-0",
                isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-coerver-green flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Contact Button */}
              <Link
                href="/kontakt"
                onClick={onClose}
                className="group inline-flex items-center gap-2 sm:gap-3 bg-white text-coerver-dark hover:bg-coerver-green hover:text-white font-bold px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>KONTAKT</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="hidden xl:flex xl:col-span-5 flex-col p-6 xl:p-10">
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-white text-coerver-dark hover:bg-coerver-green hover:text-white flex items-center justify-center transition-all duration-300 group"
                aria-label="Zatvori izbornik"
              >
                <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image card */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div
                className={cn(
                  "relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden transition-all duration-700 delay-500",
                  isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                <Image
                  src="/images/training/training-01.webp"
                  alt="Coerver Training"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Card content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
                    <h3 className="text-white font-bold text-xl mb-1">Pridruži se</h3>
                    <p className="text-white/60 text-sm mb-4">Postani dio Coerver obitelji</p>
                    <Link
                      href="/za-igrace/akademije"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 bg-coerver-green text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-coerver-green/90 transition-colors"
                    >
                      Prijavi se
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact info card */}
              <Link
                href="/kontakt"
                onClick={onClose}
                className={cn(
                  "w-full max-w-md bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-700 delay-600 group",
                  isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Kontaktirajte nas</p>
                    <p className="text-white font-semibold">info@coervercroatia.com</p>
                    <p className="text-white/60 text-sm">+385 98 1873 228</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-coerver-green flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const sidebarRef = useRef<HTMLDivElement>(null);

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
    if (!sidebarRef.current) return;

    if (isVisible) {
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(sidebarRef.current, {
        x: 80, // Slide out to the right
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isVisible]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Fixed Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-16 md:w-20 z-50 flex flex-col items-center py-6 main-site-sidebar"
      >
        {/* Top Section - Login & Menu in a pill when scrolled */}
        <div
          className={cn(
            "flex flex-col items-center gap-6 transition-all duration-500 ease-out",
            isScrolled
              ? "bg-white rounded-full px-3 py-4 shadow-lg shadow-black/10"
              : ""
          )}
        >
          {/* Login/Prijava Button */}
          <Link
            href="/prijava"
            className={cn(
              "flex flex-col items-center gap-1 group transition-colors duration-300",
              isScrolled
                ? "text-coerver-dark hover:text-coerver-green"
                : "text-white hover:text-coerver-green"
            )}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-wider transition-opacity duration-300",
              isScrolled ? "opacity-0 h-0" : "opacity-100"
            )}>Prijava</span>
          </Link>

          {/* Divider when scrolled */}
          {isScrolled && (
            <div className="w-6 h-px bg-gray-200" />
          )}

          {/* Hamburger Menu */}
          <button
            onClick={handleOpen}
            className={cn(
              "p-1 cursor-pointer group transition-colors duration-300",
              isScrolled
                ? "text-coerver-dark hover:text-coerver-green"
                : "text-white hover:text-coerver-green"
            )}
            aria-label="Otvori izbornik"
            type="button"
          >
            <div className="relative w-7 h-5 flex flex-col justify-between">
              <span className="block w-full h-0.5 bg-current transition-all duration-300 group-hover:w-5" />
              <span className="block w-5 h-0.5 bg-current transition-all duration-300 group-hover:w-full ml-auto" />
            </div>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Social Icons - hide when scrolled */}
        <div
          className={cn(
            "flex flex-col items-center gap-4 transition-all duration-500",
            isScrolled ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          )}
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Fullscreen Navigation */}
      <FullscreenNav isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
