import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/flanto-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const slot = request.nextUrl.searchParams.get("slot");
  if (!slot) return new NextResponse("Not found", { status: 404 });
  const upstream = await apiFetch(request, `/site/media?slot=${encodeURIComponent(slot)}`, { method: "GET" });
  return new NextResponse(await upstream.arrayBuffer(), { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") || "application/octet-stream", "Cache-Control": "public, max-age=3600" } });
}
