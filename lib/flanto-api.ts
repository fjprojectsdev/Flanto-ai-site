import { NextRequest, NextResponse } from "next/server";

const baseUrl = String(process.env.FLANTO_API_BASE_URL || "").replace(/\/+$/, "");

export function apiUrl(path: string) {
  if (!baseUrl.startsWith("https://")) throw new Error("API indisponível");
  return `${baseUrl}${path}`;
}

export async function apiFetch(request: NextRequest, path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("Cookie", cookie);
  return fetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}

export async function forwardJson(request: NextRequest, path: string, method = "POST") {
  const body = method === "GET" ? undefined : await request.text();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body) headers["Content-Type"] = request.headers.get("content-type") || "application/json";
  const upstream = await apiFetch(request, path, { method, headers, body });
  const response = new NextResponse(await upstream.text(), { status: upstream.status });
  response.headers.set("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
  response.headers.set("Cache-Control", "no-store");
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) response.headers.set("Set-Cookie", setCookie);
  return response;
}
