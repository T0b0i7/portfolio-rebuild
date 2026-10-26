import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article className="py-16 md:py-24">
      <div className="shell max-w-2xl">
        <Link href="/#writing" className="link-underline text-sm text-muted hover:text-fg">
          ← All posts
        </Link>

        <p className="eyebrow mt-10">{post.eyebrow}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
        <p className="mt-4 font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted">
          {post.minutes} min read ·{" "}
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </p>

        <div className="mt-10 space-y-5 text-base leading-relaxed text-muted">
          <p>{post.excerpt}</p>
          <p className="text-fg">Draft — replace this body with the real article.</p>
        </div>
      </div>
    </article>
  );
}
