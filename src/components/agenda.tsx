"use client";

import { useEffect, useState } from "react";
import { businessLabel, MODE_LABELS } from "@/lib/business";
import { formatDate } from "@/lib/slots";
import type { AgendaItem } from "@/lib/types";
import { useLang } from "@/lib/use-visitor";
import { T } from "./t";

/** Programme public. N'affiche que des lives réels, approuvés par l'équipe. */
export function Agenda() {
  const lang = useLang();
  const [items, setItems] = useState<AgendaItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/agenda")
      .then((res) => res.json())
      .then((data) => alive && setItems(data.agenda ?? []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, []);

  if (items === null) {
    return (
      <p className="py-6 text-[var(--muted)]">
        <T fr="Chargement du programme…" en="Loading the schedule…" />
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panel-soft max-w-xl p-6">
        <p className="display t-3">
          <T fr="Le programme est encore vide." en="The schedule is still empty." />
        </p>
        <p className="mt-2 text-[var(--ink-soft)]">
          <T
            fr="Les lives s'affichent ici dès que l'équipe les approuve. Le premier peut être le tien."
            en="Lives show up here as soon as the team approves them. The first one can be yours."
          />
        </p>
      </div>
    );
  }

  return (
    <ul>
      {items.map((item) => (
        <li
          key={`${item.date}-${item.slotStart}`}
          className="grid gap-1 border-t border-[var(--line)] py-5 last:border-b md:grid-cols-[14rem_1fr_auto] md:items-baseline md:gap-6"
        >
          <p className="font-bold">
            <span className="inline-block first-letter:uppercase">{formatDate(item.date, lang)}</span>
            <span className="ml-2 font-extrabold text-[var(--main-deep)]">{item.slotStart}</span>
          </p>
          <p>
            <span className="display text-xl">{item.businessName}</span>
            <span className="ml-2 text-[var(--muted)]">
              {businessLabel(item.businessType)[lang]} · {item.city}
            </span>
          </p>
          <span className="tag tag-line justify-self-start">{MODE_LABELS[item.mode][lang]}</span>
        </li>
      ))}
    </ul>
  );
}
