import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";
import { T } from "./t";

export function SiteFooter() {
  return (
    <footer className="wall">
      <div className="band band-tall" aria-hidden />
      <div className="shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-9 w-auto" />
          <p className="display mt-4 text-xl">{SITE.tagline}.</p>
          <p className="mt-2 max-w-xs text-[0.95rem] text-[var(--ink-soft)]">
            <T k="footer.blurb" vars={{ city: SITE.studioCity, country: SITE.studioCountry }} />
          </p>
        </div>
        <nav className="grid content-start gap-2.5 font-semibold">
          <Link href="/reserver" className="hover:underline">
            <T k="nav.bookLive" />
          </Link>
          <Link href="/lives" className="hover:underline">
            <T k="nav.lives" />
          </Link>
          <Link href="/#packages" className="hover:underline">
            <T k="nav.packages" />
          </Link>
          <Link href="/suivi" className="hover:underline">
            <T k="nav.track" />
          </Link>
          <Link href="/histoire" className="hover:underline">
            <T k="nav.why" />
          </Link>
        </nav>
        <div className="grid content-start gap-2.5 font-semibold">
          <a href={SITE.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            TikTok {SITE.tiktokAccount}
          </a>
          {SITE.teamWhatsapp ? (
            <a
              href={`https://wa.me/${SITE.teamWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WhatsApp +{SITE.teamWhatsapp}
            </a>
          ) : null}
          <Link href="/admin" className="text-sm font-normal text-[var(--muted)] hover:underline">
            <T k="nav.team" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
