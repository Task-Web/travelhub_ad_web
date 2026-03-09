import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";
import { fileStore } from "@/lib/file-store";
import { StateResponse, StateRequest, StatePatchRequest } from "@/lib/types";

// GET /api/state - Retrieve current user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);

  const response: StateResponse = {
    user_id: userId,
    state,
  };

  return createResponseWithCookie(response, userId);
}

// PUT /api/state - Replace entire state
export async function PUT(request: NextRequest) {
  const userId = await getUserId(request);

  let payload: StateRequest;
  try {
    payload = await request.json();
  } catch {
    return createResponseWithCookie(
      { detail: "Invalid JSON body" },
      userId,
      400
    );
  }

  const nextState: {
    data: Record<string, unknown>;
    note: string | null;
    meta?: StateRequest["meta"];
  } = {
    data: payload.data || {},
    note: payload.note ?? null,
  };

  if (payload.meta) {
    nextState.meta = payload.meta;
  }

  const state = await stateStore.replaceState(userId, nextState);

  const response: StateResponse = {
    user_id: userId,
    state,
  };

  return createResponseWithCookie(response, userId);
}

// PATCH /api/state - Merge into existing state
export async function PATCH(request: NextRequest) {
  const userId = await getUserId(request);

  let payload: StatePatchRequest;
  try {
    payload = await request.json();
  } catch {
    return createResponseWithCookie(
      { detail: "Invalid JSON body" },
      userId,
      400
    );
  }

  const state = await stateStore.patchState(
    userId,
    payload.data || {},
    payload.note
  );

  const response: StateResponse = {
    user_id: userId,
    state,
  };

  return createResponseWithCookie(response, userId);
}

// DELETE /api/state - Reset and clear state
export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request);

  // Delete user files first
  await fileStore.deleteUserFiles(userId);

  // Reset state
  const state = await stateStore.resetState(userId);

  const response: StateResponse = {
    user_id: userId,
    state,
  };

  return createResponseWithCookie(response, userId);
}
