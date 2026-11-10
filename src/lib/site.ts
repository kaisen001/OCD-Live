/**
 * Réglages du site. Tout ce qui dépend de l'équipe OCD se change ici.
 */
export const SITE = {
  name: "OCD Live",
  tagline: "Les Opportunités C'est Dehors",
  tiktokAccount: "@houseofchallenge",
  tiktokUrl: "https://www.tiktok.com/@houseofchallenge",
  studioCity: "Lomé",
  studioCountry: "Togo",
  /** Fuseau du studio. Lomé est en GMT toute l'année. */
  studioTimeZone: "Africa/Lome",
  /**
   * À REMPLIR PAR L'ÉQUIPE : numéro WhatsApp officiel au format international
   * sans « + » (ex. "22890000000"). Vide = le bouton WhatsApp n'est pas affiché.
   */
  teamWhatsapp: process.env.NEXT_PUBLIC_TEAM_WHATSAPP ?? "",
} as const;
