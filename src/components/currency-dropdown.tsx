"use client";

import { COUNTRIES, getCountry } from "@/lib/currencies";
import { setCountry, useCountryId, useLang } from "@/lib/use-visitor";
import { FlagDropdown } from "./flag-dropdown";
import { useT } from "./t";

/** Dropdown pays / monnaies avec drapeaux. */
export function CurrencyDropdown({ align = "right" }: { align?: "left" | "right" }) {
  const countryId = useCountryId();
  const lang = useLang();
  const t = useT();
  const current = getCountry(countryId);

  return (
    <FlagDropdown
      label={t("currency.choose")}
      value={current.id}
      buttonText={current.code}
      align={align}
      wide
      header={t("currency.header")}
      items={COUNTRIES.map((item) => ({
        id: item.id,
        flag: item.flag,
        title: item.name[lang],
        subtitle: `${item.code} · ${item.label} · ${item.currencyName[lang]}`,
      }))}
      onChange={setCountry}
    />
  );
}
