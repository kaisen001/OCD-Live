import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-[center_30%] sm:bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=80)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(17,16,14,0.88) 0%, rgba(17,16,14,0.62) 40%, rgba(17,16,14,0.28) 68%, rgba(17,16,14,0.18) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 82% 20%, rgba(184,28,36,0.22), transparent 32%)",
        }}
        aria-hidden
      />

      <div className="container-shell relative flex min-h-[92svh] flex-col justify-end pb-16 pt-28 text-white md:justify-center md:pb-28">
        <div className="max-w-[40rem]">
          <p className="fade-up font-display text-[clamp(2.6rem,8vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            OCD Live
          </p>
          <h1 className="fade-up mt-5 font-display text-[clamp(1.7rem,4vw,2.65rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white/92">
            Des clients WhatsApp. En live.
          </h1>
          <p className="fade-up-delay mt-5 max-w-lg text-[0.98rem] leading-relaxed text-white/72 sm:text-lg">
            Présentiel au Togo ou à distance. Réservez un créneau, choisissez
            votre pack, l’équipe OCD valide et diffuse.
          </p>
          <div className="fade-up-delay-2 mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row">
            <Link
              href="/reserver"
              className="btn btn-primary w-full sm:min-w-[12rem] sm:w-auto"
            >
              Réserver mon live
            </Link>
            <Link
              href="/#agenda"
              className="btn btn-secondary w-full sm:min-w-[12rem] sm:w-auto"
            >
              Voir l’agenda
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg)] via-[color-mix(in_srgb,var(--bg)_55%,transparent)] to-transparent" />
    </section>
  );
}
