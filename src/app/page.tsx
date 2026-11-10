import Link from "next/link";
import { Agenda } from "@/components/agenda";
import { Price } from "@/components/price";
import { T } from "@/components/t";
import { PACKAGES, pricePerLive } from "@/lib/packages";

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
      {/* ---------- Ouverture ---------- */}
      <section className="relative overflow-hidden">
        <div className="shell grid gap-10 pb-14 pt-10 md:grid-cols-[1.25fr_0.75fr] md:items-end md:gap-6 md:pb-24 md:pt-20">
          <div>
            <p className="kicker">
              <T
                fr="TikTok House of Challenge · dès le 1er décembre"
                en="House of Challenge TikTok · from 1 December"
              />
            </p>
            <h1 className="display t-hero mt-5">
              <T
                fr={
                  <>
                    Pas d&apos;abonnés&nbsp;? Vends sur un compte qui a déjà{" "}
                    <span className="text-[var(--main)]">le public.</span>
                  </>
                }
                en={
                  <>
                    No followers? Sell on an account that already has{" "}
                    <span className="text-[var(--main)]">the crowd.</span>
                  </>
                }
              />
            </h1>
            <p className="lead mt-6">
              <T
                fr="Tu réserves un créneau de 1 h 30. Tu montres tes produits en direct sur House of Challenge. Ton numéro WhatsApp reste à l'écran pour prendre les commandes."
                en="You book a 1.5-hour slot. You show your products live on House of Challenge. Your WhatsApp number stays on screen to take orders."
              />
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/reserver" className="btn btn-primary">
                <T fr="Réserver mon live" en="Book my live" />
              </Link>
              <Link href="#prix" className="btn btn-plain">
                <T fr="Voir les prix" en="See prices" />
              </Link>
            </div>
          </div>

          {/* Le ticket : l'essentiel en trois lignes, posé de travers comme une étiquette de marché. */}
          <aside className="tilt-r relative mx-auto w-full max-w-[19rem] md:mb-6 md:mr-10">
            <div className="panel overflow-hidden shadow-[8px_8px_0_var(--ink)]">
              <div className="band" aria-hidden />
              <div className="bg-[var(--accent)] px-6 py-5">
                <p className="text-sm font-bold uppercase tracking-wider">
                  <T fr="Un live" en="One live" />
                </p>
                <p className="display mt-1 text-[3.4rem]">1 h 30</p>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                  <T fr="À partir de" en="From" />
                </p>
                <Price amount={PACKAGES[0].priceFcfa} stack className="display block text-[2.1rem]" />
                <p className="mt-3 border-t-2 border-dashed border-[var(--line)] pt-3 text-[0.95rem] font-semibold">
                  <T fr="Premier live : mardi 1er décembre 2026" en="First live: Tuesday 1 December 2026" />
                </p>
              </div>
            </div>
          </aside>
        </div>
        <div className="band band-tall" aria-hidden />
      </section>

      {/* ---------- Les quatre étapes ---------- */}
      <section className="shell sec">
        <div className="max-w-2xl">
          <p className="kicker">
            <T fr="Comment ça se passe" en="How it goes" />
          </p>
          <h2 className="display t-2 mt-4">
            <T fr="Quatre choix. Deux minutes." en="Four choices. Two minutes." />
          </h2>
        </div>
        <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.fr[0]} className={index % 2 === 1 ? "lg:mt-14" : ""}>
              <span className="step-num">{index + 1}</span>
              <h3 className="display t-3 mt-4">
                <T fr={step.fr[0]} en={step.en[0]} />
              </h3>
              <p className="mt-2 text-[var(--ink-soft)]">
                <T fr={step.fr[1]} en={step.en[1]} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Deux façons de passer en live ---------- */}
      <section className="shell pb-16 md:pb-24">
        <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <article className="marks rounded-lg bg-[var(--main)] p-7 text-[var(--white)] md:p-10">
            <p className="kicker on-main">
              <T fr="Au studio · Lomé, Togo" en="At the studio · Lomé, Togo" />
            </p>
            <h2 className="display t-2 mt-4">
              <T fr="Tu viens avec tes produits." en="You come with your products." />
            </h2>
            <p className="mt-4 max-w-md text-lg">
              <T
                fr="La régie dirige le live. Toi, tu présentes et tu vends."
                en="The control room runs the live. You present and you sell."
              />
            </p>
            <Link href="/reserver?format=presentiel" className="btn btn-accent mt-7">
              <T fr="Réserver au studio" en="Book the studio" />
            </Link>
          </article>
          <article className="panel p-7 md:mt-12 md:p-9">
            <p className="kicker">
              <T fr="À distance · partout" en="Remote · anywhere" />
            </p>
            <h2 className="display t-3 mt-4 !text-[clamp(1.6rem,3.4vw,2.2rem)]">
              <T fr="Tu restes dans ta boutique." en="You stay in your shop." />
            </h2>
            <p className="mt-3 text-[var(--ink-soft)]">
              <T
                fr="Une assistante OCD te suit avant et pendant le live. Il te faut un téléphone et une bonne connexion."
                en="An OCD assistant is with you before and during the live. You need a phone and a good connection."
              />
            </p>
            <Link href="/reserver?format=distance" className="btn btn-plain mt-6">
              <T fr="Réserver à distance" en="Book remote" />
            </Link>
          </article>
        </div>
      </section>

      {/* ---------- Les prix ---------- */}
      <section id="prix" className="scroll-mt-20 bg-[var(--paper-2)]">
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
              <div key={pack.id} className="price-row">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="display t-3">
                    <T fr={pack.name.fr} en={pack.name.en} />
                  </h3>
                  {pack.featured ? (
                    <span className="tag tag-main">
                      <T fr="Le pack de 4" en="The pack of 4" />
                    </span>
                  ) : null}
                </div>
                <div className="text-right md:order-3">
                  <Price amount={pack.priceFcfa} className="display block text-2xl md:text-[1.9rem]" />
                  {pack.lives > 1 ? (
                    <p className="text-sm font-bold text-[var(--main)]">
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
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="relative mx-auto w-full max-w-[20rem] md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/affiche/exemple"
              alt=""
              width={1080}
              height={1350}
              loading="lazy"
              className="tilt-l w-full rounded-md border-2 border-[var(--ink)] shadow-[8px_8px_0_var(--ink)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/carte/exemple"
              alt=""
              width={1080}
              height={680}
              loading="lazy"
              className="tilt-r absolute -bottom-8 -right-3 w-[62%] rounded-md border-2 border-[var(--ink)] shadow-[6px_6px_0_var(--accent)] sm:-right-10"
            />
          </div>
          <div className="pt-6 md:pt-0">
            <p className="kicker">
              <T fr="Inclus avec chaque réservation" en="Included with every booking" />
            </p>
            <h2 className="display t-2 mt-4">
              <T fr="Ton affiche est prête avant ton live." en="Your poster is ready before your live." />
            </h2>
            <ul className="mt-6 grid gap-5">
              <li>
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
              <li>
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
              <li>
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
      <section className="shell pb-16 md:pb-24">
        <p className="kicker">
          <T fr="Le programme" en="The schedule" />
        </p>
        <h2 className="display t-2 mt-4 mb-8">
          <T fr="Les prochains lives." en="Upcoming lives." />
        </h2>
        <Agenda />
      </section>

      {/* ---------- La parole de Bovann ---------- */}
      <section className="on-dark bg-[var(--ink)] text-[var(--paper)]">
        <div className="shell sec grid gap-8 md:grid-cols-[auto_1fr]">
          <div className="band-vertical hidden min-h-56 rounded md:block" aria-hidden />
          <figure>
            <blockquote className="display text-[clamp(1.8rem,5vw,3.2rem)] leading-[1.05]">
              <T
                fr="« Aujourd'hui, les clients ne se baladent plus dans la rue. Ton client se balade sur TikTok. Quand tu entres, tu présentes et puis il achète. »"
                en="“Today, customers no longer walk down the street. Your customer walks around TikTok. You come in, you present, and then they buy.”"
              />
            </blockquote>
            <figcaption className="mt-6 text-[0.95rem] opacity-80">
              <span className="font-bold text-[var(--accent)]">Bovann</span>
              <T
                fr=", créateur de House of Challenge. Propos rapportés par Laura Dave Media, 6 novembre 2026."
                en=", creator of House of Challenge. As reported by Laura Dave Media, 6 November 2026."
              />
            </figcaption>
            <Link href="/histoire" className="link mt-6 inline-block !decoration-[var(--accent)]">
              <T fr="Pourquoi « Les Opportunités C'est Dehors »" en="Why “Opportunities are out there”" />
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
        <div className="max-w-2xl border-l-[6px] border-[var(--accent)] pl-5 md:pl-7">
          <p className="kicker">
            <T fr="Avis des vendeurs" en="Seller reviews" />
          </p>
          <p className="display t-3 mt-3">
            <T
              fr="Les premiers lives ont lieu le 1er décembre. Les avis des vendeurs seront publiés ici après."
              en="The first lives take place on 1 December. Seller reviews will be published here afterwards."
            />
          </p>
          <p className="mt-2 text-[var(--ink-soft)]">
            <T fr="On n'invente ni avis, ni chiffres." en="We don't make up reviews or numbers." />
          </p>
        </div>
      </section>

      {/* ---------- Dernier appel ---------- */}
      <section className="shell pb-16 md:pb-24">
        <div className="marks rounded-lg bg-[var(--accent)] p-7 md:flex md:items-center md:justify-between md:gap-8 md:p-12">
          <h2 className="display t-2 max-w-xl">
            <T fr="Les opportunités, c'est dehors. Ton créneau aussi." en="Opportunities are out there. So is your slot." />
          </h2>
          <Link href="/reserver" className="btn btn-primary mt-6 w-full shrink-0 md:mt-0 md:w-auto">
            <T fr="Réserver mon live" en="Book my live" />
          </Link>
        </div>
      </section>
    </>
  );
}
