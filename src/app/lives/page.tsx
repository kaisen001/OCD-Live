import type { Metadata } from "next";
import { LivesBoard } from "@/components/lives-board";
import { T } from "@/components/t";

export const metadata: Metadata = { title: "Lives" };

export default function LivesPage() {
  return (
    <div className="shell py-10 md:py-16">
      <p className="kicker">
        <T k="lives.kicker" />
      </p>
      <h1 className="display t-2 mt-4 max-w-3xl">
        <T k="lives.title" />
      </h1>
      <p className="lead mt-4 max-w-2xl">
        <T k="lives.lead" />
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        <T k="time.legend" />
      </p>
      <div className="mt-10">
        <LivesBoard />
      </div>
    </div>
  );
}
