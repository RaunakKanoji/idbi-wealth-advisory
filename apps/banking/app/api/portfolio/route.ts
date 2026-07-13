import { NextResponse } from "next/server";
import type { PortfolioData } from "@idbi/types";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";

export async function GET() {
  const snapshot = buildCustomerSnapshot();
  const data: PortfolioData = { allocation: snapshot.allocation, holdings: snapshot.holdings };
  return NextResponse.json(envelope(data, snapshot.sources));
}
