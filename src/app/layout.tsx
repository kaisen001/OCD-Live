import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { LocaleRoot } from "@/components/locale-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TabBar } from "@/components/tab-bar";
import "./globals.css";

/** TikTok Sans : la police de TikTok, publiée sous licence libre (SIL OFL). */
const text = localFont({
  src: "../fonts/tiktok-sans.woff2",
  variable: "--font-text",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OCD Live : réserve ton live de vente sur House of Challenge",
    template: "%s · OCD Live",
  },
  description:
    "Vends en direct sur le TikTok House of Challenge, au studio de Lomé ou à distance. Un live dure 1 h 30. À partir de 15 000 FCFA. Premiers lives le 1er décembre 2026.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** Choisit la langue avant le premier affichage : pas de clignotement. */
const langScript = `try{var loc=localStorage.getItem("ocd-locale")||"";var map={fr:"fr",en:"en",ee:"fr",fon:"fr",wo:"fr",bm:"fr",mos:"fr",ha:"fr",yo:"en",ig:"en",sw:"en",ln:"fr",ar:"fr",am:"en",zu:"en",pt:"en"};var ui=map[loc]||localStorage.getItem("ocd-lang");if(ui!=="fr"&&ui!=="en"){ui=(navigator.language||"fr").toLowerCase().indexOf("en")===0?"en":"fr"}if(!loc||!map[loc])loc=ui;var d=document.documentElement;d.dataset.lang=ui;d.dataset.locale=loc;d.lang=loc==="ar"?"ar":ui;d.dir=loc==="ar"?"rtl":"ltr";localStorage.setItem("ocd-locale",loc);localStorage.setItem("ocd-lang",ui);document.cookie="ocd-locale="+encodeURIComponent(loc)+";path=/;max-age=31536000;samesite=lax"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-lang="fr"
      data-scroll-behavior="smooth"
      className={text.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased" suppressHydrationWarning>
        <LocaleRoot>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <TabBar />
        </LocaleRoot>
      </body>
    </html>
  );
}
