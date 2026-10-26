import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { linkGroups } from "@/lib/pages-content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Links",
  description: "People, writing and tools I keep coming back to.",
};

export default function LinksPage() {
  return (
    <PageShell
      eyebrow="Links"
      title="A small corner of the internet"
      intro="Where I publish, what I read, and the tools I would install again on a new machine."
    >
      <div className="space-y-12">
        {linkGroups.map((group, groupIndex) => (
          <Reveal key={group.title} delay={groupIndex * 60}>
            <section aria-labelledby={`links-${groupIndex}`}>
              <h2 id={`links-${groupIndex}`} className="eyebrow">
                {group.title}
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="card group flex items-center justify-between gap-3 p-4 transition-colors hover:border-fg/40"
                    >
                      <span>
                        <span className="block text-sm font-medium">{link.label}</span>
                        <span className="block text-xs text-muted">{link.note}</span>
                      </span>
                      <Icon
                        name="arrow-up-right"
                        size={15}
                        className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}

        <Reveal delay={180}>
          <div className="rounded-xl border border-line p-5">
            <h2 className="eyebrow">Site</h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {site.pages.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className="text-muted hover:text-fg">
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
