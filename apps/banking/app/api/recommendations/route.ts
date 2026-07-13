import { NextResponse } from "next/server";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";

export async function GET() {
  const snapshot = buildCustomerSnapshot();
  return NextResponse.json(envelope(snapshot.recommendations, snapshot.sources));
}
