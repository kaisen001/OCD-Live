import Link from "next/link";
import { LangToggle } from "./lang-toggle";
import { Logo } from "./logo";
import { T } from "./t";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white">
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link href="/" aria-label="OCD Live">
          <Logo className="h-7 w-auto sm:h-8" />
        </Link>
        <nav className="flex items-center gap-1 text-[0.97rem] sm:gap-2">
          <Link href="/#packages" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] md:block">
            <T fr="Packages" en="Packages" />
          </Link>
          <Link href="/histoire" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] md:block">
            <T fr="Pourquoi OCD" en="Why OCD" />
          </Link>
          <Link href="/suivi" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] md:block">
            <T fr="Mon live" en="My live" />
          </Link>
          <LangToggle />
          <Link href="/reserver" className="btn btn-primary btn-small">
            <T fr="Réserver" en="Book" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
