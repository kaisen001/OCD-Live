"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { t as translate, type MessageKey } from "@/lib/i18n";
import { useLocaleId } from "@/lib/use-visitor";

type LocaleApi = {
  localeId: string;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleApi>({
  localeId: "fr",
  t: (key, vars) => translate("fr", key, vars),
});

/** Fournit la locale courante à tout le site : un changement de langue rafraîchit tous les textes. */
export function LocaleRoot({ children }: { children: ReactNode }) {
  const localeId = useLocaleId();
  const value = useMemo<LocaleApi>(
    () => ({
      localeId,
      t: (key, vars) => translate(localeId, key, vars),
    }),
    [localeId],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleApi() {
  return useContext(LocaleContext);
}
