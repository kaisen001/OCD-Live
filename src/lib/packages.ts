import type { LivePackage, PackageId } from "./types";

/** Un créneau dure toujours 1 h 30. */
export const LIVE_MINUTES = 90;

/**
 * Les 6 packages.
 * Bovann a cité deux prix dans sa vidéo : 15 000 F et 20 000 F pour 1 h 30.
 * Tous les autres prix sont des PROPOSITIONS, à remplacer par la grille officielle.
 * Pour changer un prix, on change `priceFcfa` ici et nulle part ailleurs.
 *
 * `slots` = nombre de créneaux de 1 h 30 réservés d'affilée le jour choisi.
 * `lives` = nombre de lives compris dans le package.
 */
export const PACKAGES: LivePackage[] = [
  {
    id: "simple",
    name: { fr: "Live simple", en: "Single live" },
    slots: 1,
    lives: 1,
    priceFcfa: 15_000,
    summary: { fr: "1 h 30 de live pour placer ton produit.", en: "1.5 hours live to show your product." },
    includes: [
      { fr: "Ton numéro et ton adresse à l'écran", en: "Your number and address on screen" },
    ],
  },
  {
    id: "plus",
    name: { fr: "Live annoncé", en: "Announced live" },
    slots: 1,
    lives: 1,
    priceFcfa: 20_000,
    summary: {
      fr: "1 h 30 de live, annoncé la veille sur House of Challenge.",
      en: "1.5 hours live, announced the day before on House of Challenge.",
    },
    includes: [
      { fr: "Ton numéro et ton adresse à l'écran", en: "Your number and address on screen" },
      { fr: "Annonce de ton live la veille", en: "Your live announced the day before" },
    ],
  },
  {
    id: "demi",
    name: { fr: "Demi-journée", en: "Half day" },
    slots: 3,
    lives: 1,
    priceFcfa: 36_000,
    featured: true,
    summary: {
      fr: "4 h 30 de suite. Moins cher que trois lives séparés.",
      en: "4.5 hours in a row. Cheaper than three separate lives.",
    },
    includes: [
      { fr: "3 créneaux de suite le même jour", en: "3 slots in a row on the same day" },
      { fr: "Annonce de ton live la veille", en: "Your live announced the day before" },
    ],
  },
  {
    id: "journee",
    name: { fr: "Journée", en: "Full day" },
    slots: 6,
    lives: 1,
    priceFcfa: 60_000,
    summary: {
      fr: "9 h de live. Pour un lancement ou un gros stock.",
      en: "9 hours live. For a launch or a big stock.",
    },
    includes: [
      { fr: "6 créneaux de suite le même jour", en: "6 slots in a row on the same day" },
      { fr: "Annonce de ton live la veille", en: "Your live announced the day before" },
    ],
  },
  {
    id: "vedette",
    name: { fr: "Vedette", en: "Star" },
    slots: 1,
    lives: 1,
    priceFcfa: 50_000,
    summary: {
      fr: "Bovann poste ta vidéo sur son compte et annonce ton live. Puis tu passes en live.",
      en: "Bovann posts your video on his account and announces your live. Then you go live.",
    },
    includes: [
      { fr: "Ta vidéo sur le compte de Bovann", en: "Your video on Bovann's account" },
      { fr: "1 h 30 de live", en: "1.5 hours live" },
    ],
  },
  {
    id: "mois",
    name: { fr: "Package du mois", en: "Monthly package" },
    slots: 1,
    lives: 12,
    priceFcfa: 150_000,
    summary: {
      fr: "12 lives de 1 h 30 sur un mois, et Bovann annonce ton live sur son compte.",
      en: "12 lives of 1.5 hours over a month, and Bovann announces your live on his account.",
    },
    includes: [
      { fr: "3 lives par semaine pendant un mois", en: "3 lives a week for a month" },
      { fr: "Ta vidéo sur le compte de Bovann", en: "Your video on Bovann's account" },
    ],
  },
];

export function getPackage(id: PackageId) {
  const found = PACKAGES.find((item) => item.id === id);
  if (!found) throw new Error(`Package inconnu: ${id}`);
  return found;
}

export function isPackageId(value: string): value is PackageId {
  return PACKAGES.some((item) => item.id === value);
}

/** Durée d'un passage : 1 créneau = "1 h 30", 3 créneaux = "4 h 30". */
export function durationLabel(slots: number) {
  const minutes = slots * LIVE_MINUTES;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

/** 15000 -> "15 000 FCFA" (espace insécable, lisible partout). */
export function formatFcfa(amount: number) {
  const digits = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${digits} FCFA`;
}
