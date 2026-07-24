import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const DISPUTE_FIELDS = [
  "userType",
  "confirmationNumber",
  "fullName",
  "email",
  "phone",
  "topic",
  "message",
] as const;
const TOPICS = [
  "Reservation",
  "Refunds",
  "Customer Service",
  "Digital Markets Act feedback",
  "Other",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const isOptionalString = (value: unknown) => value === undefined || typeof value === "string";

const isDisputeInput = (value: unknown): value is Record<string, unknown> =>
  isRecord(value)
  && Object.keys(value).every((key) => DISPUTE_FIELDS.includes(key as (typeof DISPUTE_FIELDS)[number]))
  && (value.userType === "guest" || value.userType === "partner")
  && typeof value.fullName === "string" && value.fullName.trim().length > 0
  && typeof value.email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.email)
  && typeof value.topic === "string" && TOPICS.includes(value.topic)
  && typeof value.message === "string" && value.message.trim().length > 0
  && isOptionalString(value.confirmationNumber)
  && isOptionalString(value.phone);

// GET /api/disputes - Fetch disputes from state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const stored = (state.data as Record<string, unknown>).disputes;
  const disputes = Array.isArray(stored) ? stored : [];

  return createResponseWithCookie({ disputes, count: disputes.length }, userId);
}

// POST /api/disputes - Submit a customer dispute.
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400);
  }
  if (!isDisputeInput(body)) {
    return createResponseWithCookie({ detail: "Invalid dispute request" }, userId, 422);
  }

  const state = await stateStore.getState(userId);
  const stored = (state.data as Record<string, unknown>).disputes;
  const disputes = Array.isArray(stored) ? stored : [];
  const dispute = {
    ...body,
    id: `DSP${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  await stateStore.patchState(
    userId,
    { disputes: [...disputes, dispute] },
    "Added new dispute submission"
  );

  return createResponseWithCookie(
    { dispute, message: "Dispute submitted successfully" },
    userId
  );
}
