"use client";

import { useEffect, useState } from "react";

interface SafeAreaInsets {
  top: number;
  bottom: number;
}

/**
 * Measured safe-area insets for the rare JS consumer (e.g. positioning math).
 * Layout should use the CSS utilities in styles/safe-area.css instead.
 */
export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({ top: 0, bottom: 0 });

  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;" +
      "padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)";
    document.body.appendChild(probe);
    const styles = getComputedStyle(probe);
    setInsets({
      top: parseFloat(styles.paddingTop) || 0,
      bottom: parseFloat(styles.paddingBottom) || 0,
    });
    probe.remove();
  }, []);

  return insets;
}
