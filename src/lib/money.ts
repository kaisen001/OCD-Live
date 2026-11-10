/**
 * Les prix sont en francs CFA. Pour un visiteur hors zone CFA, on affiche
 * en plus une estimation dans sa monnaie, devinée à partir de son fuseau.
 */
const ZONE_CURRENCY: Record<string, string> = {
  // Zone CFA (XOF et XAF valent pareil) : pas de conversion à afficher.
  "Africa/Lome": "XOF",
  "Africa/Abidjan": "XOF",
  "Africa/Dakar": "XOF",
  "Africa/Bamako": "XOF",
  "Africa/Ouagadougou": "XOF",
  "Africa/Porto-Novo": "XOF",
  "Africa/Niamey": "XOF",
  "Africa/Bissau": "XOF",
  "Africa/Douala": "XOF",
  "Africa/Libreville": "XOF",
  "Africa/Brazzaville": "XOF",
  "Africa/Ndjamena": "XOF",
  "Africa/Bangui": "XOF",
  "Africa/Malabo": "XOF",
  "Africa/Lagos": "NGN",
  "Africa/Accra": "GHS",
  "Africa/Conakry": "GNF",
  "Africa/Kinshasa": "CDF",
  "Africa/Lubumbashi": "CDF",
  "Africa/Nairobi": "KES",
  "Africa/Johannesburg": "ZAR",
  "Africa/Casablanca": "MAD",
  "Africa/Algiers": "DZD",
  "Africa/Tunis": "TND",
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
    return null;
  }
}
