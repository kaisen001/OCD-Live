import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";
import { FCFA_PER_EUR } from "@/lib/money";

/** Taux du jour : combien vaut 1 FCFA dans chaque monnaie. Gardé une journée. */
async function fetchRates() {
  "use cache";
  cacheLife("days");
  const res = await fetch("https://open.er-api.com/v6/latest/XOF");
  if (!res.ok) throw new Error("Taux indisponibles");
  const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
  if (data.result !== "success" || !data.rates) throw new Error("Taux indisponibles");
  return data.rates;
}

export async function GET() {
  try {
    return NextResponse.json({ rates: await fetchRates() });
  } catch {
    // Sans service de taux, on garde au moins l'euro : sa parité est fixe.
    return NextResponse.json({ rates: { EUR: 1 / FCFA_PER_EUR } });
  }
}
