"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AvatarStage } from "@/components/avatar/avatar-stage";
import { useScreenView } from "@/lib/analytics/track";
import { cn } from "@/lib/utils/cn";
import { useConversation } from "@/providers/conversation-provider";

const SUGGESTED_PROMPTS = [
  "How healthy are my finances?",
  "Am I on track for my goals?",
  "How is my portfolio invested?",
  "What should I do next?",
];

/**
 * CopilotMobileScreen (F110 / mobile conversation experience): avatar stage that
 * shrinks as history grows, conversation history, suggested prompts, and a
 * keyboard-safe composer. Voice control appears when the copilotVoice capability
 * flag ships — text is the always-available baseline (F119).
 */
export function CopilotScreen() {
  useScreenView("copilot");
  const { messages, pending, send } = useConversation();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, pending]);

  const ask = (text: string) => {
    send(text);
    setDraft("");
  };

  return (
    <div className="flex min-h-full flex-col gap-4 py-4">
      <AvatarStage compact={hasConversation} />

      {!hasConversation ? (
        <section aria-label="Suggested questions" className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => ask(prompt)}
              className="flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm text-primary"
            >
              {prompt}
            </button>
          ))}
        </section>
      ) : null}

      <div role="log" aria-label="Conversation" aria-live="polite" className="flex flex-1 flex-col gap-3">
        {messages.map((message) => (
          <p
            key={message.id}
            className={cn(
              "max-w-[85%] whitespace-pre-line rounded-(--radius-card) px-4 py-3 text-sm",
              message.role === "customer"
                ? "self-end bg-primary text-white"
                : "self-start border border-border bg-surface",
            )}
          >
            <span className="sr-only">
              {message.role === "customer" ? "You said: " : "Copilot said: "}
            </span>
            {message.text}
          </p>
        ))}
        {pending ? (
          <p className="self-start animate-pulse rounded-(--radius-card) border border-border bg-surface px-4 py-3 text-sm text-muted">
            Copilot is thinking…
          </p>
        ) : null}
        <div ref={endRef} aria-hidden="true" />
      </div>

      <Link href="/advisor" className="self-center text-xs font-medium text-muted underline underline-offset-2">
        Prefer a human? Request an advisor
      </Link>

      <form
        className="sticky-above-nav z-30 -mx-4 border-t border-border bg-background px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
      >
        <div className="flex gap-2">
          <label htmlFor="copilot-question" className="sr-only">
            Ask the Copilot a question
          </label>
          <input
            id="copilot-question"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about your money…"
            enterKeyHint="send"
            autoComplete="off"
            maxLength={500}
            className="min-h-12 w-full min-w-0 flex-1 rounded-(--radius-control) border border-border bg-surface px-4 text-sm"
          />
          <button
            type="submit"
            disabled={pending || draft.trim().length === 0}
            className="flex min-h-12 shrink-0 items-center rounded-(--radius-control) bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
