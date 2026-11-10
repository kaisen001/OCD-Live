/**
 * Pays / monnaies pour l'affichage des packs.
 * `flag` = code ISO pour /flags/{flag}.svg
 */
export type CountryMoney = {
  id: string;
  /** Code ISO drapeau (/flags/{flag}.svg). */
  flag: string;
  name: { fr: string; en: string };
  code: string;
  label: string;
  currencyName: { fr: string; en: string };
  fixedFromXof?: number;
};

export const COUNTRIES: CountryMoney[] = [
  { id: "tg", flag: "tg", name: { fr: "Togo", en: "Togo" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "bj", flag: "bj", name: { fr: "Bénin", en: "Benin" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "bf", flag: "bf", name: { fr: "Burkina Faso", en: "Burkina Faso" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "ci", flag: "ci", name: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "sn", flag: "sn", name: { fr: "Sénégal", en: "Senegal" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "ml", flag: "ml", name: { fr: "Mali", en: "Mali" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "ne", flag: "ne", name: { fr: "Niger", en: "Niger" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "gw", flag: "gw", name: { fr: "Guinée-Bissau", en: "Guinea-Bissau" }, code: "XOF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "cm", flag: "cm", name: { fr: "Cameroun", en: "Cameroon" }, code: "XAF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "ga", flag: "ga", name: { fr: "Gabon", en: "Gabon" }, code: "XAF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "cg", flag: "cg", name: { fr: "Congo", en: "Congo" }, code: "XAF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "td", flag: "td", name: { fr: "Tchad", en: "Chad" }, code: "XAF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "cf", flag: "cf", name: { fr: "Centrafrique", en: "Central African Republic" }, code: "XAF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "gq", flag: "gq", name: { fr: "Guinée équatoriale", en: "Equatorial Guinea" }, code: "XAF", label: "FCFA", currencyName: { fr: "Franc CFA", en: "CFA franc" }, fixedFromXof: 1 },
  { id: "ng", flag: "ng", name: { fr: "Nigeria", en: "Nigeria" }, code: "NGN", label: "₦", currencyName: { fr: "Naira", en: "Naira" } },
  { id: "gh", flag: "gh", name: { fr: "Ghana", en: "Ghana" }, code: "GHS", label: "GH₵", currencyName: { fr: "Cedi", en: "Cedi" } },
  { id: "gn", flag: "gn", name: { fr: "Guinée", en: "Guinea" }, code: "GNF", label: "FG", currencyName: { fr: "Franc guinéen", en: "Guinean franc" } },
  { id: "cd", flag: "cd", name: { fr: "RDC", en: "DR Congo" }, code: "CDF", label: "FC", currencyName: { fr: "Franc congolais", en: "Congolese franc" } },
  { id: "ke", flag: "ke", name: { fr: "Kenya", en: "Kenya" }, code: "KES", label: "KSh", currencyName: { fr: "Shilling kenyan", en: "Kenyan shilling" } },
  { id: "tz", flag: "tz", name: { fr: "Tanzanie", en: "Tanzania" }, code: "TZS", label: "TSh", currencyName: { fr: "Shilling tanzanien", en: "Tanzanian shilling" } },
  { id: "ug", flag: "ug", name: { fr: "Ouganda", en: "Uganda" }, code: "UGX", label: "USh", currencyName: { fr: "Shilling ougandais", en: "Ugandan shilling" } },
  { id: "rw", flag: "rw", name: { fr: "Rwanda", en: "Rwanda" }, code: "RWF", label: "FRw", currencyName: { fr: "Franc rwandais", en: "Rwandan franc" } },
  { id: "za", flag: "za", name: { fr: "Afrique du Sud", en: "South Africa" }, code: "ZAR", label: "R", currencyName: { fr: "Rand", en: "Rand" } },
  { id: "ma", flag: "ma", name: { fr: "Maroc", en: "Morocco" }, code: "MAD", label: "MAD", currencyName: { fr: "Dirham", en: "Dirham" } },
  { id: "dz", flag: "dz", name: { fr: "Algérie", en: "Algeria" }, code: "DZD", label: "DA", currencyName: { fr: "Dinar algérien", en: "Algerian dinar" } },
  { id: "tn", flag: "tn", name: { fr: "Tunisie", en: "Tunisia" }, code: "TND", label: "DT", currencyName: { fr: "Dinar tunisien", en: "Tunisian dinar" } },
  { id: "eg", flag: "eg", name: { fr: "Égypte", en: "Egypt" }, code: "EGP", label: "E£", currencyName: { fr: "Livre égyptienne", en: "Egyptian pound" } },
  { id: "et", flag: "et", name: { fr: "Éthiopie", en: "Ethiopia" }, code: "ETB", label: "Br", currencyName: { fr: "Birr", en: "Birr" } },
  { id: "ao", flag: "ao", name: { fr: "Angola", en: "Angola" }, code: "AOA", label: "Kz", currencyName: { fr: "Kwanza", en: "Kwanza" } },
  { id: "mz", flag: "mz", name: { fr: "Mozambique", en: "Mozambique" }, code: "MZN", label: "MT", currencyName: { fr: "Metical", en: "Metical" } },
  { id: "mr", flag: "mr", name: { fr: "Mauritanie", en: "Mauritania" }, code: "MRU", label: "UM", currencyName: { fr: "Ouguiya", en: "Ouguiya" } },
  { id: "sl", flag: "sl", name: { fr: "Sierra Leone", en: "Sierra Leone" }, code: "SLE", label: "Le", currencyName: { fr: "Leone", en: "Leone" } },
  { id: "gm", flag: "gm", name: { fr: "Gambie", en: "Gambia" }, code: "GMD", label: "D", currencyName: { fr: "Dalasi", en: "Dalasi" } },
  { id: "lr", flag: "lr", name: { fr: "Liberia", en: "Liberia" }, code: "LRD", label: "L$", currencyName: { fr: "Dollar libérien", en: "Liberian dollar" } },
  { id: "eu", flag: "eu", name: { fr: "Europe", en: "Europe" }, code: "EUR", label: "€", currencyName: { fr: "Euro", en: "Euro" } },
  { id: "us", flag: "us", name: { fr: "États-Unis", en: "United States" }, code: "USD", label: "$", currencyName: { fr: "Dollar US", en: "US dollar" } },
];

export const CURRENCIES = COUNTRIES;

export function getCountry(idOrCode: string): CountryMoney {
  return (
    COUNTRIES.find((item) => item.id === idOrCode) ||
    COUNTRIES.find((item) => item.code === idOrCode) ||
    COUNTRIES[0]
  );
}

export function getCurrency(code: string): CountryMoney {
  return COUNTRIES.find((item) => item.code === code) ?? COUNTRIES[0];
}

export function isKnownCountry(id: string) {
  return COUNTRIES.some((item) => item.id === id);
}

export function isKnownCurrency(code: string) {
  return COUNTRIES.some((item) => item.code === code);
}
