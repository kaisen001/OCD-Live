import Link from "next/link";
import { LangToggle } from "./lang-toggle";
import { Logo } from "./logo";
import { T } from "./t";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link href="/" aria-label="OCD Live">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/#prix" className="hidden px-3 py-2 font-semibold hover:underline md:block">
            <T fr="Prix" en="Prices" />
          </Link>
          <Link href="/histoire" className="hidden px-3 py-2 font-semibold hover:underline md:block">
            <T fr="Pourquoi OCD" en="Why OCD" />
          </Link>
          <Link href="/suivi" className="hidden px-3 py-2 font-semibold hover:underline sm:block">
            <T fr="Mon live" en="My live" />
          </Link>
          <LangToggle />
          <Link href="/reserver" className="btn btn-primary btn-small !shadow-[3px_3px_0_var(--ink)]">
            <T fr="Réserver" en="Book" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
