import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const BOOKING_FIELDS = [
  "type",
  "confirmationNumber",
  "propertyName",
  "location",
  "checkIn",
  "checkOut",
  "totalPrice",
  "currency",
  "guestName",
  "roomType",
  "image",
  "details",
] as const;

const DETAIL_FIELDS = [
  "time",
  "ticketType",
  "quantity",
  "pricePerTicket",
  "category",
  "duration",
  "adults",
  "children",
  "rooms",
  "specialRequests",
  "paymentMethod",
  "origin",
  "destination",
  "flight",
  "roomType",
  "boardBasis",
  "travelers",
  "pickupLocation",
  "dropoffLocation",
  "pickupTime",
  "dropoffTime",
  "transmission",
  "seats",
  "doors",
  "insurance",
  "passengers",
  "vehicleType",
] as const;

const LEG_FIELDS = [
  "airline",
  "flightNumber",
  "departure",
  "arrival",
  "departureTime",
  "arrivalTime",
  "duration",
  "stops",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const hasOnly = (value: Record<string, unknown>, fields: readonly string[]) =>
  Object.keys(value).every((key) => fields.includes(key));

const isFlightLeg = (value: unknown) => {
  if (!isRecord(value) || !hasOnly(value, LEG_FIELDS)) return false;
  return LEG_FIELDS.every((field) =>
    field === "stops"
      ? typeof value[field] === "number" && Number.isInteger(value[field]) && value[field] >= 0
      : typeof value[field] === "string" && value[field].length > 0
  );
};

const isFlightDetails = (value: unknown) => {
  if (!isRecord(value) || !hasOnly(value, ["outbound", "return"])) return false;
  return isFlightLeg(value.outbound) && isFlightLeg(value.return);
};

const isBookingDetails = (value: unknown) => {
  if (!isRecord(value) || !hasOnly(value, DETAIL_FIELDS)) return false;
  return Object.entries(value).every(([key, entry]) => {
    if (key === "flight") return isFlightDetails(entry);
    return typeof entry === "string" || (typeof entry === "number" && Number.isFinite(entry));
  });
};

const isBookingInput = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value) || !hasOnly(value, BOOKING_FIELDS)) return false;
  const requiredStrings = [
    "confirmationNumber",
    "propertyName",
    "location",
    "checkIn",
    "checkOut",
    "currency",
    "guestName",
  ];
  return ["hotel", "car", "attraction"].includes(String(value.type))
    && requiredStrings.every((field) => typeof value[field] === "string" && value[field].length > 0)
    && typeof value.totalPrice === "number" && Number.isFinite(value.totalPrice) && value.totalPrice >= 0
    && (value.roomType === undefined || typeof value.roomType === "string")
    && (value.image === undefined || typeof value.image === "string")
    && isBookingDetails(value.details);
};

// GET /api/bookings - Fetch bookings from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const status = request.nextUrl.searchParams.get("status");
  const stored = (state.data as Record<string, unknown>).bookings;
  let bookings = Array.isArray(stored) ? (stored as Record<string, unknown>[]) : [];

  if (status) bookings = bookings.filter((booking) => booking.status === status);

  return createResponseWithCookie({ bookings, count: bookings.length }, userId);
}

// POST /api/bookings - Create a confirmed booking from checkout details.
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }
  if (!isBookingInput(body)) {
    return createResponseWithCookie({ detail: "Invalid booking request" }, userId, 422);
  }

  const state = await stateStore.getState(userId);
  const stored = (state.data as Record<string, unknown>).bookings;
  const bookings = Array.isArray(stored) ? (stored as Record<string, unknown>[]) : [];
  const booking = {
    ...body,
    id: `BK${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  await stateStore.patchState(userId, { bookings: [...bookings, booking] }, "Added new booking");

  return createResponseWithCookie(
    { booking, message: "Booking created successfully" },
    userId
  );
}
