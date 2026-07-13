"use client";

import { useEffect, useState } from "react";
import { breakpoints, type Breakpoint } from "@idbi/config";

/**
 * Current named breakpoint (F112). SSR-safe: returns "base" until mounted, so
 * server markup is always the mobile-first variant and hydration never mismatches.
 * Use CSS media queries for visual layout — reach for this hook only when
 * component behaviour genuinely differs by viewport.
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      let current: Breakpoint = "base";
      for (const [name, minWidth] of Object.entries(breakpoints)) {
        if (width >= minWidth) current = name as Breakpoint;
      }
      setBreakpoint(current);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return breakpoint;
}
