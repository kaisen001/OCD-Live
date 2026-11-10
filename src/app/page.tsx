import Link from "next/link";
import { Agenda } from "@/components/agenda";
import { Price } from "@/components/price";
import { T } from "@/components/t";
import { PACKAGES, pricePerLive } from "@/lib/packages";

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

const TICKER = [
  { fr: "Mode", en: "Fashion" },
  { fr: "Beauté", en: "Beauty" },
  { fr: "Alimentation", en: "Food" },
  { fr: "Téléphones", en: "Phones" },
  { fr: "Artisanat", en: "Crafts" },
  { fr: "Maison", en: "Home" },
  { fr: "Agriculture", en: "Farming" },
  { fr: "Services", en: "Services" },
  { fr: "Formation", en: "Training" },
];

const STEPS = [
  {
    fr: ["Studio ou à distance", "Tu viens au studio à Lomé, ou tu restes chez toi."],
    en: ["Studio or remote", "Come to the studio in Lomé, or stay where you are."],
  },
  {
    fr: ["Ta date, ton heure", "Le calendrier ouvre le 1er décembre. Tu vois les créneaux libres."],
    en: ["Your date, your time", "The calendar opens on 1 December. You see the free slots."],
  },
  {
    fr: ["Ton pack", "Un live, ou plusieurs. Plus tu en prends, moins le live coûte."],
    en: ["Your pack", "One live, or several. The more you take, the less each live costs."],
  },
  {
    fr: ["Ton business", "Tu dis ce que tu vends. L'équipe reçoit ta demande tout de suite."],
    en: ["Your business", "Tell us what you sell. The team gets your request right away."],
  },
];

