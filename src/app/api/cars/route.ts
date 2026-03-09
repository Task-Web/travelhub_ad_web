import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/cars - Search car rentals from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const params = request.nextUrl.searchParams;

  const location = params.get("location");
  const carType = params.get("car_type");

  let cars = (state.data as Record<string, unknown>).cars as
    | Record<string, unknown>[]
    | undefined;
  cars = Array.isArray(cars) ? cars : [];

  if (location) {
    const target = location.toUpperCase();
    cars = cars.filter((car) =>
      Array.isArray(car.locations)
        ? car.locations.map(String).includes(target)
        : false
    );
  }

  if (carType) {
    const target = carType.toLowerCase();
    cars = cars.filter((car) =>
      String(car.type ?? "").toLowerCase().includes(target)
    );
  }

  return createResponseWithCookie({ cars, count: cars.length }, userId);
}
