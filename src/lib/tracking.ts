import clarity from "@microsoft/clarity";

// CRO Event Tracking
// Tracks user interactions for conversion optimization analysis

export const trackEvent = {
  // CTA Clicks
  ctaClick: (ctaName: string, location: string) => {
    clarity.event("cta_click", { cta: ctaName, location });
  },

  // Form Events
  formStart: (formName: string) => {
    clarity.event("form_start", { form: formName });
  },

  formSubmit: (formName: string) => {
    clarity.event("form_submit", { form: formName });
  },

  formError: (formName: string, error: string) => {
    clarity.event("form_error", { form: formName, error });
  },

  // Scroll Depth
  scrollDepth: (depth: number, page: string) => {
    clarity.event("scroll_depth", { depth: `${depth}%`, page });
  },

  // Page Section Views
  sectionView: (section: string, page: string) => {
    clarity.event("section_view", { section, page });
  },

  // Camp Specific
  campView: (campSlug: string, campName: string) => {
    clarity.event("camp_view", { slug: campSlug, name: campName });
  },

  campCardClick: (campSlug: string) => {
    clarity.event("camp_card_click", { slug: campSlug });
  },

  // Urgency Elements
  urgencyView: (type: string, value: string) => {
    clarity.event("urgency_view", { type, value });
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