export default function Home() {
  return (
    <>
      {/* ---------- Ouverture : la scène, le soir ---------- */}
      <section className="dark relative overflow-hidden">
        <div className="shell grid gap-12 pb-16 pt-10 md:grid-cols-[1.35fr_0.65fr] md:items-center md:gap-8 md:pb-24 md:pt-16">
          <div>
            <p className="flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
              <span className="live-dot" aria-hidden />
              <T
                fr="En direct sur House of Challenge · dès le 1er décembre"
                en="Live on House of Challenge · from 1 December"
              />
            </p>
            <h1 className="display t-hero mt-6">
              <T
                fr={
                  <>
                    Pas d&apos;abonnés&nbsp;?
                    <br />
                    <span className="text-[var(--main)]">Prends la scène.</span>
                  </>
                }
                en={
                  <>
                    No followers?
                    <br />
                    <span className="text-[var(--main)]">Take the stage.</span>
                  </>
                }
              />
            </h1>
            <p className="lead mt-7">
              <T
                fr="Tu réserves 1 h 30 sur le compte TikTok House of Challenge. Tu montres tes produits en direct. Ton numéro WhatsApp reste à l'écran pour prendre les commandes."
                en="You book 1.5 hours on the House of Challenge TikTok account. You show your products live. Your WhatsApp number stays on screen to take orders."
              />
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/reserver" className="btn btn-primary">
                <T fr="Réserver mon live" en="Book my live" />
              </Link>
              <Link href="#prix" className="btn btn-plain">
                <T fr="Voir les prix" en="See prices" />
              </Link>
            </div>
          </div>

          {/* Illustration : à quoi ressemble ton live. Aucun chiffre inventé. */}
          <figure className="mx-auto w-[15.5rem] md:w-full md:max-w-[17rem] md:justify-self-end">
            <div className="phone tilt-r">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/sacs-wax.webp" alt="" width={440} height={550} />
              <div className="phone-ui">
                <div className="flex items-center justify-between">
                  <span className="chip">@houseofchallenge</span>
                  <span className="chip chip-live">LIVE</span>
                </div>
                <div className="grid gap-2">
                  <span className="chip">
                    <T fr="Ton produit · ton prix" en="Your product · your price" />
                  </span>
                  <span className="chip bg-[var(--paper)]! text-[var(--ink)]!">
                    <T fr="WhatsApp : ton numéro" en="WhatsApp: your number" />
                  </span>
                </div>
              </div>
            </div>
            <figcaption className="mt-5 text-center text-xs text-[var(--muted)]">
              <T fr="Illustration. Photo : " en="Illustration. Photo: " />
              <a href={PHOTOS[0].page} target="_blank" rel="noopener noreferrer" className="underline">
                {PHOTOS[0].author}
              </a>
              , CC BY-SA 4.0
            </figcaption>
          </figure>
        </div>

        {/* Les trois faits à retenir */}
        <div className="border-t border-[var(--line)]">
          <dl className="shell grid grid-cols-[auto_1fr_auto] divide-x divide-[var(--line)] sm:grid-cols-3">
            <div className="py-6 pr-4">
              <dt className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--muted)]">
                <T fr="Un live" en="One live" />
              </dt>
              <dd className="display mt-1 text-[clamp(1.25rem,5.2vw,3.2rem)]">1 h 30</dd>
            </div>
            <div className="px-4 py-6 sm:px-6">
              <dt className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--muted)]">
                <T fr="À partir de" en="From" />
              </dt>
              <dd className="display mt-1 text-[clamp(1.25rem,5.2vw,3.2rem)] text-[var(--main)]">
                <Price amount={PACKAGES[0].priceFcfa} stack />
              </dd>
            </div>
            <div className="py-6 pl-4 sm:pl-6">
              <dt className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--muted)]">
                <T fr="Premier live" en="First live" />
              </dt>
              <dd className="display mt-1 text-[clamp(1.25rem,5.2vw,3.2rem)]">
                <T fr="1er déc." en="1 Dec." />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------- Bandeau défilant ---------- */}
      <div className="ticker" aria-hidden>
        <div>
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, index) => (
            <span key={index} className="display text-xl">
              <T fr={item.fr} en={item.en} />
              <span className="ml-10 opacity-50">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Pour qui ---------- */}
      <section className="shell sec">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
          <div className="grid grid-cols-[1.15fr_0.85fr] items-end gap-3 sm:gap-4">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[1].src}
                alt={PHOTOS[1].fr}
                width={PHOTOS[1].w}
                height={PHOTOS[1].h}
                loading="lazy"
                className="w-full rounded-[1.4rem] object-cover"
              />
              <figcaption className="mt-2 text-[0.7rem] leading-tight text-[var(--muted)]">
                <T fr={PHOTOS[1].fr} en={PHOTOS[1].en} /> ·{" "}
                <a href={PHOTOS[1].page} target="_blank" rel="noopener noreferrer" className="underline">
                  {PHOTOS[1].author}
                </a>
                , CC BY-SA 4.0
              </figcaption>
            </figure>
            <figure className="mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[2].src}
                alt={PHOTOS[2].fr}
                width={PHOTOS[2].w}
                height={PHOTOS[2].h}
                loading="lazy"
                className="w-full rounded-[1.4rem] object-cover"
              />
              <figcaption className="mt-2 text-[0.7rem] leading-tight text-[var(--muted)]">
                <T fr={PHOTOS[2].fr} en={PHOTOS[2].en} /> ·{" "}
                <a href={PHOTOS[2].page} target="_blank" rel="noopener noreferrer" className="underline">
                  {PHOTOS[2].author}
                </a>
                , CC BY-SA 4.0
              </figcaption>
            </figure>
          </div>
          <div>
            <p className="kicker">
              <T fr="Pour qui" en="Who it's for" />
            </p>
            <h2 className="display t-2 mt-4">
              <T fr="Tu vends déjà. Il te manque le public." en="You already sell. You just need the crowd." />
            </h2>
            <p className="lead mt-5">
              <T
                fr="Si tu as un produit et un prix, tu peux passer en live. Pas besoin d'avoir un compte TikTok connu : tu passes sur le nôtre."
                en="If you have a product and a price, you can go live. You don't need a well-known TikTok account: you go live on ours."
              />
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Les quatre étapes ---------- */}
      <section className="bg-[var(--paper-2)]">
        <div className="shell sec">
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <div>
              <p className="kicker">
                <T fr="Comment ça se passe" en="How it goes" />
              </p>
              <h2 className="display t-2 mt-4">
                <T fr="Quatre choix. Deux minutes." en="Four choices. Two minutes." />
              </h2>
            </div>
            <Link href="/reserver" className="btn btn-accent mt-6 md:mt-0">
              <T fr="Commencer" en="Start" />
            </Link>
          </div>
          <ol className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.fr[0]} className={index % 2 === 1 ? "lg:mt-16" : ""}>
                <span className="step-num">{index + 1}</span>
                <h3 className="display t-3 mt-5">
                  <T fr={step.fr[0]} en={step.en[0]} />
                </h3>
                <p className="mt-2 text-[var(--ink-soft)]">
                  <T fr={step.fr[1]} en={step.en[1]} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Deux façons de passer en live ---------- */}
      <section className="shell sec">
        <div className="grid gap-5 md:grid-cols-[1.25fr_1fr]">
          <article className="dark relative overflow-hidden rounded-[1.75rem] p-7 md:p-11">
            <div className="band-vertical absolute inset-y-0 right-0 hidden sm:block" aria-hidden />
            <p className="kicker">
              <T fr="Au studio · Lomé, Togo" en="At the studio · Lomé, Togo" />
            </p>
            <h2 className="display t-2 mt-4 max-w-md">
              <T fr="Tu viens avec tes produits." en="You come with your products." />
            </h2>
            <p className="mt-4 max-w-sm text-lg text-[var(--ink-soft)]">
              <T
                fr="La régie dirige le live. Toi, tu présentes et tu vends."
                en="The control room runs the live. You present and you sell."
              />
            </p>
            <Link href="/reserver?format=presentiel" className="btn btn-primary mt-8">
              <T fr="Réserver au studio" en="Book the studio" />
            </Link>
          </article>
          <article className="rounded-[1.75rem] bg-[var(--main)] p-7 md:mt-14 md:p-10">
            <p className="kicker text-[var(--ink)]!">
              <T fr="À distance · partout" en="Remote · anywhere" />
            </p>
            <h2 className="display t-2 mt-4 !text-[clamp(2rem,4.6vw,3rem)]">
              <T fr="Tu restes dans ta boutique." en="You stay in your shop." />
            </h2>
            <p className="mt-4 text-lg">
              <T
                fr="Une assistante OCD te suit avant et pendant le live. Il te faut un téléphone et une bonne connexion."
                en="An OCD assistant is with you before and during the live. You need a phone and a good connection."
              />
            </p>
            <Link href="/reserver?format=distance" className="btn btn-accent mt-8">
              <T fr="Réserver à distance" en="Book remote" />
            </Link>
          </article>
        </div>
      </section>

      {/* ---------- Les prix ---------- */}
      <section id="prix" className="dark scroll-mt-16">
        <div className="shell sec">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="kicker">
                <T fr="Les prix" en="Prices" />
              </p>
              <h2 className="display t-2 mt-4">
                <T fr="Plus tu passes, moins tu paies." en="The more you go live, the less you pay." />
              </h2>
            </div>
            <p className="max-w-xs text-[var(--ink-soft)]">
              <T
                fr="Chaque live dure 1 h 30. Les prix sont en francs CFA."
                en="Every live lasts 1.5 hours. Prices are in CFA francs."
              />
            </p>
          </div>

          <div className="mt-10">
            {PACKAGES.map((pack) => (
              <div key={pack.id} className="price-row" data-featured={pack.featured ? "true" : undefined}>
                <div>
                  <h3 className="display t-3">
                    <T fr={pack.name.fr} en={pack.name.en} />
                  </h3>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                    {pack.lives} live{pack.lives > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right md:order-3">
                  <Price amount={pack.priceFcfa} className="display block text-[1.7rem] md:text-[2.1rem]" />
                  {pack.lives > 1 ? (
                    <p className="text-sm font-bold text-[var(--main-deep)]">
                      <T fr="soit " en="that's " />
                      <Price amount={pricePerLive(pack)} approx={false} />
                      <T fr=" le live" en=" per live" />
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2 md:order-2 md:col-span-1">
                  <p className="font-semibold">
                    <T fr={pack.summary.fr} en={pack.summary.en} />
                  </p>
                  <ul className="mt-1 text-[0.95rem] text-[var(--ink-soft)]">
                    {pack.includes.map((line) => (
                      <li key={line.fr}>
                        <T fr={line.fr} en={line.en} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <Link href="/reserver" className="btn btn-primary mt-10 w-full sm:w-auto">
            <T fr="Choisir ma date" en="Pick my date" />
          </Link>
        </div>
      </section>

      {/* ---------- Ce que le vendeur reçoit ---------- */}
      <section className="shell sec">
        <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="relative mx-auto w-full max-w-[19rem] md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/affiche/exemple"
              alt=""
              width={1080}
              height={1350}
              loading="lazy"
              className="tilt-l w-full rounded-2xl shadow-[0_30px_60px_-30px_rgba(7,16,25,0.6)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/carte/exemple"
              alt=""
              width={1080}
              height={680}
              loading="lazy"
              className="tilt-r absolute -bottom-9 -right-3 w-[64%] rounded-xl shadow-[0_20px_40px_-18px_rgba(7,16,25,0.7)] sm:-right-10"
            />
          </div>
          <div className="pt-6 md:pt-0">
            <p className="kicker">
              <T fr="Inclus avec chaque réservation" en="Included with every booking" />
            </p>
            <h2 className="display t-2 mt-4">
              <T fr="Ton affiche est prête avant ton live." en="Your poster is ready before your live." />
            </h2>
            <ul className="mt-8 grid gap-6">
              <li className="border-l-[3px] border-[var(--main)] pl-5">
                <p className="display t-3">
                  <T fr="Une affiche à ton nom" en="A poster with your name" />
                </p>
                <p className="mt-1 text-[var(--ink-soft)]">
                  <T
                    fr="Ton business, ta date, ton heure. Tu la mets en statut WhatsApp et sur TikTok pour prévenir tes clients."
                    en="Your business, your date, your time. Post it as a WhatsApp status and on TikTok to tell your customers."
                  />
                </p>
              </li>
              <li className="border-l-[3px] border-[var(--main)] pl-5">
                <p className="display t-3">
                  <T fr="Ta carte de membre OCD" en="Your OCD member card" />
                </p>
                <p className="mt-1 text-[var(--ink-soft)]">
                  <T
                    fr="Chaque vendeur reçoit un numéro. Tu le gardes pour tous tes lives."
                    en="Every seller gets a number. You keep it for all your lives."
                  />
                </p>
              </li>
              <li className="border-l-[3px] border-[var(--main)] pl-5">
                <p className="display t-3">
                  <T fr="Une liste pour te préparer" en="A list to get ready" />
                </p>
                <p className="mt-1 text-[var(--ink-soft)]">
                  <T
                    fr="Ce qu'il faut avoir sous la main le jour du live : produits, prix, numéro de commande."
                    en="What to have at hand on the day: products, prices, order number."
                  />
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Programme ---------- */}
      <section className="shell pb-20 md:pb-28">
        <p className="kicker">
          <T fr="Le programme" en="The schedule" />
        </p>
        <h2 className="display t-2 mb-8 mt-4">
          <T fr="Les prochains lives." en="Upcoming lives." />
        </h2>
        <Agenda />
      </section>

      {/* ---------- La parole de Bovann ---------- */}
      <section className="bg-[var(--main)] text-[var(--ink)]">
        <div className="shell sec">
          <figure className="max-w-4xl">
            <blockquote className="display text-[clamp(2.2rem,7vw,4.6rem)]">
              <T
                fr="« Ton client se balade sur TikTok. Quand tu entres, tu présentes et puis il achète. »"
                en="“Your customer walks around TikTok. You come in, you present, and then they buy.”"
              />
            </blockquote>
            <figcaption className="mt-7 font-semibold">
              Bovann
              <T
                fr=", créateur de House of Challenge. Propos rapportés par Laura Dave Media, 6 novembre 2026."
                en=", creator of House of Challenge. As reported by Laura Dave Media, 6 November 2026."
              />
            </figcaption>
            <Link href="/histoire" className="btn btn-accent mt-8">
              <T fr="Pourquoi « OCD »" en="Why “OCD”" />
            </Link>
          </figure>
        </div>
      </section>

      {/* ---------- Avis ----------
          EMPLACEMENT RÉSERVÉ AUX VRAIS AVIS.
          Après les premiers lives, remplacer ce bloc par les avis réels des vendeurs
          (nom, business, ville, et si possible le nombre de commandes reçues).
          Ne jamais inventer d'avis ni de chiffres. */}
      <section className="shell sec">
        <div className="max-w-2xl">
          <p className="kicker">
            <T fr="Avis des vendeurs" en="Seller reviews" />
          </p>
          <p className="display t-3 mt-4">
            <T
              fr="Les premiers lives ont lieu le 1er décembre. Les avis des vendeurs seront publiés ici après."
              en="The first lives take place on 1 December. Seller reviews will be published here afterwards."
            />
          </p>
          <p className="mt-3 text-[var(--ink-soft)]">
            <T fr="On n'invente ni avis, ni chiffres." en="We don't make up reviews or numbers." />
          </p>
        </div>
      </section>

      {/* ---------- Dernier appel ---------- */}
      <section className="dark">
        <div className="shell sec text-center">
          <h2 className="display t-hero mx-auto max-w-4xl">
            <T
              fr={
                <>
                  Les opportunités, <span className="text-[var(--main)]">c&apos;est dehors.</span>
                </>
              }
              en={
                <>
                  Opportunities are <span className="text-[var(--main)]">out there.</span>
                </>
              }
            />
          </h2>
          <Link href="/reserver" className="btn btn-primary mt-10">
            <T fr="Réserver mon live" en="Book my live" />
          </Link>
        </div>
      </section>
    </>
  );
}
