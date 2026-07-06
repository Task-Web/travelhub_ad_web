import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";
import { fileStore } from "@/lib/file-store";
import { StateResponse, StateRequest, StatePatchRequest } from "@/lib/types";
import { getTask052Flow } from "@/lib/task052-flow";
import {
  shouldMergeTask052Seed,
  validateTask052StatePatch,
  validateTask052StatePut,
} from "@/lib/task052-state-guard";

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
  const task052Validation = validateTask052StatePut(payloadData);
  if (!task052Validation.ok) {
    return createResponseWithCookie(
      { detail: task052Validation.detail },
      userId,
      task052Validation.status
    );
  }

  let data = payloadData;
  if (shouldMergeTask052Seed(payloadData)) {
    const retainedData: Record<string, unknown> = {
      ...(await stateStore.getState(userId)).data,
    };
    data = {
      ...retainedData,
      ...payloadData,
      task052_click_sessions: [],
      task052_page_tokens: [],
    };
  }

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

  const payloadData = payload.data || {};
  const { flow } = await getTask052Flow(userId);
  const task052Validation = validateTask052StatePatch(payloadData, flow);
  if (!task052Validation.ok) {
    return createResponseWithCookie(
      { detail: task052Validation.detail },
      userId,
      task052Validation.status
    );
  }

  const state = await stateStore.patchState(
    userId,
    payloadData,
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
