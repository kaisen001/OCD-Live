/**
 * EMPLACEMENT DU LOGO OFFICIEL.
 * Bovann a dit que le logo est disponible sur le compte @OCD.
 * Dès qu'on l'a : déposer le fichier dans public/ et remplacer ce mot-symbole.
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 leading-none">
      <span
        className="display grid h-10 place-items-center rounded-[5px] px-2 text-[1.15rem]"
        style={{
          background: "var(--main)",
          color: "var(--white)",
          border: `2px solid ${onDark ? "var(--paper)" : "var(--ink)"}`,
        }}
      >
        OCD
      </span>
      <span className="display text-[1.15rem]">
        Live
        <span
          aria-hidden
          className="ml-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
          style={{ background: "var(--accent)", border: "2px solid currentColor" }}
        />
      </span>
    </span>
  );
}
