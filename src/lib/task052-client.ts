import {
  createTask052JsonHeaders,
  type Task052Action,
  type Task052ActionTokenTarget,
} from "./task052-protocol";

interface Task052ActionTokenResponse {
  allowed?: boolean;
  action_token?: string;
  detail?: string;
}

export async function requestTask052ActionToken(
  action: Task052Action,
  target: Task052ActionTokenTarget = {}
): Promise<string> {
  const response = await fetch("/api/task052/action-token", {
    method: "POST",
    credentials: "include",
    headers: createTask052JsonHeaders(),
    body: JSON.stringify({ action, ...target }),
  });

  const data = (await response
    .json()
    .catch(() => ({}))) as Task052ActionTokenResponse;

  if (!response.ok || data.allowed !== true || !data.action_token) {
    throw new Error(data.detail || "Task 052 action token was not granted");
  }

  return data.action_token;
}

