"use client";

import { setLang, useLang } from "@/lib/use-visitor";

export function LangToggle() {
  const lang = useLang();
  const next = lang === "fr" ? "en" : "fr";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className="min-h-11 rounded-md border-2 border-[var(--line)] px-3 text-sm font-bold uppercase tracking-wide hover:border-[var(--ink)]"
      aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span className={lang === "fr" ? "" : "opacity-40"}>FR</span>
      <span className="mx-1 opacity-40">/</span>
      <span className={lang === "en" ? "" : "opacity-40"}>EN</span>
    </button>
  );
}
