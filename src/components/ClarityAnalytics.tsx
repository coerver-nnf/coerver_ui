"use client";

import { useEffect } from "react";

export function ClarityAnalytics() {
  useEffect(() => {
    // Delay Clarity init to not impact LCP
    const timer = setTimeout(() => {
      import("@microsoft/clarity").then((clarity) => {
        clarity.default.init("xfkmvhk4tn");
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
