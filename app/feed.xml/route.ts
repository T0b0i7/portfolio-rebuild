import { posts } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const base = site.url.replace(/\/$/, "");

  const items = posts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${base}/writing/${post.slug}</link>
      <guid isPermaLink="true">${base}/writing/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — ${site.role}`)}</title>
    <link>${base}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
