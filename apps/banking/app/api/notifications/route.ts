import { NextResponse } from "next/server";
import { demoNotifications } from "@idbi/test-fixtures";
import { envelope } from "@/lib/api/snapshot";

/** In-app notification feed — the always-available fallback for push (F119). */
export async function GET() {
  return NextResponse.json(
    envelope([...demoNotifications].sort((a, b) => b.date.localeCompare(a.date))),
  );
}
