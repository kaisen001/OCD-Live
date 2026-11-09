import { AgendaSection } from "@/components/agenda-section";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { PackagesStrip } from "@/components/packages-strip";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <AgendaSection />
      <PackagesStrip />
      <section className="container-shell pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-[var(--radius)] bg-[var(--ink)] px-6 py-10 text-white sm:px-10 sm:py-12 md:px-14 md:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(184,28,36,0.45), transparent 68%)",
            }}
            aria-hidden
          />

          <div className="relative grid gap-10 md:grid-cols-[1.35fr_0.85fr] md:items-end">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/50">
                Prochaine étape
              </p>
              <h2 className="font-display mt-3 max-w-xl text-[clamp(1.7rem,3.5vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                Bloquez votre créneau avant qu’il parte.
              </h2>
              <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-white/68">
                Présentiel au Togo ou à distance. L’équipe reçoit votre
                business, votre date et votre pack immédiatement.
              </p>
              <Link
                href="/reserver"
                className="btn btn-primary mt-7 w-full sm:w-auto"
              >
                Réserver mon live
              </Link>
            </div>

            <ul className="space-y-0 text-sm text-white/70">
              {[
                "Parcours en 3 écrans",
                "Validation admin avant publication",
                "Code suivi + kit prep inclus",
              ].map((item) => (
                <li
                  key={item}
                  className="border-t border-white/12 py-3.5 first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
