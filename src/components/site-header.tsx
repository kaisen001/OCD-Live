"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/#agenda", label: "Agenda" },
  { href: "/#packs", label: "Packs" },
  { href: "/suivi", label: "Suivi" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)]/70 bg-[color-mix(in_srgb,var(--bg)_72%,white)] backdrop-blur-xl">
      <div className="container-shell flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={close}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[var(--accent)] font-display text-[0.68rem] font-extrabold tracking-wide text-white sm:h-10 sm:w-10 sm:text-xs">
            OCD
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[0.95rem] font-extrabold tracking-tight sm:text-base">
              OCD Live
            </span>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)] sm:block">
              Studio commercial
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-semibold text-[var(--ink-soft)] transition-colors hover:bg-black/[0.035] hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/suivi"
            className="btn btn-ghost hidden !min-h-10 !px-3.5 text-sm sm:inline-flex"
          >
            Suivre
          </Link>
          <Link
            href="/reserver"
            className="btn btn-primary !min-h-10 !px-4 text-sm sm:!min-h-11 sm:!px-5"
          >
            Réserver
          </Link>
          <button
            type="button"
            className="btn btn-ghost !min-h-10 !w-10 !px-0 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="font-display text-lg leading-none">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--line)] bg-[var(--surface)] md:hidden"
        >
          <nav className="container-shell flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[var(--radius-sm)] px-3 py-3 text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--bg-deep)]"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/reserver"
              className="btn btn-primary mt-2 w-full"
              onClick={close}
            >
              Réserver mon live
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
