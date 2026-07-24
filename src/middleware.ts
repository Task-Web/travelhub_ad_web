import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME =
  process.env.COOKIE_NAME ||
  process.env.NEXT_PUBLIC_COOKIE_NAME ||
  "user_id";
const COOKIE_MAX_AGE =
  Number(process.env.COOKIE_MAX_AGE || process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) ||
  60 * 60 * 24 * 30;

function createNonce(): string {
  return btoa(crypto.randomUUID());
}

function buildContentSecurityPolicy(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  const connectSrc = ["'self'"];

  if (isDevelopment) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push("ws:", "wss:");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    "img-src 'self' data: blob: https://images.unsplash.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  const isDocumentNavigation =
    request.headers.get("sec-fetch-dest") === "document" &&
    request.headers.get("sec-fetch-mode") === "navigate";
  const hasCookieOverride = request.nextUrl.searchParams.has("cookie");
  const existingUserId = request.cookies.get(COOKIE_NAME)?.value;
  const newUserId =
    isDocumentNavigation && !hasCookieOverride && !existingUserId
      ? crypto.randomUUID()
      : null;

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  if (isDocumentNavigation) {
    requestHeaders.set("x-task052-document-navigation", "1");
  }
  if (newUserId) {
    const existingCookieHeader = request.headers.get("cookie");
    const userCookie = `${COOKIE_NAME}=${newUserId}`;
    requestHeaders.set(
      "cookie",
      existingCookieHeader
        ? `${existingCookieHeader}; ${userCookie}`
        : userCookie
    );
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  if (newUserId) {
    response.cookies.set(COOKIE_NAME, newUserId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|vite.svg).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
