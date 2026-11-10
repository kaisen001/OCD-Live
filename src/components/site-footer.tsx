import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";
import { T } from "./t";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-[var(--ink)] text-[var(--paper)]">
      <div className="band band-tall" aria-hidden />
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo onDark />
          <p className="display mt-5 text-2xl">{SITE.tagline}.</p>
          <p className="mt-3 max-w-xs text-[0.95rem] opacity-75">
            <T
              fr={`Lives de vente sur le TikTok House of Challenge. Studio à ${SITE.studioCity}, ${SITE.studioCountry}.`}
              en={`Sales lives on the House of Challenge TikTok. Studio in ${SITE.studioCity}, ${SITE.studioCountry}.`}
            />
          </p>
        </div>
        <nav className="grid content-start gap-3 font-semibold">
          <Link href="/reserver" className="hover:underline">
            <T fr="Réserver un live" en="Book a live" />
          </Link>
          <Link href="/#prix" className="hover:underline">
            <T fr="Les prix" en="Prices" />
          </Link>
          <Link href="/suivi" className="hover:underline">
            <T fr="Suivre ma réservation" en="Track my booking" />
          </Link>
          <Link href="/histoire" className="hover:underline">
            <T fr="Pourquoi OCD" en="Why OCD" />
          </Link>
        </nav>
        <div className="grid content-start gap-3 font-semibold">
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
          <Link href="/admin" className="text-sm font-normal opacity-60 hover:underline">
            <T fr="Espace équipe" en="Team area" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
