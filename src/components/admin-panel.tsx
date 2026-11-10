"use client";

import { useEffect, useMemo, useState } from "react";
import { businessLabel, MODE_LABELS } from "@/lib/business";
import { formatFcfa, getPackage } from "@/lib/packages";
import { formatDate } from "@/lib/slots";
import type { Reservation, ReservationStatus } from "@/lib/types";

const FILTERS: { id: "all" | ReservationStatus; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "En attente" },
  { id: "confirmed", label: "Approuvées" },
  { id: "cancelled", label: "Annulées" },
];

/** Message WhatsApp prérempli pour confirmer le créneau au vendeur. */
function whatsappLink(item: Reservation) {
  const text = `Bonjour ${item.contactName}, ici l'équipe OCD Live. Nous avons bien reçu ta réservation ${item.code} pour ${item.businessName} : ${formatDate(item.date)} de ${item.slotStart} à ${item.slotEnd} (heure de Lomé).`;
  return `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(text)}`;
}

function statusLabel(status: ReservationStatus) {
  if (status === "pending") return "En attente";
  if (status === "confirmed") return "Approuvée";
  return "Annulée";
}

export function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | ReservationStatus>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setAuthed(Boolean(data.authenticated)))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/reservations")
      .then((res) => (res.status === 401 ? null : res.json()))
      .then((data) => {
        if (!data) setAuthed(false);
        else setReservations(data.reservations ?? []);
      })
      .catch(() => setActionError("Impossible de charger les réservations."));
  }, [authed]);

  const visible = useMemo(() => {
    if (filter === "all") return reservations;
    return reservations.filter((item) => item.status === filter);
  }, [filter, reservations]);

  const counts = useMemo(() => {
    return {
      all: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
    };
  }, [reservations]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Connexion refusée.");
      setPassword("");
      setAuthed(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setReservations([]);
  }

  async function setStatus(id: string, status: ReservationStatus) {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action impossible.");
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? data.reservation : item)),
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  }

  if (authed === null) {
    return (
      <div className="panel mx-auto max-w-md p-6 text-sm text-[var(--muted)]">
        Vérification session…
      </div>
    );
  }

  if (!authed) {
    return (
      <form
        onSubmit={login}
        className="panel mx-auto max-w-md space-y-5 p-6 md:p-8"
      >
        <p className="kicker">Admin OCD</p>
        <h1 className="display t-2">
          Connexion équipe
        </h1>
        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
          Approuve les réservations. Elles apparaissent ensuite dans le programme.
        </p>
        <div className="field">
          <label htmlFor="admin-password">Mot de passe</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {loginError ? (
          <p role="alert" className="notice text-sm">
            {loginError}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary w-full" disabled={loggingIn}>
          {loggingIn ? "Connexion…" : "Entrer"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Admin OCD</p>
          <h1 className="display t-2 mt-3">
            Réservations
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
            Une réservation approuvée apparaît dans le programme, et le vendeur reçoit son affiche et sa carte OCD.
          </p>
        </div>
        <button type="button" className="btn btn-plain btn-small self-start" onClick={logout}>
          Déconnexion
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="min-h-11 rounded-full px-4 text-sm font-bold"
            aria-pressed={filter === item.id}
            style={{
              background: filter === item.id ? "var(--ink)" : "var(--white)",
              color: filter === item.id ? "var(--paper)" : "var(--ink-soft)",
              border: `2px solid ${filter === item.id ? "var(--ink)" : "var(--line)"}`,
            }}
            onClick={() => setFilter(item.id)}
          >
            {item.label} ({counts[item.id]})
          </button>
        ))}
      </div>

      {actionError ? (
        <p role="alert" className="notice text-sm">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-3">
        {visible.length === 0 ? (
          <div className="panel p-5 text-sm text-[var(--muted)]">
            Aucune réservation dans ce filtre.
          </div>
        ) : null}

        {visible.map((item) => (
          <article key={item.id} className="panel space-y-4 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="display t-3">
                    {item.businessName}
                  </h2>
                  <span
                    className={`tag ${
                      item.status === "confirmed"
                        ? "tag-ink"
                        : item.status === "pending"
                          ? "tag-accent"
                          : "tag-line"
                    }`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  OCD n° {String(item.memberNo).padStart(4, "0")} · {item.code} · {item.contactName} ·{" "}
                  {businessLabel(item.businessType).fr}
                </p>
              </div>
              <p className="display text-xl">
                {formatFcfa(item.priceFcfa)}
              </p>
            </div>

            <div className="grid gap-2 text-sm text-[var(--ink-soft)] md:grid-cols-2">
              <p>
                <span className="inline-block first-letter:uppercase">{formatDate(item.date)}</span> · {item.slotStart}–{item.slotEnd}
              </p>
              <p>
                {MODE_LABELS[item.mode].fr} · {getPackage(item.packageId).name.fr} (
                {getPackage(item.packageId).lives} live{getPackage(item.packageId).lives > 1 ? "s" : ""})
              </p>
              <p>
                {item.city}, {item.country}
              </p>
              <p>
                WhatsApp +{item.whatsapp}
              </p>
            </div>

            <p className="panel-soft p-3 text-sm text-[var(--ink-soft)]">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                className="btn btn-accent btn-small"
                href={whatsappLink(item)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Écrire sur WhatsApp
              </a>
              {item.status !== "confirmed" ? (
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  disabled={busyId === item.id}
                  onClick={() => setStatus(item.id, "confirmed")}
                >
                  Approuver
                </button>
              ) : null}
              {item.status !== "pending" ? (
                <button
                  type="button"
                  className="btn btn-plain btn-small !min-h-10"
                  disabled={busyId === item.id}
                  onClick={() => setStatus(item.id, "pending")}
                >
                  Remettre en attente
                </button>
              ) : null}
              {item.status !== "cancelled" ? (
                <button
                  type="button"
                  className="btn btn-plain btn-small !min-h-10"
                  disabled={busyId === item.id}
                  onClick={() => setStatus(item.id, "cancelled")}
                >
                  Annuler
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
