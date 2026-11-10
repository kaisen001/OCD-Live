import Link from "next/link";
import { Agenda } from "@/components/agenda";
import { Price } from "@/components/price";
import { T } from "@/components/t";
import { durationLabel, PACKAGES } from "@/lib/packages";

/** Photos sous licence libre (Wikimedia Commons). Crédit obligatoire : ne pas retirer. */
const PHOTOS = [
  {
    src: "/photos/sacs-wax.webp",
    w: 440,
    h: 550,
    fr: "Sacs en pagne wax, Lomé",
    en: "Wax print bags, Lomé",
    author: "Step may",
    page: "https://commons.wikimedia.org/wiki/File:Cr%C3%A9ation,_petit_sac_en_pagne_Wax.jpg",
  },
  {
    src: "/photos/marche-hedzranawoe.webp",
    w: 440,
    h: 440,
    fr: "Marché de Hédzranawoé, Lomé",
    en: "Hédzranawoé market, Lomé",
    author: "Akouete",
    page: "https://commons.wikimedia.org/wiki/File:March%C3%A9_de_H%C3%A9dzranawo%C3%A9_%C3%A0_Lom%C3%A9_(Togo)_06.jpg",
  },
  {
    src: "/photos/artisanat-lome.webp",
    w: 440,
    h: 550,
    fr: "Artisanat, Lomé",
    en: "Crafts, Lomé",
    author: "Step may",
    page: "https://commons.wikimedia.org/wiki/File:Cr%C3%A9ation,_Objets_d%27art,_%C3%A0_Lom%C3%A9.jpg",
  },
];

const STEPS = [
  { fr: "Tu choisis : présentiel ou à distance.", en: "You choose: in person or remote." },
  { fr: "Tu choisis ton jour, puis ton heure.", en: "You pick your day, then your time." },
  { fr: "Tu choisis ton package.", en: "You pick your package." },
  { fr: "Tu dis quel business tu fais. C'est réservé.", en: "You tell us your business. It's booked." },
];

