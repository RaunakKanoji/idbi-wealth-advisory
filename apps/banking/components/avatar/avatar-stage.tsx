"use client";

import { CopilotAvatar } from "@/components/avatar/copilot-avatar";
import { useAvatar } from "@/providers/avatar-provider";

interface AvatarStageProps {
  /** Compact once conversation history grows (F110). */
  compact: boolean;
}

/**
 * AvatarStage for the mobile Copilot screen. Large in the greeting state,
 * compact during conversation, and always minimizable — the customer controls
 * their reading space (F110).
 */
export function AvatarStage({ compact }: AvatarStageProps) {
  const { minimized, setMinimized } = useAvatar();

  if (minimized) {
    return (
      <div className="flex items-center justify-between gap-2 py-1">
        <p className="text-sm text-muted">Avatar hidden</p>
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex min-h-11 items-center text-sm font-medium text-primary"
        >
          Show avatar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <CopilotAvatar
        variant="full"
        alt="Your Wealth Copilot, a friendly robot assistant"
        className={compact ? "h-20 w-auto" : "h-44 w-auto"}
      />
      {!compact ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-lg font-bold">Hi, I'm your Wealth Copilot</h2>
          <p className="readable text-sm text-muted">
            Ask me anything about your money — I answer from the same numbers your dashboard shows.
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setMinimized(true)}
        className="flex min-h-11 items-center text-xs font-medium text-muted"
      >
        Hide avatar
      </button>
    </div>
  );
}
