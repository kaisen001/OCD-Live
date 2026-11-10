import { buildTeamMessage } from "./messages";
import type { Reservation } from "./types";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Prévient l'équipe d'une nouvelle réservation.
 * - E-mail si RESEND_API_KEY et TEAM_EMAIL sont définis.
 * - Webhook (Slack, Discord, Make…) si TEAM_WEBHOOK_URL est défini.
 * - Sinon : journal du serveur.
 * Une notification qui échoue ne bloque jamais la réservation.
 */
export async function notifyTeam(reservation: Reservation) {
  const { subject, lines } = buildTeamMessage(reservation);
  const textBody = lines.join("\n");
  let delivered = false;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TEAM_EMAIL;
  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.TEAM_EMAIL_FROM || "OCD Live <onboarding@resend.dev>",
          to: to.split(",").map((item) => item.trim()).filter(Boolean),
          subject,
          text: textBody,
          html: `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5">${lines
            .map((line) => (line ? `<p style="margin:0 0 6px">${escapeHtml(line)}</p>` : "<br>"))
            .join("")}</div>`,
        }),
      });
      if (res.ok) delivered = true;
      else console.error("E-mail équipe refusé", res.status, await res.text());
    } catch (error) {
      console.error("E-mail équipe en échec", error);
    }
  }

  const webhook = process.env.TEAM_WEBHOOK_URL || process.env.ADMIN_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `${subject}\n${textBody}`, content: `${subject}\n${textBody}` }),
      });
      if (res.ok) delivered = true;
    } catch (error) {
      console.error("Webhook équipe en échec", error);
    }
  }

  if (!delivered) {
    console.info(`\n===== NOUVELLE RÉSERVATION OCD =====\n${subject}\n${textBody}\n`);
  }
  return delivered;
}
