import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#101317",
          color: "#f2f1ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#9aa0a8" }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#e8814f" }} />
          {site.name} — {site.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -3, maxWidth: 900, fontWeight: 600 }}>
            {site.headline}
          </div>
          <div style={{ fontSize: 26, color: "#9aa0a8", maxWidth: 780 }}>{site.location}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#9aa0a8", borderTop: "1px solid #2b3038", paddingTop: 24 }}>
          <span>{site.url.replace(/^https?:\/\//, "")}</span>
          <span>{site.stack.slice(0, 3).join(" · ")}</span>
        </div>
      </div>
    ),
    size,
  );
}
