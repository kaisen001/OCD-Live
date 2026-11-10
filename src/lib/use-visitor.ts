"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getCountry, getCurrency, isKnownCountry, isKnownCurrency } from "./currencies";
import { getLocale } from "./locales";
import { currencyForTimeZone, FCFA_PER_EUR } from "./money";
import type { Lang } from "./types";

const LANG_EVENT = "ocd:lang";
const COUNTRY_EVENT = "ocd:country";
const LOCALE_KEY = "ocd-locale";
const COUNTRY_KEY = "ocd-country";
const CURRENCY_KEY = "ocd-currency";

function subscribeLang(callback: () => void) {
  window.addEventListener(LANG_EVENT, callback);
  return () => window.removeEventListener(LANG_EVENT, callback);
}

function readUiLang(): Lang {
  return document.documentElement.dataset.lang === "en" ? "en" : "fr";
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribeLang, readUiLang, () => "fr");
}

function readLocaleId(): string {
  try {
    const fromDom = document.documentElement.dataset.locale;
    if (fromDom) return fromDom;
    return localStorage.getItem(LOCALE_KEY) || (readUiLang() === "en" ? "en" : "fr");
  } catch {
    return readUiLang() === "en" ? "en" : "fr";
  }
}

export function useLocaleId(): string {
  return useSyncExternalStore(subscribeLang, readLocaleId, () => "fr");
}

export function setLocale(localeId: string) {
  const locale = getLocale(localeId);
  document.documentElement.dataset.lang = locale.ui;
  document.documentElement.dataset.locale = locale.id;
  document.documentElement.lang = locale.id === "ar" ? "ar" : locale.ui;
  document.documentElement.dir = locale.id === "ar" ? "rtl" : "ltr";
  try {
    localStorage.setItem(LOCALE_KEY, locale.id);
    localStorage.setItem("ocd-lang", locale.ui);
    document.cookie = `${LOCALE_KEY}=${encodeURIComponent(locale.id)};path=/;max-age=31536000;samesite=lax`;
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(LANG_EVENT));
}

export function setLang(lang: Lang) {
  setLocale(lang);
}

export type Visitor = {
  timeZone: string;
  countryId: string;
  currency: string;
  rate: number | null;
};

let ratesPromise: Promise<Record<string, number>> | null = null;

function loadRates() {
  ratesPromise ??= fetch("/api/rates")
    .then((res) => res.json())
    .then((data) => (data.rates ?? {}) as Record<string, number>)
    .catch(() => ({ EUR: 1 / FCFA_PER_EUR }));
  return ratesPromise;
}

function rateFor(currency: string, rates: Record<string, number>): number | null {
  const meta = getCurrency(currency);
  if (meta.fixedFromXof != null) return meta.fixedFromXof;
  if (currency === "EUR") return rates.EUR ?? 1 / FCFA_PER_EUR;
  return rates[currency] ?? null;
}

/** Devine un pays à partir du fuseau. */
function countryForTimeZone(timeZone: string): string {
  const map: Record<string, string> = {
    "Africa/Lome": "tg",
    "Africa/Abidjan": "ci",
    "Africa/Dakar": "sn",
    "Africa/Bamako": "ml",
    "Africa/Ouagadougou": "bf",
    "Africa/Porto-Novo": "bj",
    "Africa/Niamey": "ne",
    "Africa/Bissau": "gw",
    "Africa/Douala": "cm",
    "Africa/Libreville": "ga",
    "Africa/Brazzaville": "cg",
    "Africa/Ndjamena": "td",
    "Africa/Bangui": "cf",
    "Africa/Malabo": "gq",
    "Africa/Lagos": "ng",
    "Africa/Accra": "gh",
    "Africa/Conakry": "gn",
    "Africa/Kinshasa": "cd",
    "Africa/Lubumbashi": "cd",
    "Africa/Nairobi": "ke",
    "Africa/Dar_es_Salaam": "tz",
    "Africa/Kampala": "ug",
    "Africa/Johannesburg": "za",
    "Africa/Casablanca": "ma",
    "Africa/Algiers": "dz",
    "Africa/Tunis": "tn",
    "Africa/Cairo": "eg",
    "Africa/Addis_Ababa": "et",
    "Africa/Luanda": "ao",
    "Africa/Maputo": "mz",
    "Africa/Kigali": "rw",
    "Africa/Monrovia": "lr",
    "Africa/Freetown": "sl",
    "Africa/Banjul": "gm",
    "Africa/Nouakchott": "mr",
  };
  if (map[timeZone]) return map[timeZone];
  if (timeZone.startsWith("Europe/")) return "eu";
  if (timeZone.startsWith("America/")) return "us";
  const code = currencyForTimeZone(timeZone);
  return getCurrency(code).id;
}

function readSavedCountry(): string | null {
  try {
    const country = localStorage.getItem(COUNTRY_KEY);
    if (country && isKnownCountry(country)) return country;
    // Migration ancienne clé monnaie seule.
    const currency = localStorage.getItem(CURRENCY_KEY);
    if (currency && isKnownCurrency(currency)) return getCurrency(currency).id;
    return null;
  } catch {
    return null;
  }
}

function subscribeCountry(callback: () => void) {
  window.addEventListener(COUNTRY_EVENT, callback);
  return () => window.removeEventListener(COUNTRY_EVENT, callback);
}

export function useCountryId(): string {
  return useSyncExternalStore(subscribeCountry, () => readSavedCountry() || "tg", () => "tg");
}

/** @deprecated — code monnaie dérivé du pays. */
export function useCurrencyCode(): string {
  const countryId = useCountryId();
  return getCountry(countryId).code;
}

export function setCountry(countryId: string) {
  if (!isKnownCountry(countryId)) return;
  const country = getCountry(countryId);
  try {
    localStorage.setItem(COUNTRY_KEY, country.id);
    localStorage.setItem(CURRENCY_KEY, country.code);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(COUNTRY_EVENT));
}

export function setCurrency(code: string) {
  if (!isKnownCurrency(code)) return;
  setCountry(getCurrency(code).id);
}

export function useVisitor(): Visitor | null {
  const preferredCountry = useCountryId();
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    let alive = true;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lome";
    const detected = countryForTimeZone(timeZone);
    const saved = readSavedCountry();
    const countryId = saved && isKnownCountry(saved) ? saved : preferredCountry || detected;
    const country = getCountry(countryId);

    if (!saved) {
      try {
        localStorage.setItem(COUNTRY_KEY, country.id);
        localStorage.setItem(CURRENCY_KEY, country.code);
        window.dispatchEvent(new Event(COUNTRY_EVENT));
      } catch {
        /* ignore */
      }
    }

    loadRates().then((rates) => {
      if (!alive) return;
      setVisitor({
        timeZone,
        countryId: country.id,
        currency: country.code,
        rate: rateFor(country.code, rates),
      });
    });

    return () => {
      alive = false;
    };
  }, [preferredCountry]);

  return visitor;
}
