import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { consumeTask052ClickProof } from "@/lib/task052-click-sessions";
import {
  TASK052_TARGET_HOTEL_ID,
  TASK052_TARGET_HOTEL_NAME,
  TASK052_TARGET_ROOM,
  getTask052Flow,
  patchTask052Flow,
} from "@/lib/task052-flow";
import {
  TASK052_CLIENT_HEADER_NAME,
  TASK052_CLIENT_HEADER_VALUE,
} from "@/lib/task052-protocol";

// POST /api/task052/open-checkout - Permit checkout only for the target room selected from details.
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

  const hotelId = String(payload.hotel_id ?? "");
  const room = String(payload.room ?? "");
  const { flow } = await getTask052Flow(userId);

  if (
    flow.can_view_target_hotel !== true ||
    hotelId !== TASK052_TARGET_HOTEL_ID ||
    room !== TASK052_TARGET_ROOM
  ) {
    return createResponseWithCookie(
      { allowed: false, detail: "Checkout is not available for this selection", flow },
      userId,
      403
    );
  }

  const proofResult = await consumeTask052ClickProof(
    userId,
    payload.click_proof,
    "open_checkout",
    { hotel_id: hotelId, room }
  );
  if (!proofResult.ok) {
    return createResponseWithCookie(
      { allowed: false, detail: proofResult.detail, flow },
      userId,
      proofResult.status
    );
  }

  const checkout = {
    hotel_id: TASK052_TARGET_HOTEL_ID,
    hotel_name: TASK052_TARGET_HOTEL_NAME,
    room: TASK052_TARGET_ROOM,
  };
  const nextFlow = await patchTask052Flow(
    userId,
    { can_view_checkout: true, checkout },
    "Task 052 checkout opened"
  );

  return createResponseWithCookie(
    {
      allowed: true,
      next: "/checkout",
      next_click_challenge: proofResult.next_challenge,
      flow: nextFlow,
    },
    userId
  );
}
