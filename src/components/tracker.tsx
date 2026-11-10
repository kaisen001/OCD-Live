"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { bizKey, modeKey } from "@/lib/business";
import type { MessageKey } from "@/lib/i18n";
import { durationLabel, getPackage } from "@/lib/packages";
import { SITE } from "@/lib/site";
import { formatDate, localTimeFor } from "@/lib/slots";
import type { PackageId, PublicReservation } from "@/lib/types";
import { useLang, useLocaleId, useVisitor } from "@/lib/use-visitor";
import { Price } from "./price";
import { T, useT } from "./t";

const PACK_NAME: Record<PackageId, MessageKey> = {
  simple: "pack.simple.name",
  plus: "pack.plus.name",
  demi: "pack.demi.name",
  journee: "pack.journee.name",
  vedette: "pack.vedette.name",
  mois: "pack.mois.name",
};

const PREP_KEYS: Record<"presentiel" | "distance", MessageKey[]> = {
  presentiel: [
    "track.prep.presentiel.1",
    "track.prep.presentiel.2",
    "track.prep.presentiel.3",
    "track.prep.presentiel.4",
    "track.prep.presentiel.5",
  ],
  distance: [
    "track.prep.distance.1",
    "track.prep.distance.2",
    "track.prep.distance.3",
    "track.prep.distance.4",
    "track.prep.distance.5",
  ],
};

function ShareImage({
  src,
  fileName,
  text,
  labelKey,
}: {
  src: string;
  fileName: string;
  text: string;
  labelKey: MessageKey;
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
      <T k={labelKey} />
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
  const localeId = useLocaleId();
  const t = useT();
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
          <T k="track.kicker" />
        </p>
        <h1 className="display t-2 mt-4">
          <T k="track.findTitle" />
        </h1>
        {state === "missing" ? (
          <p role="alert" className="notice mt-6">
            {t("track.notFound", { code })}
          </p>
        ) : null}
        {state === "down" ? (
          <p role="alert" className="notice mt-6">
            <T k="track.error" />
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
              <T k="track.codeLabel" />
            </label>
            <input
              id="code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("track.codePh")}
              autoCapitalize="characters"
              autoComplete="off"
              required
            />
            <span className="hint">
              <T k="track.codeHint" />
            </span>
          </div>
          <button type="submit" className="btn btn-primary">
            <T k="track.open" />
          </button>
        </form>
      </div>
    );
  }

  // Une réservation chargée pour un autre code ne doit jamais s'afficher.
  if (!reservation || reservation.code !== code) {
    return (
      <p className="mx-auto min-h-[40vh] max-w-xl text-[var(--muted)]">
        <T k="track.loading" />
      </p>
    );
  }

  const r = reservation;
  const pack = getPackage(r.packageId);
  const local = visitor ? localTimeFor(r.date, r.slotStart, visitor.timeZone) : null;
  const number = String(r.memberNo).padStart(4, "0");
  const date = formatDate(r.date, localeId);
  const text = t("track.shareLive", {
    name: r.businessName,
    date,
    start: r.slotStart,
    tiktok: SITE.tiktokAccount,
    url: SITE.tiktokUrl,
  });
  const afficheSrc = `/api/affiche/${r.code}?lang=${lang}`;
  const carteSrc = `/api/carte/${r.code}?lang=${lang}`;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker">{t("track.member", { n: number })}</p>
      <h1 className="display t-2 mt-4">
        {r.status === "pending" ? (
          isNew ? (
            <T k="track.newPending" />
          ) : (
            <T k="track.pending" />
          )
        ) : r.status === "confirmed" ? (
          <T k="track.confirmed" />
        ) : (
          <T k="track.cancelled" />
        )}
      </h1>
      {r.status === "pending" ? (
        <p className="lead mt-4">
          <T k="track.pendingLead" />
        </p>
      ) : null}

      {/* Récapitulatif */}
      <div className="panel mt-8 overflow-hidden">
        <div className="band" aria-hidden />
        <dl className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2 sm:p-7">
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="track.code" />
            </dt>
            <dd className="display text-2xl">{r.code}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="track.when" />
            </dt>
            <dd className="font-bold">
              <span className="inline-block first-letter:uppercase">{formatDate(r.date, localeId)}</span>, {r.slotStart}–{r.slotEnd}
              <span className="block text-sm font-semibold text-[var(--muted)]">
                {t("time.lome")}
                {local ? ` · ${local} ${t("time.yourTime")}` : null}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="track.where" />
            </dt>
            <dd className="font-bold">{t(modeKey(r.mode))}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="track.package" />
            </dt>
            <dd className="font-bold">
              {t(PACK_NAME[r.packageId])} · {pack.lives > 1 ? `${pack.lives} × ` : ""}
              {durationLabel(pack.slots)} · <Price amount={r.priceFcfa} />
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              <T k="track.business" />
            </dt>
            <dd className="font-bold">
              {r.businessName} · {t(bizKey(r.businessType))} · {r.city}, {r.country}
            </dd>
          </div>
        </dl>
        {isNew ? (
          <p className="border-t-2 border-dashed border-[var(--line)] px-5 py-3 text-sm font-semibold sm:px-7">
            <T k="track.keepCode" />
          </p>
        ) : null}
      </div>

      {/* Affiche et carte */}
      {r.status === "confirmed" ? (
        <section className="mt-12">
          <h2 className="display t-2">
            <T k="track.tellTitle" />
          </h2>
          <p className="lead mt-3">
            <T k="track.tellLead" />
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afficheSrc}
                alt={t("track.poster")}
                width={1080}
                height={1350}
                className="w-full rounded-2xl shadow-[0_24px_50px_-28px_rgba(22,24,35,0.55)]"
              />
              <div className="mt-5 grid gap-3">
                <ShareImage
                  src={afficheSrc}
                  fileName={`affiche-${r.code}.png`}
                  text={text}
                  labelKey="track.sharePoster"
                />
                <a
                  className="btn btn-plain"
                  href={`https://wa.me/?text=${encodeURIComponent(text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <T k="track.waShare" />
                </a>
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={carteSrc}
                alt={t("track.card")}
                width={1080}
                height={680}
                className="w-full rounded-xl shadow-[0_18px_36px_-18px_rgba(22,24,35,0.6)]"
              />
              <div className="mt-5">
                <ShareImage
                  src={carteSrc}
                  fileName={`carte-ocd-${number}.png`}
                  text={t("track.shareCardText", { n: number, tagline: SITE.tagline })}
                  labelKey="track.shareCard"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {r.status === "pending" ? (
        <section className="panel-soft mt-10 p-6">
          <h2 className="display t-3">
            <T k="track.comingTitle" />
          </h2>
          <p className="mt-2 text-[var(--ink-soft)]">{t("track.comingLead", { n: number })}</p>
        </section>
      ) : null}

      {/* Préparation */}
      {r.status !== "cancelled" ? (
        <section className="mt-12">
          <h2 className="display t-2">
            <T k="track.prepTitle" />
          </h2>
          <ol className="mt-6">
            {PREP_KEYS[r.mode].map((key, index) => (
              <li key={key} className="flex items-center gap-4 border-t border-[var(--line)] py-3.5">
                <span className="step-num shrink-0">{index + 1}</span>
                <span className="font-semibold">
                  <T k={key} />
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <a href="/reserver" className="btn btn-primary mt-8">
          <T k="track.bookAgain" />
        </a>
      )}
    </div>
  );
}
