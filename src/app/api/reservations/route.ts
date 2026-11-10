import { NextResponse } from "next/server";
import { notifyTeam } from "@/lib/notify";
import { createReservation, SlotTakenError, toPublic } from "@/lib/store";
import { InputError, parseReservationInput } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
  }

  // Piège à robots : un vrai visiteur ne remplit jamais ce champ caché.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
  }

  try {
    const reservation = await createReservation(parseReservationInput(body));
    await notifyTeam(reservation);
    return NextResponse.json({ reservation: toPublic(reservation) }, { status: 201 });
  } catch (error) {
    if (error instanceof InputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof SlotTakenError) {
      return NextResponse.json({ error: error.message, slotTaken: true }, { status: 409 });
    }
    console.error("Réservation en échec", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "La réservation n'a pas pu être enregistrée. Réessaie dans un instant.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
