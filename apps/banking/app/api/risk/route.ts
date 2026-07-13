import { NextResponse } from "next/server";
import { assessRisk } from "@idbi/financial-domain";
import { riskQuestionnaireSchema } from "@idbi/validation";
import { envelope } from "@/lib/api/snapshot";
import { demoStore } from "@/lib/api/store";

export async function GET() {
  return NextResponse.json(envelope(demoStore.riskAssessment));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = riskQuestionnaireSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid answers" },
      { status: 400 },
    );
  }
  // Scoring lives in the domain engine (F004) — never in the route or the UI.
  const assessment = assessRisk(parsed.data.answers);
  demoStore.riskAssessment = assessment;
  return NextResponse.json(envelope(assessment));
}
