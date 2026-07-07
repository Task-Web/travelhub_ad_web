import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { consumeTask052ClickProof } from "@/lib/task052-click-sessions";
import {
  TASK052_TARGET_HOTEL_ID,
  getTask052Flow,
  patchTask052Flow,
} from "@/lib/task052-flow";
import {
  TASK052_CLIENT_HEADER_NAME,
  TASK052_CLIENT_HEADER_VALUE,
} from "@/lib/task052-protocol";

// POST /api/task052/open-hotel - Permit opening the target hotel after the ad is closed.
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
  const { flow } = await getTask052Flow(userId);
  if (hotelId !== TASK052_TARGET_HOTEL_ID || flow.ad_closed !== true) {
    return createResponseWithCookie(
      { allowed: false, detail: "Target hotel is not available yet", flow },
      userId,
      403
    );
  }

  const proofResult = await consumeTask052ClickProof(
    userId,
    payload.click_proof,
    "open_hotel",
    { hotel_id: hotelId }
  );
  if (!proofResult.ok) {
    return createResponseWithCookie(
      { allowed: false, detail: proofResult.detail, flow },
      userId,
      proofResult.status
    );
  }

  const nextFlow = await patchTask052Flow(
    userId,
    { can_view_target_hotel: true },
    "Task 052 target hotel opened"
  );

  return createResponseWithCookie(
    {
      allowed: true,
      next: `/hotel/${TASK052_TARGET_HOTEL_ID}`,
      next_click_challenge: proofResult.next_challenge,
      flow: nextFlow,
    },
    userId
  );
}
