import { stateStore } from "./state-store";
import type { UserState } from "./types";

export const TASK052_TARGET_HOTEL_ID = "hotel-paris-1";
export const TASK052_TARGET_HOTEL_NAME = "Le Meurice";
export const TASK052_TARGET_ROOM = "Deluxe Suite";

export interface Task052Checkout {
  hotel_id: string;
  hotel_name: string;
  room: string;
}

export interface Task052FlowState {
  ad_closed: boolean;
  can_view_target_hotel: boolean;
  can_view_checkout: boolean;
  checkout_page_visited: boolean;
  checkout: Task052Checkout | null;
}

export const DEFAULT_TASK052_FLOW: Task052FlowState = {
  ad_closed: false,
  can_view_target_hotel: false,
  can_view_checkout: false,
  checkout_page_visited: false,
  checkout: null,
};

export function normalizeTask052Flow(raw: unknown): Task052FlowState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_TASK052_FLOW };
  }

  const record = raw as Record<string, unknown>;
  const checkout =
    record.checkout &&
    typeof record.checkout === "object" &&
    !Array.isArray(record.checkout)
      ? (record.checkout as Record<string, unknown>)
      : null;

  return {
    ad_closed: record.ad_closed === true,
    can_view_target_hotel: record.can_view_target_hotel === true,
    can_view_checkout: record.can_view_checkout === true,
    checkout_page_visited: record.checkout_page_visited === true,
    checkout: checkout
      ? {
          hotel_id: String(checkout.hotel_id ?? ""),
          hotel_name: String(checkout.hotel_name ?? ""),
          room: String(checkout.room ?? ""),
        }
      : null,
  };
}

export function getTask052FlowFromState(state: UserState<Record<string, unknown>>): {
  flow: Task052FlowState;
  initialized: boolean;
} {
  const data = state.data as Record<string, unknown>;
  return {
    flow: normalizeTask052Flow(data.task052),
    initialized: Object.prototype.hasOwnProperty.call(data, "task052"),
  };
}

export async function getTask052Flow(userId: string) {
  const state = await stateStore.getState(userId);
  return getTask052FlowFromState(
    state as UserState<Record<string, unknown>>
  );
}

export async function patchTask052Flow(
  userId: string,
  patch: Partial<Task052FlowState>,
  note: string
): Promise<Task052FlowState> {
  const { flow } = await getTask052Flow(userId);
  const nextFlow = {
    ...flow,
    ...patch,
  };
  await stateStore.patchState(userId, { task052: nextFlow }, note);
  return nextFlow;
}

export function canShowTask052Checkout(flow: Task052FlowState): boolean {
  return (
    flow.can_view_checkout === true &&
    flow.checkout?.hotel_id === TASK052_TARGET_HOTEL_ID &&
    flow.checkout?.hotel_name === TASK052_TARGET_HOTEL_NAME &&
    flow.checkout?.room === TASK052_TARGET_ROOM
  );
}
