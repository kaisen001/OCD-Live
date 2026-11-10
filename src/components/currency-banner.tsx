"use client";

import { getCountry } from "@/lib/currencies";
import { useCountryId, useLang } from "@/lib/use-visitor";
import { CurrencyDropdown } from "./currency-dropdown";
import { Flag } from "./flag";
import { T } from "./t";

/** Bandeau accueil : dropdown pays / monnaie avec drapeaux image. */
export function CurrencyBanner() {
  const countryId = useCountryId();
  const country = getCountry(countryId);
  const lang = useLang();

  return (
    <div className="shell pb-2 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 shadow-[0_10px_28px_-22px_rgba(22,24,35,0.45)]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Flag code={country.flag} className="h-6 w-9 shrink-0" alt={country.name[lang]} />
          <div className="min-w-0">
            <p className="text-sm font-extrabold">
              <T k="currency.title" />
            </p>
            <p className="truncate text-sm text-[var(--ink-soft)]">
              {country.name[lang]} · {country.code} ({country.label})
            </p>
          </div>
        </div>
        <CurrencyDropdown align="right" />
      </div>
    </div>
  );
}
