"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const content = sectionRef.current.querySelector(".about-content");
    const images = sectionRef.current.querySelectorAll(".about-image");
    const stats = sectionRef.current.querySelectorAll(".about-stat");
    const features = sectionRef.current.querySelectorAll(".about-feature");

    gsap.set(content, { opacity: 0, x: -60 });
    gsap.set(images, { opacity: 0, scale: 0.9, y: 40 });
    gsap.set(stats, { opacity: 0, y: 30 });
    gsap.set(features, { opacity: 0, x: -20 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.to(content, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        });

        gsap.to(images, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.2,
        });

        gsap.to(stats, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.5,
        });

        gsap.to(features, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.4,
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-b from-white via-coerver-gray-50/50 to-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div className="about-content order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-coerver-green/10 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-coerver-green animate-pulse" />
              <span className="text-coerver-green font-semibold text-sm uppercase tracking-wider">
                O Coerver Metodi
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-coerver-dark leading-tight">
              Globalni Standard
              <span className="block text-coerver-green">Nogometne Izvrsnosti</span>
            </h2>

            <p className="mt-6 text-coerver-gray-600 text-lg leading-relaxed">
              Coerver Coaching je revolucionarna metodologija koja je transformirala
              način na koji se mladi nogometaši razvijaju diljem svijeta. Prisutni u
              preko <span className="font-semibold text-coerver-dark">50 zemalja</span>,
              postavljamo standarde tehničke izvrsnosti.
            </p>

            {/* Features list */}
            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Individualni Pristup",
                  desc: "Svaki igrač dobiva personalizirani program razvoja",
                },
                {
                  title: "Dokazana Metodologija",
                  desc: "40+ godina usavršavanja i globalnog uspjeha",
                },
                {
                  title: "Certificirani Treneri",
                  desc: "Vrhunski stručnjaci s međunarodnim licencama",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="about-feature flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-coerver-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coerver-green to-coerver-green-dark flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-coerver-dark">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-coerver-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/o-nama">
                <Button variant="primary" size="lg">
                  Saznaj Više
                </Button>
              </Link>
              <Link href="/za-igrace">
                <Button variant="outline" size="lg">
                  Naši Programi
                </Button>
              </Link>
            </div>
          </div>

          {/* Images Grid */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[500px] lg:h-[600px]">
              {/* Main image */}
              <div className="about-image absolute top-0 right-0 w-[75%] h-[65%] rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-coerver-green/20 to-coerver-green-dark/30 flex items-center justify-center">
                  <div className="text-center text-coerver-green/40">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm">Trening Session</p>
                  </div>
                </div>
              </div>

              {/* Secondary image */}
              <div className="about-image absolute bottom-0 left-0 w-[60%] h-[50%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="w-full h-full bg-gradient-to-br from-coerver-dark/20 to-coerver-gray-900/30 flex items-center justify-center">
                  <div className="text-center text-coerver-dark/40">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm">Ball Mastery</p>
                  </div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="about-stat absolute top-[55%] right-[5%] bg-white rounded-xl shadow-xl p-4 min-w-[140px]">
                <div className="text-3xl font-bold text-coerver-green">50+</div>
                <p className="text-sm text-coerver-gray-600">Zemalja Svijeta</p>
              </div>

              <div className="about-stat absolute top-[15%] left-[5%] bg-coerver-green rounded-xl shadow-xl p-4 min-w-[140px]">
                <div className="text-3xl font-bold text-white">40+</div>
                <p className="text-sm text-white/80">Godina Iskustva</p>
              </div>

              <div className="about-stat absolute bottom-[20%] right-[25%] bg-coerver-dark rounded-xl shadow-xl p-4 min-w-[120px]">
                <div className="text-2xl font-bold text-coerver-green">1M+</div>
                <p className="text-sm text-white/80">Igrača Globalno</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
