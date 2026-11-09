"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { businessLabel, modeLabel } from "@/lib/business";
import { formatDateFr } from "@/lib/slots";
import type { BusinessType, LiveMode, ReservationStatus } from "@/lib/types";

type AgendaItem = {
  code: string;
  businessName: string;
  businessType: BusinessType;
  mode: LiveMode;
  date: string;
  slotStart: string;
  slotEnd: string;
  city: string;
  country: string;
  packageName: string;
  status: ReservationStatus;
};

export function AgendaSection() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/agenda")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        setItems(data.agenda ?? []);
        setLoaded(true);
      })
      .catch(() => {
        if (!alive) return;
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="agenda"
      className="border-y border-[var(--line)] bg-[var(--surface)]"
    >
      <div className="container-shell section-space">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="section-kicker">Agenda public</p>
            <h2 className="section-title">Prochains lives approuvés.</h2>
            <p className="section-lead">
              Seuls les dossiers validés par l’équipe OCD apparaissent ici.
            </p>
          </div>
          <Link href="/reserver" className="btn btn-dark self-start">
            Réserver mon live
          </Link>
        </div>

        <div className="mt-12 border-t border-[var(--line)]">
          {!loaded ? (
            <p className="py-8 text-sm text-[var(--muted)]">
              Chargement de l’agenda…
            </p>
          ) : null}

          {loaded && items.length === 0 ? (
            <div className="py-10 md:py-12">
              <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                L’affiche se remplit après validation.
              </h3>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
                Réservez un créneau, l’équipe OCD approuve, puis votre business
                apparaît ici avec date et horaire.
              </p>
            </div>
          ) : null}

          {items.slice(0, 6).map((item) => (
            <article
              key={item.code}
              className="grid gap-3 border-b border-[var(--line)] py-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-center md:gap-6 md:py-6"
            >
              <div>
                <p className="font-display text-lg font-bold tracking-tight md:text-xl">
                  {item.businessName}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {businessLabel(item.businessType)} · {item.city},{" "}
                  {item.country}
                </p>
              </div>
              <div className="text-sm leading-relaxed text-[var(--ink-soft)]">
                <p className="capitalize">{formatDateFr(item.date)}</p>
                <p>
                  {item.slotStart}–{item.slotEnd} · {modeLabel(item.mode)}
                </p>
              </div>
              <span className="tag tag-teal justify-self-start md:justify-self-end">
                {item.packageName}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
