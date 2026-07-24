import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const DEFAULT_SEARCH = { lastQuery: null, filters: {}, history: [] };
const QUERY_FIELDS = [
  "type",
  "origin",
  "originCode",
  "destination",
  "destCode",
  "departDate",
  "returnDate",
  "travelers",
  "cabinClass",
  "tripType",
] as const;
const FILTER_FIELDS = ["directOnly", "maxPrice", "minRating", "stops", "airlines"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const isFlightQuery = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value) || Object.keys(value).some((key) => !QUERY_FIELDS.includes(key as (typeof QUERY_FIELDS)[number]))) {
    return false;
  }
  const optionalStrings = ["originCode", "destCode", "returnDate"];
  return value.type === "flights"
    && ["origin", "destination", "departDate"].every((field) => typeof value[field] === "string" && value[field].length > 0)
    && optionalStrings.every((field) => value[field] === undefined || typeof value[field] === "string")
    && typeof value.travelers === "number" && Number.isInteger(value.travelers) && value.travelers > 0
    && ["economy", "premium-economy", "business", "first"].includes(String(value.cabinClass))
    && ["round-trip", "one-way", "multi-city"].includes(String(value.tripType));
};

const isFilters = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value) || Object.keys(value).some((key) => !FILTER_FIELDS.includes(key as (typeof FILTER_FIELDS)[number]))) {
    return false;
  }
  return (value.directOnly === undefined || typeof value.directOnly === "boolean")
    && ["maxPrice", "minRating", "stops"].every((field) =>
      value[field] === undefined || (typeof value[field] === "number" && Number.isFinite(value[field]) && value[field] >= 0)
    )
    && (value.airlines === undefined || (Array.isArray(value.airlines) && value.airlines.every((entry) => typeof entry === "string")));
};

// GET /api/search - Fetch product search history and filters.
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const stored = (state.data as Record<string, unknown>).search;
  const search = isRecord(stored) ? stored : DEFAULT_SEARCH;
  return createResponseWithCookie({ search }, userId);
}

// PATCH /api/search - Save a flight search and/or supported search filters.
export async function PATCH(request: NextRequest) {
  const userId = await getUserId(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  if (!isRecord(body)
    || Object.keys(body).length === 0
    || Object.keys(body).some((key) => !["lastQuery", "filters"].includes(key))
    || (body.lastQuery !== undefined && body.lastQuery !== null && !isFlightQuery(body.lastQuery))
    || (body.filters !== undefined && !isFilters(body.filters))) {
    return createResponseWithCookie({ detail: "Invalid search update" }, userId, 422);
  }

  const state = await stateStore.getState(userId);
  const stored = (state.data as Record<string, unknown>).search;
  const search = isRecord(stored) ? { ...stored } : { ...DEFAULT_SEARCH };

  if ("lastQuery" in body) {
    if (body.lastQuery === null) {
      search.lastQuery = null;
    } else {
      const stampedQuery = { ...body.lastQuery, timestamp: new Date().toISOString() };
      const history = Array.isArray(search.history) ? search.history : [];
      search.lastQuery = stampedQuery;
      search.history = [stampedQuery, ...history].slice(0, 10);
    }
  }
  if (body.filters !== undefined) search.filters = body.filters;

  await stateStore.patchState(userId, { search }, "Updated search state");
  return createResponseWithCookie({ search, message: "Search state updated" }, userId);
}
