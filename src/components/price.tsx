"use client";

import { formatPrice } from "@/lib/money";
import { formatFcfa } from "@/lib/packages";
import { useLang, useVisitor } from "@/lib/use-visitor";

/** Prix converti dans la monnaie choisie (source = FCFA). */
export function Price({
  amount,
  className,
  approx: showApprox = true,
  stack = false,
}: {
  amount: number;
  className?: string;
  /** false = forcer l'affichage FCFA uniquement. */
  approx?: boolean;
  /** true = le montant FCFA passe sous le prix converti. */
  stack?: boolean;
}) {
  const visitor = useVisitor();
  const lang = useLang();
  const locale = lang === "fr" ? "fr-FR" : "en-GB";

  if (!showApprox || !visitor) {
    return (
      <span className={className}>
        <span className="whitespace-nowrap">{formatFcfa(amount)}</span>
      </span>
    );
  }

  const { primary, secondary } = formatPrice(amount, visitor.currency, visitor.rate, locale);

  return (
    <span className={className}>
      <span className="whitespace-nowrap">{primary}</span>
      {secondary ? (
        <span
          className={`whitespace-nowrap text-[0.6em] font-semibold tracking-normal opacity-70 ${stack ? "block" : "ml-2"}`}
        >
          {secondary}
        </span>
      ) : null}
    </span>
  );
}
