import { promises as fs } from "fs";
import path from "path";
import { getPackage } from "./packages";
import { buildAdminMessage, buildPrepKit } from "./messages";
import { addMinutes } from "./slots";
import type { Reservation, ReservationInput, ReservationStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");

type StoreShape = {
  reservations: Reservation[];
};

declare global {
  // eslint-disable-next-line no-var
  var __ocdStore: StoreShape | undefined;
}

function memoryStore() {
  if (!globalThis.__ocdStore) {
    globalThis.__ocdStore = { reservations: [] };
  }
  return globalThis.__ocdStore;
}

async function readStore(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    memoryStore().reservations = parsed.reservations ?? [];
    return memoryStore();
  } catch {
    return memoryStore();
  }
}

async function writeStore(store: StoreShape) {
  memoryStore().reservations = store.reservations;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Vercel / read-only FS: keep in-memory for the process lifetime.
  }
}

function makeCode(date: string) {
  const stamp = date.replaceAll("-", "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OCD-${stamp}-${rand}`;
}

export async function createReservation(input: ReservationInput) {
  const store = await readStore();
  const pack = getPackage(input.packageId);
  const slotEnd = addMinutes(input.slotStart, pack.durationMin);

  const overlap = store.reservations.find(
    (item) =>
      item.status !== "cancelled" &&
      item.date === input.date &&
      item.slotStart === input.slotStart,
  );
  if (overlap) {
    throw new Error("Ce créneau vient d’être pris. Choisissez un autre horaire.");
  }

  const code = makeCode(input.date);
  const reservation: Reservation = {
    ...input,
    id: crypto.randomUUID(),
    code,
    slotEnd,
    priceFcfa: pack.priceFcfa,
    packageName: pack.name,
    status: "pending",
    createdAt: new Date().toISOString(),
    adminMessage: buildAdminMessage(input, code, slotEnd),
    prepKit: buildPrepKit(input, slotEnd),
  };

  store.reservations.unshift(reservation);
  await writeStore(store);

  if (process.env.ADMIN_WEBHOOK_URL) {
    try {
      await fetch(process.env.ADMIN_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: reservation.adminMessage,
          reservation,
        }),
      });
    } catch (error) {
      console.error("Admin webhook failed", error);
    }
  } else {
    console.info("\n===== NOTIF ADMIN OCD =====\n" + reservation.adminMessage + "\n");
  }

  return reservation;
}

export async function getReservationByCode(code: string) {
  const store = await readStore();
  return (
    store.reservations.find(
      (item) => item.code.toLowerCase() === code.trim().toLowerCase(),
    ) ?? null
  );
}

export async function listAgenda() {
  const store = await readStore();
  return store.reservations
    .filter((item) => item.status === "confirmed")
    .sort((a, b) => `${a.date}${a.slotStart}`.localeCompare(`${b.date}${b.slotStart}`))
    .map((item) => ({
      code: item.code,
      businessName: item.businessName,
      businessType: item.businessType,
      mode: item.mode,
      date: item.date,
      slotStart: item.slotStart,
      slotEnd: item.slotEnd,
      city: item.city,
      country: item.country,
      packageName: item.packageName,
      status: item.status,
    }));
}

export async function listTakenSlots(date: string) {
  const store = await readStore();
  return store.reservations
    .filter((item) => item.date === date && item.status !== "cancelled")
    .map((item) => item.slotStart);
}

export async function listAllReservations() {
  const store = await readStore();
  return [...store.reservations].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
) {
  const store = await readStore();
  const index = store.reservations.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new Error("Réservation introuvable.");
  }

  const current = store.reservations[index];
  if (status === "confirmed" || status === "pending") {
    const conflict = store.reservations.find(
      (item) =>
        item.id !== id &&
        item.status !== "cancelled" &&
        item.date === current.date &&
        item.slotStart === current.slotStart,
    );
    if (conflict) {
      throw new Error(
        `Créneau déjà pris par ${conflict.businessName} (${conflict.code}).`,
      );
    }
  }

  store.reservations[index] = { ...current, status };
  await writeStore(store);
  return store.reservations[index];
}