export default function Home() {
  return (
    <>
      {/* ---------- Dès l'ouverture : les deux choix ---------- */}
      <section className="wall overflow-hidden">
        <div className="shell grid gap-6 pb-10 pt-6 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-10 md:pb-16 md:pt-12">
          {/* Le mur du studio : l'Afrique lumineuse et le logo. */}
          <div className="relative mx-auto w-[min(54vw,12.5rem)] md:order-2 md:w-full md:max-w-[27rem]" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/afrique-lumiere.webp" alt="" width={746} height={900} className="w-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ocd-live-grand.webp"
              alt=""
              width={536}
              height={319}
              className="absolute left-[29%] top-[25%] w-[42%]"
            />
          </div>

          <div>
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--ink-soft)]">
              <span className="live-badge">LIVE</span>
              <T fr="Sur House of Challenge, dès le 1er décembre" en="On House of Challenge, from 1 December" />
            </p>
            <h1 className="display t-hero mt-3">
              <T
                fr={
                  <>
                    Tu veux faire ton live <span className="tt">où&nbsp;?</span>
                  </>
                }
                en={
                  <>
                    Where do you want to <span className="tt">go live?</span>
                  </>
                }
              />
            </h1>

            <div className="mt-5 grid gap-3">
              <Link href="/reserver?format=presentiel" className="door">
                <span>
                  <span className="display t-3 block">
                    <T fr="En présentiel" en="In person" />
                  </span>
                  <span className="text-[var(--ink-soft)]">
                    <T fr="Au studio OCD, à Lomé (Togo)" en="At the OCD studio, in Lomé (Togo)" />
                  </span>
                </span>
                <span className="door-arrow" aria-hidden>
                  →
                </span>
              </Link>
              <Link href="/reserver?format=distance" className="door">
                <span>
                  <span className="display t-3 block">
                    <T fr="À distance" en="Remote" />
                  </span>
                  <span className="text-[var(--ink-soft)]">
                    <T fr="Partout en Afrique et dans le monde" en="Anywhere in Africa and the world" />
                  </span>
                </span>
                <span className="door-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </div>

            <p className="mt-5 text-[0.97rem] text-[var(--ink-soft)]">
              <T fr="1 h 30 de live, à partir de " en="1.5 hours live, from " />
              <Price amount={PACKAGES[0].priceFcfa} className="font-bold text-[var(--ink)]" />
              <T fr=". Tu passes sur le compte TikTok House of Challenge." en=". You go live on the House of Challenge TikTok account." />
            </p>
          </div>
        </div>
      </section>

      {/* ---------- L'idée, en une phrase ---------- */}
      <section className="shell sec">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14">
          <div>
            <p className="kicker">
              <T fr="Le marketing avant la vente" en="Marketing before sales" />
            </p>
            <h2 className="display t-2 mt-2">
              <T
                fr="Place ton produit, ton numéro et ton adresse devant le public."
                en="Put your product, your number and your address in front of the crowd."
              />
            </h2>
            <p className="lead mt-4">
              <T
                fr="Tu peux tout vendre : nourriture, mode, beauté, téléphones, services. Une régie dirige le live. Ceux qui ont besoin de toi savent où te trouver."
                en="You can sell anything: food, fashion, beauty, phones, services. A control room runs the live. People who need you know where to find you."
              />
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {PHOTOS.map((photo) => (
              <figure key={photo.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.fr}
                  width={photo.w}
                  height={photo.h}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <figcaption className="mt-1.5 text-[0.65rem] leading-tight text-[var(--muted)]">
                  <a href={photo.page} target="_blank" rel="noopener noreferrer" className="underline">
                    {photo.author}
                  </a>
                  , CC BY-SA 4.0
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Les étapes ---------- */}
      <section className="wall">
        <div className="shell sec">
          <h2 className="display t-2">
            <T fr="Réserver prend deux minutes." en="Booking takes two minutes." />
          </h2>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.fr} className="flex items-start gap-3">
                <span className="step-num shrink-0">{index + 1}</span>
                <span className="pt-1.5 font-semibold">
                  <T fr={step.fr} en={step.en} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Les 6 packages ---------- */}
      <section id="packages" className="shell sec scroll-mt-16">
        <p className="kicker">
          <T fr="Les packages" en="Packages" />
        </p>
        <h2 className="display t-2 mt-2">
          <T fr="Plus tu restes en live, moins tu paies l'heure." en="The longer you stay live, the less you pay per hour." />
        </h2>

        <div className="mt-8">
          {PACKAGES.map((pack) => (
            <div key={pack.id} className="price-row">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="display t-3">
                  <T fr={pack.name.fr} en={pack.name.en} />
                </h3>
                {pack.featured ? (
                  <span className="tag tag-main">
                    <T fr="Promo" en="Deal" />
                  </span>
                ) : null}
              </div>
              <Price amount={pack.priceFcfa} className="display t-3 text-right md:order-3" />
              <p className="col-span-2 text-[var(--ink-soft)] md:order-2 md:col-span-1">
                <span className="font-bold text-[var(--ink)]">
                  {pack.lives > 1 ? `${pack.lives} × ${durationLabel(pack.slots)}` : durationLabel(pack.slots)}
                </span>
                {" · "}
                <T fr={pack.summary.fr} en={pack.summary.en} />
              </p>
            </div>
          ))}
        </div>
        <Link href="/reserver" className="btn btn-primary mt-8 w-full sm:w-auto">
          <T fr="Réserver mon live" en="Book my live" />
        </Link>
      </section>

      {/* ---------- Ce que le vendeur reçoit ---------- */}
      <section className="wall">
        <div className="shell sec grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="relative mx-auto w-full max-w-[17rem] md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/affiche/exemple"
              alt=""
              width={1080}
              height={1350}
              loading="lazy"
              className="tilt-l w-full rounded-2xl shadow-[0_24px_50px_-28px_rgba(22,24,35,0.55)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/carte/exemple"
              alt=""
              width={1080}
              height={680}
              loading="lazy"
              className="tilt-r absolute -bottom-8 -right-3 w-[64%] rounded-xl shadow-[0_18px_36px_-18px_rgba(22,24,35,0.6)] sm:-right-10"
            />
          </div>
          <div className="pt-4 md:pt-0">
            <p className="kicker">
              <T fr="Avec chaque réservation" en="With every booking" />
            </p>
            <h2 className="display t-2 mt-2">
              <T fr="Ton affiche et ta carte OCD." en="Your poster and your OCD card." />
            </h2>
            <p className="lead mt-4">
              <T
                fr="Une affiche à ton nom, avec ta date et ton heure, à mettre en statut WhatsApp et sur TikTok. Et une carte de membre avec ton numéro d'OCD."
                en="A poster with your name, date and time, to post as a WhatsApp status and on TikTok. And a member card with your OCD number."
              />
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Programme ---------- */}
      <section className="shell sec">
        <h2 className="display t-2 mb-6">
          <T fr="Les prochains lives" en="Upcoming lives" />
        </h2>
        <Agenda />

        {/* EMPLACEMENT RÉSERVÉ AUX VRAIS AVIS.
            Après les premiers lives, mettre ici les avis réels des vendeurs
            (nom, business, ville). Ne jamais inventer d'avis ni de chiffres. */}
        <p className="mt-10 text-[0.95rem] text-[var(--muted)]">
          <T
            fr="Les avis des vendeurs seront publiés ici après les premiers lives du 1er décembre. On n'invente ni avis, ni chiffres."
            en="Seller reviews will be published here after the first lives on 1 December. We don't make up reviews or numbers."
          />
        </p>
      </section>
    </>
  );
}
