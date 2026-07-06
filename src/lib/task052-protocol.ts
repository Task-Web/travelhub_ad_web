export const TASK052_CLIENT_HEADER_NAME = "X-Task052-Client";
export const TASK052_CLIENT_HEADER_VALUE = "travelhub-ui";
export const TASK052_ACTION_TOKEN_TTL_MS = 5 * 60 * 1000;

export type Task052Action = "close_ad" | "open_hotel" | "open_checkout";

export interface Task052ActionTokenTarget {
  hotel_id?: string;
  room?: string;
}

const TASK052_ACTIONS: Task052Action[] = [
  "close_ad",
  "open_hotel",
  "open_checkout",
];

export function isTask052Action(value: unknown): value is Task052Action {
  return (
    typeof value === "string" &&
    TASK052_ACTIONS.includes(value as Task052Action)
  );
}

export function createTask052JsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    [TASK052_CLIENT_HEADER_NAME]: TASK052_CLIENT_HEADER_VALUE,
  };
}
