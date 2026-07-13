"use client";

import { ToastProvider } from "@/components/feedback/toast";
import { AccessibilityProvider } from "@/providers/accessibility-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { AvatarProvider } from "@/providers/avatar-provider";
import { ConversationProvider } from "@/providers/conversation-provider";
import { FeatureFlagProvider } from "@/providers/feature-flag-provider";
import { QueryProvider } from "@/providers/query-provider";

/** Provider composition for the whole app (F008). Conversation and avatar state
 *  live here — above routing — so they survive navigation. */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <FeatureFlagProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <ConversationProvider>
              <AvatarProvider>
                <ToastProvider>{children}</ToastProvider>
              </AvatarProvider>
            </ConversationProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </FeatureFlagProvider>
    </QueryProvider>
  );
}
