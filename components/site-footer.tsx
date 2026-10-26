import Link from "next/link";
import { site } from "@/lib/site";
import { posts, projects } from "@/lib/content";
import { Icon } from "./icon";

const columns = [
  { title: "WORK", links: projects.slice(0, 3).map((p) => ({ label: p.title, href: `/work/${p.slug}` })) },
  {
    title: "SITE",
    links: [
      { label: "Projects", href: "/#work" },
      { label: "Blog", href: "/#writing" },
      { label: "About", href: "/#about" },
      { label: "Uses", href: "/#uses" },
    ],
  },
  {
    title: "SOCIAL",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "X", href: "https://x.com" },
      { label: "RSS", href: "/feed.xml" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-14">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] uppercase">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm text-muted">
              {site.role} · {site.location}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
            >
              {site.email}
              <Icon name="arrow-up-right" size={14} />
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link href={link.href} className="text-muted hover:text-fg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">
          <p>
            © {new Date().getFullYear()} {site.name} — all rights reserved
          </p>
          <p>
            {projects.length} projects · {posts.length} posts
          </p>
        </div>
      </div>
    </footer>
  );
}
