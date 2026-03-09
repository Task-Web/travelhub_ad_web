import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/cart - Fetch cart from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const cart =
    ((state.data as Record<string, unknown>).cart as Record<string, unknown>) || {
      items: [],
      total: 0,
    };

  return createResponseWithCookie({ cart }, userId);
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request);
  const cart = { items: [], total: 0 };
  await stateStore.patchState(userId, { cart }, "Cleared cart");
  return createResponseWithCookie({ cart, message: "Cart cleared" }, userId);
}
