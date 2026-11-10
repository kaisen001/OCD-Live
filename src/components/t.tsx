import type { ReactNode } from "react";

/**
 * Texte en deux langues. Le français d'abord, l'anglais ensuite.
 * Les deux versions sont dans la page ; le CSS montre la bonne.
 */
export function T({ fr, en }: { fr: ReactNode; en: ReactNode }) {
  return (
    <>
      <span lang="fr" className="l-fr">
        {fr}
      </span>
      <span lang="en" className="l-en">
        {en}
      </span>
    </>
  );
}
