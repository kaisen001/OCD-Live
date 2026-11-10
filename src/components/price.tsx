"use client";

import { formatApprox } from "@/lib/money";
import { formatFcfa } from "@/lib/packages";
import { useLang, useVisitor } from "@/lib/use-visitor";

/** Prix en FCFA, avec une estimation dans la monnaie du visiteur s'il est hors zone CFA. */
export function Price({
  amount,
  className,
  approx: showApprox = true,
  stack = false,
}: {
  amount: number;
  className?: string;
  /** false = pas d'estimation dans la monnaie du visiteur. */
  approx?: boolean;
  /** true = l'estimation passe sous le prix. */
  stack?: boolean;
}) {
  const visitor = useVisitor();
  const lang = useLang();
  const approx =
    showApprox && visitor?.rate && visitor.currency !== "XOF"
      ? formatApprox(amount, visitor.currency, visitor.rate, lang === "fr" ? "fr-FR" : "en-GB")
      : null;

  return (
    <span className={className}>
      <span className="whitespace-nowrap">{formatFcfa(amount)}</span>
      {approx ? (
        <span
          className={`whitespace-nowrap text-[0.6em] font-semibold tracking-normal opacity-70 ${stack ? "block" : "ml-2"}`}
        >
          ≈ {approx}
        </span>
      ) : null}
    </span>
  );
}
