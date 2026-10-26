import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="py-14 md:py-20">
      <div className="shell max-w-3xl">
        <Link href="/" className="link-underline text-sm text-muted hover:text-fg">
          ← Home
        </Link>
        <Reveal>
          <p className="eyebrow mt-10">{eyebrow}</p>
          <h1 className="h2 mt-3">{title}</h1>
          {intro && <p className="mt-4 text-base text-muted">{intro}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}
