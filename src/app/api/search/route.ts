import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const DEFAULT_SEARCH = {
  lastQuery: null,
  filters: {},
  history: [],
};

// GET /api/search - Fetch search state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const search =
    ((state.data as Record<string, unknown>).search as Record<string, unknown>) ||
    DEFAULT_SEARCH;

  return createResponseWithCookie({ search }, userId);
}

// PATCH /api/search - Update search state
export async function PATCH(request: NextRequest) {
  const userId = await getUserId(request);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const state = await stateStore.getState(userId);
  const search =
    ((state.data as Record<string, unknown>).search as Record<string, unknown>) ||
    { ...DEFAULT_SEARCH };

  if ("lastQuery" in payload) {
    const lastQuery = payload.lastQuery as Record<string, unknown> | null;
    if (lastQuery) {
      const stampedQuery = {
        ...lastQuery,
        timestamp: new Date().toISOString(),
      };
      const history = Array.isArray(search.history) ? search.history : [];
      search.lastQuery = stampedQuery;
      search.history = [stampedQuery, ...history].slice(0, 10);
    } else {
      search.lastQuery = null;
    }
  }

  if ("filters" in payload) {
    search.filters = payload.filters as Record<string, unknown>;
  }

  await stateStore.patchState(userId, { search }, "Updated search state");

  return createResponseWithCookie(
    { search, message: "Search state updated" },
    userId
  );
}
