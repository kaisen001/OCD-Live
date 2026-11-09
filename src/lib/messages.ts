import { businessLabel, modeLabel } from "./business";
import { formatFcfa } from "./packages";
import { formatDateFr } from "./slots";
import type { ReservationInput } from "./types";
import { getPackage } from "./packages";

export function buildAdminMessage(
  input: ReservationInput,
  code: string,
  slotEnd: string,
) {
  const pack = getPackage(input.packageId);
  return [
    `Nouvelle réservation OCD Live — ${code}`,
    `${input.contactName} / ${input.businessName}`,
    `Business : ${businessLabel(input.businessType)} — ${input.description}`,
    `Mode : ${modeLabel(input.mode)}`,
    `Créneau : ${formatDateFr(input.date)} de ${input.slotStart} à ${slotEnd}`,
    `Package : ${pack.name} (${formatFcfa(pack.priceFcfa)})`,
    `Contact : ${input.phone} · WhatsApp ${input.whatsapp}`,
    `Lieu : ${input.city}, ${input.country}`,
  ].join("\n");
}

export function buildPrepKit(input: ReservationInput, slotEnd: string) {
  const pack = getPackage(input.packageId);
  const modeLine =
    input.mode === "presentiel"
      ? "Présentiel : préparez vos produits et arrivez 30 min avant chez Bovann Shop (Togo)."
      : "À distance : envoyez 6–10 photos/vidéos claires + prix WhatsApp avant le live.";

  return [
    `Kit prep OCD Live — ${input.businessName}`,
    `Date : ${formatDateFr(input.date)} · ${input.slotStart}–${slotEnd}`,
    `Formule : ${pack.name}`,
    modeLine,
    "À préparer :",
    "1. 3 offres phares avec prix",
    "2. Numéro WhatsApp business prêt",
    "3. Adresse / zone de livraison",
    "4. Une phrase d’accroche en 10 secondes",
    "Jour J : l’assistante co-anime, rappelle vos contacts, et oriente les acheteurs vers WhatsApp.",
  ].join("\n");
}
