import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { InfoResponse } from "@/lib/types";
import os from "os";

const APP_NAME = process.env.APP_NAME || "TravelHub Web";

// GET /api/info - System and request info
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  const runtimeEnv: Record<string, string> = {
    node_version: process.version,
    platform: os.platform(),
    env_mode: process.env.NODE_ENV || "development",
  };

  const requestInfo: Record<string, unknown> = {
    client: request.headers.get("x-forwarded-for") || "unknown",
    headers: Object.fromEntries(request.headers.entries()),
    path: request.nextUrl.pathname,
    method: request.method,
    user_id: userId,
  };

  const response: InfoResponse = {
    app_name: APP_NAME,
    node_version: process.version,
    env: runtimeEnv,
    request: requestInfo,
  };

  return createResponseWithCookie(response, userId);
}
