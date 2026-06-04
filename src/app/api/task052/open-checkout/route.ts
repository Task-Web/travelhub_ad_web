import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import {
  TASK052_TARGET_HOTEL_ID,
  TASK052_TARGET_HOTEL_NAME,
  TASK052_TARGET_ROOM,
  getTask052Flow,
  patchTask052Flow,
} from "@/lib/task052-flow";

// POST /api/task052/open-checkout - Permit checkout only for the target room selected from details.
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
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
    { allowed: true, next: "/checkout", flow: nextFlow },
    userId
  );
}
