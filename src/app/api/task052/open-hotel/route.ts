import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import {
  TASK052_TARGET_HOTEL_ID,
  getTask052Flow,
  patchTask052Flow,
} from "@/lib/task052-flow";

// POST /api/task052/open-hotel - Permit opening the target hotel after the ad is closed.
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
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

  const nextFlow = await patchTask052Flow(
    userId,
    { can_view_target_hotel: true },
    "Task 052 target hotel opened"
  );

  return createResponseWithCookie(
    { allowed: true, next: `/hotel/${TASK052_TARGET_HOTEL_ID}`, flow: nextFlow },
    userId
  );
}
