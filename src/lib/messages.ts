import { businessLabel, MODE_LABELS } from "./business";
import { formatFcfa, getPackage } from "./packages";
import { formatDate } from "./slots";
import type { Reservation } from "./types";

/** Le message que l'équipe reçoit à chaque réservation. */
export function buildTeamMessage(r: Reservation) {
  const pack = getPackage(r.packageId);
  return {
    subject: `Nouvelle réservation : ${r.businessName}, ${formatDate(r.date)} ${r.slotStart}–${r.slotEnd}`,
    lines: [
      `${r.contactName} fait « ${businessLabel(r.businessType).fr} » (${r.businessName}).`,
      `A réservé le ${formatDate(r.date)} de ${r.slotStart} à ${r.slotEnd}, heure de Lomé.`,
      "",
      `Type de live : ${MODE_LABELS[r.mode].fr}`,
      `Pack : ${pack.name.fr}, ${pack.lives} live${pack.lives > 1 ? "s" : ""}, ${formatFcfa(pack.priceFcfa)}`,
      `Ce qu'il vend : ${r.description}`,
      `WhatsApp : +${r.whatsapp} (https://wa.me/${r.whatsapp})`,
      `Lieu : ${r.city}, ${r.country}`,
      `Membre OCD n° ${String(r.memberNo).padStart(4, "0")} · Code ${r.code}`,
      "",
      "La réservation est en attente. Ouvre /admin pour l'approuver.",
    ],
  };
}
