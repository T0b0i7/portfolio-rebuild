import { createHash, randomUUID } from "node:crypto";
import type { Finding, Report, ReportPatch, ReportStatus } from "./report-types";

/**
 * In-memory repository. Swap the four exported functions for a database layer
 * (Prisma/Drizzle) — the route handlers and the PDF renderer only depend on them.
 */
const reports = new Map<string, Report>();

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** SHA-256 over the legally meaningful fields only. */
export function computeHash(report: Report): string {
  const canonical = {
    reference: report.reference,
    version: report.version,
    status: report.status,
    subject: report.subject,
    control: report.control,
    findings: report.findings,
  };
  return createHash("sha256").update(stableStringify(canonical), "utf8").digest("hex");
}

function seal(report: Report): Report {
  return { ...report, cryptographic_hash: computeHash(report) };
}

function nextReference(): string {
  const year = new Date().getFullYear();
  const count = [...reports.values()].filter((item) => item.reference.startsWith(`NG-${year}-`)).length;
  return `NG-${year}-${String(count + 1).padStart(4, "0")}`;
}

export type CreateReportInput = {
  subject: Report["subject"];
  control: Report["control"];
  findings?: Finding[];
  status?: ReportStatus;
};

export function createReport(input: CreateReportInput, actor = "api"): Report {
  const now = new Date().toISOString();
  const id = randomUUID();
  const report: Report = {
    id,
    reference: nextReference(),
    version: 1,
    status: input.status ?? "brouillon",
    rootId: id,
    parentId: null,
    supersededBy: null,
    createdAt: now,
    updatedAt: now,
    subject: input.subject,
    control: input.control,
    findings: input.findings ?? [],
    cryptographic_hash: "",
    history: [
      {
        version: 1,
        status: input.status ?? "brouillon",
        at: now,
        actor,
        summary: "Création du rapport",
      },
    ],
  };
  const sealed = seal(report);
  reports.set(id, sealed);
  return sealed;
}

export function getReport(id: string): Report | undefined {
  return reports.get(id);
}

export function listReports(): Report[] {
  return [...reports.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export class ReportNotFoundError extends Error {}
export class ReportConflictError extends Error {}

export type UpdateResult = {
  report: Report;
  versioned: boolean;
  previous: Report | null;
};

/**
 * EF-35 — versioning.
 * A patch against a *validated* report never mutates it: the current version is
 * kept as an immutable audit record and a v(n+1) draft is created instead.
 */
export function updateReport(id: string, patch: ReportPatch, actor = "api"): UpdateResult {
  const existing = reports.get(id);
  if (!existing) throw new ReportNotFoundError(`Rapport introuvable: ${id}`);
  if (existing.status === "archivé") {
    throw new ReportConflictError("Un rapport archivé ne peut plus être modifié.");
  }

  const now = new Date().toISOString();
  const versioned = existing.status === "validé";

  const base: Report = versioned
    ? {
        ...existing,
        id: randomUUID(),
        version: existing.version + 1,
        status: "brouillon",
        parentId: existing.id,
        rootId: existing.rootId,
        supersededBy: null,
        createdAt: now,
        updatedAt: now,
        history: [
          ...existing.history,
          {
            version: existing.version + 1,
            status: "brouillon",
            at: now,
            actor,
            summary: `Nouvelle version créée depuis la v${existing.version} validée`,
          },
        ],
      }
    : existing;

  const merged: Report = {
    ...base,
    subject: { ...base.subject, ...(patch.subject ?? {}) },
    control: { ...base.control, ...(patch.control ?? {}) },
    findings: patch.findings ?? base.findings,
    // A cloned version is always a draft, whatever the payload says.
    status: versioned ? "brouillon" : (patch.status ?? base.status),
    updatedAt: now,
    history: versioned
      ? base.history
      : [
          ...base.history,
          {
            version: base.version,
            status: patch.status ?? base.status,
            at: now,
            actor,
            summary: patch.note ?? "Modification du rapport",
          },
        ],
  };

  const sealed = seal(merged);
  reports.set(sealed.id, sealed);

  if (versioned) {
    reports.set(existing.id, { ...existing, supersededBy: sealed.id });
    return { report: sealed, versioned: true, previous: existing };
  }

  return { report: sealed, versioned: false, previous: null };
}

/** Resolves the latest version of a report lineage. */
export function resolveLatest(id: string): Report | undefined {
  let current = reports.get(id);
  const seen = new Set<string>();
  while (current?.supersededBy && !seen.has(current.id)) {
    seen.add(current.id);
    current = reports.get(current.supersededBy);
  }
  return current;
}

export function verifyHash(id: string, hash?: string): { report: Report; valid: boolean } | null {
  const report = resolveLatest(id) ?? reports.get(id);
  if (!report) return null;
  const expected = computeHash(report);
  return { report, valid: hash ? hash === expected : expected === report.cryptographic_hash };
}

// --- seed ------------------------------------------------------------------
function seed() {
  const created = createReport(
    {
      subject: {
        name: "Atelier Verrière SAS",
        site: "verriere.example",
        address: "8 rue des Forges, 44000 Nantes",
        siret: "SIRET 852 419 673 00021",
      },
      control: {
        type: "Audit d'accessibilité et de conformité IA",
        date: "2026-10-14T09:30:00.000Z",
        operator: "NaviGarde IA / agent-conformite-04",
        framework: "RGAA 4.1 + AI Act art. 50",
      },
      findings: [
        {
          id: "F-001",
          severity: "critique",
          title: "Absence d'alternative textuelle sur les visuels produits",
          detail:
            "27 images décoratives et 6 images informatives n'exposent aucun attribut alt. Les lecteurs d'écran annoncent le nom du fichier.",
          evidence: "<img src=\"/media/verre-01.avif\"> - 33 occurrences",
          aiConfidence: 0.97,
        },
        {
          id: "F-002",
          severity: "majeur",
          title: "Contraste insuffisant sur les libellés secondaires",
          detail:
            "Le ratio mesuré est de 3.1:1 sur les textes de 14px, sous le seuil de 4.5:1 exigé par le référentiel.",
          evidence: "--color-muted sur --bg-surface",
          aiConfidence: 0.88,
        },
        {
          id: "F-003",
          severity: "mineur",
          title: "Mentions de transparence IA incomplètes",
          detail:
            "Le chatbot du site ne déclare pas explicitement sa nature automatique au premier échange.",
          aiConfidence: 0.72,
        },
      ],
      status: "validé",
    },
    "agent-conformite-04",
  );
  return created;
}

seed();
