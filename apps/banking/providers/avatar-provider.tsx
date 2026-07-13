"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { AvatarStateName } from "@idbi/types";
import { useDeviceCapabilities } from "@/hooks/use-device-capabilities";
import { useAccessibility } from "@/providers/accessibility-provider";
import { useFeatureFlag } from "@/providers/feature-flag-provider";

interface AvatarContextValue {
  state: AvatarStateName;
  setState: (state: AvatarStateName) => void;
  /** The customer can always minimize the avatar for reading space (F110). */
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  /** True when animation must not play: flag off, reduced motion, or weak device. */
  staticOnly: boolean;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AvatarStateName>("launcher");
  const [minimized, setMinimized] = useState(false);
  const animationEnabled = useFeatureFlag("avatarAnimation");
  const { reducedMotion } = useAccessibility();
  const { weakDevice } = useDeviceCapabilities();

  const staticOnly = !animationEnabled || reducedMotion || weakDevice;

  const set = useCallback((next: AvatarStateName) => setState(next), []);

  return (
    <AvatarContext.Provider value={{ state, setState: set, minimized, setMinimized, staticOnly }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar(): AvatarContextValue {
  const value = useContext(AvatarContext);
  if (!value) throw new Error("useAvatar must be used within AvatarProvider");
  return value;
}
