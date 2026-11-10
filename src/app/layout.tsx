import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = localFont({
  src: "../fonts/anton.woff2",
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

const text = localFont({
  src: "../fonts/figtree.woff2",
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
  themeColor: "#071019",
};

/** Choisit la langue avant le premier affichage : pas de clignotement. */
const langScript = `try{var l=localStorage.getItem("ocd-lang");if(l!=="fr"&&l!=="en"){l=(navigator.language||"fr").toLowerCase().indexOf("en")===0?"en":"fr"}var d=document.documentElement;d.dataset.lang=l;d.lang=l}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-lang="fr"
      className={`${display.variable} ${text.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
