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
