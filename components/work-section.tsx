"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { filters, projects, type Facet } from "@/lib/content";
import { Icon } from "./icon";

type FilterId = Facet | "all";

export function WorkSection() {
  const [active, setActive] = useState<FilterId>("all");
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.facets.includes(active))),
    [active],
  );

  useEffect(() => {
    setCurrent(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [active]);

  function goTo(index: number) {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - 1, behavior: "smooth" });
    setCurrent(index);
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const closest = slides.reduce(
      (best, slide, index) =>
        Math.abs(slide.offsetLeft - track.scrollLeft) < best.distance
          ? { index, distance: Math.abs(slide.offsetLeft - track.scrollLeft) }
          : best,
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    setCurrent(closest.index);
  }

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="shell">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">01 — Selected</p>
            <h2 id="work-title" className="h2 mt-3">
              Curated work
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted">
            Products I designed, built and shipped — filters narrow the set by discipline and market.
          </p>
        </header>

        <div
          role="group"
          aria-label="Filter projects"
          className="mt-10 flex flex-wrap gap-2"
        >
          {filters.map((filter) => {
            const selected = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActive(filter.id)}
                aria-pressed={selected}
                className="rounded-full border px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.12em] uppercase transition-colors"
                style={{
                  borderColor: selected ? "var(--fg)" : "var(--line)",
                  background: selected ? "var(--fg)" : "transparent",
                  color: selected ? "var(--bg)" : "var(--muted)",
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {visible.length} project{visible.length === 1 ? "" : "s"} shown
        </p>

        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((project, index) => (
            <li
              key={project.slug}
              id={`project-${project.slug}`}
              className="w-[86vw] shrink-0 snap-start sm:w-[420px]"
              aria-current={index === current ? "true" : undefined}
            >
              <article className="card group flex h-full flex-col overflow-hidden">
                <div
                  className="relative h-40 w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in oklch, ${project.accent} 32%, var(--bg-elevated)), var(--bg-elevated) 70%)`,
                  }}
                >
                  <span className="absolute inset-0 grid place-items-center font-mono text-[0.65rem] tracking-[0.2em] uppercase text-fg/50">
                    {project.eyebrow}
                  </span>
                  <div className="grid-lines absolute inset-0" aria-hidden="true" />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
                    <span className="font-mono text-xs text-muted">{project.year}</span>
                  </div>
                  <p className="text-sm text-muted">{project.summary}</p>

                  <dl className="grid grid-cols-3 gap-2 border-y border-line py-3">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted">
                          {metric.label}
                        </dt>
                        <dd className="text-sm font-medium">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-4 pt-2 text-sm">
                    <Link
                      href={`/work/${project.slug}`}
                      className="link-underline inline-flex items-center gap-1 font-medium"
                    >
                      View details
                      <Icon name="arrow-up-right" size={14} />
                    </Link>
                    {project.links.live && (
                      <a href={project.links.live} className="text-muted hover:text-fg">
                        Live
                      </a>
                    )}
                    {project.links.code && (
                      <a href={project.links.code} className="text-muted hover:text-fg">
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5" aria-label="Go to project">
            {visible.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${project.title}`}
                aria-current={index === current ? "true" : undefined}
                className="rounded-full border px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.1em] uppercase"
                style={{
                  borderColor: index === current ? "var(--fg)" : "var(--line)",
                  color: index === current ? "var(--fg)" : "var(--muted)",
                }}
              >
                {project.title}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(Math.max(current - 1, 0))}
              disabled={current === 0}
              aria-label="Previous project"
              className="grid size-9 place-items-center rounded-full border border-line text-muted disabled:opacity-40 hover:enabled:text-fg"
            >
              <Icon name="arrow-left" size={15} />
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(current + 1, visible.length - 1))}
              disabled={current >= visible.length - 1}
              aria-label="Next project"
              className="grid size-9 place-items-center rounded-full border border-line text-muted disabled:opacity-40 hover:enabled:text-fg"
            >
              <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
