import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// POST /api/cart/items - Add item to cart
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  let item: Record<string, unknown>;
  try {
    item = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const state = await stateStore.getState(userId);
  const cart =
    ((state.data as Record<string, unknown>).cart as Record<string, unknown>) || {
      items: [],
      total: 0,
    };

  const items = Array.isArray(cart.items) ? cart.items : [];
  if (!item.id) {
    item.id = uuidv4().replace(/-/g, "").slice(0, 8);
  }

  items.push(item);
  const total = items.reduce(
    (sum, entry) => sum + Number((entry as Record<string, unknown>).price || 0),
    0
  );

  const updatedCart = { items, total };
  await stateStore.patchState(userId, { cart: updatedCart }, "Added item to cart");

  return createResponseWithCookie(
    { cart: updatedCart, message: "Item added to cart" },
    userId
  );
}
