import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/t";

export const metadata: Metadata = { title: "Pourquoi OCD" };

export default function HistoirePage() {
  return (
    <>
      <section className="wall">
        <div className="shell pb-14 pt-10 md:pb-24 md:pt-20">
        <p className="kicker">
          <T fr="Pourquoi OCD" en="Why OCD" />
        </p>
        <h1 className="display t-hero mt-5 max-w-4xl">
          <T
            fr={
              <>
                Les <span className="text-[var(--main-deep)]">O</span>pportunités{" "}
                <span className="text-[var(--main-deep)]">C</span>&apos;est{" "}
                <span className="text-[var(--main-deep)]">D</span>ehors.
              </>
            }
            en={
              <>
                Opportunities are <span className="text-[var(--main-deep)]">out there.</span>
              </>
            }
          />
        </h1>
        <p className="lead mt-6">
          <T
            fr="OCD, c'est une façon de faire : tu ne restes pas assis à attendre. Tu sors, tu regardes, tu proposes."
            en="OCD is a way of doing things: you don't sit and wait. You go out, you look, you offer."
          />
        </p>
        </div>
      </section>


      <section className="shell sec grid gap-12 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="display t-2">
            <T fr="Le problème du petit vendeur." en="The small seller's problem." />
          </h2>
          <p className="mt-4 text-[var(--ink-soft)]">
            <T
              fr="Tu as un bon produit. Mais sur TikTok, sans abonnés, personne ne voit ton live. Et construire un public prend des mois."
              en="You have a good product. But on TikTok, with no followers, nobody sees your live. And building an audience takes months."
            />
          </p>
          <h2 className="display t-2 mt-10">
            <T fr="Ce que fait OCD Live." en="What OCD Live does." />
          </h2>
          <p className="mt-4 text-[var(--ink-soft)]">
            <T
              fr="On te prête la scène. Pendant 1 h 30, tu vends sur le compte TikTok House of Challenge, créé par Bovann. Tu profites d'un public qui existe déjà."
              en="We lend you the stage. For 1.5 hours you sell on the House of Challenge TikTok account, created by Bovann. You use an audience that already exists."
            />
          </p>
          <Link href="/reserver" className="btn btn-primary mt-8">
            <T fr="Réserver mon live" en="Book my live" />
          </Link>
        </div>

        <div className="grid content-start gap-6">
          <figure className="rounded-[1.5rem] bg-[var(--main-soft)] p-8">
            <blockquote className="display t-2">
              <T fr="« Si tu as 10 abonnés, tu as 10 clients. »" en="“If you have 10 followers, you have 10 customers.”" />
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold">
              <T
                fr="Bovann, propos rapportés par Laura Dave Media, 6 novembre 2026."
                en="Bovann, as reported by Laura Dave Media, 6 November 2026."
              />
            </figcaption>
          </figure>

          {/* EMPLACEMENT RÉSERVÉ : l'histoire de Bovann, racontée par lui, avec ses photos.
              On ne l'écrit pas à sa place. À remplacer dès réception du texte et des images. */}
          <div className="rounded-[1.75rem] border-2 border-dashed border-[var(--line)] p-8">
            <p className="tag tag-ink">
              <T fr="À compléter par l'équipe" en="To be completed by the team" />
            </p>
            <p className="display t-3 mt-4">
              <T fr="L'histoire de Bovann, racontée par lui." en="Bovann's story, in his own words." />
            </p>
            <p className="mt-2 text-[var(--ink-soft)]">
              <T
                fr="Ici viendront son parcours et ses photos. On ne les écrit pas à sa place."
                en="His journey and his photos will go here. We don't write them for him."
              />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
