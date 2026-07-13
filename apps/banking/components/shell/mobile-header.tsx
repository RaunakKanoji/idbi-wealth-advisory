"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/navigation/icons";
import { isPrimaryDestination, titleForPath } from "@/lib/navigation";

/** MobileHeader (F107): orientation, not actions — title, back, notifications. */
export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = titleForPath(pathname);
  const showBack = !isPrimaryDestination(pathname);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/overview");
  };

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-1 px-2">
        {showBack ? (
          <button
            type="button"
            aria-label="Back"
            onClick={goBack}
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            <Icon name="back" />
          </button>
        ) : (
          <span className="w-2" aria-hidden="true" />
        )}
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{title}</h1>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-full text-muted"
        >
          <Icon name="notifications" />
        </Link>
      </div>
    </header>
  );
}
