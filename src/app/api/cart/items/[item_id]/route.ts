import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// DELETE /api/cart/items/[item_id] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ item_id: string }> }
) {
  const userId = await getUserId(request);
  const { item_id: itemId } = await params;

  const state = await stateStore.getState(userId);
  const cart =
    ((state.data as Record<string, unknown>).cart as Record<string, unknown>) || {
      items: [],
      total: 0,
    };

  const items = Array.isArray(cart.items) ? cart.items : [];
  const filteredItems = items.filter(
    (entry) => String((entry as Record<string, unknown>).id) !== itemId
  );
  const total = filteredItems.reduce(
    (sum, entry) => sum + Number((entry as Record<string, unknown>).price || 0),
    0
  );

  const updatedCart = { items: filteredItems, total };
  await stateStore.patchState(userId, { cart: updatedCart }, "Removed item from cart");

  return createResponseWithCookie(
    { cart: updatedCart, message: "Item removed from cart" },
    userId
  );
}
