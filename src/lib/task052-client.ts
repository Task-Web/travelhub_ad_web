import { p256 } from "@noble/curves/nist.js";
import {
  createTask052ClickProofMessage,
  createTask052JsonHeaders,
  normalizeTask052ActionTarget,
  type Task052Action,
  type Task052ActionTarget,
  type Task052ClickProof,
} from "./task052-protocol";

interface Task052ClickSessionResponse {
  allowed?: boolean;
  click_session_id?: string;
  click_challenge?: string;
  detail?: string;
}

interface Task052ClickSession {
  id: string;
  challenge: string;
  signer:
    | { type: "webcrypto"; privateKey: CryptoKey }
    | { type: "noble"; secretKey: Uint8Array };
}

type TrustedEventCarrier = Event | { nativeEvent?: Event };

let clickSessionPromise: Promise<Task052ClickSession> | null = null;
let clickSession: Task052ClickSession | null = null;
let task052PageToken: string | null = null;

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

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createNobleP256KeyPair(): {
  publicKey: JsonWebKey;
  secretKey: Uint8Array;
} {
  const { secretKey } = p256.keygen();
  const publicKeyBytes = p256.getPublicKey(secretKey, false);

  return {
    publicKey: {
      kty: "EC",
      crv: "P-256",
      x: bytesToBase64Url(publicKeyBytes.slice(1, 33)),
      y: bytesToBase64Url(publicKeyBytes.slice(33, 65)),
      ext: true,
      key_ops: ["verify"],
    },
    secretKey,
  };
}

function assertTask052PageCanCreateSession(): void {
  if (
    typeof window !== "undefined" &&
    new URL(window.location.href).searchParams.has("cookie")
  ) {
    throw new Error("Task 052 page token is not available with a cookie override");
  }
}

async function createClickSession(): Promise<Task052ClickSession> {
  assertTask052PageCanCreateSession();

  let publicKey: JsonWebKey;
  let signer: Task052ClickSession["signer"];

  if (crypto.subtle) {
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"]
    );
    publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
    signer = { type: "webcrypto", privateKey: keyPair.privateKey };
  } else {
    const keyPair = createNobleP256KeyPair();
    publicKey = keyPair.publicKey;
    signer = { type: "noble", secretKey: keyPair.secretKey };
  }
  const response = await fetch("/api/task052/click-session", {
    method: "POST",
    credentials: "include",
    headers: createTask052JsonHeaders(),
    body: JSON.stringify({
      public_key: publicKey,
      page_token: task052PageToken,
    }),
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
    signer,
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
  target: Task052ActionTarget
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
  const messageBytes = new TextEncoder().encode(message);
  const signature =
    session.signer.type === "webcrypto"
      ? new Uint8Array(
          await crypto.subtle.sign(
            { name: "ECDSA", hash: "SHA-256" },
            session.signer.privateKey,
            messageBytes
          )
        )
      : p256.sign(messageBytes, session.signer.secretKey, {
          format: "compact",
          prehash: true,
        });

  return {
    ...unsignedProof,
    signature: bytesToBase64Url(signature),
  };
}

export function setTask052PageToken(pageToken: string | null): void {
  if (!pageToken && task052PageToken) {
    return;
  }

  task052PageToken = pageToken;
  if (!pageToken) {
    clickSessionPromise = null;
    clickSession = null;
  }
}

export function prepareTask052ClickSession(): void {
  if (
    typeof window !== "undefined" &&
    new URL(window.location.href).searchParams.has("cookie")
  ) {
    return;
  }

  void ensureClickSession().catch(() => {
    clickSessionPromise = null;
    clickSession = null;
  });
}

export async function createTask052ClickProofForEvent(
  action: Task052Action,
  target: Task052ActionTarget = {},
  event: TrustedEventCarrier
): Promise<Task052ClickProof> {
  assertTrustedEvent(event);

  const session = await ensureClickSession();
  const normalizedTarget = normalizeTask052ActionTarget(action, target);
  return signClickProof(session, action, normalizedTarget);
}

export function updateTask052ClickChallenge(nextChallenge: unknown): void {
  if (clickSession && typeof nextChallenge === "string" && nextChallenge) {
    clickSession.challenge = nextChallenge;
  }
}
