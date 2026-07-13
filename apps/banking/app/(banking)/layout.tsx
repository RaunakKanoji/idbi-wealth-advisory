import { ResponsiveAppShell } from "@/components/shell/responsive-app-shell";
import { AuthGate } from "@/features/authentication/auth-gate";

export default function BankingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <ResponsiveAppShell>{children}</ResponsiveAppShell>
    </AuthGate>
  );
}
