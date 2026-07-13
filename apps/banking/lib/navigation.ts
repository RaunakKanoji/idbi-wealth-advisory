/**
 * Canonical route definitions shared by every navigation variant
 * (cross-platform-navigation-context.md). The tablet rail and desktop sidebar
 * (Phases 4–5) must consume these same definitions.
 */

export type IconName =
  | "home"
  | "wealth"
  | "copilot"
  | "goals"
  | "more"
  | "spending"
  | "portfolio"
  | "recommendations"
  | "simulator"
  | "documents"
  | "consent"
  | "notifications"
  | "profile"
  | "settings";

export interface NavDestination {
  href: string;
  label: string;
  icon: IconName;
}

/** Mobile bottom navigation — exactly five entries (F108). */
export const primaryTabs: NavDestination[] = [
  { href: "/overview", label: "Home", icon: "home" },
  { href: "/wealth-health", label: "Wealth", icon: "wealth" },
  { href: "/copilot", label: "Copilot", icon: "copilot" },
  { href: "/goals", label: "Goals", icon: "goals" },
];

/** Destinations inside the mobile "More" sheet (F108). */
export const moreDestinations: NavDestination[] = [
  { href: "/spending", label: "Spending", icon: "spending" },
  { href: "/portfolio", label: "Portfolio", icon: "portfolio" },
  { href: "/recommendations", label: "Recommendations", icon: "recommendations" },
  { href: "/simulator", label: "Simulator", icon: "simulator" },
  { href: "/documents", label: "Documents", icon: "documents" },
  { href: "/consent", label: "Consent", icon: "consent" },
  { href: "/notifications", label: "Notifications", icon: "notifications" },
  { href: "/profile", label: "Profile", icon: "profile" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export const routeTitles: Record<string, string> = {
  "/overview": "IDBI Wealth Copilot",
  "/profile/financial": "Financial Profile",
  "/profile/risk": "Risk Profile",
  "/goals/new": "New Goal",
  "/wealth-health": "Wealth Health",
  "/copilot": "Copilot",
  "/goals": "Goals",
  "/portfolio": "Portfolio",
  "/spending": "Spending",
  "/recommendations": "Recommendations",
  "/simulator": "Simulator",
  "/documents": "Documents",
  "/consent": "Consent",
  "/notifications": "Notifications",
  "/advisor": "Talk to an Advisor",
  "/profile": "Profile",
  "/settings": "Settings",
};

export function titleForPath(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const base = Object.keys(routeTitles).find((href) => pathname.startsWith(`${href}/`));
  return base ? routeTitles[base]! : "IDBI Wealth Copilot";
}

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Routes reachable from the bottom navigation directly (no back button). */
export function isPrimaryDestination(pathname: string): boolean {
  return primaryTabs.some((tab) => pathname === tab.href);
}
