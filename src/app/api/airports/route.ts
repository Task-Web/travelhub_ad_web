import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/airports - Search airports from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const q = request.nextUrl.searchParams.get("q");

  let airports = (state.data as Record<string, unknown>).airports as
    | Record<string, unknown>[]
    | undefined;
  airports = Array.isArray(airports) ? airports : [];

  if (q) {
    const qLower = q.toLowerCase();
    airports = airports.filter((airport) => {
      const code = String(airport.code ?? "").toLowerCase();
      const name = String(airport.name ?? "").toLowerCase();
      const city = String(airport.city ?? "").toLowerCase();
      const country = String(airport.country ?? "").toLowerCase();
      return (
        code.includes(qLower) ||
        name.includes(qLower) ||
        city.includes(qLower) ||
        country.includes(qLower)
      );
    });
  }

  return createResponseWithCookie(
    { airports, count: airports.length },
    userId
  );
}
