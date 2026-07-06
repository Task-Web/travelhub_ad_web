import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { issueTask052ActionToken } from "@/lib/task052-action-tokens";
import { consumeTask052ClickProof } from "@/lib/task052-click-sessions";
import {
  TASK052_TARGET_HOTEL_ID,
  TASK052_TARGET_ROOM,
  getTask052Flow,
} from "@/lib/task052-flow";
import {
  TASK052_CLIENT_HEADER_NAME,
  TASK052_CLIENT_HEADER_VALUE,
  isTask052Action,
  normalizeTask052ActionTarget,
} from "@/lib/task052-protocol";

// POST /api/task052/action-token - Grant one-time tokens for task 052 UI actions.
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  if (
    request.headers.get(TASK052_CLIENT_HEADER_NAME) !==
    TASK052_CLIENT_HEADER_VALUE
  ) {
    return createResponseWithCookie(
      { allowed: false, detail: "Missing task client header" },
      userId,
      403
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const action = payload.action;
  if (!isTask052Action(action)) {
    return createResponseWithCookie(
      { allowed: false, detail: "Invalid task action" },
      userId,
      400
    );
  }

  const target = normalizeTask052ActionTarget(action, {
    hotel_id: String(payload.hotel_id ?? ""),
    room: String(payload.room ?? ""),
  });
  const { flow } = await getTask052Flow(userId);

  if (
    action === "open_hotel" &&
    (flow.ad_closed !== true || target.hotel_id !== TASK052_TARGET_HOTEL_ID)
  ) {
    return createResponseWithCookie(
      { allowed: false, detail: "Target hotel is not available yet" },
      userId,
      403
    );
  }

  if (
    action === "open_checkout" &&
    (flow.can_view_target_hotel !== true ||
      target.hotel_id !== TASK052_TARGET_HOTEL_ID ||
      target.room !== TASK052_TARGET_ROOM)
  ) {
    return createResponseWithCookie(
      { allowed: false, detail: "Checkout is not available for this selection" },
      userId,
      403
    );
  }

  const clickProofResult = await consumeTask052ClickProof(
    userId,
    payload.click_proof,
    action,
    target
  );
  if (!clickProofResult.ok) {
    return createResponseWithCookie(
      { allowed: false, detail: clickProofResult.detail },
      userId,
      clickProofResult.status
    );
  }

  const actionToken = await issueTask052ActionToken(userId, action, target);

  return createResponseWithCookie(
    {
      allowed: true,
      action_token: actionToken,
      next_click_challenge: clickProofResult.next_challenge,
    },
    userId
  );
}
