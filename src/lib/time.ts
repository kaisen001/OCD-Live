/** Fuseau du studio OCD / référence de tous les créneaux stockés. */
export const STUDIO_TZ = "Africa/Lome";

/** Convertit une heure Lomé (HH:MM) vers le fuseau du visiteur. */
export function localTimeFor(date: string, time: string, timeZone: string): string | null {
  if (!timeZone || timeZone === STUDIO_TZ) return null;
  try {
    const utc = new Date(`${date}T${time}:00+00:00`);
    if (Number.isNaN(utc.getTime())) return null;
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(utc);
  } catch {
    return null;
  }
}

type SlotLabels = {
  studio: string;
  local: string;
  sameZone: boolean;
};

/** Plage horaire Lomé + équivalent local (si fuseau différent). */
export function formatSlotRange(
  date: string,
  start: string,
  end: string,
  visitorTz: string | null | undefined,
  labels: { lome: string; yourTime: string },
): SlotLabels {
  const studio = `${start}–${end} ${labels.lome}`;
  if (!visitorTz || visitorTz === STUDIO_TZ) {
    return { studio, local: studio, sameZone: true };
  }
  const localStart = localTimeFor(date, start, visitorTz);
  const localEnd = localTimeFor(date, end, visitorTz);
  if (!localStart || !localEnd) {
    return { studio, local: studio, sameZone: true };
  }
  return {
    studio,
    local: `${localStart}–${localEnd} ${labels.yourTime}`,
    sameZone: false,
  };
}

/** Texte d'affichage : une ou deux lignes. */
export function slotDisplayLine(
  date: string,
  start: string,
  end: string,
  visitorTz: string | null | undefined,
  labels: { lome: string; yourTime: string },
): string {
  const range = formatSlotRange(date, start, end, visitorTz, labels);
  if (range.sameZone) return range.studio;
  return `${range.studio} · ${range.local}`;
}
