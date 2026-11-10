import { LIVE_MINUTES } from "./packages";
import type { Lang } from "./types";

/** Premier jour de live. */
export const BOOKING_OPENS_ON = "2026-12-01";
/** Nombre de jours ouverts à la réservation à partir du premier jour. */
export const BOOKING_WINDOW_DAYS = 62;
/** Jours fermés (0 = dimanche). Vide = ouvert tous les jours, comme demandé. */
export const CLOSED_WEEKDAYS: number[] = [];

/**
 * Heures de début, à l'heure de Lomé (GMT). Chaque créneau dure 1 h 30
 * et ils se suivent sans trou : on peut en réserver plusieurs d'affilée.
 * (L'exemple de Bovann : « de 10 h à 11 h 30 ».)
 */
export const SLOT_STARTS = [
  "08:30",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
  "20:30",
];

export function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Heure de fin d'un passage de `count` créneaux. */
export function slotEnd(start: string, count = 1) {
  return addMinutes(start, LIVE_MINUTES * count);
}

/** Les créneaux occupés par un passage de `count` créneaux, ou null s'il dépasse la journée. */
export function slotsFrom(start: string, count: number) {
  const index = SLOT_STARTS.indexOf(start);
  if (index < 0 || index + count > SLOT_STARTS.length) return null;
  return SLOT_STARTS.slice(index, index + count);
}

export function isSlotStart(value: string) {
  return SLOT_STARTS.includes(value);
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Aujourd'hui à Lomé (GMT), au format AAAA-MM-JJ. */
export function todayInLome(now = new Date()) {
  return iso(now);
}

export function lastBookableDate() {
  const d = new Date(`${BOOKING_OPENS_ON}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + BOOKING_WINDOW_DAYS - 1);
  return iso(d);
}

export function isBookableDate(date: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || iso(d) !== date) return false;
  if (date < BOOKING_OPENS_ON || date > lastBookableDate()) return false;
  if (date < todayInLome(now)) return false;
  return !CLOSED_WEEKDAYS.includes(d.getUTCDay());
}

export type CalendarDay = { date: string; day: number; open: boolean } | null;
export type CalendarMonth = { key: string; year: number; month: number; days: CalendarDay[] };

/** Mois affichés dans le calendrier, semaines commençant le lundi. */
export function calendarMonths(now = new Date()): CalendarMonth[] {
  const first = new Date(`${BOOKING_OPENS_ON}T00:00:00Z`);
  const last = new Date(`${lastBookableDate()}T00:00:00Z`);
  const months: CalendarMonth[] = [];
  const cursor = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1));
  while (cursor <= last) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();
    const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const lead = (cursor.getUTCDay() + 6) % 7;
    const days: CalendarDay[] = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= count; day += 1) {
      const date = iso(new Date(Date.UTC(year, month, day)));
      days.push({ date, day, open: isBookableDate(date, now) });
    }
    months.push({ key: `${year}-${month}`, year, month, days });
    cursor.setUTCMonth(month + 1);
  }
  return months;
}

const LOCALES: Record<Lang, string> = { fr: "fr-FR", en: "en-GB" };

export function formatDate(isoDate: string, lang: Lang = "fr") {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

export function formatMonth(year: number, month: number, lang: Lang = "fr") {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));
}

export function weekdayInitials(lang: Lang = "fr") {
  return lang === "fr"
    ? ["L", "M", "M", "J", "V", "S", "D"]
    : ["M", "T", "W", "T", "F", "S", "S"];
}

/**
 * Heure du visiteur pour un créneau donné à l'heure de Lomé.
 * Renvoie null si le visiteur est à la même heure que Lomé.
 */
export function localTimeFor(date: string, time: string, timeZone: string) {
  try {
    const instant = new Date(`${date}T${time}:00Z`);
    const local = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(instant);
    return local === time ? null : local;
  } catch {
    return null;
  }
}
