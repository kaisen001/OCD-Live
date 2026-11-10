import type { Bi, BusinessType, LiveMode } from "./types";

export const BUSINESS_TYPES: { id: BusinessType; label: Bi }[] = [
  { id: "mode", label: { fr: "Mode, couture, accessoires", en: "Fashion, tailoring, accessories" } },
  { id: "beaute", label: { fr: "Beauté, cosmétiques, coiffure", en: "Beauty, cosmetics, hair" } },
  { id: "restauration", label: { fr: "Alimentation, restauration", en: "Food, catering" } },
  { id: "tech", label: { fr: "Téléphones, électronique", en: "Phones, electronics" } },
  { id: "maison", label: { fr: "Maison, déco", en: "Home, decor" } },
  { id: "agriculture", label: { fr: "Agriculture, élevage", en: "Farming, livestock" } },
  { id: "artisanat", label: { fr: "Artisanat, art", en: "Crafts, art" } },
  { id: "services", label: { fr: "Services", en: "Services" } },
  { id: "formation", label: { fr: "Formation, coaching", en: "Training, coaching" } },
  { id: "autre", label: { fr: "Autre", en: "Other" } },
];

export const MODE_LABELS: Record<LiveMode, Bi> = {
  presentiel: { fr: "En présentiel, à Lomé", en: "In person, in Lomé" },
  distance: { fr: "À distance", en: "Remote" },
};

export function isBusinessType(value: string): value is BusinessType {
  return BUSINESS_TYPES.some((item) => item.id === value);
}

export function businessLabel(id: BusinessType): Bi {
  return BUSINESS_TYPES.find((item) => item.id === id)?.label ?? { fr: id, en: id };
}
