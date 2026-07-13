"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useScreenView } from "@/lib/analytics/track";
import { useAccessibility } from "@/providers/accessibility-provider";
import { useAuth } from "@/providers/auth-provider";

const LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/consent", label: "Consent" },
  { href: "/documents", label: "Documents" },
  { href: "/notifications", label: "Notifications" },
  { href: "/advisor", label: "Talk to an advisor" },
];

export function SettingsScreen() {
  useScreenView("settings");
  const { signOut } = useAuth();
  const { reducedMotion } = useAccessibility();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 py-5">
      <section className="flex flex-col gap-1 rounded-(--radius-card) border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Account</h2>
        <p className="text-sm text-muted">Signed in as Ananya Sharma (demo customer)</p>
      </section>

      <nav aria-label="Settings sections">
        <ul className="flex flex-col divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="flex min-h-12 items-center px-4 text-sm font-medium">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="flex flex-col gap-1 rounded-(--radius-card) border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Accessibility</h2>
        <p className="text-sm text-muted">
          Reduced motion: {reducedMotion ? "on" : "off"} (follows your device setting — the avatar
          stays static when it's on)
        </p>
      </section>

      <button
        type="button"
        onClick={() => {
          signOut();
          router.replace("/sign-in");
        }}
        className="flex min-h-12 items-center justify-center rounded-(--radius-control) border border-border bg-surface text-sm font-semibold text-negative"
      >
        Sign out
      </button>

      <p className="text-center text-xs text-muted">IDBI Wealth Copilot · hackathon build 0.2.0</p>
    </div>
  );
}
