import { SkipLink } from "@/components/accessibility/skip-link";
import { CopilotLauncher } from "@/components/avatar/copilot-launcher";
import { MobileBottomNavigation } from "@/components/navigation/mobile-bottom-navigation";
import { MobileHeader } from "@/components/shell/mobile-header";
import { OfflineBanner } from "@/components/shell/offline-banner";

/**
 * The single responsive application shell (F008). Every authenticated route
 * renders inside it. Phase 1 renders the mobile chrome at all widths with a
 * constrained content column; the tablet rail (F113) and desktop sidebar
 * (F114/F115) swap in behind this same component in Phases 4–5 — exactly one
 * navigation pattern at a time (Decision D-004).
 */
export function ResponsiveAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <MobileHeader />
      <OfflineBanner />
      <main id="main" className="pb-bottom-nav flex-1">
        <div className="mx-auto w-full max-w-3xl px-4">{children}</div>
      </main>
      <CopilotLauncher />
      <MobileBottomNavigation />
    </div>
  );
}
