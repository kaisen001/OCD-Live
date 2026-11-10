import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { businessLabel } from "./business";
import { SITE } from "./site";
import { formatDate } from "./slots";
import type { Lang, PublicReservation } from "./types";

const C = {
  main: "#f65f00",
  accent: "#ffc531",
  ink: "#071019",
  paper: "#fff7e8",
};

let assets: Promise<{
  display: Buffer;
  text: Buffer;
  motif: string;
  logo: string;
  logoDark: string;
}> | null = null;

function loadAssets() {
  assets ??= Promise.all([
    readFile(join(process.cwd(), "src/fonts/anton.woff")),
    readFile(join(process.cwd(), "src/fonts/figtree-600.woff")),
    readFile(join(process.cwd(), "public/motif.svg")),
    readFile(join(process.cwd(), "src/assets/logo-blanc.png")),
    readFile(join(process.cwd(), "src/assets/logo.png")),
  ]).then(([display, text, motif, logo, logoDark]) => ({
    display,
    text,
    motif: `data:image/svg+xml;base64,${motif.toString("base64")}`,
    logo: `data:image/png;base64,${logo.toString("base64")}`,
    logoDark: `data:image/png;base64,${logoDark.toString("base64")}`,
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

function Wordmark({ logo, width }: { logo: string; width: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logo} width={width} height={Math.round((width * 79) / 410)} alt="" />;
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
      { name: "Display", data: display, weight: 400, style: "normal" },
      { name: "Text", data: text, weight: 600, style: "normal" },
    ],
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

/** Affiche verticale 1080 × 1350 : statut WhatsApp, TikTok, Instagram. */
export async function renderPoster(r: PublicReservation, lang: Lang, sample = false) {
  const { motif, logo } = await loadAssets();
  const W = 1080;
  const H = 1350;
  const date = formatDate(r.date, lang).toUpperCase();
  const name = r.businessName.toUpperCase();

  return render(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        background: C.ink,
        color: C.paper,
        fontFamily: "Text",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 70px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark logo={logo} width={330} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: C.main,
              color: C.ink,
              fontFamily: "Display",
              fontSize: 40,
              letterSpacing: 3,
              padding: "10px 30px",
              borderRadius: 60,
            }}
          >
            {sample ? (lang === "fr" ? "EXEMPLE" : "SAMPLE") : lang === "fr" ? "EN LIVE" : "LIVE"}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 90, fontSize: 36, letterSpacing: 5, color: C.main }}>
          {businessLabel(r.businessType)[lang].toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontFamily: "Display",
            fontSize: nameSize(name, 210, 120),
            lineHeight: 0.98,
          }}
        >
          {name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: 56 }}>
          <div style={{ display: "flex", fontSize: 44, letterSpacing: 2 }}>{date}</div>
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 4 }}>
            <div style={{ display: "flex", fontFamily: "Display", fontSize: 250, lineHeight: 0.95, color: C.main }}>
              {r.slotStart.replace(":", "H")}
            </div>
            <div style={{ display: "flex", marginLeft: 28, marginBottom: 34, fontSize: 32, opacity: 0.75 }}>
              {lang === "fr" ? "heure de Lomé (GMT)" : "Lomé time (GMT)"}
            </div>
          </div>
        </div>
      </div>

      <Band motif={motif} width={W} height={44} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: C.main,
          color: C.ink,
          padding: "30px 70px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32 }}>
          {lang === "fr" ? "Sur TikTok" : "On TikTok"}&nbsp;
          <span style={{ fontFamily: "Display", fontSize: 40, marginLeft: 12 }}>{SITE.tiktokAccount}</span>
        </div>
        <div style={{ display: "flex", fontFamily: "Display", fontSize: 24, letterSpacing: 1 }}>
          {SITE.tagline.toUpperCase()}
        </div>
      </div>
    </div>,
    W,
    H,
  );
}

/** Carte de membre 1080 × 680. */
export async function renderCard(r: PublicReservation, lang: Lang, sample = false) {
  const { motif, logoDark } = await loadAssets();
  const W = 1080;
  const H = 680;
  const number = String(r.memberNo).padStart(4, "0");

  return render(
    <div
      style={{
        display: "flex",
        width: W,
        height: H,
        background: C.paper,
        color: C.ink,
        fontFamily: "Text",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 56, height: H, overflow: "hidden" }}>
        {Array.from({ length: Math.ceil(H / 28) }, (_, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={motif} width={56} height={28} alt="" />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "50px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark logo={logoDark} width={290} />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, opacity: 0.6 }}>
            {sample
              ? lang === "fr"
                ? "EXEMPLE"
                : "SAMPLE"
              : lang === "fr"
                ? "CARTE DE MEMBRE"
                : "MEMBER CARD"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", marginTop: 50 }}>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 70, marginBottom: 22 }}>OCD N°</div>
          <div
            style={{
              display: "flex",
              marginLeft: 24,
              fontFamily: "Display",
              fontSize: 250,
              lineHeight: 0.95,
              color: C.main,
            }}
          >
            {number}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: nameSize(r.contactName, 64, 48) }}>
            {r.contactName.toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 32, opacity: 0.75 }}>
            {r.businessName} · {r.city}
          </div>
        </div>
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
