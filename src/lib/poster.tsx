import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { businessLabel } from "./business";
import { SITE } from "./site";
import { formatDate } from "./slots";
import type { Lang, PublicReservation } from "./types";

const C = {
  main: "#c63d17",
  accent: "#f5b81f",
  ink: "#1c120d",
  paper: "#fff7e8",
};

let assets: Promise<{ display: Buffer; text: Buffer; motif: string }> | null = null;

function loadAssets() {
  assets ??= Promise.all([
    readFile(join(process.cwd(), "src/fonts/bricolage-800.woff")),
    readFile(join(process.cwd(), "src/fonts/instrument-600.woff")),
    readFile(join(process.cwd(), "public/motif.svg")),
  ]).then(([display, text, motif]) => ({
    display,
    text,
    motif: `data:image/svg+xml;base64,${motif.toString("base64")}`,
  }));
  return assets;
}

function Band({ motif, width, height }: { motif: string; width: number; height: number }) {
  const tile = height * 2;
  const count = Math.ceil(width / tile);
  return (
    <div style={{ display: "flex", width, height, overflow: "hidden", flexShrink: 0 }}>
      {Array.from({ length: count }, (_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={motif} width={tile} height={height} alt="" />
      ))}
    </div>
  );
}

function Wordmark({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", fontFamily: "Display", fontSize: size }}>
      <div
        style={{
          display: "flex",
          background: C.main,
          color: C.paper,
          border: `4px solid ${C.paper}`,
          borderRadius: 8,
          padding: `${size * 0.12}px ${size * 0.28}px`,
        }}
      >
        OCD
      </div>
      <div style={{ display: "flex", marginLeft: size * 0.3 }}>Live</div>
    </div>
  );
}

/** Taille du nom : un nom long doit rester sur l'affiche. */
function nameSize(name: string, big: number, small: number) {
  if (name.length <= 12) return big;
  if (name.length <= 22) return Math.round((big + small) / 2);
  return small;
}

async function render(node: React.ReactElement, width: number, height: number) {
  const { display, text } = await loadAssets();
  return new ImageResponse(node, {
    width,
    height,
    fonts: [
      { name: "Display", data: display, weight: 800, style: "normal" },
      { name: "Text", data: text, weight: 600, style: "normal" },
    ],
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

/** Affiche verticale 1080 × 1350 : statut WhatsApp, TikTok, Instagram. */
export async function renderPoster(r: PublicReservation, lang: Lang, sample = false) {
  const { motif } = await loadAssets();
  const W = 1080;
  const H = 1350;
  const date = formatDate(r.date, lang).toUpperCase();

  return render(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        background: C.main,
        color: C.paper,
        fontFamily: "Text",
      }}
    >
      <Band motif={motif} width={W} height={90} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "60px 70px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: C.accent,
              color: C.ink,
              fontFamily: "Display",
              fontSize: 44,
              padding: "12px 26px",
              borderRadius: 8,
              border: `5px solid ${C.ink}`,
              transform: "rotate(-3deg)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 24,
                height: 24,
                borderRadius: 12,
                background: C.main,
                marginRight: 16,
              }}
            />
            {lang === "fr" ? "EN LIVE" : "LIVE"}
          </div>
          {sample ? (
            <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>
              {lang === "fr" ? "Exemple d'affiche" : "Sample poster"}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontFamily: "Display",
            fontSize: nameSize(r.businessName, 150, 96),
            lineHeight: 0.95,
            letterSpacing: -4,
          }}
        >
          {r.businessName}
        </div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 40, opacity: 0.92 }}>
          {businessLabel(r.businessType)[lang]}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: 54,
            background: C.paper,
            color: C.ink,
            border: `6px solid ${C.ink}`,
            borderRadius: 12,
            padding: "34px 40px",
            boxShadow: `12px 12px 0 ${C.ink}`,
          }}
        >
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 58, letterSpacing: -1.5 }}>
            {date}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
            <div style={{ display: "flex", fontFamily: "Display", fontSize: 112, color: C.main, letterSpacing: -3 }}>
              {r.slotStart.replace(":", " h ")}
            </div>
            <div style={{ display: "flex", marginLeft: 22, fontSize: 34 }}>
              {lang === "fr" ? "heure de Lomé (GMT)" : "Lomé time (GMT)"}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 10, fontSize: 38 }}>
            {lang === "fr" ? "Sur TikTok :" : "On TikTok:"}&nbsp;
            <span style={{ fontFamily: "Display" }}>{SITE.tiktokAccount}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: C.ink,
          padding: "30px 70px",
        }}
      >
        <Wordmark size={46} />
        <div style={{ display: "flex", fontFamily: "Display", fontSize: 36, color: C.accent }}>
          {SITE.tagline}
        </div>
      </div>
      <Band motif={motif} width={W} height={60} />
    </div>,
    W,
    H,
  );
}

/** Carte de membre 1080 × 680. */
export async function renderCard(r: PublicReservation, lang: Lang, sample = false) {
  const { motif } = await loadAssets();
  const W = 1080;
  const H = 680;
  const number = String(r.memberNo).padStart(4, "0");

  return render(
    <div
      style={{
        display: "flex",
        width: W,
        height: H,
        background: C.ink,
        color: C.paper,
        fontFamily: "Text",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "54px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={44} />
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: C.accent }}>
            {sample
              ? lang === "fr"
                ? "EXEMPLE"
                : "SAMPLE"
              : lang === "fr"
                ? "CARTE DE MEMBRE"
                : "MEMBER CARD"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", marginTop: 56 }}>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 56, color: C.accent }}>
            OCD N°
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 22,
              fontFamily: "Display",
              fontSize: 190,
              lineHeight: 0.9,
              letterSpacing: -6,
            }}
          >
            {number}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: nameSize(r.contactName, 62, 46),
              letterSpacing: -1.5,
            }}
          >
            {r.contactName}
          </div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 34, opacity: 0.85 }}>
            {r.businessName} · {r.city}
          </div>
          <div style={{ display: "flex", marginTop: 22, fontFamily: "Display", fontSize: 32, color: C.accent }}>
            {SITE.tagline}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 120, height: H, overflow: "hidden" }}>
        {Array.from({ length: Math.ceil(H / 60) }, (_, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={motif} width={120} height={60} alt="" />
        ))}
      </div>
    </div>,
    W,
    H,
  );
}

export const SAMPLE_RESERVATION: PublicReservation = {
  code: "OCD-EXEMPLE",
  memberNo: 1,
  status: "confirmed",
  mode: "presentiel",
  date: "2026-12-01",
  slotStart: "10:30",
  slotEnd: "12:00",
  packageId: "decouverte",
  priceFcfa: 15000,
  businessName: "Ton business",
  businessType: "mode",
  contactName: "Ton nom",
  city: "Lomé",
  country: "Togo",
};
