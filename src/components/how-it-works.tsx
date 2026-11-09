const STEPS = [
  {
    n: "01",
    title: "Mode + métier",
    text: "Présentiel ou distance, puis votre activité pour une recommandation de pack.",
  },
  {
    n: "02",
    title: "Date + créneau + pack",
    text: "Calendrier dès le 1er décembre, horaires verrouillés, six formules claires.",
  },
  {
    n: "03",
    title: "Validation équipe",
    text: "Votre fiche part à OCD. Après approbation, le live apparaît à l’agenda.",
  },
];

export function HowItWorks() {
  return (
    <section className="container-shell section-space">
      <div className="max-w-2xl">
        <p className="section-kicker">Parcours</p>
        <h2 className="section-title">Trois écrans. Une réservation.</h2>
        <p className="section-lead">
          Un booking studio conçu pour aller vite — du premier clic à la
          validation équipe.
        </p>
      </div>

      <ol className="mt-12 grid list-none gap-8 p-0 md:mt-16 md:grid-cols-3 md:gap-10">
        {STEPS.map((step, index) => (
          <li key={step.n} className="relative">
            {index < STEPS.length - 1 ? (
              <span
                className="pointer-events-none absolute top-5 left-[calc(100%+0.4rem)] hidden h-px w-[calc(100%-1.2rem)] bg-[var(--line)] md:block"
                aria-hidden
              />
            ) : null}
            <p className="font-display text-[0.75rem] font-bold tracking-[0.2em] text-[var(--accent)]">
              {step.n}
            </p>
            <h3 className="font-display mt-4 text-[1.35rem] font-bold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 max-w-[17rem] text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
