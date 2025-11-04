"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // ✅ Guard for SSR (prevents `window` access on the server)
    if (typeof window === "undefined") return;

    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", updateIsMobile);

    // Initialize immediately
    updateIsMobile();

    return () => {
      mql.removeEventListener("change", updateIsMobile);
    };
  }, []);

  return isMobile;
}
