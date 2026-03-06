"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeInUp = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
};

export const fadeIn = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.6,
      delay,
      ease: "power2.out",
    }
  );
};

export const slideInLeft = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
};

export const slideInRight = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: 100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
};

export const scaleIn = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay,
      ease: "back.out(1.7)",
    }
  );
};

export const staggerFadeInUp = (
  elements: string | Element[],
  staggerAmount: number = 0.1
) => {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: staggerAmount,
      ease: "power3.out",
    }
  );
};

export const createScrollTrigger = (
  trigger: string | Element,
  animation: gsap.core.Tween | gsap.core.Timeline,
  options: ScrollTrigger.Vars = {}
) => {
  return ScrollTrigger.create({
    trigger,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
    animation,
    ...options,
  });
};

export const parallaxScroll = (
  element: string | Element,
  speed: number = 0.5
) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

export const textReveal = (element: string | Element) => {
  return gsap.fromTo(
    element,
    {
      clipPath: "inset(0 100% 0 0)",
    },
    {
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "power4.inOut",
    }
  );
};

export const heroAnimation = (
  titleElement: string | Element,
  subtitleElement: string | Element,
  ctaElement: string | Element
) => {
  const tl = gsap.timeline();

  tl.fromTo(
    titleElement,
    { opacity: 0, y: 80 },
    { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
  )
    .fromTo(
      subtitleElement,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(
      ctaElement,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

  return tl;
};

export const cardHoverAnimation = (element: Element) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, {
    y: -10,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    duration: 0.3,
    ease: "power2.out",
  });

  element.addEventListener("mouseenter", () => tl.play());
  element.addEventListener("mouseleave", () => tl.reverse());

  return tl;
};

export const navDropdownAnimation = (element: Element) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: -10,
      display: "none",
    },
    {
      opacity: 1,
      y: 0,
      display: "block",
      duration: 0.3,
      ease: "power2.out",
    }
  );
};

export const mobileMenuAnimation = (element: Element) => {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    element,
    {
      x: "100%",
    },
    {
      x: "0%",
      duration: 0.4,
      ease: "power3.out",
    }
  );

  return tl;
};
