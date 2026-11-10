import { connection, NextResponse } from "next/server";
import { todayInLome } from "@/lib/slots";
import { listAgenda } from "@/lib/store";

export async function GET() {
  // Toujours calculé à la demande : le calendrier doit être à jour.
  await connection();
  try {
    return NextResponse.json({ agenda: await listAgenda(todayInLome()) });
  } catch {
    return NextResponse.json({ agenda: [] });
  }
}
