import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const COOKIE_NAME =
  process.env.COOKIE_NAME ||
  process.env.NEXT_PUBLIC_COOKIE_NAME ||
  "user_id";
export const COOKIE_MAX_AGE =
  Number(process.env.COOKIE_MAX_AGE || process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) ||
  60 * 60 * 24 * 30; // 30 days

// Get user ID from request (query param > cookie > generate new)
// This implements the constitution requirement for cookie override via query parameter
export async function getUserId(request: NextRequest): Promise<string> {
  // Check for cookie override in query params (constitutional requirement)
  const cookieOverride = request.nextUrl.searchParams.get("cookie");
  if (cookieOverride) {
    return cookieOverride;
  }

  // Check for existing cookie
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME);
  if (existingCookie?.value) {
    return existingCookie.value;
  }

  // Generate new user ID
  return uuidv4();
}

// Set user cookie on response
export function setUserCookie(response: NextResponse, userId: string): void {
  response.cookies.set(COOKIE_NAME, userId, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

// Create a response with the user cookie set
export function createResponseWithCookie<T>(
  data: T,
  userId: string,
  status: number = 200
): NextResponse<T> {
  const response = NextResponse.json(data, { status });
  setUserCookie(response, userId);
  return response;
}
