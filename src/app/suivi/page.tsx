import type { Metadata } from "next";
import { Suspense } from "react";
import { Tracker } from "@/components/tracker";

export const metadata: Metadata = { title: "Mon live" };

export default function SuiviPage() {
  return (
    <div className="shell py-10 md:py-16">
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Tracker />
      </Suspense>
    </div>
  );
}
