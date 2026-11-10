import { isBusinessType } from "./business";
import { isPackageId } from "./packages";
import { isBookableDate, isSlotStart } from "./slots";
import type { ReservationInput } from "./types";

export class InputError extends Error {}

function text(value: unknown, label: string, max: number, min = 1) {
  if (typeof value !== "string") throw new InputError(`${label} : champ manquant.`);
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length < min) throw new InputError(`${label} : champ manquant.`);
  if (clean.length > max) throw new InputError(`${label} : texte trop long.`);
  return clean;
}

/** Garde uniquement les chiffres. "+228 90 12 34 56" -> "22890123456". */
export function normalizePhone(value: string) {
  return value.replace(/\D/g, "").replace(/^00/, "");
}

export function parseReservationInput(body: unknown): ReservationInput {
  if (!body || typeof body !== "object") throw new InputError("Demande invalide.");
  const data = body as Record<string, unknown>;

  const mode = text(data.mode, "Type de live", 20);
  if (mode !== "presentiel" && mode !== "distance") {
    throw new InputError("Type de live invalide.");
  }
  const date = text(data.date, "Date", 10);
  if (!isBookableDate(date)) throw new InputError("Cette date n'est pas ouverte.");
  const slotStart = text(data.slotStart, "Créneau", 5);
  if (!isSlotStart(slotStart)) throw new InputError("Créneau invalide.");
  const packageId = text(data.packageId, "Pack", 20);
  if (!isPackageId(packageId)) throw new InputError("Pack invalide.");
  const businessType = text(data.businessType, "Activité", 20);
  if (!isBusinessType(businessType)) throw new InputError("Activité invalide.");

  const whatsapp = normalizePhone(text(data.whatsapp, "Numéro WhatsApp", 24));
  if (whatsapp.length < 8 || whatsapp.length > 15) {
    throw new InputError("Numéro WhatsApp invalide. Mets l'indicatif du pays, ex. +228 90 12 34 56.");
  }

  return {
    mode,
    date,
    slotStart,
    packageId,
    businessType,
    whatsapp,
    businessName: text(data.businessName, "Nom du business", 60, 2),
    description: text(data.description, "Ce que tu vends", 400, 3),
    contactName: text(data.contactName, "Ton nom", 60, 2),
    city: text(data.city, "Ville", 60, 2),
    country: text(data.country, "Pays", 60, 2),
  };
}
