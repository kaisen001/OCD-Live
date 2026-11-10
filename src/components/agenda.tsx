"use client";

import { useEffect, useState } from "react";
import { bizKey, modeKey } from "@/lib/business";
import { formatDate, localTimeFor } from "@/lib/slots";
import { slotDisplayLine } from "@/lib/time";
import type { AgendaItem } from "@/lib/types";
import { useLocaleId, useVisitor } from "@/lib/use-visitor";
import { T, useT } from "./t";

/** Programme public. N'affiche que des lives réels, approuvés par l'équipe. */
export function Agenda() {
  const localeId = useLocaleId();
  const t = useT();
  const visitor = useVisitor();
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
        <T k="agenda.loading" />
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panel-soft max-w-xl p-6">
        <p className="display t-3">
          <T k="agenda.emptyTitle" />
        </p>
        <p className="mt-2 text-[var(--ink-soft)]">
          <T k="agenda.emptyBody" />
        </p>
      </div>
    );
  }

  return (
    <ul>
      {items.map((item) => {
        const local = visitor ? localTimeFor(item.date, item.slotStart, visitor.timeZone) : null;
        const when = slotDisplayLine(item.date, item.slotStart, item.slotEnd, visitor?.timeZone, {
          lome: t("time.lome"),
          yourTime: t("time.yourTime"),
        });
        return (
          <li
            key={`${item.date}-${item.slotStart}`}
            className="grid gap-1 border-t border-[var(--line)] py-5 last:border-b md:grid-cols-[minmax(14rem,1.1fr)_1fr_auto] md:items-baseline md:gap-6"
          >
            <p className="font-bold">
              <span className="inline-block first-letter:uppercase">{formatDate(item.date, localeId)}</span>
              <span className="ml-2 font-extrabold text-[var(--main-deep)]">{item.slotStart}</span>
              {local ? (
                <span className="mt-0.5 block text-sm font-semibold text-[var(--muted)]">
                  {local} {t("time.yourTime")}
                </span>
              ) : null}
              <span className="sr-only">{when}</span>
            </p>
            <p>
              <span className="display text-xl">{item.businessName}</span>
              <span className="ml-2 text-[var(--muted)]">
                {t(bizKey(item.businessType))} · {item.city}
              </span>
            </p>
            <span className="tag tag-line justify-self-start">{t(modeKey(item.mode))}</span>
          </li>
        );
      })}
    </ul>
  );
}
