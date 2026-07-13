import { NextResponse } from "next/server";
import { copilotQuestionSchema } from "@idbi/validation";
import { answerQuestion } from "@/lib/api/copilot-brain";
import { buildCustomerSnapshot, envelope } from "@/lib/api/snapshot";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = copilotQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid question" },
      { status: 400 },
    );
  }

  const snapshot = buildCustomerSnapshot();
  const answer = answerQuestion(parsed.data.question, snapshot);
  return NextResponse.json(envelope(answer, snapshot.sources));
}
