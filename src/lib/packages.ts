import type { BusinessType, LivePackage, PackageId } from "./types";

export const PACKAGES: LivePackage[] = [
  {
    id: "decouverte",
    name: "Découverte",
    tagline: "Premier direct clé en main",
    priceFcfa: 15_000,
    durationMin: 90,
    highlights: [
      "1h30 sur House of Challenge",
      "Assistante OCD en co-animation",
      "Nom + téléphone diffusés",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Contacts complets + stories",
    priceFcfa: 20_000,
    durationMin: 90,
    badge: "Populaire",
    highlights: [
      "1h30 avec bandeau contacts",
      "Adresse + réseaux à l’écran",
      "2 stories le jour J",
    ],
  },
  {
    id: "visibilite",
    name: "Visibilité+",
    tagline: "2h + affiche & publication",
    priceFcfa: 35_000,
    durationMin: 120,
    highlights: [
      "2h00 de direct",
      "Affiche digitale dédiée",
      "4 stories avant/après",
    ],
  },
  {
    id: "immersion",
    name: "Immersion 4h",
    tagline: "Marathon vente à tarif avantageux",
    priceFcfa: 45_000,
    durationMin: 240,
    badge: "Meilleur ratio",
    highlights: [
      "4h00 continues",
      "Idéal resto / mode / démo",
      "3 stories pendant le live",
    ],
  },
  {
    id: "vip",
    name: "VIP Projecteur",
    tagline: "Annonce 48h + grand live 4h",
    priceFcfa: 65_000,
    durationMin: 240,
    highlights: [
      "Annonce officielle J-2",
      "Affiche premium + teasing",
      "4h co-animées",
    ],
  },
  {
    id: "partenaire",
    name: "Partenaire Mensuel",
    tagline: "4 lives / mois + campagne 30 jours",
    priceFcfa: 150_000,
    durationMin: 120,
    badge: "Mensuel",
    highlights: [
      "4 sessions de 2h",
      "Créneaux prioritaires",
      "Annonce avant chaque live",
    ],
  },
];

const RECOS: Record<BusinessType, PackageId> = {
  restauration: "immersion",
  mode: "business",
  beaute: "business",
  tech: "decouverte",
  artisanat: "visibilite",
  services: "decouverte",
  autre: "business",
};

export function getPackage(id: PackageId) {
  const pack = PACKAGES.find((item) => item.id === id);
  if (!pack) throw new Error(`Package inconnu: ${id}`);
  return pack;
}

export function recommendPackage(businessType: BusinessType): PackageId {
  return RECOS[businessType];
}

export function formatFcfa(amount: number) {
  const grouped = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} FCFA`;
}
