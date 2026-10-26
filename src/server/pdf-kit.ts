import { rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { toWinAnsi } from "@/src/ai/reportTemplate.js";

export const A4: [number, number] = [595.28, 841.89];
export const MARGIN = 44;
export const CONTENT_WIDTH = A4[0] - MARGIN * 2;
export const FOOTER_HEIGHT = 118;

export const INK = rgb(0.09, 0.1, 0.12);
export const MUTED = rgb(0.42, 0.44, 0.48);
export const RULE = rgb(0.82, 0.83, 0.85);
export const PAPER = rgb(0.98, 0.98, 0.975);
export const SEAL = rgb(0.36, 0.09, 0.11);

export const SEVERITY_COLORS: Record<string, ReturnType<typeof rgb>> = {
  critique: rgb(0.66, 0.13, 0.13),
  majeur: rgb(0.7, 0.42, 0.04),
  mineur: rgb(0.25, 0.32, 0.55),
  info: MUTED,
};

export type Fonts = { regular: PDFFont; bold: PDFFont; mono: PDFFont };
/** Character-level wrapping: PDF standard fonts have no automatic layout. */
export function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const words = toWinAnsi(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    if (font.widthOfTextAtSize(word, size) > width) {
      let chunk = "";
      for (const character of word) {
        if (font.widthOfTextAtSize(chunk + character, size) > width) {
          lines.push(chunk);
          chunk = character;
        } else {
          chunk += character;
        }
      }
      line = chunk;
    } else {
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
export type TextOptions = {
  x: number;
  y: number;
  size: number;
  font?: PDFFont;
  color?: ReturnType<typeof rgb>;
  width?: number;
  lineHeight?: number;
  maxLines?: number;
};

/** Draws wrapped text and returns the y position below the last line. */
export function text(
  page: PDFPage,
  fonts: Fonts,
  value: string,
  options: TextOptions,
): number {
  const font = options.font ?? fonts.regular;
  const size = options.size;
  const lineHeight = options.lineHeight ?? size * 1.35;
  const width = options.width ?? CONTENT_WIDTH;
  const lines = wrap(value, font, size, width);
  const limited = options.maxLines ? lines.slice(0, options.maxLines) : lines;

  let y = options.y;
  for (const line of limited) {
    page.drawText(line, { x: options.x, y, size, font, color: options.color ?? INK });
    y -= lineHeight;
  }
  return y;
}

export function rule(page: PDFPage, y: number, color = RULE, width = 0.7) {
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: A4[0] - MARGIN, y },
    thickness: width,
    color,
  });
}

/** Section heading with its rule; returns the y below it. */
export function section(page: PDFPage, fonts: Fonts, label: string, y: number): number {
  page.drawText(toWinAnsi(label.toUpperCase()), {
    x: MARGIN,
    y,
    size: 8,
    font: fonts.bold,
    color: MUTED,
  });
  rule(page, y - 6);
  return y - 22;
}
// __END__
