import { defaultConsent } from "@idbi/test-fixtures";
import type { ConsentSettings, FinancialProfile, Goal, RiskAssessment } from "@idbi/types";

export interface AdvisorRequestRecord {
  id: string;
  reason: string;
  contactTime: string;
  note?: string;
  at: string;
}

interface DemoStore {
  profileOverride: FinancialProfile | null;
  riskAssessment: RiskAssessment | null;
  consent: ConsentSettings;
  extraGoals: Goal[];
  advisorRequests: AdvisorRequestRecord[];
}

/**
 * In-memory demo persistence (Decision D-006): customer edits live for the
 * lifetime of the server process — enough for the hackathon journey, replaced
 * by real services later. Hung off globalThis so Next.js dev HMR doesn't reset
 * it between recompiles.
 */
const globalRef = globalThis as typeof globalThis & { __idbiDemoStore?: DemoStore };

export const demoStore: DemoStore = (globalRef.__idbiDemoStore ??= {
  profileOverride: null,
  riskAssessment: null,
  consent: { ...defaultConsent },
  extraGoals: [],
  advisorRequests: [],
});
