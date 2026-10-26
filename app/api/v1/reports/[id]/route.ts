import { NextResponse } from "next/server";
import {
  ReportConflictError,
  ReportNotFoundError,
  getReport,
  updateReport,
} from "@/src/server/report-store";
import { apiError, readJson } from "@/src/server/http";
import type { ReportPatch } from "@/src/server/report-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/reports/:id */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const report = getReport(id);
  if (!report) return apiError(404, "not_found", `Rapport ${id} introuvable.`);
  return NextResponse.json({ data: report });
}
/**
 * PATCH /api/v1/reports/:id — EF-35.
 * On a validated report nothing is overwritten: the current version is frozen
 * and a v(n+1) draft is created and returned (201 Created).
 */
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await readJson<ReportPatch>(request);
  if (!body) return apiError(400, "invalid_payload", "Corps JSON invalide.");
  if (body.findings && !Array.isArray(body.findings)) {
    return apiError(400, "invalid_payload", "findings doit etre un tableau.");
  }

  try {
    const actor = request.headers.get("x-actor") ?? "api";
    const result = updateReport(id, body, actor);

    return NextResponse.json(
      {
        data: result.report,
        meta: {
          versioned: result.versioned,
          previousId: result.previous?.id ?? null,
          previousVersion: result.previous?.version ?? null,
        },
      },
      {
        status: result.versioned ? 201 : 200,
        headers: {
          location: `/api/v1/reports/${result.report.id}`,
          "x-report-version": String(result.report.version),
          "x-versioning": result.versioned ? "cloned" : "in-place",
        },
      },
    );
  } catch (error) {
    if (error instanceof ReportNotFoundError) {
      return apiError(404, "not_found", error.message);
    }
    if (error instanceof ReportConflictError) {
      return apiError(409, "conflict", error.message);
    }
    throw error;
  }
}
