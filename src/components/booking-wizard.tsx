"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BUSINESS_TYPES, MODE_LABELS } from "@/lib/business";
import { PACKAGES, getPackage, pricePerLive } from "@/lib/packages";
import {
  SLOT_STARTS,
  calendarMonths,
  formatDate,
  formatMonth,
  localTimeFor,
  slotEnd,
  weekdayInitials,
} from "@/lib/slots";
import type { BusinessType, LiveMode, PackageId } from "@/lib/types";
import { useLang, useVisitor } from "@/lib/use-visitor";
import { Price } from "./price";
import { T } from "./t";

type Form = {
  mode: LiveMode | null;
  date: string;
  slotStart: string;
  packageId: PackageId | null;
  businessName: string;
  businessType: BusinessType | "";
  description: string;
  contactName: string;
  whatsapp: string;
  city: string;
  country: string;
  website: string;
};

const EMPTY: Form = {
  mode: null,
  date: "",
  slotStart: "",
  packageId: null,
  businessName: "",
  businessType: "",
  description: "",
  contactName: "",
  whatsapp: "",
  city: "",
  country: "",
  website: "",
};

const STEP_TITLES = [
  { fr: "Où veux-tu faire ton live ?", en: "Where do you want to go live?" },
  { fr: "Quel jour, à quelle heure ?", en: "Which day, what time?" },
  { fr: "Combien de lives ?", en: "How many lives?" },
  { fr: "Parle-nous de ton business.", en: "Tell us about your business." },
];

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const lang = useLang();
  const visitor = useVisitor();
  const top = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(() => {
    const format = params.get("format");
    return { ...EMPTY, mode: format === "presentiel" || format === "distance" ? format : null };
  });
  const [taken, setTaken] = useState<Record<string, string[]> | null>(null);
  const [calendarDown, setCalendarDown] = useState(false);
  const [monthIndex, setMonthIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = useMemo(() => calendarMonths(), []);
  const month = months[monthIndex];

  function loadTaken() {
    fetch("/api/slots")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setTaken(data.taken ?? {});
        setCalendarDown(false);
      })
      .catch(() => setCalendarDown(true));
  }

  useEffect(loadTaken, []);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function go(next: number) {
    setStep(next);
    setError(null);
    top.current?.scrollIntoView({ block: "start" });
  }

  const takenToday = (form.date && taken?.[form.date]) || [];
  const pack = form.packageId ? getPackage(form.packageId) : null;
  const formReady =
    form.businessName.trim().length >= 2 &&
    form.businessType !== "" &&
    form.description.trim().length >= 3 &&
    form.contactName.trim().length >= 2 &&
    form.whatsapp.replace(/\D/g, "").length >= 8 &&
    form.city.trim().length >= 2 &&
    form.country.trim().length >= 2;

  const ready = [Boolean(form.mode), Boolean(form.date && form.slotStart), Boolean(pack), formReady][step];

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        // Quelqu'un vient de prendre ce créneau : on ramène au calendrier, à jour.
        setForm((prev) => ({ ...prev, slotStart: "" }));
        loadTaken();
        setStep(1);
        setError(
          lang === "fr"
            ? "Ce créneau vient d'être pris par un autre vendeur. Choisis une autre heure."
            : "Another seller just took this slot. Pick another time.",
        );
        setSending(false);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      router.replace(`/suivi?code=${encodeURIComponent(data.reservation.code)}&nouveau=1`);
    } catch (err) {
      setError(
        (err instanceof Error && err.message) ||
          (lang === "fr"
            ? "La réservation n'est pas partie. Vérifie ta connexion et réessaie."
            : "The booking did not go through. Check your connection and try again."),
      );
      setSending(false);
    }
  }

  return (
    <div ref={top} className="mx-auto max-w-2xl scroll-mt-20">
      {/* Progression */}
      <div className="flex items-center gap-2" aria-hidden>
        {STEP_TITLES.map((_, index) => (
          <span
            key={index}
            className="h-2.5 flex-1 rounded-full"
            style={{
              background: index <= step ? "var(--main)" : "var(--line)",
            }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
        <T fr={`Étape ${step + 1} sur 4`} en={`Step ${step + 1} of 4`} />
      </p>
      <h1 className="display t-2 mt-2">
        <T fr={STEP_TITLES[step].fr} en={STEP_TITLES[step].en} />
      </h1>

      {error ? (
        <p role="alert" className="notice mt-6">
          {error}
        </p>
      ) : null}

      {/* ---------- 1. Format ---------- */}
      {step === 0 ? (
        <div className="rise mt-7 grid gap-4">
          <button
            type="button"
            className="choice"
            aria-pressed={form.mode === "presentiel"}
            onClick={() => set("mode", "presentiel")}
          >
            <span className="display t-3">
              <T fr="Au studio, à Lomé" en="At the studio, in Lomé" />
            </span>
            <span>
              <T
                fr="Tu viens avec tes produits. La régie dirige le live."
                en="You come with your products. The control room runs the live."
              />
            </span>
          </button>
          <button
            type="button"
            className="choice"
            aria-pressed={form.mode === "distance"}
            onClick={() => set("mode", "distance")}
          >
            <span className="display t-3">
              <T fr="À distance" en="Remote" />
            </span>
            <span>
              <T
                fr="Tu restes chez toi ou dans ta boutique, dans n'importe quel pays. Une assistante OCD te suit."
                en="You stay at home or in your shop, in any country. An OCD assistant is with you."
              />
            </span>
          </button>
        </div>
      ) : null}

      {/* ---------- 2. Date et heure ---------- */}
      {step === 1 ? (
        <div className="rise mt-7">
          <div className="panel p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="btn btn-plain btn-small !min-w-12 !px-0"
                disabled={monthIndex === 0}
                onClick={() => setMonthIndex((i) => i - 1)}
                aria-label={lang === "fr" ? "Mois précédent" : "Previous month"}
              >
                ←
              </button>
              <p className="display text-xl capitalize">{formatMonth(month.year, month.month, lang)}</p>
              <button
                type="button"
                className="btn btn-plain btn-small !min-w-12 !px-0"
                disabled={monthIndex === months.length - 1}
                onClick={() => setMonthIndex((i) => i + 1)}
                aria-label={lang === "fr" ? "Mois suivant" : "Next month"}
              >
                →
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-[var(--muted)]">
              {weekdayInitials(lang).map((letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {month.days.map((day, index) => {
                if (!day) return <span key={`vide-${index}`} />;
                const full = (taken?.[day.date]?.length ?? 0) >= SLOT_STARTS.length;
                return (
                  <button
                    key={day.date}
                    type="button"
                    className="day"
                    disabled={!day.open || full}
                    aria-pressed={form.date === day.date}
                    aria-label={formatDate(day.date, lang)}
                    onClick={() => setForm((prev) => ({ ...prev, date: day.date, slotStart: "" }))}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              <T
                fr="Les lives commencent le 1er décembre 2026. Pas de live le dimanche."
                en="Lives start on 1 December 2026. No lives on Sundays."
              />
            </p>
          </div>

          {calendarDown ? (
            <p className="notice mt-5">
              <T
                fr="Le calendrier ne charge pas. Vérifie ta connexion."
                en="The calendar is not loading. Check your connection."
              />{" "}
              <button type="button" className="link" onClick={loadTaken}>
                <T fr="Réessayer" en="Try again" />
              </button>
            </p>
          ) : null}

          {form.date ? (
            <div className="mt-7">
              <h2 className="display t-3 first-letter:uppercase">{formatDate(form.date, lang)}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                <T
                  fr="Heure de Lomé (GMT). Chaque live dure 1 h 30."
                  en="Lomé time (GMT). Each live lasts 1.5 hours."
                />
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {SLOT_STARTS.map((start) => {
                  const isTaken = takenToday.includes(start);
                  const local = visitor ? localTimeFor(form.date, start, visitor.timeZone) : null;
                  return (
                    <button
                      key={start}
                      type="button"
                      className="slot"
                      disabled={isTaken || taken === null}
                      aria-pressed={form.slotStart === start}
                      onClick={() => set("slotStart", start)}
                    >
                      {start}
                      <small>
                        {isTaken ? (
                          <T fr="pris" en="taken" />
                        ) : local ? (
                          <T fr={`${local} chez toi`} en={`${local} your time`} />
                        ) : (
                          <>→ {slotEnd(start)}</>
                        )}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------- 3. Pack ---------- */}
      {step === 2 ? (
        <div className="rise mt-7 grid gap-3" role="radiogroup">
          {PACKAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              className="choice"
              aria-checked={form.packageId === item.id}
              onClick={() => set("packageId", item.id)}
            >
              <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="display t-3">
                  <T fr={item.name.fr} en={item.name.en} />
                  <span className="ml-2 text-base font-bold tracking-normal">
                    · {item.lives} live{item.lives > 1 ? "s" : ""}
                  </span>
                </span>
                <Price amount={item.priceFcfa} className="display text-xl" />
              </span>
              <span>
                <T fr={item.summary.fr} en={item.summary.en} />
              </span>
              {item.lives > 1 ? (
                <span className="text-sm font-bold">
                  <T fr="Soit " en="That's " />
                  <Price amount={pricePerLive(item)} approx={false} />
                  <T fr=" le live" en=" per live" />
                </span>
              ) : null}
            </button>
          ))}
          {pack && pack.lives > 1 ? (
            <p className="notice">
              <T
                fr={`Ton premier live : ${formatDate(form.date, "fr")} à ${form.slotStart}. Tu choisis les ${pack.lives - 1} autres avec l'équipe, sur WhatsApp.`}
                en={`Your first live: ${formatDate(form.date, "en")} at ${form.slotStart}. You pick the other ${pack.lives - 1} with the team, on WhatsApp.`}
              />
            </p>
          ) : null}
        </div>
      ) : null}

      {/* ---------- 4. Business ---------- */}
      {step === 3 ? (
        <form
          className="rise mt-7 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (formReady && !sending) void submit();
          }}
        >
          <div className="field">
            <label htmlFor="businessName">
              <T fr="Nom de ton business" en="Your business name" />
            </label>
            <input
              id="businessName"
              value={form.businessName}
              maxLength={60}
              autoComplete="organization"
              onChange={(e) => set("businessName", e.target.value)}
              placeholder={lang === "fr" ? "Ex. Chez Amina Couture" : "E.g. Amina Tailoring"}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="businessType">
              <T fr="Ton activité" en="What you do" />
            </label>
            <select
              id="businessType"
              value={form.businessType}
              onChange={(e) => set("businessType", e.target.value as BusinessType)}
              required
            >
              <option value="">{lang === "fr" ? "Choisir" : "Choose"}</option>
              {BUSINESS_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label[lang]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="description">
              <T fr="Qu'est-ce que tu vends ?" en="What do you sell?" />
            </label>
            <textarea
              id="description"
              value={form.description}
              maxLength={400}
              onChange={(e) => set("description", e.target.value)}
              placeholder={
                lang === "fr"
                  ? "Ex. Robes en pagne sur mesure, de 8 000 à 25 000 FCFA. Livraison à Lomé."
                  : "E.g. Made-to-measure wax dresses, 8,000 to 25,000 FCFA. Delivery in Lomé."
              }
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contactName">
              <T fr="Ton nom" en="Your name" />
            </label>
            <input
              id="contactName"
              value={form.contactName}
              maxLength={60}
              autoComplete="name"
              onChange={(e) => set("contactName", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">
              <T fr="Ton numéro WhatsApp" en="Your WhatsApp number" />
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              value={form.whatsapp}
              maxLength={24}
              autoComplete="tel"
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="+228 90 12 34 56"
              required
            />
            <span className="hint">
              <T
                fr="Avec l'indicatif du pays. L'équipe t'écrit sur ce numéro pour confirmer."
                en="With the country code. The team writes to this number to confirm."
              />
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="city">
                <T fr="Ville" en="City" />
              </label>
              <input
                id="city"
                value={form.city}
                maxLength={60}
                autoComplete="address-level2"
                onChange={(e) => set("city", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="country">
                <T fr="Pays" en="Country" />
              </label>
              <input
                id="country"
                value={form.country}
                maxLength={60}
                autoComplete="country-name"
                onChange={(e) => set("country", e.target.value)}
                required
              />
            </div>
          </div>
          {/* Piège à robots : invisible pour un humain. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden
          />
          <button type="submit" className="sr-only" tabIndex={-1} aria-hidden>
            OK
          </button>
        </form>
      ) : null}

      {step === 3 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          <T
          fr="Tu ne paies rien maintenant. L'équipe te contacte sur WhatsApp pour confirmer et régler."
          en="You pay nothing now. The team contacts you on WhatsApp to confirm and settle payment."
          />
        </p>
      ) : null}

      {/* ---------- Récapitulatif + boutons ---------- */}
      <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0">
        {form.mode ? (
          <p className="mb-3 text-sm font-semibold text-[var(--ink-soft)]">
            {MODE_LABELS[form.mode][lang]}
            {form.date && form.slotStart ? (
              <>
                {" · "}
                <span className="inline-block first-letter:uppercase">{formatDate(form.date, lang)}</span> {form.slotStart}
              </>
            ) : null}
            {pack ? (
              <>
                {" · "}
                {pack.name[lang]} <Price amount={pack.priceFcfa} />
              </>
            ) : null}
          </p>
        ) : null}
        <div className="flex gap-3">
          {step > 0 ? (
            <button type="button" className="btn btn-plain" onClick={() => go(step - 1)} disabled={sending}>
              <T fr="Retour" en="Back" />
            </button>
          ) : null}
          {step < 3 ? (
            <button type="button" className="btn btn-primary flex-1" disabled={!ready} onClick={() => go(step + 1)}>
              <T fr="Continuer" en="Continue" />
            </button>
          ) : (
            <button type="button" className="btn btn-primary flex-1" disabled={!ready || sending} onClick={submit}>
              {sending ? <T fr="Envoi…" en="Sending…" /> : <T fr="Envoyer ma réservation" en="Send my booking" />}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
