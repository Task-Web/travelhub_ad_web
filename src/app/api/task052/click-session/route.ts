import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import {
  createTask052ClickSession,
  createTask052PageToken,
} from "@/lib/task052-click-sessions";
import {
  TASK052_CLIENT_HEADER_NAME,
  TASK052_CLIENT_HEADER_VALUE,
} from "@/lib/task052-protocol";

function canBootstrapPageToken(request: NextRequest): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (
    (fetchSite !== null && fetchSite !== "same-origin") ||
    request.nextUrl.searchParams.has("cookie")
  ) {
    return false;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const requestHost = request.headers.get("host");
  if (!origin || !referer || !requestHost) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    const refererUrl = new URL(referer);
    return (
      originUrl.origin === refererUrl.origin &&
      refererUrl.host === requestHost &&
      refererUrl.protocol === request.nextUrl.protocol &&
      !refererUrl.searchParams.has("cookie")
    );
  } catch {
    return false;
  }
}

// POST /api/task052/click-session - Register the page's click verification key.
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

  let pageToken = payload.page_token;
  if ((!pageToken || typeof pageToken !== "string") && canBootstrapPageToken(request)) {
    pageToken = await createTask052PageToken(userId);
  }

  const result = await createTask052ClickSession(
    userId,
    payload.public_key,
    pageToken
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
