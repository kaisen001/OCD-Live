import Link from "next/link";
import { Agenda } from "@/components/agenda";
import { CurrencyBanner } from "@/components/currency-banner";
import { Price } from "@/components/price";
import { T } from "@/components/t";
import { durationLabel, PACKAGES } from "@/lib/packages";
import type { MessageKey } from "@/lib/i18n";
import type { PackageId } from "@/lib/types";

/** Photos sous licence libre (Wikimedia Commons). Crédit obligatoire : ne pas retirer. */
const PHOTOS: {
  src: string;
  w: number;
  h: number;
  altKey: MessageKey;
  author: string;
  page: string;
}[] = [
  {
    src: "/photos/sacs-wax.webp",
    w: 440,
    h: 550,
    altKey: "home.photo1",
    author: "Step may",
    page: "https://commons.wikimedia.org/wiki/File:Cr%C3%A9ation,_petit_sac_en_pagne_Wax.jpg",
  },
  {
    src: "/photos/marche-hedzranawoe.webp",
    w: 440,
    h: 440,
    altKey: "home.photo2",
    author: "Akouete",
    page: "https://commons.wikimedia.org/wiki/File:March%C3%A9_de_H%C3%A9dzranawo%C3%A9_%C3%A0_Lom%C3%A9_(Togo)_06.jpg",
  },
  {
    src: "/photos/artisanat-lome.webp",
    w: 440,
    h: 550,
    altKey: "home.photo3",
    author: "Step may",
    page: "https://commons.wikimedia.org/wiki/File:Cr%C3%A9ation,_Objets_d%27art,_%C3%A0_Lom%C3%A9.jpg",
  },
];

const STEP_KEYS: MessageKey[] = ["home.step1", "home.step2", "home.step3", "home.step4"];

const PACK_NAME: Record<PackageId, MessageKey> = {
  simple: "pack.simple.name",
  plus: "pack.plus.name",
  demi: "pack.demi.name",
  journee: "pack.journee.name",
  vedette: "pack.vedette.name",
  mois: "pack.mois.name",
};

const PACK_SUMMARY: Record<PackageId, MessageKey> = {
  simple: "pack.simple.summary",
  plus: "pack.plus.summary",
  demi: "pack.demi.summary",
  journee: "pack.journee.summary",
  vedette: "pack.vedette.summary",
  mois: "pack.mois.summary",
};

