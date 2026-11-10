import { NextResponse } from "next/server";
import { getReservationByCode, toPublic } from "@/lib/store";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Code manquant." }, { status: 400 });
  }
  try {
    const reservation = await getReservationByCode(code);
    if (!reservation) {
      return NextResponse.json({ error: "Aucune réservation avec ce code." }, { status: 404 });
    }
    return NextResponse.json({ reservation: toPublic(reservation) });
  } catch {
    return NextResponse.json({ error: "Suivi indisponible. Réessaie." }, { status: 503 });
  }
}
