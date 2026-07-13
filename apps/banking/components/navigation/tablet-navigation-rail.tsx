"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import { Icon } from "@/components/navigation/icons";
import { track } from "@/lib/analytics/track";
import { isActive, moreDestinations, primaryTabs } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

/** Every destination sits directly on the rail — no More sheet on tablet (D-007). */
const RAIL_DESTINATIONS = [...primaryTabs, ...moreDestinations];

/**
 * Tablet navigation rail (F113): the ≥768px presentation of primary navigation,
 * consuming the same route definitions as the bottom navigation. Rendered
 * instead of — never alongside — the mobile bottom navigation (Decision D-004).
 * Phase 5 replaces it at ≥1024px with the desktop sidebar (F115).
 */
export function TabletNavigationRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      data-nav-variant="rail"
      className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-20 shrink-0 overflow-y-auto border-r border-border bg-surface py-2 md:block"
    >
      <ul className="flex flex-col gap-1 px-1.5">
        {RAIL_DESTINATIONS.map((destination) => {
          const active = isActive(pathname, destination.href);
          return (
            <li key={destination.href}>
              <Link
                href={destination.href}
                aria-label={destination.label}
                aria-current={active ? "page" : undefined}
                onClick={() =>
                  track(ANALYTICS_EVENTS.navigationTabSelected, { tab: destination.label })
                }
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-(--radius-control) px-1 py-1.5 text-[10px]",
                  active ? "bg-primary-soft font-semibold text-primary" : "text-muted",
                )}
              >
                <Icon name={destination.icon} className="h-5 w-5" />
                <span className="w-full truncate text-center">
                  {destination.shortLabel ?? destination.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
