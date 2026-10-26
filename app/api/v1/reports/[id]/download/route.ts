import { getReport } from "@/src/server/report-store";
import { renderReportPdf } from "@/src/server/report-pdf";
import { apiError, originFrom } from "@/src/server/http";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** GET /api/v1/reports/:id/download — regulatory PDF, generated on the fly. */
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const report = getReport(id);
  if (!report) return apiError(404, "not_found", `Rapport ${id} introuvable.`);

  const pdf = await renderReportPdf(report, { origin: originFrom(request) });
  const filename = `navigarde-${slug(report.reference)}-v${report.version}.pdf`;
  return new Response(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-length": String(pdf.byteLength),
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
      "x-report-id": report.id,
      "x-report-reference": report.reference,
      "x-report-version": String(report.version),
      "x-report-hash": report.cryptographic_hash,
    },
  });
}
