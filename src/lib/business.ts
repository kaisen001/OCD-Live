import type { BusinessType, LiveMode } from "./types";

export const BUSINESS_TYPES: { id: BusinessType; label: string; hint: string }[] =
  [
    {
      id: "restauration",
      label: "Restauration",
      hint: "Plats, snacks, boissons",
    },
    { id: "mode", label: "Mode & accessoires", hint: "Vêtements, tissus" },
    { id: "beaute", label: "Beauté & soins", hint: "Cosmétiques, coiffure" },
    { id: "tech", label: "Tech & électronique", hint: "Phones, gadgets" },
    { id: "artisanat", label: "Artisanat", hint: "Créations locales" },
    { id: "services", label: "Services", hint: "Formations, prestations" },
    { id: "autre", label: "Autre activité", hint: "Dites-nous tout" },
  ];

export const LIVE_MODES: {
  id: LiveMode;
  title: string;
  subtitle: string;
  points: string[];
}[] = [
  {
    id: "presentiel",
    title: "Présentiel — Togo",
    subtitle: "Dans les locaux Bovann Shop, avec régie",
    points: [
      "Vous venez avec vos produits",
      "Accueil + co-animation sur place",
      "Diffusion House of Challenge",
    ],
  },
  {
    id: "distance",
    title: "À distance",
    subtitle: "Afrique & international, sans déplacement",
    points: [
      "Depuis votre boutique ou domicile",
      "Assistante OCD porte votre offre à l’écran",
      "Contacts WhatsApp mis en avant",
    ],
  },
];

export function businessLabel(id: BusinessType) {
  return BUSINESS_TYPES.find((item) => item.id === id)?.label ?? id;
}

export function modeLabel(id: LiveMode) {
  return LIVE_MODES.find((item) => item.id === id)?.title ?? id;
}
