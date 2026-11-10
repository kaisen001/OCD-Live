"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { businessLabel, MODE_LABELS } from "@/lib/business";
import { getPackage } from "@/lib/packages";
import { SITE } from "@/lib/site";
import { formatDate, localTimeFor } from "@/lib/slots";
import type { Lang, PublicReservation } from "@/lib/types";
import { useLang, useVisitor } from "@/lib/use-visitor";
import { Price } from "./price";
import { T } from "./t";

const PREP: Record<"presentiel" | "distance", { fr: string; en: string }[]> = {
  presentiel: [
    { fr: "Arrive au studio 30 minutes avant ton heure.", en: "Be at the studio 30 minutes before your time." },
    { fr: "Apporte les produits que tu veux montrer.", en: "Bring the products you want to show." },
    { fr: "Note le prix de chaque produit.", en: "Write down the price of each product." },
    { fr: "Garde ton téléphone WhatsApp chargé pour les commandes.", en: "Keep your WhatsApp phone charged for orders." },
    { fr: "Prépare une phrase pour te présenter en 10 secondes.", en: "Prepare one line to introduce yourself in 10 seconds." },
  ],
  distance: [
    { fr: "Teste ta connexion la veille, à l'endroit où tu feras le live.", en: "Test your connection the day before, where you will go live." },
    { fr: "Mets-toi dans un endroit éclairé et calme.", en: "Pick a bright, quiet place." },
    { fr: "Pose tes produits à portée de main, avec leurs prix.", en: "Keep your products within reach, with their prices." },
    { fr: "Charge ton téléphone et garde le chargeur branché.", en: "Charge your phone and keep the charger plugged in." },
    { fr: "L'assistante OCD t'écrit sur WhatsApp avant le live.", en: "The OCD assistant writes to you on WhatsApp before the live." },
  ],
};

function shareText(r: PublicReservation, lang: Lang) {
  const date = formatDate(r.date, lang);
  return lang === "fr"
    ? `${r.businessName} passe en live le ${date} à ${r.slotStart} (heure de Lomé) sur TikTok ${SITE.tiktokAccount}. Viens voir et commander ! ${SITE.tiktokUrl}`
    : `${r.businessName} goes live on ${date} at ${r.slotStart} (Lomé time) on TikTok ${SITE.tiktokAccount}. Come watch and order! ${SITE.tiktokUrl}`;
}

