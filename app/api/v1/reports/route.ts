import { NextResponse } from "next/server";
import { createReport, listReports } from "@/src/server/report-store";
import { apiError, readJson } from "@/src/server/http";
import type { CreateReportInput } from "@/src/server/report-store";

export const dynamic = "force-dynamic";

/** GET /api/v1/reports — lightweight listing, no findings payload. */
export async function GET() {
  const data = listReports().map((report) => ({
    id: report.id,
    reference: report.reference,
    version: report.version,
    status: report.status,
    rootId: report.rootId,
    parentId: report.parentId,
    supersededBy: report.supersededBy,
    cryptographic_hash: report.cryptographic_hash,
    updatedAt: report.updatedAt,
  }));
  return NextResponse.json({ data, meta: { count: data.length } });
}

/** POST /api/v1/reports — creates the first version of a report. */
export async function POST(request: Request) {
  const body = await readJson<CreateReportInput>(request);
  if (!body?.subject?.name || !body?.subject?.site || !body?.control?.type) {
    return apiError(400, "invalid_payload", "subject.{name,site} et control.type sont requis.", {
      required: ["subject.name", "subject.site", "control.type"],
    });
  }

  const report = createReport(
    {
      subject: body.subject,
      control: {
        date: body.control.date ?? new Date().toISOString(),
        operator: body.control.operator ?? "api",
        framework: body.control.framework ?? "non spécifié",
        type: body.control.type,
      },
      findings: Array.isArray(body.findings) ? body.findings : [],
      status: body.status === "validé" ? "validé" : "brouillon",
    },
    request.headers.get("x-actor") ?? "api",
  );

  return NextResponse.json(
    { data: report },
    {
      status: 201,
      headers: { location: `/api/v1/reports/${report.id}` },
    },
  );
}
