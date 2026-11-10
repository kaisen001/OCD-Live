import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking-wizard";

export const metadata: Metadata = { title: "Réserver mon live" };

export default function ReserverPage() {
  return (
    <div className="shell py-8 md:py-14">
      <Suspense fallback={<div className="mx-auto min-h-[60vh] max-w-2xl" />}>
        <BookingWizard />
      </Suspense>
    </div>
  );
}
