import { NextRequest } from "next/server";
import { forwardJson } from "@/lib/flanto-api";
export async function POST(request: NextRequest) { return forwardJson(request, "/auth/logout"); }
