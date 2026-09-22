import { NextRequest } from "next/server";
import { forwardJson } from "@/lib/flanto-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) { return forwardJson(request, "/site/data", "GET"); }
