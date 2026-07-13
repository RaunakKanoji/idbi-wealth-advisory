import { NextResponse } from "next/server";
import { summarizeSpending } from "@idbi/financial-domain";
import { demoTransactions } from "@idbi/test-fixtures";
import type { SpendingData } from "@idbi/types";
import { latestSpendingMonth } from "@/lib/api/copilot-brain";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";

export async function GET() {
  const snapshot = buildCustomerSnapshot();
  const month = latestSpendingMonth();
  const summary = summarizeSpending(demoTransactions, month);
  const transactions = demoTransactions
    .filter((t) => t.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date));
  const data: SpendingData = { summary, transactions };
  return NextResponse.json(envelope(data, snapshot.sources));
}
