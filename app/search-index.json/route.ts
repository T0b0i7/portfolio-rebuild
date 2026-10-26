import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search-index";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(buildSearchIndex(), {
    headers: { "cache-control": "public, max-age=0, s-maxage=3600" },
  });
}
