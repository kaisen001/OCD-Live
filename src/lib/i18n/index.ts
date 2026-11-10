import { getLocale } from "@/lib/locales";
import { en } from "./messages/en";
import { fr, type MessageKey, type Messages } from "./messages/fr";
import { am } from "./messages/am";
import { ar } from "./messages/ar";
import { bm } from "./messages/bm";
import { ee } from "./messages/ee";
import { fon } from "./messages/fon";
import { ha } from "./messages/ha";
import { ig } from "./messages/ig";
import { ln } from "./messages/ln";
import { mos } from "./messages/mos";
import { pt } from "./messages/pt";
import { sw } from "./messages/sw";
import { wo } from "./messages/wo";
import { yo } from "./messages/yo";
import { zu } from "./messages/zu";

export type { MessageKey, Messages };

const CATALOGS: Record<string, Messages> = {
  fr,
  en,
  ee,
  fon,
  wo,
  bm,
  mos,
  ha,
  yo,
  ig,
  sw,
  ln,
  ar,
  am,
  zu,
  pt,
};

function fill(vars: Record<string, string | number> | undefined, template: string) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}

/** Traduit une clé pour une locale (fallback : ui fr/en → fr). */
export function t(
  localeId: string,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const locale = getLocale(localeId);
  const primary = CATALOGS[locale.id] ?? CATALOGS[locale.ui] ?? fr;
  const fallbackUi = locale.ui === "en" ? en : fr;
  const raw = primary[key] ?? fallbackUi[key] ?? fr[key] ?? key;
  return fill(vars, raw);
}

export function catalogFor(localeId: string): Messages {
  const locale = getLocale(localeId);
  return CATALOGS[locale.id] ?? CATALOGS[locale.ui] ?? fr;
}
