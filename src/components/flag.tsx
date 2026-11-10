/** Drapeau pays (fichier SVG local, visible même sans emoji Windows). */
export function Flag({
  code,
  alt = "",
  className = "h-5 w-7",
}: {
  /** Code ISO pays en minuscules (ex. tg, ng). */
  code: string;
  alt?: string;
  className?: string;
}) {
  const src = `/flags/${code.toLowerCase()}.svg`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={28}
      height={20}
      className={`inline-block rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(22,24,35,0.12)] ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
