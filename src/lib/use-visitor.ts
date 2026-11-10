"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { currencyForTimeZone, FCFA_PER_EUR } from "./money";
import type { Lang } from "./types";

const LANG_EVENT = "ocd:lang";

function subscribe(callback: () => void) {
  window.addEventListener(LANG_EVENT, callback);
  return () => window.removeEventListener(LANG_EVENT, callback);
}

function readLang(): Lang {
  return document.documentElement.dataset.lang === "en" ? "en" : "fr";
}

/** Langue affichée. Sur le serveur : français. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, readLang, () => "fr");
}

export function setLang(lang: Lang) {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem("ocd-lang", lang);
  } catch {
    // Stockage bloqué : la langue tient le temps de la visite.
  }
  window.dispatchEvent(new Event(LANG_EVENT));
}

export type Visitor = {
  timeZone: string;
  currency: string;
  /** Combien vaut 1 FCFA dans la monnaie du visiteur. null = inconnu. */
  rate: number | null;
};

let ratesPromise: Promise<Record<string, number>> | null = null;

function loadRates() {
  ratesPromise ??= fetch("/api/rates")
    .then((res) => res.json())
    .then((data) => (data.rates ?? {}) as Record<string, number>)
    .catch(() => ({}));
  return ratesPromise;
}

/** Fuseau et monnaie du visiteur, devinés par le navigateur. */
export function useVisitor(): Visitor | null {
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    let alive = true;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lome";
    const currency = currencyForTimeZone(timeZone);
    const rate: Promise<number | null> =
      currency === "XOF"
        ? Promise.resolve(null)
        : currency === "EUR"
          ? Promise.resolve(1 / FCFA_PER_EUR)
          : loadRates().then((rates) => rates[currency] ?? null);
    rate.then((value) => {
      if (alive) setVisitor({ timeZone, currency, rate: value });
    });
    return () => {
      alive = false;
    };
  }, []);

  return visitor;
}
