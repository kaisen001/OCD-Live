import type { Lang } from "./types";

/** Une langue proposée au visiteur. Le site s'affiche en fr ou en (ui). */
export type LocaleOption = {
  id: string;
  native: string;
  fr: string;
  en: string;
  /** Code ISO du drapeau image (/flags/{flag}.svg). */
  flag: string;
  country: { fr: string; en: string };
  ui: Lang;
};

export const LOCALES: LocaleOption[] = [
  { id: "fr", native: "Français", fr: "Français", en: "French", flag: "fr", country: { fr: "France / Afrique francophone", en: "France / Francophone Africa" }, ui: "fr" },
  { id: "en", native: "English", fr: "Anglais", en: "English", flag: "gb", country: { fr: "Royaume-Uni / Afrique anglophone", en: "UK / Anglophone Africa" }, ui: "en" },
  { id: "ee", native: "Eʋegbe", fr: "Éwé", en: "Ewe", flag: "tg", country: { fr: "Togo", en: "Togo" }, ui: "fr" },
  { id: "fon", native: "Fɔngbè", fr: "Fon", en: "Fon", flag: "bj", country: { fr: "Bénin", en: "Benin" }, ui: "fr" },
  { id: "wo", native: "Wolof", fr: "Wolof", en: "Wolof", flag: "sn", country: { fr: "Sénégal", en: "Senegal" }, ui: "fr" },
  { id: "bm", native: "Bamanankan", fr: "Bambara", en: "Bambara", flag: "ml", country: { fr: "Mali", en: "Mali" }, ui: "fr" },
  { id: "mos", native: "Mooré", fr: "Mooré", en: "Mooré", flag: "bf", country: { fr: "Burkina Faso", en: "Burkina Faso" }, ui: "fr" },
  { id: "ha", native: "Hausa", fr: "Haoussa", en: "Hausa", flag: "ne", country: { fr: "Niger", en: "Niger" }, ui: "fr" },
  { id: "yo", native: "Yorùbá", fr: "Yoruba", en: "Yoruba", flag: "ng", country: { fr: "Nigeria", en: "Nigeria" }, ui: "en" },
  { id: "ig", native: "Igbo", fr: "Igbo", en: "Igbo", flag: "ng", country: { fr: "Nigeria", en: "Nigeria" }, ui: "en" },
  { id: "sw", native: "Kiswahili", fr: "Swahili", en: "Swahili", flag: "tz", country: { fr: "Tanzanie / Kenya", en: "Tanzania / Kenya" }, ui: "en" },
  { id: "ln", native: "Lingála", fr: "Lingala", en: "Lingala", flag: "cd", country: { fr: "RDC", en: "DR Congo" }, ui: "fr" },
  { id: "ar", native: "العربية", fr: "Arabe", en: "Arabic", flag: "ma", country: { fr: "Maroc", en: "Morocco" }, ui: "fr" },
  { id: "am", native: "አማርኛ", fr: "Amharique", en: "Amharic", flag: "et", country: { fr: "Éthiopie", en: "Ethiopia" }, ui: "en" },
  { id: "zu", native: "isiZulu", fr: "Zoulou", en: "Zulu", flag: "za", country: { fr: "Afrique du Sud", en: "South Africa" }, ui: "en" },
  { id: "pt", native: "Português", fr: "Portugais", en: "Portuguese", flag: "ao", country: { fr: "Angola", en: "Angola" }, ui: "en" },
];

export function getLocale(id: string): LocaleOption {
  return LOCALES.find((item) => item.id === id) ?? LOCALES[0];
}

/** Locale BCP47 pour Intl (dates, heures). */
export function intlLocale(id: string): string {
  const locale = getLocale(id);
  const map: Record<string, string> = {
    fr: "fr-FR",
    en: "en-GB",
    ar: "ar",
    pt: "pt-PT",
    sw: "sw",
    am: "am",
    ha: "ha",
    yo: "yo",
    ig: "ig",
    zu: "zu",
  };
  return map[locale.id] ?? (locale.ui === "en" ? "en-GB" : "fr-FR");
}
