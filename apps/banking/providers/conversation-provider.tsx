"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ConversationMessage } from "@idbi/types";

interface ConversationContextValue {
  messages: ConversationMessage[];
  send: (text: string) => void;
  clear: () => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

/**
 * Conversation state lives at the app root so it survives route transitions
 * (F008; F116 depends on this). The Phase 2 Copilot replaces the canned reply
 * with the conversational-ai service.
 */
export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  const send = useCallback((text: string) => {
    const now = new Date().toISOString();
    setMessages((current) => [
      ...current,
      { id: `m-${current.length + 1}`, role: "customer", text, at: now },
      {
        id: `m-${current.length + 2}`,
        role: "copilot",
        text: "I'm getting ready to answer questions about your money — the full Copilot arrives with Phase 2.",
        at: now,
      },
    ]);
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return (
    <ConversationContext.Provider value={{ messages, send, clear }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation(): ConversationContextValue {
  const value = useContext(ConversationContext);
  if (!value) throw new Error("useConversation must be used within ConversationProvider");
  return value;
}
