"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "./t";

/** Barre du bas sur téléphone, comme dans TikTok : Accueil, +, Mon live. */
export function TabBar() {
  const path = usePathname();
  // Pas de barre là où l'écran a déjà ses propres boutons en bas.
  if (path.startsWith("/reserver") || path.startsWith("/admin")) return null;

  return (
    <>
      <div className="h-16 md:hidden" aria-hidden />
      <nav className="tabbar" aria-label="Navigation">
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3 3 10.5V21h6v-6h6v6h6V10.5z" />
          </svg>
          <T fr="Accueil" en="Home" />
        </Link>
        <Link href="/reserver" aria-label="Réserver un live" className="!p-0">
          <span className="tab-plus">+</span>
        </Link>
        <Link href="/suivi" aria-current={path.startsWith("/suivi") ? "page" : undefined}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
          </svg>
          <T fr="Mon live" en="My live" />
        </Link>
      </nav>
    </>
  );
}
