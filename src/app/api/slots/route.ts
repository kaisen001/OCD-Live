import { connection, NextResponse } from "next/server";
import { BOOKING_OPENS_ON, lastBookableDate } from "@/lib/slots";
import { listTakenSlots } from "@/lib/store";

/** Créneaux déjà pris sur toute la période ouverte. */
export async function GET() {
  // Toujours calculé à la demande : le calendrier doit être à jour.
  await connection();
  try {
    const taken = await listTakenSlots(BOOKING_OPENS_ON, lastBookableDate());
    return NextResponse.json({ taken });
  } catch {
    return NextResponse.json({ error: "Calendrier indisponible." }, { status: 503 });
  }
}
