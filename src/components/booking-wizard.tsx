"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BUSINESS_TYPES, bizKey, modeKey } from "@/lib/business";
import { PACKAGES, durationLabel, getPackage } from "@/lib/packages";
import {
  SLOT_STARTS,
  calendarMonths,
  formatDate,
  formatMonth,
  localTimeFor,
  slotEnd,
  slotsFrom,
  weekdayInitials,
} from "@/lib/slots";
import type { BusinessType, LiveMode, PackageId } from "@/lib/types";
import { useLang, useLocaleId, useVisitor } from "@/lib/use-visitor";
import { Price } from "./price";
import { T, useT } from "./t";
import type { MessageKey } from "@/lib/i18n";

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
  address: string;
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
  address: "",
  city: "",
  country: "",
  website: "",
};

const STEP_KEYS: MessageKey[] = ["book.step1", "book.step2", "book.step3", "book.step4"];

const PACK_NAME: Record<PackageId, MessageKey> = {
  simple: "pack.simple.name",
  plus: "pack.plus.name",
  demi: "pack.demi.name",
  journee: "pack.journee.name",
  vedette: "pack.vedette.name",
  mois: "pack.mois.name",
};

const PACK_SUMMARY: Record<PackageId, MessageKey> = {
  simple: "pack.simple.summary",
  plus: "pack.plus.summary",
  demi: "pack.demi.summary",
  journee: "pack.journee.summary",
  vedette: "pack.vedette.summary",
  mois: "pack.mois.summary",
};

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const lang = useLang();
  const localeId = useLocaleId();
  const t = useT();
  const visitor = useVisitor();
  const top = useRef<HTMLDivElement>(null);

  // Venu de l'accueil, le visiteur a déjà choisi présentiel ou distance : on passe au calendrier.
  const format = params.get("format");
  const chosen = format === "presentiel" || format === "distance" ? format : null;
  const [step, setStep] = useState(chosen ? 1 : 0);
  const [form, setForm] = useState<Form>({ ...EMPTY, mode: chosen });
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

  /** Un package long a besoin de plusieurs créneaux libres de suite à partir de l'heure choisie. */
  function fits(slots: number) {
    const needed = slotsFrom(form.slotStart, slots);
    return Boolean(needed && !needed.some((slot) => takenToday.includes(slot)));
  }
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
        setError(t("book.slotTaken"));
        setSending(false);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      router.replace(`/suivi?code=${encodeURIComponent(data.reservation.code)}&nouveau=1`);
    } catch (err) {
      setError((err instanceof Error && err.message) || t("book.fail"));
      setSending(false);
    }
  }

  return (
    <div ref={top} className="mx-auto max-w-2xl scroll-mt-20">
      {/* Progression */}
      <div className="flex items-center gap-2" aria-hidden>
        {STEP_KEYS.map((key) => (
          <span
            key={key}
            className="h-2.5 flex-1 rounded-full"
            style={{
              background: STEP_KEYS.indexOf(key) <= step ? "var(--main)" : "var(--line)",
            }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
        {step + 1} / 4
      </p>
      <h1 className="display t-2 mt-2">
        <T k={STEP_KEYS[step]} />
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
              <T k="book.modeStudio" />
            </span>
            <span>
              <T k="book.modeStudioSub" />
            </span>
          </button>
          <button
            type="button"
            className="choice"
            aria-pressed={form.mode === "distance"}
            onClick={() => set("mode", "distance")}
          >
            <span className="display t-3">
              <T k="book.modeRemote" />
            </span>
            <span>
              <T k="book.modeRemoteSub" />
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
                className="btn btn-plain btn-small !min-w-11 !px-0"
                disabled={monthIndex === 0}
                onClick={() => setMonthIndex((i) => i - 1)}
                aria-label={t("book.prevMonth")}
              >
                ←
              </button>
              <p className="display text-xl capitalize">{formatMonth(month.year, month.month, lang)}</p>
              <button
                type="button"
                className="btn btn-plain btn-small !min-w-11 !px-0"
                disabled={monthIndex === months.length - 1}
                onClick={() => setMonthIndex((i) => i + 1)}
                aria-label={t("book.nextMonth")}
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
                    aria-label={formatDate(day.date, localeId)}
                    onClick={() => setForm((prev) => ({ ...prev, date: day.date, slotStart: "" }))}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              <T k="book.opens" />
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              <T k="time.legend" />
            </p>
          </div>

          {calendarDown ? (
            <p className="notice mt-5">
              <T k="book.calDown" />{" "}
              <button type="button" className="link" onClick={loadTaken}>
                <T k="book.retry" />
              </button>
            </p>
          ) : null}

          {form.date ? (
            <div className="mt-7">
              <h2 className="display t-3 first-letter:uppercase">{formatDate(form.date, localeId)}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                <T k="time.lomeGmt" />
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
                      onClick={() => setForm((prev) => ({ ...prev, slotStart: start, packageId: null }))}
                    >
                      {start}
                      <small>
                        {isTaken ? (
                          <T k="book.taken" />
                        ) : local ? (
                          t("book.localHint", { time: local })
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

      {/* ---------- 3. Package ---------- */}
      {step === 2 ? (
        <div className="rise mt-7 grid gap-3" role="radiogroup">
          {PACKAGES.map((item) => {
            const ok = fits(item.slots);
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                className="choice"
                disabled={!ok}
                aria-checked={form.packageId === item.id}
                onClick={() => set("packageId", item.id)}
              >
                <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="display t-3">
                    <T k={PACK_NAME[item.id]} />
                  </span>
                  <Price amount={item.priceFcfa} className="display t-3" />
                </span>
                <span className="text-sm font-bold">
                  {item.lives > 1 ? `${item.lives} × ${durationLabel(item.slots)}` : durationLabel(item.slots)}
                  {ok ? (
                    <span className="font-semibold text-[var(--muted)]">
                      {" · "}
                      {form.slotStart} → {slotEnd(form.slotStart, item.slots)}
                    </span>
                  ) : null}
                </span>
                <span className="text-[0.97rem]">
                  {ok ? (
                    <T k={PACK_SUMMARY[item.id]} />
                  ) : (
                    t("book.needsSlots", { n: item.slots, start: form.slotStart })
                  )}
                </span>
              </button>
            );
          })}
          {pack && pack.lives > 1 ? (
            <p className="notice">
              {t("book.multiLive", {
                date: formatDate(form.date, localeId),
                start: form.slotStart,
                n: pack.lives - 1,
              })}
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
              <T k="book.bizName" />
            </label>
            <input
              id="businessName"
              value={form.businessName}
              maxLength={60}
              autoComplete="organization"
              onChange={(e) => set("businessName", e.target.value)}
              placeholder={t("book.bizNamePh")}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="businessType">
              <T k="book.bizType" />
            </label>
            <select
              id="businessType"
              value={form.businessType}
              onChange={(e) => set("businessType", e.target.value as BusinessType)}
              required
            >
              <option value="">{t("book.bizTypeChoose")}</option>
              {BUSINESS_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(bizKey(item.id))}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="description">
              <T k="book.desc" />
            </label>
            <textarea
              id="description"
              value={form.description}
              maxLength={400}
              onChange={(e) => set("description", e.target.value)}
              placeholder={t("book.descPh")}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contactName">
              <T k="book.contact" />
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
              <T k="book.whatsapp" />
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              value={form.whatsapp}
              maxLength={24}
              autoComplete="tel"
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder={t("book.whatsappPh")}
              required
            />
            <span className="hint">
              <T k="book.whatsappHint" />
            </span>
          </div>
          <div className="field">
            <label htmlFor="address">
              <T k="book.address" />
            </label>
            <input
              id="address"
              value={form.address}
              maxLength={120}
              autoComplete="street-address"
              onChange={(e) => set("address", e.target.value)}
              placeholder={t("book.addressPh")}
            />
            <span className="hint">
              <T k="book.addressHint" />
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="city">
                <T k="book.city" />
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
                <T k="book.country" />
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
          <T k="book.payLater" />
        </p>
      ) : null}

      {/* ---------- Récapitulatif + boutons ---------- */}
      <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t border-[var(--line)] bg-white px-5 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0">
        {form.mode ? (
          <p className="mb-3 text-sm font-semibold text-[var(--ink-soft)]">
            {t(modeKey(form.mode))}
            {form.date && form.slotStart ? (
              <>
                {" · "}
                <span className="inline-block first-letter:uppercase">{formatDate(form.date, localeId)}</span>{" "}
                {form.slotStart}
              </>
            ) : null}
            {pack ? (
              <>
                {" · "}
                {t(PACK_NAME[pack.id])} <Price amount={pack.priceFcfa} />
              </>
            ) : null}
          </p>
        ) : null}
        <div className="flex gap-3">
          {step > 0 ? (
            <button type="button" className="btn btn-plain" onClick={() => go(step - 1)} disabled={sending}>
              <T k="book.back" />
            </button>
          ) : null}
          {step < 3 ? (
            <button type="button" className="btn btn-primary flex-1" disabled={!ready} onClick={() => go(step + 1)}>
              <T k="book.next" />
            </button>
          ) : (
            <button type="button" className="btn btn-primary flex-1" disabled={!ready || sending} onClick={submit}>
              {sending ? <T k="book.sending" /> : <T k="book.submit" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
