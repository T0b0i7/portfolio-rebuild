// NaviGarde IA — structure administrative du rapport (EF-35 / export réglementaire).
// Aucune dépendance : ce module décrit le document, il ne le dessine pas.

export const REPORT_TEMPLATE = {
  issuer: {
    name: "NAVIGARDE IA",
    unit: "Cellule de contrôle automatisé",
    address: "14 quai des Audits, 75000 Paris",
    contact: "controle@navigarde.example",
    siret: "SIRET 000 000 000 00000",
  },
  document: {
    title: "RAPPORT DE CONTRÔLE",
    subtitle: "Document administratif scellé par intelligence artificielle",
    reference: "Référence",
    version: "Version",
    status: "Statut",
    issued: "Émis le",
    hash: "Empreinte SHA-256",
    qr: "Vérification",
    legal:
      "Ce document est généré automatiquement. Sa validité est attestée par l'empreinte cryptographique " +
      "imprimée en pied de page et vérifiable à l'adresse indiquée.",
  },
  sections: {
    metadata: "1. Métadonnées administratives",
    findings: "2. Constatations de l'analyse IA",
    seal: "3. Sceau de souveraineté numérique",
  },
  severities: {
    critique: "CRITIQUE",
    majeur: "MAJEUR",
    mineur: "MINEUR",
    info: "INFORMATION",
  },
};

const STATUS_LABELS = {
  brouillon: "BROUILLON — non opposable",
  "validé": "VALIDÉ — opposable",
  validé: "VALIDÉ — opposable",
  archivé: "ARCHIVÉ",
};

/** PDF fonts are WinAnsi: drop characters they cannot encode. */
export function toWinAnsi(value) {
  return String(value == null ? "" : value)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u00A0\u202F\u2009]/g, " ")
    .replace(/\u20AC/g, "EUR")
    .replace(/[^\u0000-\u00FF]/g, "?");
}

function formatDate(iso, locale = "fr-FR") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Projects a stored report into the administrative document model consumed by
 * the PDF renderer (src/server/report-pdf.ts).
 */
export function buildReportDocument(report, options = {}) {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const origin = (options.origin ?? "http://localhost:3000").replace(/\/$/, "");
  const verificationUrl =
    report.verification_url ??
    `${origin}/verify/${report.id}?v=${report.version}&hash=${report.cryptographic_hash}`;

  const metadata = [
    { label: REPORT_TEMPLATE.document.reference, value: report.reference },
    { label: REPORT_TEMPLATE.document.version, value: `v${report.version}` },
    {
      label: REPORT_TEMPLATE.document.status,
      value: STATUS_LABELS[report.status] ?? String(report.status).toUpperCase(),
    },
    { label: REPORT_TEMPLATE.document.issued, value: formatDate(report.createdAt) },
    { label: "Site contrôlé", value: report.subject.site },
    { label: "Entité", value: report.subject.name },
    { label: "Adresse", value: report.subject.address ?? "non renseignée" },
    { label: "Identifiant légal", value: report.subject.siret ?? report.subject.legal_id ?? "non renseigné" },
    { label: "Type de contrôle", value: report.control.type },
    { label: "Date du contrôle", value: formatDate(report.control.date) },
    { label: "Opérateur", value: report.control.operator },
    { label: "Référentiel", value: report.control.framework },
  ];

  const findings = report.findings.map((finding, index) => ({
    index: index + 1,
    severity: REPORT_TEMPLATE.severities[finding.severity] ?? String(finding.severity).toUpperCase(),
    severity_key: finding.severity,
    title: finding.title,
    detail: finding.detail,
    evidence: finding.evidence ?? null,
    confidence: typeof finding.aiConfidence === "number" ? Math.round(finding.aiConfidence * 100) : null,
  }));

  const counts = finding => findings.filter(item => item.severity_key === finding).length;

  return {
    issuer: REPORT_TEMPLATE.issuer,
    title: REPORT_TEMPLATE.document.title,
    subtitle: REPORT_TEMPLATE.document.subtitle,
    reference: report.reference,
    version: report.version,
    status: report.status,
    legal: REPORT_TEMPLATE.document.legal,
    sections: REPORT_TEMPLATE.sections,
    metadata,
    findings,
    summary: [
      { label: "Constatations", value: String(findings.length) },
      { label: "Critiques", value: String(counts("critique")) },
      { label: "Majeures", value: String(counts("majeur")) },
      { label: "Mineures", value: String(counts("mineur")) },
    ],
    history: (report.history ?? []).map(entry => ({
      label: `v${entry.version}`,
      value: `${entry.status} - ${formatDate(entry.at)} - ${entry.actor}`,
    })),
    seal: {
      label: REPORT_TEMPLATE.document.hash,
      algorithm: "SHA-256",
      hash: report.cryptographic_hash,
      generatedAt: formatDate(generatedAt),
      verificationUrl,
      note: REPORT_TEMPLATE.document.legal,
    },
  };
}
