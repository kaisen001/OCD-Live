import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[var(--ink)] text-white">
      <div className="container-shell grid gap-10 border-b border-white/10 py-12 md:grid-cols-[1.4fr_1fr] md:gap-16 md:py-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[var(--accent)] font-display text-xs font-extrabold tracking-wide">
              OCD
            </span>
            <p className="font-display text-2xl font-extrabold tracking-tight">
              OCD Live
            </p>
          </div>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/60">
            Booking studio commercial pour entrepreneurs. Présentiel Bovann
            Shop (Togo) ou à distance. Ouverture : 1er décembre 2026.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/40">
              Produit
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm font-semibold text-white/78">
              <Link href="/reserver" className="hover:text-white">
                Réserver
              </Link>
              <Link href="/#agenda" className="hover:text-white">
                Agenda
              </Link>
              <Link href="/#packs" className="hover:text-white">
                Packs
              </Link>
              <Link href="/suivi" className="hover:text-white">
                Suivi
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/40">
              Équipe
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm font-semibold text-white/78">
              <Link href="/admin" className="text-white/45 hover:text-white/70">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell flex flex-col gap-2 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 OCD Live</p>
        <p>House of Challenge · Bovann Shop</p>
      </div>
    </footer>
  );
}
