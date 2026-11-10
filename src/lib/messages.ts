import { businessLabel } from "./business";
import { durationLabel, formatFcfa, getPackage } from "./packages";
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
      r.mode === "presentiel"
        ? "Va venir au studio, à Lomé."
        : `Sera à distance, depuis ${r.city}, ${r.country}.`,
      "",
      `Package : ${pack.name.fr}, ${durationLabel(pack.slots)}${pack.lives > 1 ? `, ${pack.lives} lives` : ""}, ${formatFcfa(pack.priceFcfa)}`,
      `Ce qu'il vend : ${r.description}`,
      `WhatsApp : +${r.whatsapp} (https://wa.me/${r.whatsapp})`,
      `Adresse : ${r.address || "non indiquée"} · ${r.city}, ${r.country}`,
      `Membre OCD n° ${String(r.memberNo).padStart(4, "0")} · Code ${r.code}`,
      "",
      "La réservation est en attente. Ouvre /admin pour l'approuver.",
    ],
  };
}
