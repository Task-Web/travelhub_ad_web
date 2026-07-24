import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/preferences - Fetch preferences
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const preferences =
    ((state.data as Record<string, unknown>).preferences as Record<string, unknown>) ||
    {};

  return createResponseWithCookie({ preferences }, userId);
}

// PATCH /api/preferences - Update preferences
export async function PATCH(request: NextRequest) {
  const userId = await getUserId(request);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const allowed = ["currency", "language", "dateFormat", "measurementUnit"];
  if (Object.keys(payload).some((key) => !allowed.includes(key))) {
    return createResponseWithCookie({ detail: "Unknown or internal fields are not allowed" }, userId, 422);
  }
  if ("currency" in payload && (typeof payload.currency !== "string" || !["USD", "EUR", "GBP", "HKD", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD"].includes(payload.currency))) {
    return createResponseWithCookie({ detail: "Invalid currency" }, userId, 422);
  }
  if ("language" in payload && typeof payload.language !== "string") {
    return createResponseWithCookie({ detail: "Invalid language" }, userId, 422);
  }

  const state = await stateStore.getState(userId);
  const currentPrefs =
    ((state.data as Record<string, unknown>).preferences as Record<string, unknown>) ||
    {};

  const updatedPrefs = { ...currentPrefs, ...payload };
  await stateStore.patchState(
    userId,
    { preferences: updatedPrefs },
    "Updated preferences"
  );

  return createResponseWithCookie(
    { preferences: updatedPrefs, message: "Preferences updated" },
    userId
  );
}
