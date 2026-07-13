import { NextResponse } from "next/server";
import { financialProfileSchema } from "@idbi/validation";
import type { ProfileData } from "@idbi/types";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";
import { demoStore } from "@/lib/api/store";

export async function GET() {
  const snapshot = buildCustomerSnapshot();
  const data: ProfileData = {
    profile: snapshot.profile,
    risk: demoStore.riskAssessment,
    isCustomerProvided: demoStore.profileOverride !== null,
  };
  return NextResponse.json(envelope(data, snapshot.sources));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  // Same schema the form uses (F003): identical validation on every surface.
  const parsed = financialProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid profile" },
      { status: 400 },
    );
  }
  demoStore.profileOverride = parsed.data;
  const snapshot = buildCustomerSnapshot();
  const data: ProfileData = {
    profile: snapshot.profile,
    risk: demoStore.riskAssessment,
    isCustomerProvided: true,
  };
  return NextResponse.json(envelope(data, snapshot.sources));
}
