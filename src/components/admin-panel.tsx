"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { businessLabel, modeLabel } from "@/lib/business";
import { formatFcfa } from "@/lib/packages";
import { formatDateFr } from "@/lib/slots";
import type { Reservation, ReservationStatus } from "@/lib/types";

const FILTERS: { id: "all" | ReservationStatus; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "En attente" },
  { id: "confirmed", label: "Approuvées" },
  { id: "cancelled", label: "Annulées" },
];

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

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    setAuthed(Boolean(data.authenticated));
  }, []);

  const loadReservations = useCallback(async () => {
    const res = await fetch("/api/admin/reservations");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setReservations(data.reservations ?? []);
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (authed) void loadReservations();
  }, [authed, loadReservations]);

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
      <div className="surface-card mx-auto max-w-md p-6 text-sm text-[var(--muted)]">
        Vérification session…
      </div>
    );
  }

  if (!authed) {
    return (
      <form
        onSubmit={login}
        className="surface-card mx-auto max-w-md space-y-5 p-6 md:p-8"
      >
        <p className="section-kicker">Admin OCD</p>
        <h1 className="font-display text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold tracking-[-0.035em]">
          Connexion équipe
        </h1>
        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
          Approuvez les réservations avant publication sur l’accueil.
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
          <p className="text-sm font-semibold text-[var(--accent-deep)]">
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
          <p className="section-kicker">Admin OCD</p>
          <h1 className="font-display mt-3 text-[clamp(1.7rem,4vw,2.6rem)] font-extrabold tracking-[-0.035em]">
            Réservations
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
            Une réservation n’apparaît sur l’accueil qu’après approbation.
          </p>
        </div>
        <button type="button" className="btn btn-ghost self-start" onClick={logout}>
          Déconnexion
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="rounded-full px-3 py-2 text-sm font-bold"
            style={{
              background:
                filter === item.id ? "var(--accent)" : "var(--surface)",
              color: filter === item.id ? "#fff" : "var(--ink-soft)",
              border: `1px solid ${filter === item.id ? "var(--accent)" : "var(--line)"}`,
            }}
            onClick={() => setFilter(item.id)}
          >
            {item.label} ({counts[item.id]})
          </button>
        ))}
      </div>

      {actionError ? (
        <p className="rounded-[var(--radius-sm)] bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent-deep)]">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-3">
        {visible.length === 0 ? (
          <div className="surface-card p-5 text-sm text-[var(--muted)]">
            Aucune réservation dans ce filtre.
          </div>
        ) : null}

        {visible.map((item) => (
          <article key={item.id} className="surface-card space-y-4 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold">
                    {item.businessName}
                  </h2>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{
                      background:
                        item.status === "confirmed"
                          ? "var(--teal-soft)"
                          : item.status === "pending"
                            ? "var(--accent-soft)"
                            : "var(--bg-deep)",
                      color:
                        item.status === "confirmed"
                          ? "var(--teal)"
                          : item.status === "pending"
                            ? "var(--accent-deep)"
                            : "var(--muted)",
                    }}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {item.code} · {item.contactName} · {businessLabel(item.businessType)}
                </p>
              </div>
              <p className="font-display text-lg font-extrabold">
                {formatFcfa(item.priceFcfa)}
              </p>
            </div>

            <div className="grid gap-2 text-sm text-[var(--ink-soft)] md:grid-cols-2">
              <p>
                {formatDateFr(item.date)} · {item.slotStart}–{item.slotEnd}
              </p>
              <p>
                {modeLabel(item.mode)} · {item.packageName}
              </p>
              <p>
                {item.city}, {item.country}
              </p>
              <p>
                Tel {item.phone} · WhatsApp {item.whatsapp}
              </p>
            </div>

            <p className="rounded-[var(--radius-sm)] bg-[var(--bg-deep)] p-3 text-sm text-[var(--ink-soft)]">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {item.status !== "confirmed" ? (
                <button
                  type="button"
                  className="btn btn-primary !min-h-10"
                  disabled={busyId === item.id}
                  onClick={() => setStatus(item.id, "confirmed")}
                >
                  Approuver
                </button>
              ) : null}
              {item.status !== "pending" ? (
                <button
                  type="button"
                  className="btn btn-ghost !min-h-10"
                  disabled={busyId === item.id}
                  onClick={() => setStatus(item.id, "pending")}
                >
                  Remettre en attente
                </button>
              ) : null}
              {item.status !== "cancelled" ? (
                <button
                  type="button"
                  className="btn btn-ghost !min-h-10"
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
