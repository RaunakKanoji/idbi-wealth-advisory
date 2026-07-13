import { NextResponse } from "next/server";
import { consentUpdateSchema } from "@idbi/validation";
import { envelope } from "@/lib/api/snapshot";
import { demoStore } from "@/lib/api/store";

export async function GET() {
  return NextResponse.json(envelope(demoStore.consent));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = consentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid consent settings" },
      { status: 400 },
    );
  }
  // Enforcement happens in the snapshot builder: withdrawing AA consent removes
  // AA holdings and marks those sources unavailable on every surface.
  demoStore.consent = parsed.data;
  return NextResponse.json(envelope(demoStore.consent));
}
