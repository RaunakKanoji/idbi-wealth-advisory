"use client";

import { createContext, useContext, useMemo } from "react";
import { resolveFlags, type FeatureFlagName, type FeatureFlags } from "@/lib/feature-flags/flags";

const FeatureFlagContext = createContext<FeatureFlags | null>(null);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const flags = useMemo(() => resolveFlags(), []);
  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlag(name: FeatureFlagName): boolean {
  const flags = useContext(FeatureFlagContext);
  if (!flags) throw new Error("useFeatureFlag must be used within FeatureFlagProvider");
  return flags[name];
}
