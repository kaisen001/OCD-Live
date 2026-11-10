import type { LivePackage, PackageId } from "./types";

/** Un live dure toujours 1 h 30. */
export const LIVE_MINUTES = 90;

/**
 * Grille de prix PROPOSÉE (en attente de la grille officielle).
 * Règle : plus on prend de lives, moins le live coûte cher.
 * Pour changer un prix, on change `priceFcfa` ici et nulle part ailleurs.
 */
export const PACKAGES: LivePackage[] = [
  {
    id: "decouverte",
    name: { fr: "Découverte", en: "First live" },
    lives: 1,
    priceFcfa: 15_000,
    summary: {
      fr: "Un live pour essayer.",
      en: "One live to try it out.",
    },
    includes: [
      {
        fr: "1 h 30 en direct sur House of Challenge",
        en: "1.5 hours live on House of Challenge",
      },
      {
        fr: "Ton nom et ton WhatsApp affichés à l'écran",
        en: "Your name and WhatsApp shown on screen",
      },
    ],
  },
  {
    id: "duo",
    name: { fr: "Duo", en: "Duo" },
    lives: 2,
    priceFcfa: 28_000,
    summary: {
      fr: "Deux passages : les clients te reconnaissent au deuxième.",
      en: "Two shows: buyers recognise you the second time.",
    },
    includes: [
      { fr: "2 lives de 1 h 30", en: "2 lives of 1.5 hours" },
      {
        fr: "Ton nom et ton WhatsApp affichés à l'écran",
        en: "Your name and WhatsApp shown on screen",
      },
    ],
  },
  {
    id: "pack4",
    name: { fr: "Pack 4", en: "Pack of 4" },
    lives: 4,
    priceFcfa: 52_000,
    featured: true,
    summary: {
      fr: "Un live par semaine pendant un mois.",
      en: "One live a week for a month.",
    },
    includes: [
      { fr: "4 lives de 1 h 30", en: "4 lives of 1.5 hours" },
      {
        fr: "Ton live annoncé la veille sur House of Challenge",
        en: "Your live announced the day before on House of Challenge",
      },
    ],
  },
  {
    id: "semaine",
    name: { fr: "Semaine", en: "Full week" },
    lives: 5,
    priceFcfa: 62_500,
    summary: {
      fr: "Cinq jours de suite, à la même heure.",
      en: "Five days in a row, same time.",
    },
    includes: [
      {
        fr: "5 lives de 1 h 30 dans la même semaine",
        en: "5 lives of 1.5 hours in the same week",
      },
      {
        fr: "Ton live annoncé la veille sur House of Challenge",
        en: "Your live announced the day before on House of Challenge",
      },
    ],
  },
  {
    id: "pack8",
    name: { fr: "Pack 8", en: "Pack of 8" },
    lives: 8,
    priceFcfa: 96_000,
    summary: {
      fr: "Deux lives par semaine pendant un mois.",
      en: "Two lives a week for a month.",
    },
    includes: [
      { fr: "8 lives de 1 h 30", en: "8 lives of 1.5 hours" },
      {
        fr: "Ton live annoncé la veille sur House of Challenge",
        en: "Your live announced the day before on House of Challenge",
      },
      {
        fr: "Tu choisis tes créneaux avant les autres",
        en: "You pick your slots before everyone else",
      },
    ],
  },
  {
    id: "mensuel",
    name: { fr: "Mensuel Bovann", en: "Bovann monthly" },
    lives: 12,
    priceFcfa: 150_000,
    summary: {
      fr: "Trois lives par semaine, et Bovann annonce ton live sur son compte.",
      en: "Three lives a week, and Bovann announces your live on his account.",
    },
    includes: [
      {
        fr: "12 lives de 1 h 30 sur un mois",
        en: "12 lives of 1.5 hours over one month",
      },
      {
        fr: "Annonce de ton live sur le compte TikTok de Bovann",
        en: "Your live announced on Bovann's TikTok account",
      },
      {
        fr: "Tu choisis tes créneaux avant les autres",
        en: "You pick your slots before everyone else",
      },
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

export function pricePerLive(pack: LivePackage) {
  return Math.round(pack.priceFcfa / pack.lives);
}

/** 15000 -> "15 000 FCFA" (espace insécable, lisible partout). */
export function formatFcfa(amount: number) {
  const digits = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${digits} FCFA`;
}
