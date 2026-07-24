import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { canShowTask052Checkout, getTask052Flow, patchTask052Flow } from "@/lib/task052-flow";

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  let body: unknown;
  try { body = await request.json(); } catch { return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length) return createResponseWithCookie({ detail: "This action accepts no fields" }, userId, 422);
  const { flow, initialized } = await getTask052Flow(userId);
  if (!initialized || !canShowTask052Checkout(flow)) return createResponseWithCookie({ detail: "Checkout is not available" }, userId, 409);
  const next = await patchTask052Flow(userId, { checkout_page_visited: true }, "Task 052 checkout reached");
  return createResponseWithCookie({ checkout_page_visited: next.checkout_page_visited }, userId);
}
