import { NextRequest } from "next/server";
import { forwardJson } from "@/lib/flanto-api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) { return forwardJson(request, "/site/admin/content"); }
