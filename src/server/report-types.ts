export type ReportStatus = "brouillon" | "validé" | "archivé";

export type Finding = {
  id: string;
  severity: "critique" | "majeur" | "mineur" | "info";
  title: string;
  detail: string;
  evidence?: string;
  aiConfidence?: number;
};

export type HistoryEntry = {
  version: number;
  status: ReportStatus;
  at: string;
  actor: string;
  summary: string;
};

export type Report = {
  id: string;
  reference: string;
  version: number;
  status: ReportStatus;
  rootId: string;
  parentId: string | null;
  supersededBy: string | null;
  createdAt: string;
  updatedAt: string;
  subject: {
    name: string;
    site: string;
    address?: string;
    siret?: string;
    legal_id?: string;
  };
  control: {
    type: string;
    date: string;
    operator: string;
    framework: string;
  };
  findings: Finding[];
  cryptographic_hash: string;
  history: HistoryEntry[];
  verification_url?: string;
};

export type ReportPatch = {
  subject?: Partial<Report["subject"]>;
  control?: Partial<Report["control"]>;
  findings?: Finding[];
  status?: ReportStatus;
  note?: string;
};
