import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ocd_admin_session";
const SESSION_DAYS = 7;

function secret() {
  const value = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (value) return value;
  // En ligne, pas de secret connu d'avance : sans réglage, aucune session n'est valable.
  return process.env.NODE_ENV === "production" ? null : "ocd-live-dev-secret";
}

/** En ligne, pas de mot de passe par défaut : sans ADMIN_PASSWORD, personne n'entre. */
export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "ocd-admin";
}

function sign(payload: string) {
  const key = secret();
  if (!key) throw new Error("ADMIN_SECRET manquant.");
  return createHmac("sha256", key).update(payload).digest("hex");
}

export function createAdminSession() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expRaw, sig] = parts;
  if (role !== "admin") return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${role}.${expRaw}`;
  try {
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkAdminPassword(password: string) {
  const expected = getAdminPassword();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminRequest() {
  const jar = await cookies();
  return verifyAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
