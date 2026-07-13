import { NextResponse } from "next/server";
import type { GoalsData } from "@idbi/types";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";

export async function GET() {
  const snapshot = buildCustomerSnapshot();
  const data: GoalsData = { goals: snapshot.goals, projections: snapshot.projections };
  return NextResponse.json(envelope(data, snapshot.sources));
}
