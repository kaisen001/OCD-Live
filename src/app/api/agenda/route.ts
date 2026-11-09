import { NextResponse } from "next/server";
import { listAgenda } from "@/lib/store";

export async function GET() {
  const agenda = await listAgenda();
  return NextResponse.json({ agenda });
}
