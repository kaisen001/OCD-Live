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
  | "decouverte"
  | "duo"
  | "pack4"
  | "semaine"
  | "pack8"
  | "mensuel";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type LivePackage = {
  id: PackageId;
  name: Bi;
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
