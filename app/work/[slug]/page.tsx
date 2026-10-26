import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/content";
import { Icon } from "@/components/icon";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <article className="py-16 md:py-24">
      <div className="shell max-w-3xl">
        <Link href="/#work" className="link-underline text-sm text-muted hover:text-fg">
          ← All projects
        </Link>

        <p className="eyebrow mt-10">{project.eyebrow}</p>
        <h1 className="display mt-4 text-4xl md:text-6xl">{project.title}</h1>
        <p className="mt-4 text-lg text-muted">{project.tagline}</p>

        <dl className="mt-10 grid grid-cols-3 gap-4 rounded-xl border border-line p-5">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">
                {metric.label}
              </dt>
              <dd className="mt-1 text-lg font-medium">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <div className="prose mt-10 space-y-5 text-base leading-relaxed">
          <p>{project.summary}</p>
          <p className="text-muted">
            Role: {project.role} · {project.year}
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm text-bg"
            >
              Live <Icon name="arrow-up-right" size={14} />
            </a>
          )}
          {project.links.code && (
            <a
              href={project.links.code}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm"
            >
              Code <Icon name="arrow-up-right" size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
