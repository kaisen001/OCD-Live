"use client";

import Link from "next/link";
import { CardCarousel } from "@/components/carousel/card-carousel";
import { formatFcfa, PACKAGES } from "@/lib/packages";

export function PackagesStrip() {
  return (
    <section id="packs" className="container-shell section-space">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="section-kicker">6 packages</p>
          <h2 className="section-title">
            Du premier live au partenariat mensuel.
          </h2>
          <p className="section-lead">
            Des formules progressives, prix visibles, sans jargon.
          </p>
        </div>
        <Link href="/reserver" className="btn btn-primary self-start">
          Réserver mon live
        </Link>
      </div>

      <div className="mt-10 md:mt-12">
        <CardCarousel label="Packages OCD Live" autoplay intervalMs={4200}>
          {PACKAGES.map((pack, index) => (
            <article key={pack.id} className="pack-card">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-[0.72rem] font-bold tracking-[0.16em] text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                {pack.badge ? (
                  <span className="tag tag-accent">{pack.badge}</span>
                ) : null}
              </div>
              <h3 className="font-display mt-4 text-[1.35rem] font-bold tracking-tight">
                {pack.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{pack.tagline}</p>
              <p className="font-display mt-6 text-[1.75rem] font-extrabold tracking-tight">
                {formatFcfa(pack.priceFcfa)}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {pack.durationMin >= 60
                  ? `${pack.durationMin / 60}h`
                  : `${pack.durationMin} min`}{" "}
                d’antenne
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-[var(--line)] pt-4 text-sm text-[var(--ink-soft)]">
                {pack.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
