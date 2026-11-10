"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, useT } from "./t";

/** Barre du bas sur téléphone : Accueil, Lives, Mon live. */
export function TabBar() {
  const path = usePathname();
  const t = useT();
  if (path.startsWith("/reserver") || path.startsWith("/admin")) return null;

  return (
    <>
      <div className="h-16 md:hidden" aria-hidden />
      <nav className="tabbar" aria-label={t("nav.aria")}>
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3 3 10.5V21h6v-6h6v6h6V10.5z" />
          </svg>
          <T k="nav.home" />
        </Link>
        <Link href="/lives" aria-current={path.startsWith("/lives") ? "page" : undefined}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 4h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3.2L12 20.5 10.2 17H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 4v2h6V8H9Zm0 4v2h4v-2H9Z" />
          </svg>
          <T k="nav.lives" />
        </Link>
        <Link href="/suivi" aria-current={path.startsWith("/suivi") ? "page" : undefined}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
          </svg>
          <T k="nav.myLive" />
        </Link>
      </nav>
    </>
  );
}
