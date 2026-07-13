"use client";

import { MobileBottomNavigation } from "@/components/navigation/mobile-bottom-navigation";
import { TabletNavigationRail } from "@/components/navigation/tablet-navigation-rail";
import { useBreakpoint } from "@/hooks/use-breakpoint";

/**
 * Exactly one navigation pattern at a time (Decision D-004), switched through
 * the centralized breakpoint system (F112) — the canonical case where component
 * behaviour genuinely differs by viewport. SSR renders the mobile-first variant;
 * both components also carry CSS guards so a wrong variant can never flash.
 */
export function ResponsiveNavigation() {
  const breakpoint = useBreakpoint();
  const tabletOrWider = breakpoint !== "base" && breakpoint !== "sm";
  return tabletOrWider ? <TabletNavigationRail /> : <MobileBottomNavigation />;
}
