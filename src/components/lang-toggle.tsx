"use client";

import { LOCALES } from "@/lib/locales";
import { setLocale, useLang, useLocaleId } from "@/lib/use-visitor";
import { FlagDropdown } from "./flag-dropdown";
import { useT } from "./t";

/** Dropdown langues africaines + drapeaux des pays. */
export function LangToggle() {
  const localeId = useLocaleId();
  const lang = useLang();
  const t = useT();
  const current = LOCALES.find((item) => item.id === localeId) ?? LOCALES[0];

  return (
    <FlagDropdown
      label={t("nav.lang")}
      value={current.id}
      buttonText={current.id.length <= 3 ? current.id : current.id.slice(0, 2)}
      header={t("nav.langHeader")}
      items={LOCALES.map((item) => ({
        id: item.id,
        flag: item.flag,
        title: item.native,
        subtitle: `${item.country[lang]} · ${lang === "fr" ? item.fr : item.en}`,
      }))}
      onChange={setLocale}
    />
  );
}
