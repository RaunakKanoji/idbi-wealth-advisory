"use client";

import { useEffect, useState } from "react";

/**
 * Feature-detected device capabilities (F119). The single entry point for
 * capability checks — never infer capability from viewport width, and never
 * sniff ad hoc in components (device-capability-context.md).
 */
export interface DeviceCapabilities {
  touch: boolean;
  hover: boolean;
  speechRecognition: boolean;
  textToSpeech: boolean;
  pushNotifications: boolean;
  standalone: boolean; // installed as a PWA
  /** Conservative heuristic: low memory/cores → static avatar, reduced motion (F110/F111). */
  weakDevice: boolean;
}

const SSR_DEFAULTS: DeviceCapabilities = {
  touch: true, // mobile-first default until detection runs
  hover: false,
  speechRecognition: false,
  textToSpeech: false,
  pushNotifications: false,
  standalone: false,
  weakDevice: false,
};

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(SSR_DEFAULTS);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    setCapabilities({
      touch: window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0,
      hover: window.matchMedia("(hover: hover)").matches,
      speechRecognition: "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
      textToSpeech: "speechSynthesis" in window,
      pushNotifications: "Notification" in window && "PushManager" in window,
      standalone: window.matchMedia("(display-mode: standalone)").matches,
      weakDevice: memory <= 2 || cores <= 2,
    });
  }, []);

  return capabilities;
}
