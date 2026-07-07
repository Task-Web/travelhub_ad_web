import { createHash, randomBytes, timingSafeEqual, webcrypto } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { stateStore } from "./state-store";
import type { UserState } from "./types";
import {
  createTask052ClickProofMessage,
  isTask052Action,
  normalizeTask052ActionTarget,
  task052ActionTargetsEqual,
  type Task052Action,
  type Task052ActionTarget,
  type Task052ClickProof,
} from "./task052-protocol";

export const TASK052_CLICK_SESSION_TTL_MS = 30 * 60 * 1000;
export const TASK052_CLICK_PROOF_MAX_AGE_MS = 60 * 1000;
export const TASK052_PAGE_TOKEN_TTL_MS = 5 * 60 * 1000;

export interface Task052ClickSessionRecord {
  id: string;
  public_key: JsonWebKey;
  challenge_hash: string;
  issued_at: string;
  expires_at: string;
}

export interface Task052PageTokenRecord {
  token_hash: string;
  issued_at: string;
  expires_at: string;
}

export type Task052ClickSessionCreateResult =
  | { ok: true; session_id: string; challenge: string }
  | { ok: false; detail: string; status: number };

export type Task052ClickProofConsumeResult =
  | { ok: true; next_challenge: string }
  | { ok: false; detail: string; status: number };

interface TimingOptions {
  now?: Date;
  ttlMs?: number;
}

function hashValue(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function isSameHash(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function createChallenge(): string {
  return randomBytes(32).toString("base64url");
}

function base64UrlToBuffer(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isP256PublicJwk(raw: unknown): raw is JsonWebKey {
  return (
    isRecord(raw) &&
    raw.kty === "EC" &&
    raw.crv === "P-256" &&
    typeof raw.x === "string" &&
    typeof raw.y === "string" &&
    !("d" in raw)
  );
}

export function normalizeTask052ClickSessions(
  raw: unknown
): Task052ClickSessionRecord[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item) => {
    if (!isRecord(item) || !isP256PublicJwk(item.public_key)) {
      return [];
    }

    if (
      typeof item.id !== "string" ||
      typeof item.challenge_hash !== "string" ||
      typeof item.issued_at !== "string" ||
      typeof item.expires_at !== "string"
    ) {
      return [];
    }

    return [
      {
        id: item.id,
        public_key: item.public_key,
        challenge_hash: item.challenge_hash,
        issued_at: item.issued_at,
        expires_at: item.expires_at,
      },
    ];
  });
}

export function normalizeTask052PageTokens(
  raw: unknown
): Task052PageTokenRecord[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    if (
      typeof item.token_hash !== "string" ||
      typeof item.issued_at !== "string" ||
      typeof item.expires_at !== "string"
    ) {
      return [];
    }

    return [
      {
        token_hash: item.token_hash,
        issued_at: item.issued_at,
        expires_at: item.expires_at,
      },
    ];
  });
}

async function getClickSessions(userId: string) {
  const state = await stateStore.getState(userId);
  const data = (state as UserState<Record<string, unknown>>).data;
  return normalizeTask052ClickSessions(data.task052_click_sessions);
}

async function getPageTokens(userId: string) {
  const state = await stateStore.getState(userId);
  const data = (state as UserState<Record<string, unknown>>).data;
  return normalizeTask052PageTokens(data.task052_page_tokens);
}

async function patchClickSessions(
  userId: string,
  records: Task052ClickSessionRecord[],
  note: string
) {
  await stateStore.patchState(userId, { task052_click_sessions: records }, note);
}

async function patchPageTokens(
  userId: string,
  records: Task052PageTokenRecord[],
  note: string
) {
  await stateStore.patchState(userId, { task052_page_tokens: records }, note);
}

function pruneExpiredSessions(
  records: Task052ClickSessionRecord[],
  now: Date
): Task052ClickSessionRecord[] {
  const nowMs = now.getTime();
  return records.filter((record) => Date.parse(record.expires_at) > nowMs);
}

function pruneExpiredPageTokens(
  records: Task052PageTokenRecord[],
  now: Date
): Task052PageTokenRecord[] {
  const nowMs = now.getTime();
  return records.filter((record) => Date.parse(record.expires_at) > nowMs);
}

function parseClickProof(raw: unknown): Task052ClickProof | null {
  if (!isRecord(raw)) {
    return null;
  }

  const action = raw.action;
  if (!isTask052Action(action)) {
    return null;
  }

  if (
    typeof raw.session_id !== "string" ||
    typeof raw.challenge !== "string" ||
    typeof raw.signed_at !== "string" ||
    typeof raw.signature !== "string"
  ) {
    return null;
  }

  return {
    session_id: raw.session_id,
    challenge: raw.challenge,
    action,
    target: normalizeTask052ActionTarget(
      action,
      isRecord(raw.target) ? raw.target : {}
    ),
    signed_at: raw.signed_at,
    signature: raw.signature,
  };
}

async function verifyClickProofSignature(
  publicKey: JsonWebKey,
  proof: Task052ClickProof
): Promise<boolean> {
  const key = await webcrypto.subtle.importKey(
    "jwk",
    publicKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"]
  );
  const message = createTask052ClickProofMessage({
    session_id: proof.session_id,
    challenge: proof.challenge,
    action: proof.action,
    target: proof.target,
    signed_at: proof.signed_at,
  });

  return webcrypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    base64UrlToBuffer(proof.signature),
    new TextEncoder().encode(message)
  );
}

