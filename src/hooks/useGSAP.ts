"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP() {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    contextRef.current = gsap.context(() => {});

    return () => {
      contextRef.current?.revert();
    };
  }, []);

  const addAnimation = useCallback(
    (animation: () => gsap.core.Tween | gsap.core.Timeline) => {
      if (contextRef.current) {
        contextRef.current.add(animation);
      }
    },
    []
  );

  return { context: contextRef, addAnimation };
}

export function useScrollAnimation(
  ref: React.RefObject<HTMLElement>,
  animation: (element: HTMLElement) => gsap.core.Tween | gsap.core.Timeline,
  options: ScrollTrigger.Vars = {}
) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const anim = animation(element);

    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      animation: anim,
      ...options,
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [ref, animation, options]);
}

export function useFadeInUp(ref: React.RefObject<HTMLElement>, delay: number = 0) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    gsap.set(element, { opacity: 0, y: 50 });

    const anim = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      anim.kill();
    };
  }, [ref, delay]);
}

export function useStaggerAnimation(
  containerRef: React.RefObject<HTMLElement>,
  childSelector: string,
  staggerAmount: number = 0.1
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const children = container.querySelectorAll(childSelector);

    gsap.set(children, { opacity: 0, y: 50 });

    const anim = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: staggerAmount,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      anim.kill();
    };
  }, [containerRef, childSelector, staggerAmount]);
}

export function useParallax(ref: React.RefObject<HTMLElement>, speed: number = 0.5) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const anim = gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      anim.kill();
    };
  }, [ref, speed]);
}
