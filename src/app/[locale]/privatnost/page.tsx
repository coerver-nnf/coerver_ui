"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const localeMap: Record<string, string> = {
  hr: "hr-HR",
  sl: "sl-SI",
  en: "en-GB",
};

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy");
  const locale = useLocale();

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {t("hero.titleStart")} <span className="text-coerver-green">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-white/70">
              {t("hero.description")}
            </p>
            <p className="text-white/50 mt-4">
              {t("hero.lastUpdated", {
                date: new Date().toLocaleDateString(localeMap[locale] ?? "hr-HR", { day: "numeric", month: "long", year: "numeric" }),
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg">

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("controller.title")}</h2>
              <p className="text-gray-600 mb-6">
                {t("controller.intro")}
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>{t("controller.emailLabel")} <a href="mailto:info@coervercroatia.com" className="text-coerver-green hover:underline">info@coervercroatia.com</a></li>
                <li>{t("controller.phoneLabel")} +385 98 1873 228</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("dataCollected.title")}</h2>
              <p className="text-gray-600 mb-4">{t("dataCollected.intro")}</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2, 3].map((index) => (
                  <li key={index}>{t.rich(`dataCollected.items.${index}`, { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                ))}
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("purpose.title")}</h2>
              <p className="text-gray-600 mb-4">{t("purpose.intro")}</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2, 3, 4].map((index) => (
                  <li key={index}>{t(`purpose.items.${index}`)}</li>
                ))}
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("legalBasis.title")}</h2>
              <p className="text-gray-600 mb-4">{t("legalBasis.intro")}</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2, 3].map((index) => (
                  <li key={index}>{t.rich(`legalBasis.items.${index}`, { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                ))}
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("sharing.title")}</h2>
              <p className="text-gray-600 mb-4">{t("sharing.intro")}</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2].map((index) => (
                  <li key={index}>{t.rich(`sharing.items.${index}`, { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                ))}
              </ul>
              <p className="text-gray-600 mb-8">
                {t("sharing.outro")}
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("cookies.title")}</h2>
              <p className="text-gray-600 mb-4">{t("cookies.intro")}</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1].map((index) => (
                  <li key={index}>{t.rich(`cookies.items.${index}`, { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                ))}
              </ul>
              <p className="text-gray-600 mb-8">
                {t("cookies.outro")}
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("rights.title")}</h2>
              <p className="text-gray-600 mb-4">{t("rights.intro")}</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                  <li key={index}>{t.rich(`rights.items.${index}`, { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                ))}
              </ul>
              <p className="text-gray-600 mb-8">
                {t("rights.outro")}{" "}
                <a href="mailto:info@coervercroatia.com" className="text-coerver-green hover:underline">
                  info@coervercroatia.com
                </a>.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("retention.title")}</h2>
              <p className="text-gray-600 mb-8">
                {t("retention.intro")}
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2, 3].map((index) => (
                  <li key={index}>{t(`retention.items.${index}`)}</li>
                ))}
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("security.title")}</h2>
              <p className="text-gray-600 mb-8">
                {t("security.intro")}
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                {[0, 1, 2, 3].map((index) => (
                  <li key={index}>{t(`security.items.${index}`)}</li>
                ))}
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("children.title")}</h2>
              <p className="text-gray-600 mb-8">
                {t("children.text")}
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("complaint.title")}</h2>
              <p className="text-gray-600 mb-8">
                {t("complaint.intro")}
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>{t("complaint.webLabel")} <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="text-coerver-green hover:underline">www.azop.hr</a></li>
                <li>{t("complaint.emailLabel")} azop@azop.hr</li>
                <li>{t("complaint.addressLabel")} Selska cesta 136, 10000 Zagreb</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">{t("changes.title")}</h2>
              <p className="text-gray-600 mb-8">
                {t("changes.text")}
              </p>
            </div>

            <div className="animate-on-scroll bg-gray-50 rounded-2xl p-8 mt-12">
              <h2 className="text-xl font-bold text-coerver-dark mb-4">{t("questions.title")}</h2>
              <p className="text-gray-600 mb-4">
                {t("questions.text")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:info@coervercroatia.com"
                  className="inline-flex items-center justify-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@coervercroatia.com
                </a>
                <a
                  href="tel:+385981873228"
                  className="inline-flex items-center justify-center gap-2 bg-coerver-dark text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-dark/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +385 98 1873 228
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
