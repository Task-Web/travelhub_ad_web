import { NextRequest, NextResponse } from "next/server";
import { getUserId, createResponseWithCookie, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/attractions/[attraction_id] - Fetch an attraction by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attraction_id: string }> }
) {
  const userId = await getUserId(request);
  const { attraction_id: attractionId } = await params;
  const state = await stateStore.getState(userId);
  const attractions = Array.isArray(
    (state.data as Record<string, unknown>).attractions
  )
    ? ((state.data as Record<string, unknown>).attractions as Record<
        string,
        unknown
      >[])
    : [];

  const attraction = attractions.find(
    (item) => String(item.id) === attractionId
  );
  if (!attraction) {
    const response = NextResponse.json(
      { detail: "Attraction not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  return createResponseWithCookie({ attraction }, userId);
}
