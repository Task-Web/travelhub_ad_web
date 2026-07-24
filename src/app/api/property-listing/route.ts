import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

const TYPES = ["hotel", "apartment", "holiday-home", "bnb"];
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  return createResponseWithCookie({ listing: state.data.propertyListing ?? null }, userId);
}

export async function PUT(request: NextRequest) {
  const userId = await getUserId(request);
  let body: unknown;
  try { body = await request.json(); } catch { return createResponseWithCookie({ detail: "Invalid JSON body" }, userId, 400); }
  if (!isRecord(body) || Object.keys(body).some((key) => !["selectedType", "formData", "showWizard", "currentStep"].includes(key))) {
    return createResponseWithCookie({ detail: "Unknown or internal fields are not allowed" }, userId, 422);
  }
  if (body.selectedType !== null && (typeof body.selectedType !== "string" || !TYPES.includes(body.selectedType))) return createResponseWithCookie({ detail: "Invalid property type" }, userId, 422);
  if (!isRecord(body.formData) || Object.keys(body.formData).some((key) => !["email", "propertyName", "address"].includes(key))
    || Object.values(body.formData).some((value) => typeof value !== "string")) return createResponseWithCookie({ detail: "Invalid property form" }, userId, 422);
  if (typeof body.showWizard !== "boolean" || !Number.isInteger(body.currentStep) || Number(body.currentStep) < 1 || Number(body.currentStep) > 5) return createResponseWithCookie({ detail: "Invalid listing progress" }, userId, 422);
  const listing = { selectedType: body.selectedType, formData: body.formData, showWizard: body.showWizard, currentStep: body.currentStep };
  await stateStore.patchState(userId, { propertyListing: listing }, "Updated property listing form data");
  return createResponseWithCookie({ listing }, userId);
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request);
  await stateStore.patchState(userId, { propertyListing: null }, "Property listing completed");
  return createResponseWithCookie({ completed: true }, userId);
}