export default function Home() {
  return (
    <>
      <div className="wall">
        <CurrencyBanner />
      </div>

      <section className="wall overflow-hidden">
        <div className="mx-auto flex max-w-[76rem]">
          <div className="motif-rail" aria-hidden />
          <div className="shell min-w-0 flex-1 grid gap-6 pb-10 pt-4 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-10 md:pb-16 md:pt-8">
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
                <T k="home.badge" />
              </p>
              <h1 className="display t-hero mt-3">
                <T k="home.heroBefore" /> <span className="tt"><T k="home.heroAccent" /></span>
              </h1>

              <div className="mt-5 grid gap-3">
                <Link href="/reserver?format=presentiel" className="door">
                  <span>
                    <span className="display t-3 block">
                      <T k="home.inPerson" />
                    </span>
                    <span className="text-[var(--ink-soft)]">
                      <T k="home.inPersonSub" />
                    </span>
                  </span>
                  <span className="door-arrow" aria-hidden>
                    →
                  </span>
                </Link>
                <Link href="/reserver?format=distance" className="door">
                  <span>
                    <span className="display t-3 block">
                      <T k="home.remote" />
                    </span>
                    <span className="text-[var(--ink-soft)]">
                      <T k="home.remoteSub" />
                    </span>
                  </span>
                  <span className="door-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </div>

              <p className="mt-5 text-[0.97rem] text-[var(--ink-soft)]">
                <T k="home.priceLead" />
                <Price amount={PACKAGES[0].priceFcfa} className="font-bold text-[var(--ink)]" />
                <T k="home.priceTail" />
              </p>
            </div>
          </div>
          <div className="motif-rail" aria-hidden />
        </div>
      </section>

      <div className="band-section" aria-hidden />

      <section className="shell sec">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14">
          <div>
            <p className="kicker">
              <T k="home.ideaKicker" />
            </p>
            <h2 className="display t-2 mt-2">
              <T k="home.ideaTitle" />
            </h2>
            <p className="lead mt-4">
              <T k="home.ideaBody" />
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {PHOTOS.map((photo) => (
              <figure key={photo.src}>
                <div className="frame-wax">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt=""
                    width={photo.w}
                    height={photo.h}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-1.5 text-[0.65rem] leading-tight text-[var(--muted)]">
                  <T k={photo.altKey} />
                  {" · "}
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

      <div className="band-section" aria-hidden />

      <section className="savanna">
        <div className="mx-auto flex max-w-[76rem]">
          <div className="motif-rail" aria-hidden />
          <div className="shell min-w-0 flex-1 sec">
            <p className="kicker">
              <T k="home.savannaKicker" />
            </p>
            <h2 className="display t-2 mt-2 max-w-2xl">
              <T k="home.savannaTitle" />
            </h2>
            <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEP_KEYS.map((key, index) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="step-num shrink-0">{index + 1}</span>
                  <span className="pt-1.5 font-semibold text-white/95">
                    <T k={key} />
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/reserver" className="btn btn-primary mt-10 w-full sm:w-auto">
              <T k="home.bookCta" />
            </Link>
          </div>
          <div className="motif-rail" aria-hidden />
        </div>
      </section>

      <div className="band-section" aria-hidden />

      <section id="packages" className="shell sec scroll-mt-16">
        <p className="kicker">
          <T k="home.packagesKicker" />
        </p>
        <h2 className="display t-2 mt-2">
          <T k="home.packagesTitle" />
        </h2>

        <div className="mt-8">
          {PACKAGES.map((pack) => (
            <div key={pack.id} className="price-row">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="display t-3">
                  <T k={PACK_NAME[pack.id]} />
                </h3>
                {pack.featured ? (
                  <span className="tag tag-main">
                    <T k="home.promo" />
                  </span>
                ) : null}
              </div>
              <Price amount={pack.priceFcfa} className="display t-3 text-right md:order-3" />
              <p className="col-span-2 text-[var(--ink-soft)] md:order-2 md:col-span-1">
                <span className="font-bold text-[var(--ink)]">
                  {pack.lives > 1 ? `${pack.lives} × ${durationLabel(pack.slots)}` : durationLabel(pack.slots)}
                </span>
                {" · "}
                <T k={PACK_SUMMARY[pack.id]} />
              </p>
            </div>
          ))}
        </div>
        <Link href="/reserver" className="btn btn-primary mt-8 w-full sm:w-auto">
          <T k="home.bookCta" />
        </Link>
      </section>

      <div className="band-section" aria-hidden />

      <section className="wall">
        <div className="mx-auto flex max-w-[76rem]">
          <div className="motif-rail" aria-hidden />
          <div className="shell min-w-0 flex-1 sec grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
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
                <T k="home.perkKicker" />
              </p>
              <h2 className="display t-2 mt-2">
                <T k="home.perkTitle" />
              </h2>
              <p className="lead mt-4">
                <T k="home.perkBody" />
              </p>
            </div>
          </div>
          <div className="motif-rail" aria-hidden />
        </div>
      </section>

      <section className="shell sec">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="display t-2">
            <T k="home.agendaTitle" />
          </h2>
          <Link href="/lives" className="link font-bold">
            <T k="nav.lives" />
          </Link>
        </div>
        <Agenda />
        <p className="mt-10 text-[0.95rem] text-[var(--muted)]">
          <T k="home.reviews" />
        </p>
      </section>
    </>
  );
}
