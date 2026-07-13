import { SkipLink } from "@/components/accessibility/skip-link";
import { CopilotLauncher } from "@/components/avatar/copilot-launcher";
import { ResponsiveNavigation } from "@/components/navigation/responsive-navigation";
import { MobileHeader } from "@/components/shell/mobile-header";
import { OfflineBanner } from "@/components/shell/offline-banner";

/**
 * The single responsive application shell (F008). Every authenticated route
 * renders inside it. Navigation is viewport-switched (D-004): bottom navigation
 * below 768px, the tablet rail at ≥768px (F113); the desktop sidebar replaces
 * the rail at ≥1024px in Phase 5. Content stays a single constrained column on
 * mobile and gains width beside the rail on tablet.
 */
export function ResponsiveAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <MobileHeader />
      <OfflineBanner />
      <div className="flex flex-1">
        <ResponsiveNavigation />
        <main id="main" className="pb-bottom-nav min-w-0 flex-1">
          <div className="mx-auto w-full max-w-3xl px-4 md:max-w-4xl md:px-6">{children}</div>
        </main>
      </div>
      <CopilotLauncher />
    </div>
  );
}
