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
            <T k="story.kicker" />
          </p>
          <h1 className="display t-hero mt-5 max-w-4xl">
            <T k="story.heroBefore" />{" "}
            <span className="text-[var(--main-deep)]">
              <T k="story.heroO" />
            </span>
            <T k="story.heroMid1" />
            <span className="text-[var(--main-deep)]">
              <T k="story.heroC" />
            </span>
            <T k="story.heroMid2" />{" "}
            <span className="text-[var(--main-deep)]">
              <T k="story.heroD" />
            </span>
            <T k="story.heroEnd" />
          </h1>
          <p className="lead mt-6">
            <T k="story.lead" />
          </p>
        </div>
      </section>

      <section className="shell sec grid gap-12 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="display t-2">
            <T k="story.problemTitle" />
          </h2>
          <p className="mt-4 text-[var(--ink-soft)]">
            <T k="story.problemBody" />
          </p>
          <h2 className="display t-2 mt-10">
            <T k="story.doesTitle" />
          </h2>
          <p className="mt-4 text-[var(--ink-soft)]">
            <T k="story.doesBody" />
          </p>
          <Link href="/reserver" className="btn btn-primary mt-8">
            <T k="home.bookCta" />
          </Link>
        </div>

        <div className="grid content-start gap-6">
          <figure className="rounded-[1.5rem] bg-[var(--main-soft)] p-8">
            <blockquote className="display t-2">
              <T k="story.quote" />
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold">
              <T k="story.quoteBy" />
            </figcaption>
          </figure>

          <div className="rounded-[1.75rem] border-2 border-dashed border-[var(--line)] p-8">
            <p className="display t-3 mt-1">
              <T k="story.placeholder" />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
