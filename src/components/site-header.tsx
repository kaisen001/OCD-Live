import Link from "next/link";
import { LocaleControls } from "./locale-controls";
import { Logo } from "./logo";
import { T } from "./t";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link href="/" aria-label="OCD Live">
          <Logo className="h-7 w-auto sm:h-8" />
        </Link>
        <nav className="flex items-center gap-1 text-[0.97rem] sm:gap-2">
          <Link href="/lives" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] md:block">
            <T k="nav.lives" />
          </Link>
          <Link href="/#packages" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] lg:block">
            <T k="nav.packages" />
          </Link>
          <Link href="/histoire" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] lg:block">
            <T k="nav.why" />
          </Link>
          <Link href="/suivi" className="hidden px-3 py-2 font-semibold hover:text-[var(--main-deep)] md:block">
            <T k="nav.myLive" />
          </Link>
          <LocaleControls />
          <Link href="/reserver" className="btn btn-primary btn-small">
            <T k="nav.book" />
          </Link>
        </nav>
      </div>
      <div className="band-header" aria-hidden />
    </header>
  );
}
