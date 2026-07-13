/**
 * @idbi/validation — shared zod schemas (F003).
 * Forms, BFF handlers, and services must import these same instances so validation
 * outcomes are identical on every surface.
 */
import { z } from "zod";

const inrAmount = z
  .number({ invalid_type_error: "Enter an amount" })
  .int("Enter a whole rupee amount")
  .nonnegative("Amount cannot be negative")
  .max(1_000_000_000, "Amount is too large");

export const financialProfileSchema = z
  .object({
    monthlyIncome: inrAmount.refine((v) => v > 0, "Monthly income is required"),
    monthlyExpenses: inrAmount,
    monthlyEmi: inrAmount,
    liquidSavings: inrAmount,
    dependents: z.number().int().min(0).max(20),
  })
  .refine((p) => p.monthlyExpenses + p.monthlyEmi <= p.monthlyIncome * 3, {
    message: "Expenses look inconsistent with income — please review",
    path: ["monthlyExpenses"],
  });

export type FinancialProfileInput = z.infer<typeof financialProfileSchema>;

/** Six questions, each answered on a 1 (safety first) to 5 (maximum growth) scale. */
export const riskQuestionnaireSchema = z.object({
  answers: z
    .array(z.number().int().min(1, "Choose an option").max(5))
    .length(6, "All six questions must be answered"),
});

export type RiskQuestionnaireInput = z.infer<typeof riskQuestionnaireSchema>;

export const goalFormSchema = z.object({
  name: z.string().trim().min(2, "Give the goal a name").max(60),
  targetAmount: inrAmount.refine((v) => v > 0, "Target amount is required"),
  targetYear: z.number().int().min(2026, "Target year must be in the future").max(2080),
  currentCorpus: inrAmount,
  monthlyContribution: inrAmount,
  expectedAnnualReturnPct: z
    .number()
    .min(0, "Return cannot be negative")
    .max(30, "Assumed return is unrealistically high"),
});

export type GoalFormInput = z.infer<typeof goalFormSchema>;

export const copilotQuestionSchema = z.object({
  question: z.string().trim().min(1, "Ask a question").max(500, "Keep questions under 500 characters"),
});

export type CopilotQuestionInput = z.infer<typeof copilotQuestionSchema>;

export const consentSchema = z.object({
  accountAggregator: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  /** Advisory disclosures must be explicitly acknowledged — not defaulted. */
  advisoryDisclosureAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must read and accept the advisory disclosure" }),
  }),
});

export type ConsentInput = z.infer<typeof consentSchema>;
