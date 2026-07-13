/**
 * Typed feature flags (F009). Flags gate presentation and capability rollout only —
 * never business rules, calculations, suitability, or consent.
 */
export const DEFAULT_FLAGS = {
  copilotVoice: false,
  avatarAnimation: false,
  webSplitView: false,
  tabletRail: false,
  desktopSidebar: false,
  pwaInstall: false,
} as const;

export type FeatureFlagName = keyof typeof DEFAULT_FLAGS;
export type FeatureFlags = { [K in FeatureFlagName]: boolean };

/** Environment overrides for demos: NEXT_PUBLIC_FLAG_<NAME>=true|false. */
export function resolveFlags(): FeatureFlags {
  const flags = { ...DEFAULT_FLAGS } as { [K in FeatureFlagName]: boolean };
  const env: Partial<Record<FeatureFlagName, string | undefined>> = {
    copilotVoice: process.env.NEXT_PUBLIC_FLAG_COPILOT_VOICE,
    avatarAnimation: process.env.NEXT_PUBLIC_FLAG_AVATAR_ANIMATION,
    webSplitView: process.env.NEXT_PUBLIC_FLAG_WEB_SPLIT_VIEW,
    tabletRail: process.env.NEXT_PUBLIC_FLAG_TABLET_RAIL,
    desktopSidebar: process.env.NEXT_PUBLIC_FLAG_DESKTOP_SIDEBAR,
    pwaInstall: process.env.NEXT_PUBLIC_FLAG_PWA_INSTALL,
  };
  for (const name of Object.keys(flags) as FeatureFlagName[]) {
    const value = env[name];
    if (value === "true") flags[name] = true;
    if (value === "false") flags[name] = false;
  }
  return flags;
}
