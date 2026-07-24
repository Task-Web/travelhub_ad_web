import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const PRODUCT_KEYS = [
  "preferences", "airports", "flights", "hotels", "cars", "attractions",
  "bookings", "cart", "search",
] as const;

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const workspace = Object.fromEntries(
    PRODUCT_KEYS.filter((key) => key in state.data).map((key) => [key, state.data[key]]),
  );
  return createResponseWithCookie({ user_id: userId, workspace }, userId);
}
