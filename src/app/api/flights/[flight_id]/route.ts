import { NextRequest, NextResponse } from "next/server";
import { getUserId, createResponseWithCookie, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/flights/[flight_id] - Fetch a flight by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ flight_id: string }> }
) {
  const userId = await getUserId(request);
  const { flight_id: flightId } = await params;
  const state = await stateStore.getState(userId);
  const flights = Array.isArray((state.data as Record<string, unknown>).flights)
    ? ((state.data as Record<string, unknown>).flights as Record<string, unknown>[])
    : [];

  const flight = flights.find((item) => String(item.id) === flightId);
  if (!flight) {
    const response = NextResponse.json(
      { detail: "Flight not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  return createResponseWithCookie({ flight }, userId);
}
