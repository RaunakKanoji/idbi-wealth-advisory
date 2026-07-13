"use client";

import { usePathname, useRouter } from "next/navigation";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import { Icon } from "@/components/navigation/icons";
import { track } from "@/lib/analytics/track";
import { isActive } from "@/lib/navigation";

/**
 * Floating Copilot launcher (F110). Anchored above the bottom navigation so it
 * never obstructs it; hidden on the Copilot screen itself. Static presentation —
 * animation arrives behind the avatarAnimation flag with reduced-motion and
 * weak-device fallbacks.
 */
export function CopilotLauncher() {
  const pathname = usePathname();
  const router = useRouter();

  if (isActive(pathname, "/copilot")) return null;

  return (
    <button
      type="button"
      data-copilot-launcher
      aria-label="Open Copilot"
      onClick={() => {
        track(ANALYTICS_EVENTS.copilotLauncherTapped, { from_screen: pathname });
        router.push("/copilot");
      }}
      className="above-bottom-nav fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-(--shadow-raised) active:scale-95"
    >
      <Icon name="copilot" className="h-7 w-7" />
    </button>
  );
}
