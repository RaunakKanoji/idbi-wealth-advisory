"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/navigation/icons";
import { isActive, moreDestinations } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

interface MoreSheetProps {
  open: boolean;
  pathname: string;
  onNavigate: (href: string) => void;
  onClose: () => void;
}

/** Mobile "More" sheet (F108): secondary destinations, dialog semantics. */
export function MoreSheet({ open, pathname, onNavigate, onClose }: MoreSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="More sections"
        className="safe-bottom absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-(--shadow-raised)"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold">More</h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted"
          >
            <Icon name="close" />
          </button>
        </div>
        <ul className="flex flex-col">
          {moreDestinations.map((destination) => {
            const active = isActive(pathname, destination.href);
            return (
              <li key={destination.href}>
                <button
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => onNavigate(destination.href)}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-(--radius-control) px-2 text-left text-sm",
                    active ? "bg-primary-soft font-semibold text-primary" : "text-ink",
                  )}
                >
                  <Icon name={destination.icon} className="h-5 w-5 text-muted" />
                  {destination.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
