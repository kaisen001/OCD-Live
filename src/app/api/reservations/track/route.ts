import { NextResponse } from "next/server";
import { getReservationByCode } from "@/lib/store";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Code manquant." }, { status: 400 });
  }

  const reservation = await getReservationByCode(code);
  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  return NextResponse.json({ reservation });
}
