import { BUSINESS_TYPES, LIVE_MODES } from "./business";
import { PACKAGES } from "./packages";
import { BOOKING_OPENS_ON } from "./slots";
import type { ReservationInput } from "./types";

function required(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} est requis.`);
  }
  return value.trim();
}

export function parseReservationInput(body: unknown): ReservationInput {
  if (!body || typeof body !== "object") {
    throw new Error("Payload invalide.");
  }

  const data = body as Record<string, unknown>;
  const mode = required(data.mode, "Mode");
  const businessType = required(data.businessType, "Type de business");
  const packageId = required(data.packageId, "Package");
  const date = required(data.date, "Date");
  const slotStart = required(data.slotStart, "Créneau");

  if (!LIVE_MODES.some((item) => item.id === mode)) {
    throw new Error("Mode de live invalide.");
  }
  if (!BUSINESS_TYPES.some((item) => item.id === businessType)) {
    throw new Error("Type de business invalide.");
  }
  if (!PACKAGES.some((item) => item.id === packageId)) {
    throw new Error("Package invalide.");
  }
  if (date < BOOKING_OPENS_ON) {
    throw new Error("Les réservations ouvrent le 1er décembre 2026.");
  }

  return {
    mode: mode as ReservationInput["mode"],
    businessType: businessType as ReservationInput["businessType"],
    packageId: packageId as ReservationInput["packageId"],
    date,
    slotStart,
    businessName: required(data.businessName, "Nom du business"),
    contactName: required(data.contactName, "Nom du contact"),
    phone: required(data.phone, "Téléphone"),
    whatsapp: required(data.whatsapp, "WhatsApp"),
    city: required(data.city, "Ville"),
    country: required(data.country, "Pays"),
    description: required(data.description, "Description"),
  };
}
