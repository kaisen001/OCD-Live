export type Lang = "fr" | "en";
export type Bi = { fr: string; en: string };

export type LiveMode = "presentiel" | "distance";

export type BusinessType =
  | "restauration"
  | "mode"
  | "beaute"
  | "tech"
  | "maison"
  | "agriculture"
  | "artisanat"
  | "services"
  | "formation"
  | "autre";

export type PackageId =
  | "simple"
  | "plus"
  | "demi"
  | "journee"
  | "vedette"
  | "mois";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type LivePackage = {
  id: PackageId;
  name: Bi;
  /** Créneaux de 1 h 30 réservés d'affilée le jour choisi. */
  slots: number;
  /** Nombre de lives compris. */
  lives: number;
  priceFcfa: number;
  summary: Bi;
  includes: Bi[];
  featured?: boolean;
};

export type ReservationInput = {
  mode: LiveMode;
  date: string;
  slotStart: string;
  packageId: PackageId;
  businessName: string;
  businessType: BusinessType;
  description: string;
  contactName: string;
  whatsapp: string;
  /** Adresse de la boutique, affichée pendant le live. Facultatif. */
  address: string;
  city: string;
  country: string;
};

export type Reservation = ReservationInput & {
  id: string;
  code: string;
  memberNo: number;
  slotEnd: string;
  priceFcfa: number;
  status: ReservationStatus;
  createdAt: string;
};

/** What a seller (or anyone holding the code) may see. No phone number. */
export type PublicReservation = Pick<
  Reservation,
  | "code"
  | "memberNo"
  | "status"
  | "mode"
  | "date"
  | "slotStart"
  | "slotEnd"
  | "packageId"
  | "priceFcfa"
  | "businessName"
  | "businessType"
  | "contactName"
  | "address"
  | "city"
  | "country"
>;

export type AgendaItem = Pick<
  Reservation,
  | "businessName"
  | "businessType"
  | "mode"
  | "date"
  | "slotStart"
  | "slotEnd"
  | "city"
  | "country"
>;
