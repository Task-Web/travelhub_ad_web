import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/disputes - Fetch disputes from state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const disputes = Array.isArray((state.data as Record<string, unknown>).disputes)
    ? ((state.data as Record<string, unknown>).disputes as Record<string, unknown>[])
    : [];

  return createResponseWithCookie(
    { disputes, count: disputes.length },
    userId
  );
}

// POST /api/disputes - Submit a dispute and save to state
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  let dispute: Record<string, unknown>;
  try {
    dispute = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }

  const state = await stateStore.getState(userId);
  const disputes = Array.isArray((state.data as Record<string, unknown>).disputes)
    ? ((state.data as Record<string, unknown>).disputes as Record<string, unknown>[])
    : [];

  if (!dispute.id) {
    dispute.id = `DSP${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  }
  if (!dispute.status) {
    dispute.status = "submitted";
  }
  if (!dispute.submittedAt) {
    dispute.submittedAt = new Date().toISOString();
  }

  disputes.push(dispute);
  await stateStore.patchState(
    userId,
    { disputes },
    "Added new dispute submission"
  );

  return createResponseWithCookie(
    { dispute, message: "Dispute submitted successfully" },
    userId
  );
}
