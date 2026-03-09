import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

function parseBoolean(value: string | null): boolean {
  if (!value) return false;
  return value === "true" || value === "1" || value === "yes";
}

// GET /api/flights - Search flights from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);

  const params = request.nextUrl.searchParams;
  const origin = params.get("origin");
  const destination = params.get("destination");
  const cabinClass = params.get("cabin_class") || params.get("cabinClass");
  const directOnly = parseBoolean(
    params.get("direct_only") || params.get("directOnly")
  );

  let flights = (state.data as Record<string, unknown>).flights as
    | Record<string, unknown>[]
    | undefined;
  flights = Array.isArray(flights) ? flights : [];

  if (origin) {
    const target = origin.toUpperCase();
    flights = flights.filter((flight) => String(flight.origin) === target);
  }
  if (destination) {
    const target = destination.toUpperCase();
    flights = flights.filter((flight) => String(flight.destination) === target);
  }
  if (directOnly) {
    flights = flights.filter((flight) => Number(flight.stops || 0) === 0);
  }
  if (cabinClass) {
    flights = flights.filter((flight) => {
      const cabinClasses = flight.cabinClasses as Record<string, unknown> | null;
      return cabinClasses ? cabinClass in cabinClasses : false;
    });
  }

  return createResponseWithCookie(
    { flights, count: flights.length },
    userId
  );
}
