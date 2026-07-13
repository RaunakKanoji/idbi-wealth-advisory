"use client";

import { createContext, useContext } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AccessibilityContextValue {
  reducedMotion: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({ reducedMotion: true });

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <AccessibilityContext.Provider value={{ reducedMotion }}>{children}</AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  return useContext(AccessibilityContext);
}
