import { NextRequest, NextResponse } from "next/server";
import { getUserId, createResponseWithCookie, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/packages/[package_id] - Fetch a package by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ package_id: string }> }
) {
  const userId = await getUserId(request);
  const { package_id: packageId } = await params;
  const state = await stateStore.getState(userId);
  const packages = Array.isArray(
    (state.data as Record<string, unknown>).packages
  )
    ? ((state.data as Record<string, unknown>).packages as Record<
        string,
        unknown
      >[])
    : [];

  const pkg = packages.find((item) => String(item.id) === packageId);
  if (!pkg) {
    const response = NextResponse.json(
      { detail: "Package not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  return createResponseWithCookie({ package: pkg }, userId);
}
