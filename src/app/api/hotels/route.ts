import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const PROPERTY_TYPE_MAP: Record<string, string> = {
  hotels: "hotel",
  apartments: "apartment",
  resorts: "resort",
  villas: "villa",
  cabins: "cabin",
  hostels: "hostel",
};

// GET /api/hotels - Search hotels from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const params = request.nextUrl.searchParams;

  const city = params.get("city");
  const country = params.get("country");
  const propertyType = params.get("property_type");
  const minRating = params.get("min_rating");
  const maxPrice = params.get("max_price");

  let hotels = (state.data as Record<string, unknown>).hotels as
    | Record<string, unknown>[]
    | undefined;
  hotels = Array.isArray(hotels) ? hotels : [];

  if (city) {
    const target = city.toLowerCase();
    hotels = hotels.filter((hotel) =>
      String((hotel.location as Record<string, unknown>)?.city ?? "")
        .toLowerCase()
        .includes(target)
    );
  }
  if (country) {
    const target = country.toLowerCase();
    hotels = hotels.filter((hotel) =>
      String((hotel.location as Record<string, unknown>)?.country ?? "")
        .toLowerCase()
        .includes(target)
    );
  }
  if (propertyType) {
    const target = PROPERTY_TYPE_MAP[propertyType.toLowerCase()] || propertyType.toLowerCase();
    hotels = hotels.filter(
      (hotel) => String(hotel.type ?? "").toLowerCase() === target
    );
  }

  const minRatingValue = minRating ? Number(minRating) : null;
  if (minRatingValue !== null && Number.isFinite(minRatingValue)) {
    hotels = hotels.filter(
      (hotel) => Number(hotel.reviewScore || 0) >= minRatingValue
    );
  }

  const maxPriceValue = maxPrice ? Number(maxPrice) : null;
  if (maxPriceValue !== null && Number.isFinite(maxPriceValue)) {
    hotels = hotels.filter(
      (hotel) => Number(hotel.pricePerNight || 0) <= maxPriceValue
    );
  }

  return createResponseWithCookie({ hotels, count: hotels.length }, userId);
}
