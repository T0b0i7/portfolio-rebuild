import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { buildReportDocument, toWinAnsi } from "@/src/ai/reportTemplate.js";
import type { Report } from "./report-types";
import {
  A4,
  CONTENT_WIDTH,
  FOOTER_HEIGHT,
  INK,
  MARGIN,
  MUTED,
  PAPER,
  RULE,
  SEAL,
  SEVERITY_COLORS,
  rule,
  section,
  text,
  wrap,
  type Fonts,
} from "./pdf-kit";

export type RenderOptions = { origin?: string; generatedAt?: string };

export async function renderReportPdf(
  report: Report,
  options: RenderOptions = {},
): Promise<Uint8Array> {
  const model = buildReportDocument(report, options);

  const pdf = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
  };

  pdf.setTitle(`${model.title} ${model.reference} v${model.version}`);
  pdf.setAuthor(model.issuer.name);
  pdf.setSubject(model.subtitle);
  pdf.setProducer("NaviGarde IA");
  pdf.setCreator("NaviGarde IA - export reglementaire");
  pdf.setCreationDate(new Date());

  const qrBytes = await QRCode.toBuffer(model.seal.verificationUrl, {
    type: "png",
    width: 480,
    margin: 1,
    errorCorrectionLevel: "M",
  });
  const qr = await pdf.embedPng(qrBytes);

  let page = pdf.addPage(A4);
  let y = A4[1] - MARGIN;
  // --- official header band ------------------------------------------------
  const bandHeight = 92;
  const bandTop = A4[1] - MARGIN;
  page.drawRectangle({
    x: MARGIN,
    y: bandTop - bandHeight,
    width: CONTENT_WIDTH,
    height: bandHeight,
    color: rgb(0.09, 0.1, 0.12),
  });
  page.drawText("NAVIGARDE IA", {
    x: MARGIN + 18,
    y: bandTop - 36,
    size: 18,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(toWinAnsi(model.issuer.unit), {
    x: MARGIN + 18,
    y: bandTop - 50,
    size: 7.5,
    font: fonts.regular,
    color: rgb(0.72, 0.75, 0.78),
  });
  page.drawText(toWinAnsi(`${model.issuer.address} - ${model.issuer.contact}`), {
    x: MARGIN + 18,
    y: bandTop - 62,
    size: 7,
    font: fonts.regular,
    color: rgb(0.6, 0.63, 0.67),
  });

  const rightLines = [
    model.reference,
    `VERSION v${model.version}`,
    String(model.status ?? "").toUpperCase(),
  ];
  rightLines.forEach((value, index) => {
    const label = toWinAnsi(value);
    const font = index === 0 ? fonts.bold : fonts.regular;
    const size = index === 0 ? 11 : 7.5;
    const width = font.widthOfTextAtSize(label, size);
    page.drawText(label, {
      x: A4[0] - MARGIN - 18 - width,
      y: bandTop - 34 - index * 14,
      size,
      font,
      color: index === 0 ? rgb(1, 1, 1) : rgb(0.75, 0.78, 0.82),
    });
  });

  y = bandTop - bandHeight - 30;
  // --- title + metadata ----------------------------------------------------
  page.drawText(toWinAnsi(model.title), {
    x: MARGIN,
    y,
    size: 17,
    font: fonts.bold,
    color: INK,
  });
  y -= 16;
  y = text(page, fonts, model.subtitle, { x: MARGIN, y, size: 8.5, color: MUTED, width: CONTENT_WIDTH });
  y -= 18;

  y = section(page, fonts, model.sections.metadata, y);

  const columnWidth = (CONTENT_WIDTH - 16) / 2;
  model.metadata.forEach((entry, index) => {
    if (index % 2 === 0 && index > 0) y -= 26;
    const column = index % 2;
    const x = MARGIN + column * (columnWidth + 16);
    page.drawText(toWinAnsi(String(entry.label).toUpperCase()), {
      x,
      y,
      size: 6.6,
      font: fonts.bold,
      color: MUTED,
    });
    text(page, fonts, String(entry.value), {
      x,
      y: y - 11,
      size: 8.6,
      width: columnWidth,
      maxLines: 1,
    });
  });
  y -= 34;
  // --- summary strip -------------------------------------------------------
  const boxWidth = (CONTENT_WIDTH - 3 * 8) / 4;
  model.summary.forEach((item, index) => {
    const x = MARGIN + index * (boxWidth + 8);
    page.drawRectangle({
      x,
      y: y - 46,
      width: boxWidth,
      height: 46,
      color: PAPER,
      borderColor: RULE,
      borderWidth: 0.6,
    });
    page.drawText(toWinAnsi(String(item.value)), {
      x: x + 10,
      y: y - 27,
      size: 15,
      font: fonts.bold,
      color: INK,
    });
    page.drawText(toWinAnsi(String(item.label).toUpperCase()), {
      x: x + 10,
      y: y - 39,
      size: 6.4,
      font: fonts.regular,
      color: MUTED,
    });
  });
  y -= 72;

  y = section(page, fonts, model.sections.findings, y);
  const footerTop = MARGIN + FOOTER_HEIGHT;
  for (const finding of model.findings) {
    if (y - 90 < footerTop + 12) {
      page = pdf.addPage(A4);
      y = A4[1] - MARGIN;
      y = text(page, fonts, `${model.reference} - v${model.version} (suite)`, {
        x: MARGIN,
        y,
        size: 7.5,
        color: MUTED,
        width: CONTENT_WIDTH,
      });
      y -= 16;
    }

    const color = SEVERITY_COLORS[finding.severity_key] ?? MUTED;
    page.drawRectangle({ x: MARGIN, y: y - 6, width: 3, height: 30, color });
    page.drawText(toWinAnsi(`${finding.index}. ${finding.title}`), {
      x: MARGIN + 12,
      y,
      size: 9.4,
      font: fonts.bold,
      color: INK,
      maxWidth: CONTENT_WIDTH - 120,
    });

    const badge = toWinAnsi(finding.severity);
    const badgeWidth = fonts.bold.widthOfTextAtSize(badge, 6.6) + 10;
    page.drawRectangle({
      x: A4[0] - MARGIN - badgeWidth,
      y: y - 2,
      width: badgeWidth,
      height: 12,
      color,
    });
    page.drawText(badge, {
      x: A4[0] - MARGIN - badgeWidth + 5,
      y: y + 1.4,
      size: 6.6,
      font: fonts.bold,
      color: rgb(1, 1, 1),
    });
    y -= 16;
    y = text(page, fonts, finding.detail, {
      x: MARGIN + 12,
      y,
      size: 8.2,
      width: CONTENT_WIDTH - 24,
      color: rgb(0.25, 0.27, 0.3),
    });

    if (finding.evidence) {
      page.drawText("PREUVE", { x: MARGIN + 12, y: y - 2, size: 6, font: fonts.bold, color: MUTED });
      y = text(page, fonts, finding.evidence, {
        x: MARGIN + 50,
        y: y - 2,
        size: 7,
        font: fonts.mono,
        width: CONTENT_WIDTH - 62,
        color: rgb(0.35, 0.37, 0.4),
        maxLines: 2,
      });
    }

    if (finding.confidence != null) {
      const label = toWinAnsi(`IA ${finding.confidence}%`);
      const width = fonts.mono.widthOfTextAtSize(label, 6.6);
      page.drawText(label, {
        x: A4[0] - MARGIN - width,
        y: y + 4,
        size: 6.6,
        font: fonts.mono,
        color: MUTED,
      });
    }

    y -= 16;
    rule(page, y, RULE, 0.4);
    y -= 14;
  }
  const sealY = MARGIN;
  const sealHeight = FOOTER_HEIGHT - 18;
  page.drawRectangle({
    x: MARGIN,
    y: sealY,
    width: CONTENT_WIDTH,
    height: sealHeight,
    color: PAPER,
    borderColor: SEAL,
    borderWidth: 1,
  });
  page.drawRectangle({ x: MARGIN, y: sealY, width: 4, height: sealHeight, color: SEAL });

  const qrSize = 62;
  const qrX = A4[0] - MARGIN - qrSize - 12;
  page.drawImage(qr, { x: qrX, y: sealY + sealHeight - qrSize - 12, width: qrSize, height: qrSize });
  page.drawText("VERIFICATION", {
    x: qrX + 6,
    y: sealY + sealHeight - qrSize - 22,
    size: 5.6,
    font: fonts.bold,
    color: MUTED,
  });
  const sealWidth = CONTENT_WIDTH - qrSize - 40;
  let cursor = sealY + sealHeight - 16;
  page.drawText("SCEAU DE SOUVERAINETE NUMERIQUE", {
    x: MARGIN + 14,
    y: cursor,
    size: 7.6,
    font: fonts.bold,
    color: SEAL,
  });
  cursor -= 13;
  page.drawText(toWinAnsi(model.seal.label), {
    x: MARGIN + 14,
    y: cursor,
    size: 6.2,
    font: fonts.regular,
    color: MUTED,
  });
  cursor -= 12;
  cursor = text(page, fonts, model.seal.hash, {
    x: MARGIN + 14,
    y: cursor,
    size: 7.4,
    font: fonts.mono,
    width: sealWidth,
    lineHeight: 9.4,
  });
  cursor -= 4;
  cursor = text(page, fonts, model.seal.verificationUrl, {
    x: MARGIN + 14,
    y: cursor,
    size: 6.2,
    font: fonts.mono,
    width: sealWidth,
    lineHeight: 7.6,
    color: MUTED,
    maxLines: 2,
  });
  page.drawText(toWinAnsi(`Genere le ${model.seal.generatedAt} - ${model.seal.algorithm}`), {
    x: MARGIN + 14,
    y: cursor - 2,
    size: 6,
    font: fonts.regular,
    color: MUTED,
  });
  const pages = pdf.getPages();
  pages.forEach((current, index) => {
    const label = `${index + 1} / ${pages.length}`;
    const width = fonts.regular.widthOfTextAtSize(label, 6.4);
    current.drawText(label, {
      x: A4[0] - MARGIN - width,
      y: MARGIN - 14,
      size: 6.4,
      font: fonts.regular,
      color: MUTED,
    });
    current.drawText(toWinAnsi(`${model.issuer.name} - ${model.reference} - v${model.version}`), {
      x: MARGIN,
      y: MARGIN - 14,
      size: 6.4,
      font: fonts.regular,
      color: MUTED,
    });
  });

  return pdf.save();
}
