import { NextRequest, NextResponse } from "next/server";
import { getUserId, createResponseWithCookie, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/cars/[car_id] - Fetch a car by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ car_id: string }> }
) {
  const userId = await getUserId(request);
  const { car_id: carId } = await params;
  const state = await stateStore.getState(userId);
  const cars = Array.isArray((state.data as Record<string, unknown>).cars)
    ? ((state.data as Record<string, unknown>).cars as Record<string, unknown>[])
    : [];

  const car = cars.find((item) => String(item.id) === carId);
  if (!car) {
    const response = NextResponse.json(
      { detail: "Car not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  return createResponseWithCookie({ car }, userId);
}
