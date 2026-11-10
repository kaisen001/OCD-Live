import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { businessLabel } from "./business";
import { SITE } from "./site";
import { formatDate } from "./slots";
import type { Lang, PublicReservation } from "./types";

const C = {
  main: "#f65f00",
  mainDeep: "#d94f00",
  ink: "#161823",
  soft: "#4a4c57",
  wall: "#f1f2f7",
  live: "#fe2c55",
};

type Assets = { display: Buffer; text: Buffer; motif: string; logo: string; africa: string };
let assets: Promise<Assets> | null = null;

function loadAssets() {
  const file = (path: string) => readFile(join(process.cwd(), path));
  const png = (data: Buffer) => `data:image/png;base64,${data.toString("base64")}`;
  assets ??= Promise.all([
    file("src/fonts/tiktok-sans-800.woff"),
    file("src/fonts/tiktok-sans-500.woff"),
    file("public/motif.svg"),
    file("src/assets/logo.png"),
    file("src/assets/afrique-lumiere.png"),
  ]).then(([display, text, motif, logo, africa]) => ({
    display,
    text,
    motif: `data:image/svg+xml;base64,${motif.toString("base64")}`,
    logo: png(logo),
    africa: png(africa),
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

/** Le mur du studio : l'Afrique lumineuse avec le logo dedans. */
function Wall({ africa, logo, width }: { africa: string; logo: string; width: number }) {
  const height = Math.round((width * 1000) / 829);
  const logoWidth = Math.round(width * 0.36);
  return (
    <div style={{ display: "flex", position: "relative", width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={africa} width={width} height={height} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        width={logoWidth}
        height={Math.round((logoWidth * 79) / 410)}
        alt=""
        style={{ position: "absolute", left: Math.round(width * 0.3), top: Math.round(height * 0.31) }}
      />
    </div>
  );
}

function LiveBadge({ label, size }: { label: string; size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: C.live,
        color: "#fff",
        fontFamily: "Display",
        fontSize: size,
        letterSpacing: 2,
        padding: `${size * 0.22}px ${size * 0.5}px`,
        borderRadius: size * 0.22,
      }}
    >
      <div
        style={{
          display: "flex",
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: size,
          background: "#fff",
          marginRight: size * 0.35,
        }}
      />
      {label}
    </div>
  );
}

/** Taille du nom : un nom long doit rester sur l'image. */
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
      { name: "Text", data: text, weight: 500, style: "normal" },
    ],
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

/** Affiche verticale 1080 × 1350 : statut WhatsApp, TikTok, Instagram. */
export async function renderPoster(r: PublicReservation, lang: Lang, sample = false) {
  const { motif, logo, africa } = await loadAssets();
  const W = 1080;
  const H = 1350;
  const date = formatDate(r.date, lang);

  return render(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        background: C.wall,
        color: C.ink,
        fontFamily: "Text",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginTop: -10 }}>
        <Wall africa={africa} logo={logo} width={560} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 70px", marginTop: -70 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LiveBadge label={sample ? (lang === "fr" ? "EXEMPLE" : "SAMPLE") : "LIVE"} size={34} />
          <div style={{ display: "flex", marginLeft: 20, fontSize: 32, color: C.soft }}>
            {businessLabel(r.businessType)[lang]}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Display",
            fontSize: nameSize(r.businessName, 120, 78),
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          {r.businessName}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", marginTop: "auto", marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: 170,
              lineHeight: 0.95,
              letterSpacing: -5,
              color: C.mainDeep,
            }}
          >
            {r.slotStart.replace(":", "h")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 30, marginBottom: 16 }}>
            <div style={{ display: "flex", fontFamily: "Display", fontSize: 46, letterSpacing: -1 }}>
              {date.charAt(0).toUpperCase() + date.slice(1)}
            </div>
            <div style={{ display: "flex", fontSize: 30, color: C.soft }}>
              {lang === "fr" ? "heure de Lomé (GMT)" : "Lomé time (GMT)"}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: C.mainDeep,
          color: "#fff",
          padding: "30px 70px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          {lang === "fr" ? "Sur TikTok" : "On TikTok"}
          <span style={{ fontFamily: "Display", fontSize: 38, marginLeft: 14 }}>{SITE.tiktokAccount}</span>
        </div>
        <div style={{ display: "flex", flexShrink: 0, fontSize: 22 }}>{SITE.tagline}</div>
      </div>
      <Band motif={motif} width={W} height={30} />
    </div>,
    W,
    H,
  );
}

/** Carte de membre 1080 × 680. */
export async function renderCard(r: PublicReservation, lang: Lang, sample = false) {
  const { motif, logo, africa } = await loadAssets();
  const W = 1080;
  const H = 680;
  const number = String(r.memberNo).padStart(4, "0");

  return render(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        background: C.wall,
        color: C.ink,
        fontFamily: "Text",
      }}
    >
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        <div style={{ display: "flex", position: "absolute", right: 10, top: -10 }}>
          <Wall africa={africa} logo={logo} width={490} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 64px 40px" }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: C.soft }}>
            {sample
              ? lang === "fr"
                ? "EXEMPLE DE CARTE"
                : "SAMPLE CARD"
              : lang === "fr"
                ? "CARTE DE MEMBRE"
                : "MEMBER CARD"}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: "Display", fontSize: 60, letterSpacing: -1 }}>
            OCD n°
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: 200,
              lineHeight: 0.95,
              letterSpacing: -6,
              color: C.mainDeep,
            }}
          >
            {number}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Display",
                fontSize: nameSize(r.contactName, 56, 42),
                letterSpacing: -1.5,
              }}
            >
              {r.contactName}
            </div>
            <div style={{ display: "flex", marginTop: 2, fontSize: 30, color: C.soft }}>
              {r.businessName} · {r.city}
            </div>
          </div>
        </div>
      </div>
      <Band motif={motif} width={W} height={30} />
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
  slotStart: "10:00",
  slotEnd: "11:30",
  packageId: "simple",
  priceFcfa: 15000,
  businessName: "Ton business",
  businessType: "mode",
  contactName: "Ton nom",
  address: "",
  city: "Lomé",
  country: "Togo",
};
