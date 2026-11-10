/**
 * Logo OCD Live.
 * Fichiers dans public/brand/. Ce sont des copies de petite taille :
 * à remplacer par les originaux du compte @OCD dès qu'on les a (mêmes noms de fichiers).
 */
export function Logo({ onDark = false, className = "h-8 w-auto" }: { onDark?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={onDark ? "/brand/ocd-live-blanc.webp" : "/brand/ocd-live.webp"}
      alt="OCD Live"
      width={410}
      height={79}
      className={className}
    />
  );
}
