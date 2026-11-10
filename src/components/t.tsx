"use client";

import type { ReactNode } from "react";
import type { MessageKey } from "@/lib/i18n";
import { useLang } from "@/lib/use-visitor";
import { useLocaleApi } from "./locale-root";

/** Traduit une clé selon la locale choisie. */
export function useT() {
  return useLocaleApi().t;
}

type Props =
  | { k: MessageKey; vars?: Record<string, string | number>; fr?: never; en?: never }
  | { k?: never; vars?: never; fr: ReactNode; en: ReactNode };

/**
 * Affiche une chaîne traduite.
 * Préférer `k` (dictionnaire multi-langues). `fr`/`en` reste pour textes non encore migrés.
 */
export function T(props: Props) {
  const { t } = useLocaleApi();
  const lang = useLang();
  if ("k" in props && props.k) {
    return <>{t(props.k, props.vars)}</>;
  }
  return <>{lang === "en" ? props.en : props.fr}</>;
}
