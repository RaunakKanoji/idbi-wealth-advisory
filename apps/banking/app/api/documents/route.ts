import { NextResponse } from "next/server";
import { demoAdvisoryEvents, demoDocuments } from "@idbi/test-fixtures";
import type { DocumentsData } from "@idbi/types";
import { envelope } from "@/lib/api/snapshot";

export async function GET() {
  const data: DocumentsData = {
    documents: [...demoDocuments].sort((a, b) => b.date.localeCompare(a.date)),
    history: [...demoAdvisoryEvents].sort((a, b) => b.date.localeCompare(a.date)),
  };
  return NextResponse.json(envelope(data));
}
