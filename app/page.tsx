import Link from "next/link";
import { site } from "@/lib/site";
import { posts } from "@/lib/content";
import { Icon } from "@/components/icon";
import { Parallax } from "@/components/parallax";
import { WorkSection } from "@/components/work-section";
import { RevealPhoto } from "@/components/reveal-photo";

const status = [
  { label: "BUILDING", value: "Apps, sites, tools" },
  { label: "WRITING", value: "Engineering reads" },
  { label: "HOW I WORK", value: "High agency, async-first" },
  { label: "REACH OUT", value: "Start a conversation" },
];

export default function HomePage() {
  return (
    <>
      <Parallax />

      {/* 1 — Introduction */}
      <section aria-label="Introduction" className="relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="parallax pointer-events-none absolute -top-24 right-[-10%] size-[38rem] rounded-full blur-3xl"
          style={{
            // @ts-expect-error -- custom property
            "--depth": 18,
            background:
              "radial-gradient(circle at 40% 40%, color-mix(in oklch, var(--accent) 34%, transparent), transparent 62%)",
            opacity: 0.6,
          }}
          aria-hidden="true"
        />
        <div
          className="parallax pointer-events-none absolute bottom-[-12rem] left-[-8%] size-[30rem] rounded-full blur-3xl"
          style={{
            // @ts-expect-error -- custom property
            "--depth": -10,
            background:
              "radial-gradient(circle at 60% 50%, color-mix(in oklch, var(--accent-2) 30%, transparent), transparent 64%)",
            opacity: 0.45,
          }}
          aria-hidden="true"
        />

        <div className="shell relative pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="eyebrow reveal">
            {site.role} · {site.location}
          </p>

          <h1 className="display reveal mt-6 max-w-4xl [animation-delay:80ms]">
            {site.headline}
          </h1>

          <p className="reveal mt-6 max-w-xl text-base text-muted [animation-delay:160ms]">
            {site.intro}
          </p>

          <div className="reveal mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              Start a conversation
              <Icon name="arrow-up-right" size={15} />
            </Link>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-fg/40"
            >
              See selected work
            </Link>
          </div>

          <dl className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {status.map((item) => (
              <div key={item.label} className="bg-bg px-4 py-4">
                <dt className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-muted">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3 — Curated work */}
      <WorkSection />

      {/* 4 — Profil */}
      <section id="about" aria-labelledby="about-title" className="scroll-mt-20 border-t border-line py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">02 — Profile</p>
            <h2 id="about-title" className="h2 mt-3">
              Engineer, end to end
            </h2>
            <div className="mt-6">
              <RevealPhoto />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              I build the whole path a request travels: the interface, the API contract, the
              data layer and the guardrails that keep it honest in production.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Most of my work is typed end to end — schema to client without hand-written
              types — with evals and observability wired in before the first deploy. I care
              about cold starts, empty states and the difference between a demo and a system.
            </p>

            <div>
              <h3 className="eyebrow">Stack</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {site.stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div id="uses">
              <h3 className="eyebrow">Workstation</h3>
              <p className="mt-3 text-sm text-muted">
                Laptop, 24GB, 1TB · Ghostty · herdr · VS Code · Linear · Obsidian · 1Password
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Thoughts & writings */}
      <section id="writing" aria-labelledby="writing-title" className="scroll-mt-20 border-t border-line py-20 md:py-28">
        <div className="shell">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">03 — Writing</p>
              <h2 id="writing-title" className="h2 mt-3">
                Thoughts &amp; writings
              </h2>
            </div>
            <Link href="/#writing" className="link-underline text-sm text-muted hover:text-fg">
              Read all posts
            </Link>
          </header>

          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="card group flex h-full flex-col gap-4 p-5 transition-transform hover:-translate-y-1"
                >
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">
                    {post.eyebrow}
                  </p>
                  <h3 className="text-lg leading-snug font-semibold tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted">{post.excerpt}</p>
                  <p className="mt-auto flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted">
                    {post.minutes} min read ·{" "}
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                    <Icon
                      name="arrow-up-right"
                      size={13}
                      className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — Explore & contact */}
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 border-t border-line py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">04 — Explore, experiment &amp; say hello</p>
          <h2 id="contact-title" className="h2 mt-3">
            Got an idea worth building?
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <a
              href={`mailto:${site.email}`}
              className="card group flex flex-col justify-between gap-16 p-6 transition-colors hover:border-fg/40"
            >
              <div>
                <p className="eyebrow">GOT AN IDEA WORTH BUILDING?</p>
                <p className="mt-4 text-2xl tracking-tight">Send a brief</p>
              </div>
              <span className="flex items-center justify-between text-sm">
                {site.email}
                <Icon
                  name="arrow-up-right"
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>

            <Link
              href="/#work"
              className="card group flex flex-col justify-between gap-16 p-6 transition-colors hover:border-fg/40"
            >
              <div>
                <p className="eyebrow">LET&apos;S TALK IT THROUGH</p>
                <p className="mt-4 text-2xl tracking-tight">See how I work</p>
              </div>
              <span className="flex items-center justify-between text-sm text-muted">
                Case studies, process, stack
                <Icon
                  name="arrow-up-right"
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
