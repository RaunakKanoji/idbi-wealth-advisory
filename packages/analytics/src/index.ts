/**
 * @idbi/analytics — shared analytics event definitions (F010).
 * Event names and payload schemas are identical on every surface; platform and
 * capability context travel as dimensions, never in the event name.
 */

export const ANALYTICS_EVENTS = {
  screenViewed: "screen_viewed",
  signinStarted: "signin_started",
  signinCompleted: "signin_completed",
  navigationTabSelected: "navigation_tab_selected",
  moreMenuOpened: "more_menu_opened",
  copilotLauncherTapped: "copilot_launcher_tapped",
  recommendationViewed: "recommendation_viewed",
  errorShown: "error_shown",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export interface AnalyticsEventParams {
  screen_viewed: { screen: string };
  signin_started: Record<string, never>;
  signin_completed: Record<string, never>;
  navigation_tab_selected: { tab: string };
  more_menu_opened: Record<string, never>;
  copilot_launcher_tapped: { from_screen: string };
  recommendation_viewed: { recommendation_id: string };
  error_shown: { code: string; surface: string };
}

/** Dimensions attached automatically by the app-side tracker (F010/F119). */
export interface AnalyticsDimensions {
  platform: "web";
  viewport: string;
  reduced_motion: boolean;
  online: boolean;
}
