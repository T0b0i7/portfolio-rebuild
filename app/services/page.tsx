import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PricingToggle } from "@/components/pricing-toggle";
import { Reveal } from "@/components/reveal";
import { CopyEmail } from "@/components/copy-email";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "Engagement models and monthly rates for product engineering work.",
};

const steps = [
  { label: "01", title: "Scope", text: "One call and a written brief. What ships, what does not." },
  { label: "02", title: "Build", text: "Weekly increments behind a flag, reviewed in public." },
  { label: "03", title: "Hand over", text: "Tests, runbook and a walkthrough recording." },
];

export default function ServicesPage() {
  return (
    <PageShell
      eyebrow="Services"
      title="How we could work together"
      intro="Three engagement shapes. Prices include design, implementation, tests and the documentation nobody wants to write."
    >
      <Reveal>
        <PricingToggle />
      </Reveal>

      <Reveal delay={80}>
        <section aria-labelledby="process" className="mt-16">
          <h2 id="process" className="eyebrow">
            Process
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <li key={step.label} className="card p-5">
                <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">
                  {step.label}
                </span>
                <h3 className="mt-3 text-sm font-medium">{step.title}</h3>
                <p className="mt-2 text-xs text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-14 flex flex-wrap items-center gap-4 rounded-xl border border-line p-5">
          <p className="text-sm">
            Not sure which shape fits? Send the constraints and I will tell you what I would cut.
          </p>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm text-bg"
            >
              Start a conversation
            </a>
            <CopyEmail email={site.email} />
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
