import { renderCard, SAMPLE_RESERVATION } from "@/lib/poster";
import { getReservationByCode, toPublic } from "@/lib/store";

/**
 * Image prête à partager. « exemple » montre un modèle.
 * Pour une vraie réservation, l'image n'existe qu'une fois le live approuvé.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/carte/[code]">) {
  const { code } = await ctx.params;
  const lang = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "fr";

  if (code === "exemple") return renderCard(SAMPLE_RESERVATION, lang, true);

  const reservation = await getReservationByCode(code).catch(() => null);
  if (!reservation || reservation.status !== "confirmed") {
    return new Response("Image indisponible.", { status: 404 });
  }
  return renderCard(toPublic(reservation), lang);
}
