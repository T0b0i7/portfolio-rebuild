import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { bucketList } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Bucket List",
  description: "Things I want to build, learn or see before it stops mattering.",
};

export default function BucketListPage() {
  const done = bucketList.filter((item) => item.done).length;

  return (
    <PageShell
      eyebrow="Bucket list"
      title="Things worth the attempt"
      intro={`${done} of ${bucketList.length} done. The rest is a queue, not a promise.`}
    >
      <ul className="divide-y divide-line border-y border-line">
        {bucketList.map((item, index) => (
          <Reveal as="li" key={item.label} delay={index * 40}>
            <div className="flex items-center gap-4 py-3.5">
              <span
                className="grid size-5 shrink-0 place-items-center rounded-full border"
                style={{
                  borderColor: item.done ? "var(--accent)" : "var(--line)",
                  background: item.done ? "var(--accent)" : "transparent",
                  color: "var(--bg)",
                }}
                aria-hidden="true"
              >
                {item.done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="m4 12.5 5 5L20 6.5" />
                  </svg>
                ) : null}
              </span>
              <span
                className="flex-1 text-sm"
                style={{
                  color: item.done ? "var(--fg)" : "var(--muted)",
                  textDecoration: item.done ? "line-through" : "none",
                }}
              >
                {item.label}
              </span>
              {item.year && (
                <span className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted">
                  {item.year}
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </ul>
    </PageShell>
  );
}
