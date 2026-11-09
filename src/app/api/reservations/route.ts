import { NextResponse } from "next/server";
import { createReservation, listTakenSlots } from "@/lib/store";
import { parseReservationInput } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json(
      { error: "Paramètre date manquant." },
      { status: 400 },
    );
  }
  const taken = await listTakenSlots(date);
  return NextResponse.json({ date, taken });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseReservationInput(body);
    const reservation = await createReservation(input);
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de créer la réservation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
