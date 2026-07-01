import clarity from "@microsoft/clarity";

// CRO Event Tracking
// Tracks user interactions for conversion optimization analysis

// Safe wrapper that checks if clarity is ready before sending events
const safeEvent = (eventName: string, data: Record<string, string>) => {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    clarity.event(eventName, data);
  }
};

export const trackEvent = {
  // CTA Clicks
  ctaClick: (ctaName: string, location: string) => {
    safeEvent("cta_click", { cta: ctaName, location });
  },

  // Form Events
  formStart: (formName: string) => {
    safeEvent("form_start", { form: formName });
  },

  formSubmit: (formName: string) => {
    safeEvent("form_submit", { form: formName });
  },

  formError: (formName: string, error: string) => {
    safeEvent("form_error", { form: formName, error });
  },

  // Scroll Depth
  scrollDepth: (depth: number, page: string) => {
    safeEvent("scroll_depth", { depth: `${depth}%`, page });
  },

  // Page Section Views
  sectionView: (section: string, page: string) => {
    safeEvent("section_view", { section, page });
  },

  // Camp Specific
  campView: (campSlug: string, campName: string) => {
    safeEvent("camp_view", { slug: campSlug, name: campName });
  },

  campCardClick: (campSlug: string) => {
    safeEvent("camp_card_click", { slug: campSlug });
  },

  // Urgency Elements
  urgencyView: (type: string, value: string) => {
    safeEvent("urgency_view", { type, value });
  },
};

// Scroll depth tracking hook helper
export function createScrollTracker(page: string) {
  const tracked = new Set<number>();
  const thresholds = [25, 50, 75, 90, 100];

  return () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        trackEvent.scrollDepth(threshold, page);
      }
    });
  };
}
