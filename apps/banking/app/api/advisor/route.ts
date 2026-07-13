import { NextResponse } from "next/server";
import { advisorRequestSchema } from "@idbi/validation";
import type { AdvisorRequestResult } from "@idbi/types";
import { envelope } from "@/lib/api/snapshot";
import { demoStore } from "@/lib/api/store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = advisorRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
  const referenceId = `ADV-${String(demoStore.advisorRequests.length + 1).padStart(4, "0")}`;
  demoStore.advisorRequests.push({
    id: referenceId,
    reason: parsed.data.reason,
    contactTime: parsed.data.contactTime,
    note: parsed.data.note,
    at: new Date().toISOString(),
  });
  const data: AdvisorRequestResult = { referenceId };
  return NextResponse.json(envelope(data));
}
