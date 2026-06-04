import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";
import { fileStore } from "@/lib/file-store";
import { StateResponse, StateRequest, StatePatchRequest } from "@/lib/types";

function shouldMergeTask052Seed(data: Record<string, unknown>): boolean {
  return (
    Object.keys(data).length === 1 &&
    data.task052 !== null &&
    typeof data.task052 === "object" &&
    !Array.isArray(data.task052)
  );
}

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

  const payloadData = payload.data || {};
  const data = shouldMergeTask052Seed(payloadData)
    ? {
        ...(await stateStore.getState(userId)).data,
        ...payloadData,
      }
    : payloadData;

  const nextState: {
    data: Record<string, unknown>;
    note: string | null;
    meta?: StateRequest["meta"];
  } = {
    data,
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
