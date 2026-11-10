import { promises as fs } from "fs";
import { randomInt } from "crypto";
import path from "path";
import { getPackage } from "./packages";
import { slotEnd, slotsFrom } from "./slots";
import type {
  AgendaItem,
  PublicReservation,
  Reservation,
  ReservationInput,
  ReservationStatus,
} from "./types";

export class SlotTakenError extends Error {
  constructor() {
    super("Ce créneau vient d'être pris. Choisis une autre heure.");
  }
}

/**
 * Deux stockages possibles :
 * - Supabase (production) dès que SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY existent ;
 * - un fichier local data/reservations.json (développement uniquement).
 */
const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const usingDatabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

// ---------- Commun ----------

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  let out = "";
  for (let i = 0; i < 6; i += 1) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `OCD-${out}`;
}

export function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export function toPublic(r: Reservation): PublicReservation {
  return {
    code: r.code,
    memberNo: r.memberNo,
    status: r.status,
    mode: r.mode,
    date: r.date,
    slotStart: r.slotStart,
    slotEnd: r.slotEnd,
    packageId: r.packageId,
    priceFcfa: r.priceFcfa,
    businessName: r.businessName,
    businessType: r.businessType,
    contactName: r.contactName,
    address: r.address,
    city: r.city,
    country: r.country,
  };
}

/** Les créneaux qu'une réservation occupe ce jour-là. */
function slotsOf(r: Pick<Reservation, "slotStart" | "packageId">) {
  return slotsFrom(r.slotStart, getPackage(r.packageId).slots) ?? [r.slotStart];
}

function toAgenda(r: Reservation): AgendaItem {
  return {
    businessName: r.businessName,
    businessType: r.businessType,
    mode: r.mode,
    date: r.date,
    slotStart: r.slotStart,
    slotEnd: r.slotEnd,
    city: r.city,
    country: r.country,
  };
}

function build(input: ReservationInput, memberNo: number): Reservation {
  return {
    ...input,
    id: crypto.randomUUID(),
    code: makeCode(),
    memberNo,
    slotEnd: slotEnd(input.slotStart, getPackage(input.packageId).slots),
    priceFcfa: getPackage(input.packageId).priceFcfa,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

// ---------- Supabase (API REST, sans dépendance) ----------

type Row = {
  id: string;
  code: string;
  member_no: number;
  status: ReservationStatus;
  mode: Reservation["mode"];
  date: string;
  slot_start: string;
  slot_end: string;
  package_id: Reservation["packageId"];
  price_fcfa: number;
  business_name: string;
  business_type: Reservation["businessType"];
  description: string;
  contact_name: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  created_at: string;
};

function fromRow(row: Row): Reservation {
  return {
    id: row.id,
    code: row.code,
    memberNo: row.member_no,
    status: row.status,
    mode: row.mode,
    date: row.date,
    slotStart: row.slot_start,
    slotEnd: row.slot_end,
    packageId: row.package_id,
    priceFcfa: row.price_fcfa,
    businessName: row.business_name,
    businessType: row.business_type,
    description: row.description,
    contactName: row.contact_name,
    whatsapp: row.whatsapp,
    address: row.address ?? "",
    city: row.city,
    country: row.country,
    createdAt: row.created_at,
  };
}

function toRow(r: Reservation): Row {
  return {
    id: r.id,
    code: r.code,
    member_no: r.memberNo,
    status: r.status,
    mode: r.mode,
    date: r.date,
    slot_start: r.slotStart,
    slot_end: r.slotEnd,
    package_id: r.packageId,
    price_fcfa: r.priceFcfa,
    business_name: r.businessName,
    business_type: r.businessType,
    description: r.description,
    contact_name: r.contactName,
    whatsapp: r.whatsapp,
    address: r.address,
    city: r.city,
    country: r.country,
    created_at: r.createdAt,
  };
}

async function db<T = Row>(query: string, init: RequestInit = {}, table = "reservations") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY as string,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (res.status === 409) throw new SlotTakenError();
  const body = await res.text();
  if (!res.ok) {
    console.error("Supabase", res.status, body);
    if (res.status === 403 || body.includes("42501") || body.includes("permission denied")) {
      throw new Error(
        "Supabase refuse l'accès aux tables. Dans SQL Editor, exécute le fichier supabase/fix-grants.sql puis réessaie.",
      );
    }
    throw new Error("La base de données ne répond pas. Réessaie dans un instant.");
  }
  // PostgREST : 204, ou 201 avec corps vide si Prefer: return=minimal.
  if (res.status === 204 || !body.trim()) return [];
  return JSON.parse(body) as T[];
}

type SlotRow = { date: string; slot_start: string; reservation_id: string };

/** Bloque tous les créneaux d'une réservation d'un seul coup. Si un seul est pris : refus. */
async function holdSlots(r: Reservation) {
  await db<SlotRow>(
    "",
    {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(
        slotsOf(r).map((slot) => ({ date: r.date, slot_start: slot, reservation_id: r.id })),
      ),
    },
    "booked_slots",
  );
}

async function releaseSlots(id: string) {
  await db<SlotRow>(`?reservation_id=eq.${q(id)}`, { method: "DELETE" }, "booked_slots");
}

const q = encodeURIComponent;

// ---------- Fichier local (développement) ----------

const DATA_FILE = path.join(process.cwd(), "data", "reservations.json");

declare global {
  var __ocdReservations: Reservation[] | undefined;
}

async function readLocal(): Promise<Reservation[]> {
  if (!globalThis.__ocdReservations) {
    try {
      const raw = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
      globalThis.__ocdReservations = Array.isArray(raw) ? raw : [];
    } catch {
      globalThis.__ocdReservations = [];
    }
  }
  return globalThis.__ocdReservations;
}

async function writeLocal(list: Reservation[]) {
  globalThis.__ocdReservations = list;
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch {
    // Disque en lecture seule : on garde la mémoire du processus.
  }
}

function overlaps(list: Reservation[], r: Reservation) {
  const wanted = slotsOf(r);
  return list.some(
    (item) =>
      item.id !== r.id &&
      item.status !== "cancelled" &&
      item.date === r.date &&
      slotsOf(item).some((slot) => wanted.includes(slot)),
  );
}

// ---------- API du stockage ----------

/** Un vendeur garde son numéro de membre : il est lié à son WhatsApp. */
async function memberNoFor(whatsapp: string) {
  if (usingDatabase) {
    const known = await db(`?select=member_no&whatsapp=eq.${q(whatsapp)}&limit=1`);
    if (known[0]) return known[0].member_no;
    const top = await db("?select=member_no&order=member_no.desc&limit=1");
    return (top[0]?.member_no ?? 0) + 1;
  }
  const list = await readLocal();
  const known = list.find((item) => item.whatsapp === whatsapp);
  if (known) return known.memberNo;
  return list.reduce((max, item) => Math.max(max, item.memberNo), 0) + 1;
}

export async function createReservation(input: ReservationInput) {
  const reservation = build(input, await memberNoFor(input.whatsapp));

  if (usingDatabase) {
    await holdSlots(reservation);
    try {
      const rows = await db("", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(toRow(reservation)),
      });
      return fromRow(rows[0]);
    } catch (error) {
      await releaseSlots(reservation.id).catch(() => undefined);
      throw error;
    }
  }

  const list = await readLocal();
  if (overlaps(list, reservation)) throw new SlotTakenError();
  await writeLocal([reservation, ...list]);
  return reservation;
}

