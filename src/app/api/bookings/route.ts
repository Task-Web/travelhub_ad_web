import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/bookings - Fetch bookings from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const status = request.nextUrl.searchParams.get("status");

  let bookings = (state.data as Record<string, unknown>).bookings as
    | Record<string, unknown>[]
    | undefined;
  bookings = Array.isArray(bookings) ? bookings : [];

  if (status) {
    bookings = bookings.filter((booking) => booking.status === status);
  }

  return createResponseWithCookie(
    { bookings, count: bookings.length },
    userId
  );
}

// POST /api/bookings - Create a booking and save to state
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  let booking: Record<string, unknown>;
  try {
    booking = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const state = await stateStore.getState(userId);
  const bookings = Array.isArray((state.data as Record<string, unknown>).bookings)
    ? ((state.data as Record<string, unknown>).bookings as Record<string, unknown>[])
    : [];

  if (!booking.id) {
    booking.id = `BK${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  }
  if (!booking.status) {
    booking.status = "confirmed";
  }
  if (!booking.createdAt) {
    booking.createdAt = new Date().toISOString();
  }

  bookings.push(booking);

  await stateStore.patchState(userId, { bookings }, "Added new booking");

  return createResponseWithCookie(
    { booking, message: "Booking created successfully" },
    userId
  );
}
