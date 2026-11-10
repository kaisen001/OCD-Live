"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { bizKey, modeKey } from "@/lib/business";
import { intlLocale } from "@/lib/locales";
import { formatDate, localTimeFor } from "@/lib/slots";
import { STUDIO_TZ } from "@/lib/time";
import type { AgendaItem } from "@/lib/types";
import { useLocaleId, useVisitor } from "@/lib/use-visitor";
import { T, useT } from "./t";

function clockIn(timeZone: string, localeTag: string) {
  try {
    return new Intl.DateTimeFormat(localeTag, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return "--:--:--";
  }
}

function countryKey(item: AgendaItem) {
  return (item.country || "—").trim() || "—";
}

/** Liste des lives confirmés, groupés par pays, triés par horloge. */
export function LivesBoard() {
  const t = useT();
  const localeId = useLocaleId();
  const visitor = useVisitor();
  const [items, setItems] = useState<AgendaItem[] | null>(null);
  const [now, setNow] = useState<number | null>(null);

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

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localeTag = intlLocale(localeId);
  const youTz = visitor?.timeZone || STUDIO_TZ;
  const lomeClock = now == null ? "--:--:--" : clockIn(STUDIO_TZ, localeTag);
  const youClock = now == null ? "--:--:--" : clockIn(youTz, localeTag);

  const groups = useMemo(() => {
    if (!items) return [];
    const sorted = [...items].sort((a, b) => {
      const byCountry = countryKey(a).localeCompare(countryKey(b), "fr", { sensitivity: "base" });
      if (byCountry !== 0) return byCountry;
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.slotStart.localeCompare(b.slotStart);
    });
    const map = new Map<string, AgendaItem[]>();
    for (const item of sorted) {
      const key = countryKey(item);
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [items]);

  if (items === null) {
    return (
      <p className="py-10 text-[var(--muted)]">
        <T k="lives.loading" />
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panel-soft max-w-xl p-6">
        <p className="display t-3">
          <T k="lives.emptyTitle" />
        </p>
        <p className="mt-2 text-[var(--ink-soft)]">
          <T k="lives.emptyBody" />
        </p>
        <Link href="/reserver" className="btn btn-primary mt-6">
          <T k="lives.bookCta" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10">
      <div className="panel grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <div className="flex items-end justify-between gap-3 border-b border-[var(--line)] pb-3 sm:border-0 sm:pb-0">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="lives.clockLome" />
            </p>
            <p className="display text-3xl tabular-nums text-[var(--main-deep)]">{lomeClock}</p>
          </div>
          <span className="text-sm font-semibold text-[var(--muted)]">GMT</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="lives.clockYou" />
            </p>
            <p className="display text-3xl tabular-nums">{youClock}</p>
          </div>
          <span className="max-w-[9rem] truncate text-right text-sm font-semibold text-[var(--muted)]">
            {youTz.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {groups.map(([country, list]) => (
        <section key={country}>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="display t-2">{country}</h2>
            <p className="text-sm font-bold text-[var(--muted)]">
              {t(list.length > 1 ? "lives.countPlural" : "lives.count", { n: list.length })}
            </p>
          </div>
          <ul className="panel overflow-hidden">
            {list.map((item) => {
              const local = visitor ? localTimeFor(item.date, item.slotStart, visitor.timeZone) : null;
              const localEnd = visitor ? localTimeFor(item.date, item.slotEnd, visitor.timeZone) : null;
              return (
                <li
                  key={`${country}-${item.date}-${item.slotStart}-${item.businessName}`}
                  className="grid gap-2 border-t border-[var(--line)] px-4 py-4 first:border-t-0 sm:grid-cols-[minmax(11rem,0.9fr)_1fr_auto] sm:items-center sm:gap-5 sm:px-5"
                >
                  <div>
                    <p className="font-bold first-letter:uppercase">{formatDate(item.date, localeId)}</p>
                    <p className="mt-0.5 font-extrabold text-[var(--main-deep)] tabular-nums">
                      {item.slotStart}–{item.slotEnd}
                      <span className="ml-1 text-sm font-semibold text-[var(--muted)]">{t("time.lome")}</span>
                    </p>
                    {local && localEnd ? (
                      <p className="text-sm font-semibold text-[var(--muted)] tabular-nums">
                        {local}–{localEnd} {t("time.yourTime")}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="display text-xl">{item.businessName}</p>
                    <p className="text-[var(--muted)]">
                      {t(bizKey(item.businessType))} · {item.city}
                    </p>
                  </div>
                  <span className="tag tag-line justify-self-start">{t(modeKey(item.mode))}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