export async function getReservationByCode(code: string) {
  const clean = normalizeCode(code);
  if (!/^OCD-[A-Z0-9]{4,12}$/.test(clean)) return null;
  if (usingDatabase) {
    const rows = await db(`?select=*&code=eq.${q(clean)}&limit=1`);
    return rows[0] ? fromRow(rows[0]) : null;
  }
  return (await readLocal()).find((item) => item.code === clean) ?? null;
}

/** Créneaux déjà pris, jour par jour, entre deux dates incluses. */
export async function listTakenSlots(from: string, to: string) {
  const taken: Record<string, string[]> = {};
  const add = (date: string, slot: string) => {
    (taken[date] ??= []).push(slot);
  };
  if (usingDatabase) {
    const rows = await db<SlotRow>(
      `?select=date,slot_start&date=gte.${q(from)}&date=lte.${q(to)}`,
      {},
      "booked_slots",
    );
    rows.forEach((row) => add(row.date, row.slot_start));
  } else {
    (await readLocal())
      .filter((item) => item.status !== "cancelled" && item.date >= from && item.date <= to)
      .forEach((item) => slotsOf(item).forEach((slot) => add(item.date, slot)));
  }
  return taken;
}

/** Programme public : uniquement les lives approuvés, à partir d'aujourd'hui. */
export async function listAgenda(fromDate: string, limit = 8): Promise<AgendaItem[]> {
  if (usingDatabase) {
    const rows = await db(
      `?select=*&status=eq.confirmed&date=gte.${q(fromDate)}&order=date.asc,slot_start.asc&limit=${limit}`,
    );
    return rows.map(fromRow).map(toAgenda);
  }
  return (await readLocal())
    .filter((item) => item.status === "confirmed" && item.date >= fromDate)
    .sort((a, b) => `${a.date}${a.slotStart}`.localeCompare(`${b.date}${b.slotStart}`))
    .slice(0, limit)
    .map(toAgenda);
}

export async function listAllReservations() {
  if (usingDatabase) {
    return (await db("?select=*&order=created_at.desc&limit=1000")).map(fromRow);
  }
  return [...(await readLocal())].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  if (usingDatabase) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Réservation introuvable.");
    const found = await db(`?select=*&id=eq.${q(id)}&limit=1`);
    if (!found[0]) throw new Error("Réservation introuvable.");
    const current = fromRow(found[0]);
    // Annuler libère les créneaux ; réactiver les reprend (refus s'ils sont partis).
    if (status === "cancelled" && current.status !== "cancelled") await releaseSlots(id);
    if (status !== "cancelled" && current.status === "cancelled") await holdSlots(current);
    const rows = await db(`?id=eq.${q(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status }),
    });
    return fromRow(rows[0]);
  }

  const list = await readLocal();
  const current = list.find((item) => item.id === id);
  if (!current) throw new Error("Réservation introuvable.");
  if (status !== "cancelled" && overlaps(list, current)) throw new SlotTakenError();
  const updated = { ...current, status };
  await writeLocal(list.map((item) => (item.id === id ? updated : item)));
  return updated;
}
