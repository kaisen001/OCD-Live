"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatFcfa } from "@/lib/packages";
import { formatDateFr } from "@/lib/slots";
import type { Reservation, ReservationStatus } from "@/lib/types";

function statusCopy(status: ReservationStatus) {
  if (status === "pending") {
    return {
      label: "En attente d’approbation",
      hint: "L’équipe OCD vérifie votre dossier. Votre live n’est pas encore publié sur l’accueil.",
      tag: "tag-accent" as const,
    };
  }
  if (status === "confirmed") {
    return {
      label: "Approuvée",
      hint: "Votre créneau est confirmé et visible sur l’agenda public.",
      tag: "tag-teal" as const,
    };
  }
  return {
    label: "Annulée",
    hint: "Cette réservation a été annulée. Vous pouvez en créer une nouvelle.",
    tag: "tag" as const,
  };
}

export function TrackForm() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = searchParams.get("code");
    if (initial) {
      setCode(initial);
      void lookup(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function lookup(value = code) {
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    setReservation(null);
    try {
      const res = await fetch(
        `/api/reservations/track?code=${encodeURIComponent(value.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Introuvable");
      setReservation(data.reservation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const status = reservation ? statusCopy(reservation.status) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="surface-card p-6 md:p-8">
        <p className="section-kicker">Suivi</p>
        <h1 className="font-display mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.035em]">
          Suivre ma réservation
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Entrez votre code reçu après réservation.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            className="min-h-12 flex-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-white px-3.5 outline-none focus:border-[color-mix(in_srgb,var(--accent)_55%,var(--line))] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="OCD-20261201-XXXX"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => lookup()}
            disabled={loading}
          >
            {loading ? "Recherche…" : "Rechercher"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-sm font-semibold text-[var(--accent-deep)]">
            {error}
          </p>
        ) : null}
      </div>

      {reservation && status ? (
        <div className="surface-card fade-up space-y-4 p-6 md:p-8">
          <span className={status.tag}>{status.label}</span>
          <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
            {status.hint}
          </p>
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {reservation.businessName}
            </h2>
            <p className="mt-2 text-[var(--ink-soft)]">
              {formatDateFr(reservation.date)} · {reservation.slotStart}–
              {reservation.slotEnd}
            </p>
            <p className="mt-1 text-[var(--ink-soft)]">
              {reservation.packageName} · {formatFcfa(reservation.priceFcfa)}
            </p>
          </div>
          <div className="rounded-[var(--radius-sm)] bg-[var(--bg-deep)] p-4 text-sm whitespace-pre-wrap leading-relaxed text-[var(--ink-soft)]">
            {reservation.prepKit}
          </div>
          {reservation.status === "cancelled" ? (
            <Link href="/reserver" className="btn btn-primary">
              Nouvelle réservation
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
