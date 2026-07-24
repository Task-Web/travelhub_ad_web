import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const auth = isRecord(state.data.auth) ? state.data.auth : {};
  const session = {
    isAuthenticated: auth.isAuthenticated === true,
    ...(typeof auth.email === "string" ? { email: auth.email } : {}),
    ...(typeof auth.provider === "string" ? { provider: auth.provider } : {}),
    ...(typeof auth.authenticatedAt === "string" ? { authenticatedAt: auth.authenticatedAt } : {}),
  };
  return createResponseWithCookie({ session }, userId);
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  let body: unknown;
  try { body = await request.json(); } catch { return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400); }
  if (!isRecord(body) || Object.keys(body).some((key) => !["email", "provider"].includes(key))) {
    return createResponseWithCookie({ detail: "Unknown or internal fields are not allowed" }, userId, 422);
  }
  if (typeof body.email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)
    || typeof body.provider !== "string" || !["email", "google", "apple", "facebook"].includes(body.provider)) {
    return createResponseWithCookie({ detail: "Invalid account session" }, userId, 422);
  }
  const auth = { isAuthenticated: true, provider: body.provider, email: body.email, authenticatedAt: new Date().toISOString() };
  await stateStore.patchState(userId, { auth }, `Authenticated via ${body.provider}`);
  return createResponseWithCookie({ session: auth }, userId);
}
