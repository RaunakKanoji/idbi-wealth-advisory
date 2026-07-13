import { cn } from "@/lib/utils/cn";

interface CopilotAvatarProps {
  /** "face" for tight spots (launcher, compact rows); "full" for the stage. */
  variant?: "face" | "full";
  className?: string;
  alt?: string;
}

/**
 * The bot (F110). Static SVG by design: tiny asset, crisp at any size, and the
 * default presentation while avatarAnimation is off / reduced motion / weak
 * device. Replace the SVGs in public/avatar/ with production art at any time.
 */
export function CopilotAvatar({ variant = "face", className, alt = "" }: CopilotAvatarProps) {
  return (
    <img
      src={variant === "full" ? "/avatar/copilot.svg" : "/avatar/copilot-face.svg"}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={cn("select-none", className)}
      draggable={false}
    />
  );
}
