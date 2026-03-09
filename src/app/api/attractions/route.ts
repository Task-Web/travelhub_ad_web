import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/attractions - Search attractions from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const params = request.nextUrl.searchParams;

  const city = params.get("city");
  const category = params.get("category");

  let attractions = (state.data as Record<string, unknown>).attractions as
    | Record<string, unknown>[]
    | undefined;
  attractions = Array.isArray(attractions) ? attractions : [];

  if (city) {
    const target = city.toLowerCase();
    attractions = attractions.filter((attraction) =>
      String((attraction.location as Record<string, unknown>)?.city ?? "")
        .toLowerCase()
        .includes(target)
    );
  }

  if (category) {
    const target = category.toLowerCase();
    attractions = attractions.filter((attraction) =>
      String(attraction.category ?? "").toLowerCase().includes(target)
    );
  }

  return createResponseWithCookie(
    { attractions, count: attractions.length },
    userId
  );
}
