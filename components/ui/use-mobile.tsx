"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // ✅ Run only in the browser
    if (typeof window === "undefined") return;

    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Use matchMedia for responsive detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", updateIsMobile);

    // Initialize once on mount
    updateIsMobile();

    // Clean up listener
    return () => mql.removeEventListener("change", updateIsMobile);
  }, []);

  // During SSR, this returns false until hydrated — safe default
  return !!isMobile;
}
