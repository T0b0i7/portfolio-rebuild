import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { uses } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Uses",
  description: "The hardware, software and stack I work with every day.",
};

export default function UsesPage() {
  return (
    <PageShell
      eyebrow="Uses"
      title="Everything on my desk and dock"
      intro="The short list. No affiliate links, no yearly reshuffle — this is what is actually open right now."
    >
      <div className="space-y-12">
        {uses.map((group, groupIndex) => (
          <Reveal key={group.title} delay={groupIndex * 60}>
            <section aria-labelledby={`uses-${groupIndex}`}>
              <h2 id={`uses-${groupIndex}`} className="eyebrow">
                {group.title}
              </h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-6 py-3">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-right text-sm text-muted">{item.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
