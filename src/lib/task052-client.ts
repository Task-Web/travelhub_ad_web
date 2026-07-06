import {
  createTask052ClickProofMessage,
  createTask052JsonHeaders,
  normalizeTask052ActionTarget,
  type Task052Action,
  type Task052ActionTokenTarget,
  type Task052ClickProof,
} from "./task052-protocol";

interface Task052ClickSessionResponse {
  allowed?: boolean;
  click_session_id?: string;
  click_challenge?: string;
  detail?: string;
}

interface Task052ActionTokenResponse {
  allowed?: boolean;
  action_token?: string;
  next_click_challenge?: string;
  detail?: string;
}

interface Task052ClickSession {
  id: string;
  challenge: string;
  privateKey: CryptoKey;
}

type TrustedEventCarrier = Event | { nativeEvent?: Event };

let clickSessionPromise: Promise<Task052ClickSession> | null = null;
let clickSession: Task052ClickSession | null = null;

function getNativeEvent(event: TrustedEventCarrier): Event | null {
  if (event instanceof Event) {
    return event;
  }
  return event.nativeEvent ?? null;
}

function assertTrustedEvent(event: TrustedEventCarrier): void {
  const nativeEvent = getNativeEvent(event);
  if (!nativeEvent?.isTrusted) {
    throw new Error("Task 052 action requires a trusted browser event");
  }
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function createClickSession(): Promise<Task052ClickSession> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign", "verify"]
  );
  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const response = await fetch("/api/task052/click-session", {
    method: "POST",
    credentials: "include",
    headers: createTask052JsonHeaders(),
    body: JSON.stringify({ public_key: publicKey }),
  });
  const data = (await response
    .json()
    .catch(() => ({}))) as Task052ClickSessionResponse;

  if (
    !response.ok ||
    data.allowed !== true ||
    !data.click_session_id ||
    !data.click_challenge
  ) {
    throw new Error(data.detail || "Task 052 click session was not created");
  }

  return {
    id: data.click_session_id,
    challenge: data.click_challenge,
    privateKey: keyPair.privateKey,
  };
}

async function ensureClickSession(): Promise<Task052ClickSession> {
  if (clickSession) {
    return clickSession;
  }

  if (!clickSessionPromise) {
    clickSessionPromise = createClickSession().then((session) => {
      clickSession = session;
      return session;
    });
  }

  return clickSessionPromise;
}

async function signClickProof(
  session: Task052ClickSession,
  action: Task052Action,
  target: Task052ActionTokenTarget
): Promise<Task052ClickProof> {
  const normalizedTarget = normalizeTask052ActionTarget(action, target);
  const unsignedProof = {
    session_id: session.id,
    challenge: session.challenge,
    action,
    target: normalizedTarget,
    signed_at: new Date().toISOString(),
  };
  const message = createTask052ClickProofMessage(unsignedProof);
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    session.privateKey,
    new TextEncoder().encode(message)
  );

  return {
    ...unsignedProof,
    signature: arrayBufferToBase64Url(signature),
  };
}

export function prepareTask052ClickSession(): void {
  void ensureClickSession().catch(() => {
    clickSessionPromise = null;
    clickSession = null;
  });
}

export async function requestTask052ActionToken(
  action: Task052Action,
  target: Task052ActionTokenTarget = {},
  event: TrustedEventCarrier
): Promise<string> {
  assertTrustedEvent(event);

  const session = await ensureClickSession();
  const normalizedTarget = normalizeTask052ActionTarget(action, target);
  const clickProof = await signClickProof(session, action, normalizedTarget);
  const response = await fetch("/api/task052/action-token", {
    method: "POST",
    credentials: "include",
    headers: createTask052JsonHeaders(),
    body: JSON.stringify({ action, ...normalizedTarget, click_proof: clickProof }),
  });

  const data = (await response
    .json()
    .catch(() => ({}))) as Task052ActionTokenResponse;

  if (!response.ok || data.allowed !== true || !data.action_token) {
    throw new Error(data.detail || "Task 052 action token was not granted");
  }

  if (data.next_click_challenge) {
    session.challenge = data.next_click_challenge;
  }

  return data.action_token;
}
