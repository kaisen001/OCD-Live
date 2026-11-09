import { NextResponse } from "next/server";
import {
  checkAdminPassword,
  createAdminSession,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim() ?? "";
    if (!checkAdminPassword(password)) {
      return NextResponse.json(
        { error: "Mot de passe incorrect." },
        { status: 401 },
      );
    }

    const token = createAdminSession();
    const response = NextResponse.json({ ok: true });
    const cookie = sessionCookieOptions(token);
    response.cookies.set(cookie);
    return response;
  } catch {
    return NextResponse.json({ error: "Connexion impossible." }, { status: 400 });
  }
}
