import { buildTeamMessage } from "./messages";
import type { Reservation } from "./types";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Prévient l'équipe d'une nouvelle réservation.
 * - E-mail par Brevo si BREVO_API_KEY, TEAM_EMAIL et BREVO_SENDER_EMAIL sont définis.
 * - Webhook (Slack, Discord, Make…) si TEAM_WEBHOOK_URL est défini.
 * - Sinon : journal du serveur.
 * Une notification qui échoue ne bloque jamais la réservation.
 */
export async function notifyTeam(reservation: Reservation) {
  const { subject, lines } = buildTeamMessage(reservation);
  const textBody = lines.join("\n");
  let delivered = false;

  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.TEAM_EMAIL;
  // L'expéditeur doit être une adresse validée dans Brevo (Expéditeurs et domaines).
  const sender = process.env.BREVO_SENDER_EMAIL || to?.split(",")[0]?.trim();
  if (apiKey && to && sender) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "OCD Live", email: sender },
          to: to
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((email) => ({ email })),
          subject,
          textContent: textBody,
          htmlContent: `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5">${lines
            .map((line) => (line ? `<p style="margin:0 0 6px">${escapeHtml(line)}</p>` : "<br>"))
            .join("")}</div>`,
        }),
      });
      if (res.ok) delivered = true;
      else console.error("E-mail Brevo refusé", res.status, await res.text());
    } catch (error) {
      console.error("E-mail Brevo en échec", error);
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
