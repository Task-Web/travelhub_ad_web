import { NextRequest, NextResponse } from "next/server";
import { getUserId, createResponseWithCookie, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

type BookingRecord = Record<string, unknown>;

const getBookings = (state: Record<string, unknown>) => {
  const raw = state.bookings;
  return Array.isArray(raw) ? (raw as BookingRecord[]) : [];
};

// GET /api/bookings/[booking_id] - Fetch a booking by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ booking_id: string }> }
) {
  const userId = await getUserId(request);
  const { booking_id: bookingId } = await params;
  const state = await stateStore.getState(userId);
  const bookings = getBookings(state.data as Record<string, unknown>);

  const booking = bookings.find((item) => String(item.id) === bookingId);
  if (!booking) {
    const response = NextResponse.json(
      { detail: "Booking not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  return createResponseWithCookie({ booking }, userId);
}

// PATCH /api/bookings/[booking_id] - Update a booking in user state
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ booking_id: string }> }
) {
  const userId = await getUserId(request);
  const { booking_id: bookingId } = await params;

  let updates: BookingRecord;
  try {
    updates = (await request.json()) as BookingRecord;
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const state = await stateStore.getState(userId);
  const bookings = getBookings(state.data as Record<string, unknown>);
  const index = bookings.findIndex((item) => String(item.id) === bookingId);

  if (index === -1) {
    const response = NextResponse.json(
      { detail: "Booking not found" },
      { status: 404 }
    );
    setUserCookie(response, userId);
    return response;
  }

  const updated = {
    ...bookings[index],
    ...updates,
    id: bookingId,
    updatedAt: new Date().toISOString(),
  };

  const nextBookings = [...bookings];
  nextBookings[index] = updated;
  await stateStore.patchState(
    userId,
    { bookings: nextBookings },
    `Updated booking ${bookingId}`
  );

  return createResponseWithCookie(
    { booking: updated, message: "Booking updated successfully" },
    userId
  );
}
