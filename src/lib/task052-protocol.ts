export const TASK052_CLIENT_HEADER_NAME = "X-Task052-Client";
export const TASK052_CLIENT_HEADER_VALUE = "travelhub-ui";

const TASK052_ACTIONS = [
  "close_ad",
  "open_hotel",
  "open_checkout",
] as const;

export type Task052Action = (typeof TASK052_ACTIONS)[number];

export interface Task052ActionTarget {
  hotel_id?: string;
  room?: string;
}

export interface Task052ClickProof {
  session_id: string;
  challenge: string;
  action: Task052Action;
  target: Task052ActionTarget;
  signed_at: string;
  signature: string;
}

export function isTask052Action(value: unknown): value is Task052Action {
  return (
    typeof value === "string" &&
    (TASK052_ACTIONS as readonly string[]).includes(value)
  );
}

export function createTask052JsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    [TASK052_CLIENT_HEADER_NAME]: TASK052_CLIENT_HEADER_VALUE,
  };
}

export function normalizeTask052ActionTarget(
  action: Task052Action,
  target: Task052ActionTarget = {}
): Task052ActionTarget {
  if (action === "open_hotel") {
    return { hotel_id: String(target.hotel_id ?? "") };
  }

  if (action === "open_checkout") {
    return {
      hotel_id: String(target.hotel_id ?? ""),
      room: String(target.room ?? ""),
    };
  }

  return {};
}

export function task052ActionTargetsEqual(
  left: Task052ActionTarget,
  right: Task052ActionTarget
): boolean {
  return left.hotel_id === right.hotel_id && left.room === right.room;
}

export function createTask052ClickProofMessage(
  proof: Omit<Task052ClickProof, "signature">
): string {
  return JSON.stringify({
    action: proof.action,
    challenge: proof.challenge,
    session_id: proof.session_id,
    signed_at: proof.signed_at,
    target: normalizeTask052ActionTarget(proof.action, proof.target),
  });
}
