import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { createTask052ClickSession } from "@/lib/task052-click-sessions";
import {
  TASK052_CLIENT_HEADER_NAME,
  TASK052_CLIENT_HEADER_VALUE,
} from "@/lib/task052-protocol";

// POST /api/task052/click-session - Register the page's non-exportable click signing key.
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

  const result = await createTask052ClickSession(
    userId,
    payload.public_key,
    payload.page_token
  );
  if (!result.ok) {
    return createResponseWithCookie(
      { allowed: false, detail: result.detail },
      userId,
      result.status
    );
  }

  return createResponseWithCookie(
    {
      allowed: true,
      click_session_id: result.session_id,
      click_challenge: result.challenge,
    },
    userId
  );
}
