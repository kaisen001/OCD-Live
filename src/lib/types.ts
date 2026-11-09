export type LiveMode = "presentiel" | "distance";

export type BusinessType =
  | "restauration"
  | "mode"
  | "beaute"
  | "tech"
  | "artisanat"
  | "services"
  | "autre";

export type PackageId =
  | "decouverte"
  | "business"
  | "visibilite"
  | "immersion"
  | "vip"
  | "partenaire";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type LivePackage = {
  id: PackageId;
  name: string;
  tagline: string;
  priceFcfa: number;
  durationMin: number;
  highlights: string[];
  badge?: string;
};

export type ReservationInput = {
  mode: LiveMode;
  businessType: BusinessType;
  packageId: PackageId;
  date: string;
  slotStart: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  city: string;
  country: string;
  description: string;
};

export type Reservation = ReservationInput & {
  id: string;
  code: string;
  slotEnd: string;
  priceFcfa: number;
  packageName: string;
  status: ReservationStatus;
  createdAt: string;
  adminMessage: string;
  prepKit: string;
};
