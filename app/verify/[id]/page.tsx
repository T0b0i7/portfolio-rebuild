import Link from "next/link";
import type { Metadata } from "next";
import { getReport, resolveLatest } from "@/src/server/report-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vérification d'un rapport",
  robots: { index: false, follow: false },
};

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getReport(id);

  if (!report) {
    return (
      <div className="shell max-w-2xl py-24">
        <p className="eyebrow">Vérification</p>
        <h1 className="h2 mt-3">Rapport introuvable</h1>
        <p className="mt-4 text-sm text-muted">
          Aucun rapport ne correspond à l&apos;identifiant <code className="font-mono">{id}</code>.
        </p>
        <Link href="/" className="link-underline mt-8 inline-block text-sm">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const latest = resolveLatest(report.id) ?? report;

  return (
    <div className="shell max-w-2xl py-20">
      <p className="eyebrow">Vérification — NaviGarde IA</p>
      <h1 className="h2 mt-3">{report.reference}</h1>
      <p className="mt-2 font-mono text-xs tracking-[0.12em] uppercase text-muted">
        Version v{report.version} · {report.status}
      </p>

      <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
        {[
          { label: "Empreinte SHA-256", value: report.cryptographic_hash },
          { label: "Entité contrôlée", value: report.subject.name },
          { label: "Site", value: report.subject.site },
          { label: "Type de contrôle", value: report.control.type },
          { label: "Émis le", value: new Date(report.createdAt).toISOString() },
          { label: "Dernière version", value: `v${latest.version} (${latest.status})` },
        ].map((row) => (
          <div key={row.label} className="flex flex-wrap gap-2 py-3">
            <dt className="w-44 shrink-0 font-mono text-[0.62rem] tracking-[0.1em] uppercase text-muted">
              {row.label}
            </dt>
            <dd className="min-w-0 flex-1 break-all">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`/api/v1/reports/${report.id}/download`}
          className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg"
        >
          Télécharger le PDF
        </a>
        <a
          href={`/api/v1/reports/${report.id}`}
          className="rounded-full border border-line px-4 py-2 text-sm"
        >
          API JSON
        </a>
      </div>
    </div>
  );
}
