"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ANALYTICS_EVENTS } from "@idbi/analytics";
import type { ApiEnvelope, ConversationMessage, CopilotAnswer } from "@idbi/types";
import { track } from "@/lib/analytics/track";
import { api } from "@/lib/api/client";

interface ConversationContextValue {
  messages: ConversationMessage[];
  /** True while the Copilot is composing a reply. */
  pending: boolean;
  send: (text: string) => void;
  clear: () => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

/**
 * Conversation state lives at the app root so it survives route transitions
 * (F008; F116 depends on this). Answers come from the Copilot BFF, which reads
 * the same customer snapshot as every screen — the Copilot can never quote a
 * different number than the dashboard.
 */
export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [pending, setPending] = useState(false);
  const nextId = useRef(1);

  const append = useCallback((role: ConversationMessage["role"], text: string) => {
    setMessages((current) => [
      ...current,
      { id: `m-${nextId.current++}`, role, text, at: new Date().toISOString() },
    ]);
  }, []);

  const send = useCallback(
    (text: string) => {
      const question = text.trim();
      if (!question) return;
      append("customer", question);
      setPending(true);
      void api
        .post<ApiEnvelope<CopilotAnswer>>("/api/copilot", { question })
        .then((envelope) => {
          track(ANALYTICS_EVENTS.copilotMessageSent, { intent: envelope.data.intent });
          append("copilot", envelope.data.reply);
        })
        .catch(() => {
          // Offline/timeout fallback (F119): the conversation degrades, never crashes.
          append(
            "copilot",
            "I couldn't reach your financial data just now. Your dashboard still shows the latest saved numbers — please try me again in a moment.",
          );
        })
        .finally(() => setPending(false));
    },
    [append],
  );

  const clear = useCallback(() => setMessages([]), []);

  return (
    <ConversationContext.Provider value={{ messages, pending, send, clear }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation(): ConversationContextValue {
  const value = useContext(ConversationContext);
  if (!value) throw new Error("useConversation must be used within ConversationProvider");
  return value;
}