export async function createTask052ClickSession(
  userId: string,
  publicKey: unknown,
  pageToken: unknown,
  options: TimingOptions = {}
): Promise<Task052ClickSessionCreateResult> {
  if (!isP256PublicJwk(publicKey)) {
    return {
      ok: false,
      detail: "Invalid task click public key",
      status: 400,
    };
  }

  const now = options.now ?? new Date();
  const tokenResult = await consumeTask052PageToken(userId, pageToken, { now });
  if (!tokenResult.ok) {
    return {
      ok: false,
      detail: tokenResult.detail,
      status: tokenResult.status,
    };
  }

  const challenge = createChallenge();
  const record: Task052ClickSessionRecord = {
    id: uuidv4(),
    public_key: publicKey,
    challenge_hash: hashValue(challenge),
    issued_at: now.toISOString(),
    expires_at: new Date(
      now.getTime() + (options.ttlMs ?? TASK052_CLICK_SESSION_TTL_MS)
    ).toISOString(),
  };

  await patchClickSessions(userId, [record], "Task 052 click session created");

  return { ok: true, session_id: record.id, challenge };
}

export async function createTask052PageToken(
  userId: string,
  options: TimingOptions = {}
): Promise<string> {
  const now = options.now ?? new Date();
  const ttlMs = options.ttlMs ?? TASK052_PAGE_TOKEN_TTL_MS;
  const pageToken = randomBytes(32).toString("base64url");
  const existing = pruneExpiredPageTokens(await getPageTokens(userId), now);
  await patchPageTokens(
    userId,
    [
      ...existing,
      {
        token_hash: hashValue(pageToken),
        issued_at: now.toISOString(),
        expires_at: new Date(now.getTime() + ttlMs).toISOString(),
      },
    ],
    "Task 052 page token created"
  );

  return pageToken;
}

async function consumeTask052PageToken(
  userId: string,
  rawPageToken: unknown,
  options: Pick<TimingOptions, "now"> = {}
): Promise<{ ok: true } | { ok: false; detail: string; status: number }> {
  if (typeof rawPageToken !== "string" || !rawPageToken) {
    return {
      ok: false,
      detail: "Missing task page token",
      status: 403,
    };
  }

  const now = options.now ?? new Date();
  const records = pruneExpiredPageTokens(await getPageTokens(userId), now);
  const tokenIndex = records.findIndex((record) =>
    isSameHash(record.token_hash, hashValue(rawPageToken))
  );

  if (tokenIndex === -1) {
    return {
      ok: false,
      detail: "Invalid task page token",
      status: 403,
    };
  }

  await patchPageTokens(
    userId,
    records.filter((_, index) => index !== tokenIndex),
    "Task 052 page token consumed"
  );

  return { ok: true };
}

export async function consumeTask052ClickProof(
  userId: string,
  rawProof: unknown,
  expectedAction: Task052Action,
  expectedTarget: Task052ActionTarget = {},
  options: Pick<TimingOptions, "now"> = {}
): Promise<Task052ClickProofConsumeResult> {
  const proof = parseClickProof(rawProof);
  if (!proof) {
    return {
      ok: false,
      detail: "Missing task click proof",
      status: 403,
    };
  }

  const normalizedExpectedTarget = normalizeTask052ActionTarget(
    expectedAction,
    expectedTarget
  );
  if (
    proof.action !== expectedAction ||
    !task052ActionTargetsEqual(proof.target, normalizedExpectedTarget)
  ) {
    return {
      ok: false,
      detail: "Task click proof does not match this action",
      status: 403,
    };
  }

  const now = options.now ?? new Date();
  const signedAtMs = Date.parse(proof.signed_at);
  if (
    !Number.isFinite(signedAtMs) ||
    Math.abs(now.getTime() - signedAtMs) > TASK052_CLICK_PROOF_MAX_AGE_MS
  ) {
    return {
      ok: false,
      detail: "Task click proof has expired",
      status: 403,
    };
  }

  const sessions = pruneExpiredSessions(await getClickSessions(userId), now);
  const sessionIndex = sessions.findIndex(
    (session) => session.id === proof.session_id
  );
  if (sessionIndex === -1) {
    return {
      ok: false,
      detail: "Invalid task click session",
      status: 403,
    };
  }

  const session = sessions[sessionIndex];
  if (!isSameHash(session.challenge_hash, hashValue(proof.challenge))) {
    return {
      ok: false,
      detail: "Invalid task click challenge",
      status: 403,
    };
  }

  const signatureValid = await verifyClickProofSignature(
    session.public_key,
    proof
  ).catch(() => false);
  if (!signatureValid) {
    return {
      ok: false,
      detail: "Invalid task click signature",
      status: 403,
    };
  }

  const nextChallenge = createChallenge();
  const nextSessions = [...sessions];
  nextSessions[sessionIndex] = {
    ...session,
    challenge_hash: hashValue(nextChallenge),
  };
  await patchClickSessions(
    userId,
    nextSessions,
    "Task 052 click proof consumed"
  );

  return { ok: true, next_challenge: nextChallenge };
}
