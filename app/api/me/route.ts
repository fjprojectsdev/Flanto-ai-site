import { NextRequest } from "next/server";
import { forwardJson } from "@/lib/flanto-api";
export async function GET(request: NextRequest) { return forwardJson(request, "/me", "GET"); }
