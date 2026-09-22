import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/flanto-api";

export const dynamic = "force-dynamic";

const lastConfirmedRanking = {
  season: { name: "Temporada 1", startsAt: "2026-09-05T04:32:02.425Z" },
  ranking: [
    { position: 1, displayName: "Tácilla 🖤", points: 35080, victories: 1341 },
    { position: 2, displayName: "diano 🇵🇹", points: 26740, victories: 1255 },
    { position: 3, displayName: "Lohanny🍓", points: 18680, victories: 886 },
    { position: 4, displayName: "sena🏄🏽‍♂️", points: 14260, victories: 622 },
    { position: 5, displayName: "Silva 🍃", points: 10965, victories: 375 },
    { position: 6, displayName: "ryan", points: 8500, victories: 297 },
    { position: 7, displayName: "Nathan", points: 8345, victories: 272 },
    { position: 8, displayName: "Letícia Santos", points: 7720, victories: 274 },
    { position: 9, displayName: "Jonatas Galvão", points: 7120, victories: 237 },
    { position: 10, displayName: "ana", points: 5220, victories: 236 },
  ],
};

export async function GET() {
  try {
    const response = await fetch(apiUrl("/public/ranking"), { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`Upstream ${response.status}`);
    const data = await response.json();
    if (!data?.success || !Array.isArray(data.ranking)) throw new Error("Invalid ranking response");
    return NextResponse.json({ success: true, live: true, season: data.season, ranking: data.ranking.slice(0, 10) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ success: true, live: false, ...lastConfirmedRanking }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
