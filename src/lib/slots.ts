import { getPackage } from "./packages";
import type { PackageId } from "./types";

export const BOOKING_OPENS_ON = "2026-12-01";

const BASE_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

export function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function getSlotOptions(packageId: PackageId) {
  const duration = getPackage(packageId).durationMin;
  return BASE_SLOTS.filter((start) => {
    const [h, m] = start.split(":").map(Number);
    return h * 60 + m + duration <= 22 * 60;
  }).map((start) => ({
    start,
    end: addMinutes(start, duration),
    label: `${start} – ${addMinutes(start, duration)}`,
  }));
}

export function listBookableDates(days = 45) {
  const start = new Date(`${BOOKING_OPENS_ON}T00:00:00`);
  const dates: string[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    // Skip Sundays for studio ops simplicity
    if (d.getDay() === 0) continue;
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function formatDateFr(isoDate: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}
