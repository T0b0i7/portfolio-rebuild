"use client";

import { useState } from "react";

type Plan = { id: string; name: string; monthly: number; yearly: number; note: string; features: string[] };

const plans: Plan[] = [
  {
    id: "sprint",
    name: "Sprint",
    monthly: 4200,
    yearly: 3800,
    note: "1 week, one clear outcome",
    features: ["Scoped audit", "Written recommendations", "Handover call"],
  },
  {
    id: "build",
    name: "Build",
    monthly: 9600,
    yearly: 8600,
    note: "Continuous delivery, async-first",
    features: ["Weekly shipping", "Typed end to end", "Evals & guardrails"],
  },
  {
    id: "partner",
    name: "Partner",
    monthly: 14800,
    yearly: 13400,
    note: "Embedded with your team",
    features: ["Shared roadmap", "Architecture ownership", "On-call support"],
  },
];

const digits = "0123456789".split("");

function RollingNumber({ value, fontSize = 28 }: { value: number; fontSize?: number }) {
  const characters = new Intl.NumberFormat("en-US").format(value).split("");

  return (
    <span
      className="inline-flex items-baseline font-semibold tabular-nums"
      style={{ fontSize, height: fontSize * 1.15, lineHeight: 1.15 }}
      aria-hidden="true"
    >
      {characters.map((character, index) => {
        if (!/\d/.test(character)) {
          return (
            <span key={`${character}-${index}`} style={{ width: "0.32em", textAlign: "center" }}>
              {character}
            </span>
          );
        }
        const digit = Number(character);
        return (
          <span
            key={`slot-${index}`}
            className="relative inline-block overflow-hidden"
            style={{ width: "0.62em", height: fontSize * 1.15 }}
          >
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ transform: `translateY(-${digit * 10}%)` }}
            >
              {digits.map((option) => (
                <span
                  key={option}
                  className="grid place-items-center"
                  style={{ height: fontSize * 1.15 }}
                >
                  {option}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function PricingToggle() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="font-mono text-[0.65rem] tracking-[0.12em] uppercase transition-colors"
          style={{ color: yearly ? "var(--muted)" : "var(--fg)" }}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Bill yearly (two months free)"
          onClick={() => setYearly((value) => !value)}
          className="relative h-7 w-13 rounded-full border border-line transition-colors"
          style={{ background: yearly ? "var(--fg)" : "transparent" }}
        >
          <span
            className="absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-[left,background] duration-300"
            style={{
              left: yearly ? "calc(100% - 1.5rem)" : "0.15rem",
              background: yearly ? "var(--bg)" : "var(--fg)",
            }}
          />
        </button>
        <span
          className="font-mono text-[0.65rem] tracking-[0.12em] uppercase transition-colors"
          style={{ color: yearly ? "var(--fg)" : "var(--muted)" }}
        >
          Yearly
        </span>
        <span className="chip" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
          2 months free
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        Prices shown {yearly ? "per month, billed yearly" : "per month, billed monthly"}. Values:{" "}
        {plans.map((plan) => `${plan.name} ${yearly ? plan.yearly : plan.monthly}`).join(", ")}.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.id} className="card flex flex-col gap-4 p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-medium tracking-tight">{plan.name}</h3>
              <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted">
                / month
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-xl text-muted">€</span>
              <RollingNumber value={yearly ? plan.yearly : plan.monthly} />
            </div>

            <p className="text-xs text-muted">{plan.note}</p>

            <ul className="mt-1 space-y-1.5 text-xs text-muted">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
