import {
  canShowTask052Checkout,
  type Task052Checkout,
  type Task052FlowState,
} from "./task052-flow";

type GuardResult = { ok: true } | { ok: false; status: number; detail: string };

const TASK052_INTERNAL_STATE_KEYS = [
  "task052_click_sessions",
  "task052_page_tokens",
];

const TASK052_ALLOWED_CHECKOUT_PATCH_KEYS = [
  "checkout",
  "checkout_page_visited",
];

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function containsTask052InternalState(data: Record<string, unknown>): boolean {
  return TASK052_INTERNAL_STATE_KEYS.some((key) => hasOwn(data, key));
}

function matchesCheckout(
  raw: unknown,
  checkout: Task052Checkout | null
): boolean {
  if (!checkout || !isRecord(raw)) {
    return false;
  }

  return (
    raw.hotel_id === checkout.hotel_id &&
    raw.hotel_name === checkout.hotel_name &&
    raw.room === checkout.room
  );
}

export function isTask052InitialSeed(raw: unknown): boolean {
  if (!isRecord(raw)) {
    return false;
  }

  return (
    raw.ad_closed === false &&
    raw.can_view_target_hotel === false &&
    raw.can_view_checkout === false &&
    raw.checkout_page_visited === false &&
    raw.checkout === null
  );
}

export function shouldMergeTask052Seed(data: Record<string, unknown>): boolean {
  return Object.keys(data).length === 1 && isTask052InitialSeed(data.task052);
}

export function validateTask052StatePut(
  data: Record<string, unknown>
): GuardResult {
  if (containsTask052InternalState(data)) {
    return {
      ok: false,
      status: 403,
      detail: "Task 052 internal state cannot be written through /api/state",
    };
  }

  if (!hasOwn(data, "task052")) {
    return { ok: true };
  }

  if (isTask052InitialSeed(data.task052)) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 403,
    detail: "Task 052 state can only be initialized through /api/state",
  };
}

export function validateTask052StatePatch(
  data: Record<string, unknown>,
  currentFlow: Task052FlowState
): GuardResult {
  if (containsTask052InternalState(data)) {
    return {
      ok: false,
      status: 403,
      detail: "Task 052 internal state cannot be written through /api/state",
    };
  }

  if (!hasOwn(data, "task052")) {
    return { ok: true };
  }

  const patch = data.task052;
  if (!isRecord(patch)) {
    return {
      ok: false,
      status: 403,
      detail: "Task 052 state patch must be an object",
    };
  }

  const patchKeys = Object.keys(patch);
  const hasCheckoutPageVisit =
    hasOwn(patch, "checkout_page_visited") &&
    patch.checkout_page_visited === true;

  if (
    patchKeys.length === 0 ||
    !hasCheckoutPageVisit ||
    patchKeys.some((key) => !TASK052_ALLOWED_CHECKOUT_PATCH_KEYS.includes(key))
  ) {
    return {
      ok: false,
      status: 403,
      detail: "Task 052 state can only record a verified checkout visit",
    };
  }

  if (!canShowTask052Checkout(currentFlow)) {
    return {
      ok: false,
      status: 403,
      detail: "Task 052 checkout visit is not available yet",
    };
  }

  if (hasOwn(patch, "checkout") && !matchesCheckout(patch.checkout, currentFlow.checkout)) {
    return {
      ok: false,
      status: 403,
      detail: "Task 052 checkout patch does not match the verified checkout",
    };
  }

  return { ok: true };
}
