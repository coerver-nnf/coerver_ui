"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

export function ClarityAnalytics() {
  useEffect(() => {
    clarity.init("xfkmvhk4tn");
  }, []);

  return null;
}
