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

  const details = item.details;
  const detailKeys = ["itemId", "productId", "startDate", "endDate", "travelers", "quantity", "roomType", "cabinClass", "pickupLocation", "dropoffLocation"];
  const detailsValid = details === undefined || (Boolean(details)
    && typeof details === "object" && !Array.isArray(details)
    && Object.keys(details as Record<string, unknown>).every((key) => detailKeys.includes(key))
    && Object.values(details as Record<string, unknown>).every((value) => ["string", "number", "boolean"].includes(typeof value)));
  if (Object.keys(item).some((key) => !["id", "type", "name", "price", "details"].includes(key))
    || ("id" in item && typeof item.id !== "string")
    || typeof item.type !== "string" || typeof item.name !== "string"
    || typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0
    || !detailsValid) {
    return createResponseWithCookie({ detail: "Invalid cart item" }, userId, 422);
  }

  const state = await stateStore.getState(userId);
  const cart =
    ((state.data as Record<string, unknown>).cart as Record<string, unknown>) || {
      items: [],
      total: 0,
    };

  const items = Array.isArray(cart.items) ? [...cart.items] : [];
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