function ShareImage({
  src,
  fileName,
  text,
  label,
}: {
  src: string;
  fileName: string;
  text: string;
  label: { fr: string; en: string };
}) {
  const [busy, setBusy] = useState(false);

  async function share() {
    setBusy(true);
    try {
      const blob = await (await fetch(src)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Partage annulé par l'utilisateur : rien à faire.
    }
    setBusy(false);
  }

  return (
    <button type="button" className="btn btn-primary w-full" onClick={share} disabled={busy}>
      <T fr={label.fr} en={label.en} />
    </button>
  );
}

async function fetchReservation(code: string): Promise<PublicReservation | "missing" | "down"> {
  try {
    const res = await fetch(`/api/reservations/track?code=${encodeURIComponent(code)}`);
    if (res.status === 404) return "missing";
    if (!res.ok) return "down";
    return (await res.json()).reservation as PublicReservation;
  } catch {
    return "down";
  }
}

export function Tracker() {
  const params = useSearchParams();
  const router = useRouter();
  const lang = useLang();
  const visitor = useVisitor();
  const code = params.get("code")?.trim().toUpperCase() ?? "";
  const isNew = params.get("nouveau") === "1";

  const [input, setInput] = useState("");
  const [reservation, setReservation] = useState<PublicReservation | null>(null);
  const [state, setState] = useState<"idle" | "missing" | "down">("idle");

  useEffect(() => {
    if (!code) return;
    let alive = true;
    fetchReservation(code).then((result) => {
      if (!alive) return;
      if (result === "missing" || result === "down") setState(result);
      else {
        setReservation(result);
        setState("idle");
      }
    });
    return () => {
      alive = false;
    };
  }, [code]);

  // Tant que la réservation attend, on regarde de temps en temps si l'équipe a approuvé.
  const pending = reservation?.status === "pending";
  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      fetchReservation(code).then((result) => {
        if (typeof result !== "string") setReservation(result);
      });
    }, 20000);
    return () => clearInterval(timer);
  }, [pending, code]);

  if (!code || state === "missing" || state === "down") {
    return (
      <div className="mx-auto max-w-xl">
        <p className="kicker">
          <T fr="Mon live" en="My live" />
        </p>
        <h1 className="display t-2 mt-4">
          <T fr="Retrouve ta réservation." en="Find your booking." />
        </h1>
        {state === "missing" ? (
          <p role="alert" className="notice mt-6">
            <T
              fr={`Aucune réservation avec le code ${code}. Vérifie les lettres.`}
              en={`No booking with the code ${code}. Check the letters.`}
            />
          </p>
        ) : null}
        {state === "down" ? (
          <p role="alert" className="notice mt-6">
            <T fr="Le suivi ne répond pas. Réessaie dans un instant." en="Tracking is not responding. Try again in a moment." />
          </p>
        ) : null}
        <form
          className="mt-7 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const value = input.trim().toUpperCase();
            if (value) router.push(`/suivi?code=${encodeURIComponent(value.startsWith("OCD-") ? value : `OCD-${value}`)}`);
          }}
        >
          <div className="field">
            <label htmlFor="code">
              <T fr="Ton code de réservation" en="Your booking code" />
            </label>
            <input
              id="code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="OCD-ABC123"
              autoCapitalize="characters"
              autoComplete="off"
              required
            />
            <span className="hint">
              <T fr="Tu l'as reçu à la fin de ta réservation." en="You got it at the end of your booking." />
            </span>
          </div>
          <button type="submit" className="btn btn-primary">
            <T fr="Voir mon live" en="See my live" />
          </button>
        </form>
      </div>
    );
  }

  // Une réservation chargée pour un autre code ne doit jamais s'afficher.
  if (!reservation || reservation.code !== code) {
    return (
      <p className="mx-auto min-h-[40vh] max-w-xl text-[var(--muted)]">
        <T fr="Chargement…" en="Loading…" />
      </p>
    );
  }

  const r = reservation;
  const pack = getPackage(r.packageId);
  const local = visitor ? localTimeFor(r.date, r.slotStart, visitor.timeZone) : null;
  const number = String(r.memberNo).padStart(4, "0");
  const text = shareText(r, lang);
  const afficheSrc = `/api/affiche/${r.code}?lang=${lang}`;
  const carteSrc = `/api/carte/${r.code}?lang=${lang}`;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker">
        <T fr={`Membre OCD n° ${number}`} en={`OCD member no. ${number}`} />
      </p>
      <h1 className="display t-2 mt-4">
        {r.status === "pending" ? (
          isNew ? (
            <T fr="C'est noté. L'équipe a reçu ta demande." en="Got it. The team has your request." />
          ) : (
            <T fr="Ta demande attend la confirmation." en="Your request is waiting for confirmation." />
          )
        ) : r.status === "confirmed" ? (
          <T fr="Ton live est confirmé." en="Your live is confirmed." />
        ) : (
          <T fr="Cette réservation est annulée." en="This booking is cancelled." />
        )}
      </h1>
      {r.status === "pending" ? (
        <p className="lead mt-4">
          <T
            fr="On t'écrit sur WhatsApp pour confirmer ton créneau et régler le paiement. Ton créneau est bloqué en attendant."
            en="We write to you on WhatsApp to confirm your slot and settle payment. Your slot is held in the meantime."
          />
        </p>
      ) : null}

      {/* Récapitulatif */}
      <div className="panel mt-8 overflow-hidden">
        <div className="band" aria-hidden />
        <dl className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2 sm:p-7">
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T fr="Ton code" en="Your code" />
            </dt>
            <dd className="display text-2xl">{r.code}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T fr="Quand" en="When" />
            </dt>
            <dd className="font-bold">
              <span className="inline-block first-letter:uppercase">{formatDate(r.date, lang)}</span>, {r.slotStart}–{r.slotEnd}
              <span className="block text-sm font-semibold text-[var(--muted)]">
                <T fr="heure de Lomé" en="Lomé time" />
                {local ? <T fr={` · ${local} chez toi`} en={` · ${local} your time`} /> : null}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T fr="Où" en="Where" />
            </dt>
            <dd className="font-bold">{MODE_LABELS[r.mode][lang]}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Pack</dt>
            <dd className="font-bold">
              {pack.name[lang]} · {pack.lives} live{pack.lives > 1 ? "s" : ""} · <Price amount={r.priceFcfa} />
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Business</dt>
            <dd className="font-bold">
              {r.businessName} · {businessLabel(r.businessType)[lang]} · {r.city}, {r.country}
            </dd>
          </div>
        </dl>
        {isNew ? (
          <p className="border-t-2 border-dashed border-[var(--line)] px-5 py-3 text-sm font-semibold sm:px-7">
            <T
              fr="Garde ce code. Fais une capture d'écran : il te permet de revenir sur cette page."
              en="Keep this code. Take a screenshot: it brings you back to this page."
            />
          </p>
        ) : null}
      </div>

      {/* Affiche et carte */}
      {r.status === "confirmed" ? (
        <section className="mt-12">
          <h2 className="display t-2">
            <T fr="Préviens tes clients." en="Tell your customers." />
          </h2>
          <p className="lead mt-3">
            <T
              fr="Mets ton affiche en statut WhatsApp et sur TikTok. Plus tes clients sont prévenus, plus il y a de monde à ton live."
              en="Post your poster as a WhatsApp status and on TikTok. The more customers you tell, the more people at your live."
            />
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afficheSrc}
                alt={lang === "fr" ? "Ton affiche" : "Your poster"}
                width={1080}
                height={1350}
                className="w-full rounded-2xl shadow-[0_30px_60px_-30px_rgba(7,16,25,0.6)]"
              />
              <div className="mt-5 grid gap-3">
                <ShareImage
                  src={afficheSrc}
                  fileName={`affiche-${r.code}.png`}
                  text={text}
                  label={{ fr: "Partager mon affiche", en: "Share my poster" }}
                />
                <a
                  className="btn btn-plain"
                  href={`https://wa.me/?text=${encodeURIComponent(text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T fr="Envoyer le message sur WhatsApp" en="Send the message on WhatsApp" />
                </a>
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={carteSrc}
                alt={lang === "fr" ? "Ta carte de membre" : "Your member card"}
                width={1080}
                height={680}
                className="w-full rounded-xl shadow-[0_20px_40px_-18px_rgba(7,16,25,0.6)]"
              />
              <div className="mt-5">
                <ShareImage
                  src={carteSrc}
                  fileName={`carte-ocd-${number}.png`}
                  text={lang === "fr" ? `Je suis OCD n° ${number}. ${SITE.tagline}.` : `I am OCD no. ${number}.`}
                  label={{ fr: "Partager ma carte OCD", en: "Share my OCD card" }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {r.status === "pending" ? (
        <section className="panel-soft mt-10 p-6">
          <h2 className="display t-3">
            <T fr="Ton affiche et ta carte OCD arrivent." en="Your poster and OCD card are coming." />
          </h2>
          <p className="mt-2 text-[var(--ink-soft)]">
            <T
              fr={`Dès que l'équipe confirme, cette page affiche ton affiche à partager et ta carte de membre n° ${number}. Tu n'as rien à refaire.`}
              en={`As soon as the team confirms, this page shows your poster to share and your member card no. ${number}. Nothing more to do.`}
            />
          </p>
        </section>
      ) : null}

      {/* Préparation */}
      {r.status !== "cancelled" ? (
        <section className="mt-12">
          <h2 className="display t-2">
            <T fr="Pour être prêt le jour J." en="To be ready on the day." />
          </h2>
          <ol className="mt-6">
            {PREP[r.mode].map((line, index) => (
              <li key={line.fr} className="flex gap-4 border-t border-[var(--line)] py-4">
                <span className="display text-3xl text-[var(--main-deep)]">{index + 1}</span>
                <span className="font-semibold">
                  <T fr={line.fr} en={line.en} />
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <a href="/reserver" className="btn btn-primary mt-8">
          <T fr="Réserver un autre créneau" en="Book another slot" />
        </a>
      )}
    </div>
  );
}
