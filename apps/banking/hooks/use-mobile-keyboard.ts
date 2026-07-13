"use client";

import { useEffect, useState } from "react";

interface MobileKeyboardState {
  open: boolean;
  /** Height in px the keyboard takes from the layout viewport. */
  offset: number;
}

/**
 * Virtual-keyboard awareness (F106/F109): sticky actions subtract `offset` so the
 * primary action stays visible while typing.
 */
export function useMobileKeyboard(): MobileKeyboardState {
  const [state, setState] = useState<MobileKeyboardState>({ open: false, offset: 0 });

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setState({ open: offset > 120, offset });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return state;
}
