import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { consumeTask052ClickProof } from "@/lib/task052-click-sessions";
import { patchTask052Flow } from "@/lib/task052-flow";
import {
  TASK052_CLIENT_HEADER_NAME,
  TASK052_CLIENT_HEADER_VALUE,
} from "@/lib/task052-protocol";

// POST /api/task052/ad-closed - Record closing the search-page ad popup.
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

  const proofResult = await consumeTask052ClickProof(
    userId,
    payload.click_proof,
    "close_ad"
  );
  if (!proofResult.ok) {
    return createResponseWithCookie(
      { allowed: false, detail: proofResult.detail },
      userId,
      proofResult.status
    );
  }

  const flow = await patchTask052Flow(
    userId,
    { ad_closed: true },
    "Task 052 ad closed"
  );

  return createResponseWithCookie(
    { allowed: true, next_click_challenge: proofResult.next_challenge, flow },
    userId
  );
}
