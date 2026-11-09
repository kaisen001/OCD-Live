import { Suspense } from "react";
import { TrackForm } from "@/components/track-form";

export default function SuiviPage() {
  return (
    <div className="container-shell py-10 md:py-14">
      <Suspense
        fallback={
          <div className="surface-card mx-auto max-w-2xl p-6 text-sm text-[var(--muted)]">
            Chargement du suivi…
          </div>
        }
      >
        <TrackForm />
      </Suspense>
    </div>
  );
}
