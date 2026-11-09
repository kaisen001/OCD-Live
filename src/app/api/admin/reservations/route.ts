import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import * as store from "@/lib/store";
import type { ReservationStatus } from "@/lib/types";

const STATUSES: ReservationStatus[] = ["pending", "confirmed", "cancelled"];

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const reservations = await store.listAllReservations();
  return NextResponse.json({ reservations });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string; status?: string };
    if (!body.id || !body.status || !STATUSES.includes(body.status as ReservationStatus)) {
      return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
    }
    const reservation = await store.updateReservationStatus(
      body.id,
      body.status as ReservationStatus,
    );
    return NextResponse.json({ reservation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Mise à jour impossible.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
