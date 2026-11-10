import { getCurrency } from "./currencies";
import { formatFcfa } from "./packages";

export type { CountryMoney as CurrencyOption } from "./currencies";

/**
 * Les prix sont en francs CFA. Pour un visiteur hors zone CFA, on affiche
 * en plus une estimation dans sa monnaie, devinée à partir de son fuseau.
 */
const ZONE_CURRENCY: Record<string, string> = {
  "Africa/Lome": "XOF",
  "Africa/Abidjan": "XOF",
  "Africa/Dakar": "XOF",
  "Africa/Bamako": "XOF",
  "Africa/Ouagadougou": "XOF",
  "Africa/Porto-Novo": "XOF",
  "Africa/Niamey": "XOF",
  "Africa/Bissau": "XOF",
  "Africa/Douala": "XAF",
  "Africa/Libreville": "XAF",
  "Africa/Brazzaville": "XAF",
  "Africa/Ndjamena": "XAF",
  "Africa/Bangui": "XAF",
  "Africa/Malabo": "XAF",
  "Africa/Lagos": "NGN",
  "Africa/Accra": "GHS",
  "Africa/Conakry": "GNF",
  "Africa/Kinshasa": "CDF",
  "Africa/Lubumbashi": "CDF",
  "Africa/Nairobi": "KES",
  "Africa/Dar_es_Salaam": "TZS",
  "Africa/Kampala": "UGX",
  "Africa/Johannesburg": "ZAR",
  "Africa/Casablanca": "MAD",
  "Africa/Algiers": "DZD",
  "Africa/Tunis": "TND",
  "Africa/Cairo": "EGP",
  "Africa/Addis_Ababa": "ETB",
  "Africa/Luanda": "AOA",
  "Africa/Maputo": "MZN",
  "Africa/Kigali": "RWF",
  "Africa/Monrovia": "LRD",
  "Africa/Freetown": "SLE",
  "Africa/Banjul": "GMD",
  "Africa/Nouakchott": "MRU",
  "America/Port-au-Prince": "HTG",
  "America/Toronto": "CAD",
  "America/Montreal": "CAD",
  "America/Vancouver": "CAD",
  "Europe/London": "GBP",
  "Europe/Zurich": "CHF",
};

export function currencyForTimeZone(timeZone: string): string {
  if (ZONE_CURRENCY[timeZone]) return ZONE_CURRENCY[timeZone];
  if (timeZone.startsWith("Europe/")) return "EUR";
  if (timeZone.startsWith("America/")) return "USD";
  return "XOF";
}

/** Parité fixe : 1 euro = 655,957 FCFA. */
export const FCFA_PER_EUR = 655.957;

export function formatApprox(amountFcfa: number, currency: string, rate: number, locale: string) {
  const value = amountFcfa * rate;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: value >= 20 ? 0 : 2,
    }).format(value);
  } catch {
    const digits = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${digits} ${getCurrency(currency).label}`;
  }
}

/** Affiche un prix FCFA dans la monnaie choisie. */
export function formatPrice(
  amountFcfa: number,
  currency: string,
  rate: number | null,
  locale: string,
): { primary: string; secondary: string | null } {
  if (currency === "XOF" || currency === "XAF" || rate == null || rate === 1) {
    return {
      primary: currency === "XAF" ? formatFcfa(amountFcfa).replace("FCFA", "FCFA (XAF)") : formatFcfa(amountFcfa),
      secondary: null,
    };
  }
  const converted = formatApprox(amountFcfa, currency, rate, locale);
  return {
    primary: converted ?? formatFcfa(amountFcfa),
    secondary: converted ? formatFcfa(amountFcfa) : null,
  };
}
