"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import { Icon } from "@/components/navigation/icons";
import { MoreSheet } from "@/components/navigation/more-sheet";
import { track } from "@/lib/analytics/track";
import { isActive, moreDestinations, primaryTabs } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Mobile bottom navigation (F108). Rendered at all widths during Phase 1; the
 * tablet rail (F113) and desktop sidebar (F115) replace it at md/lg later —
 * never alongside it.
 */
export function MobileBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  // Back button/gesture closes the sheet before navigating history (F108).
  useEffect(() => {
    const onPopState = () => {
      setMoreOpen(false);
      const href = pendingNavigation.current;
      pendingNavigation.current = null;
      if (href) router.push(href);
      else moreButtonRef.current?.focus();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  const openMore = useCallback(() => {
    setMoreOpen(true);
    window.history.pushState({ idbiMoreSheet: true }, "");
    track(ANALYTICS_EVENTS.moreMenuOpened, {});
  }, []);

  const requestClose = useCallback(() => {
    if (window.history.state?.idbiMoreSheet) window.history.back();
    else setMoreOpen(false);
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      pendingNavigation.current = href;
      requestClose();
    },
    [requestClose],
  );

  const moreActive = moreDestinations.some((d) => isActive(pathname, d.href));

  return (
    <>
      <nav
        aria-label="Primary"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface"
      >
        <ul className="mx-auto flex h-(--bottom-nav-height) max-w-3xl items-stretch">
          {primaryTabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            const isCopilot = tab.icon === "copilot";
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => track(ANALYTICS_EVENTS.navigationTabSelected, { tab: tab.label })}
                  className={cn(
                    "flex h-full min-h-11 flex-col items-center justify-center gap-0.5 text-[11px]",
                    active ? "font-semibold text-primary" : "text-muted",
                  )}
                >
                  {isCopilot ? (
                    <span
                      className={cn(
                        "-mt-6 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-(--shadow-raised)",
                        active ? "bg-primary-strong" : "bg-primary",
                      )}
                    >
                      <Icon name={tab.icon} className="h-6 w-6" />
                    </span>
                  ) : (
                    <Icon name={tab.icon} className="h-6 w-6" />
                  )}
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              ref={moreButtonRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              aria-current={moreActive ? "page" : undefined}
              onClick={openMore}
              className={cn(
                "flex h-full w-full min-h-11 flex-col items-center justify-center gap-0.5 text-[11px]",
                moreActive ? "font-semibold text-primary" : "text-muted",
              )}
            >
              <Icon name="more" className="h-6 w-6" />
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>
      <MoreSheet open={moreOpen} pathname={pathname} onNavigate={navigateTo} onClose={requestClose} />
    </>
  );
}
