import { NextRequest, NextResponse } from "next/server";
import { getUserId, createResponseWithCookie, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/hotels/[hotel_id] - Fetch a hotel by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hotel_id: string }> }
) {
  const userId = await getUserId(request);
  const { hotel_id: hotelId } = await params;
  const state = await stateStore.getState(userId);
  const hotels = Array.isArray((state.data as Record<string, unknown>).hotels)
    ? ((state.data as Record<string, unknown>).hotels as Record<string, unknown>[])
    : [];

  const hotel = hotels.find((item) => String(item.id) === hotelId);
  if (!hotel) {
    const response = NextResponse.json(
      { detail: "Hotel not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  return createResponseWithCookie({ hotel }, userId);
}
