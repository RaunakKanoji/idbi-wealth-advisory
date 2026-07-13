import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";

export const metadata: Metadata = {
  title: {
    default: "IDBI Wealth Copilot",
    template: "%s · IDBI Wealth Copilot",
  },
  description: "Your conversational wealth advisor from IDBI Bank.",
  manifest: "/manifest/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b5b4c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-ink antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
