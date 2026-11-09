"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BUSINESS_TYPES, LIVE_MODES } from "@/lib/business";
import { formatFcfa, getPackage, PACKAGES, recommendPackage } from "@/lib/packages";
import { formatDateFr, getSlotOptions, listBookableDates } from "@/lib/slots";
import type {
  BusinessType,
  LiveMode,
  PackageId,
} from "@/lib/types";

type FormState = {
  mode: LiveMode | null;
  businessType: BusinessType | null;
  packageId: PackageId | null;
  date: string;
  slotStart: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  city: string;
  country: string;
  description: string;
};

const INITIAL: FormState = {
  mode: null,
  businessType: null,
  packageId: null,
  date: "",
  slotStart: "",
  businessName: "",
  contactName: "",
  phone: "",
  whatsapp: "",
  city: "",
  country: "",
  description: "",
};

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [taken, setTaken] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = useMemo(() => listBookableDates(), []);
  const recommended = form.businessType
    ? recommendPackage(form.businessType)
    : null;

  const slots = useMemo(() => {
    if (!form.packageId) return [];
    return getSlotOptions(form.packageId).filter(
      (slot) => !taken.includes(slot.start),
    );
  }, [form.packageId, taken]);

  useEffect(() => {
    if (recommended && !form.packageId) {
      setForm((prev) => ({ ...prev, packageId: recommended }));
    }
  }, [recommended, form.packageId]);

  useEffect(() => {
    if (!form.date) {
      setTaken([]);
      return;
    }
    let alive = true;
    fetch(`/api/reservations?date=${form.date}`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        setTaken(data.taken ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setTaken([]);
      });
    return () => {
      alive = false;
    };
  }, [form.date]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function canGoStep2() {
    return Boolean(form.mode && form.businessType);
  }

  function canGoStep3() {
    return Boolean(form.packageId && form.date && form.slotStart);
  }

  async function submit() {
    if (!form.mode || !form.businessType || !form.packageId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la réservation.");
      const code = data.reservation?.code as string;
      // Leave /reserver clean so "Réserver" always opens a fresh form.
      router.replace(`/suivi?code=${encodeURIComponent(code)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Réservation</p>
          <h1 className="font-display mt-3 text-[clamp(1.75rem,4vw,2.6rem)] font-extrabold tracking-[-0.035em]">
            Écran {step} / 3
          </h1>
        </div>
        <div className="step-rail w-28 sm:w-36" aria-hidden>
          {[1, 2, 3].map((n) => (
            <span key={n} data-on={n <= step} />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <section className="surface-card fade-up space-y-7 p-5 sm:p-6 md:p-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Mode de live
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {LIVE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className="choice"
                  data-active={form.mode === mode.id}
                  onClick={() => update("mode", mode.id)}
                >
                  <span className="font-display text-lg font-bold">
                    {mode.title}
                  </span>
                  <span className="text-sm text-[var(--ink-soft)]">
                    {mode.subtitle}
                  </span>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {mode.points.map((point) => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold">Votre métier</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              On recommande le pack le plus adapté.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {BUSINESS_TYPES.map((biz) => (
                <button
                  key={biz.id}
                  type="button"
                  className="choice"
                  data-active={form.businessType === biz.id}
                  onClick={() => {
                    update("businessType", biz.id);
                    update("packageId", recommendPackage(biz.id));
                  }}
                >
                  <span className="font-semibold">{biz.label}</span>
                  <span className="text-sm text-[var(--muted)]">{biz.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-primary w-full sm:w-auto"
              disabled={!canGoStep2()}
              onClick={() => setStep(2)}
            >
              Continuer
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="surface-card fade-up space-y-7 p-5 sm:p-6 md:p-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Package
            </h2>
            {recommended ? (
              <p className="mt-1 text-sm text-[var(--teal)]">
                Recommandé pour vous : {getPackage(recommended).name}
              </p>
            ) : null}
            <div className="mt-4 grid gap-3">
              {PACKAGES.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  className="choice"
                  data-active={form.packageId === pack.id}
                  onClick={() => {
                    update("packageId", pack.id);
                    update("slotStart", "");
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold">
                      {pack.name}
                    </span>
                    <span className="font-bold">{formatFcfa(pack.priceFcfa)}</span>
                  </div>
                  <span className="text-sm text-[var(--ink-soft)]">
                    {pack.tagline}
                    {pack.id === recommended ? " · recommandé" : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="field">
              <label htmlFor="date">Date</label>
              <select
                id="date"
                value={form.date}
                onChange={(e) => {
                  update("date", e.target.value);
                  update("slotStart", "");
                }}
              >
                <option value="">Choisir une date</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDateFr(date)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="slot">Créneau</label>
              <select
                id="slot"
                value={form.slotStart}
                disabled={!form.packageId || !form.date}
                onChange={(e) => update("slotStart", e.target.value)}
              >
                <option value="">Choisir un horaire</option>
                {slots.map((slot) => (
                  <option key={slot.start} value={slot.start}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
            <button
              type="button"
              className="btn btn-ghost w-full sm:w-auto"
              onClick={() => setStep(1)}
            >
              Retour
            </button>
            <button
              type="button"
              className="btn btn-primary w-full sm:w-auto"
              disabled={!canGoStep3()}
              onClick={() => setStep(3)}
            >
              Continuer
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="surface-card fade-up space-y-6 p-5 sm:p-6 md:p-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Fiche business
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Ces infos partent immédiatement à l’équipe OCD.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="field md:col-span-2">
              <label htmlFor="businessName">Nom du business</label>
              <input
                id="businessName"
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="Ex. Chez Amina Traiteur"
              />
            </div>
            <div className="field">
              <label htmlFor="contactName">Votre nom</label>
              <input
                id="contactName"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+228…"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp business</label>
              <input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="city">Ville</label>
              <input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="country">Pays</label>
              <input
                id="country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="Togo, Cameroun…"
              />
            </div>
            <div className="field md:col-span-2">
              <label htmlFor="description">Que vendez-vous ?</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Produits phares, prix, zone de livraison…"
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-[var(--radius-sm)] bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent-deep)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
            <button
              type="button"
              className="btn btn-ghost w-full sm:w-auto"
              onClick={() => setStep(2)}
            >
              Retour
            </button>
            <button
              type="button"
              className="btn btn-primary w-full sm:w-auto"
              disabled={submitting}
              onClick={submit}
            >
              {submitting ? "Envoi…" : "Confirmer la réservation"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
