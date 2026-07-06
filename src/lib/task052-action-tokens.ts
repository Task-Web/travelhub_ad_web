import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { stateStore } from "./state-store";
import type { UserState } from "./types";
import {
  TASK052_ACTION_TOKEN_TTL_MS,
  type Task052Action,
  type Task052ActionTokenTarget,
} from "./task052-protocol";

export interface Task052ActionTokenRecord {
  id: string;
  token_hash: string;
  action: Task052Action;
  target: Task052ActionTokenTarget;
  issued_at: string;
  expires_at: string;
  used_at: string | null;
}

export type Task052ActionTokenConsumeResult =
  | { ok: true }
  | { ok: false; detail: string; status: number };

interface TokenTimingOptions {
  now?: Date;
  ttlMs?: number;
}

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function isSameHash(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function normalizeTarget(raw: unknown): Task052ActionTokenTarget {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const record = raw as Record<string, unknown>;
  return {
    ...(typeof record.hotel_id === "string"
      ? { hotel_id: record.hotel_id }
      : {}),
    ...(typeof record.room === "string" ? { room: record.room } : {}),
  };
}

export function normalizeTask052ActionTokens(
  raw: unknown
): Task052ActionTokenRecord[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const record = item as Record<string, unknown>;
    const action = record.action;
    if (
      typeof record.id !== "string" ||
      typeof record.token_hash !== "string" ||
      (action !== "close_ad" &&
        action !== "open_hotel" &&
        action !== "open_checkout") ||
      typeof record.issued_at !== "string" ||
      typeof record.expires_at !== "string"
    ) {
      return [];
    }

    return [
      {
        id: record.id,
        token_hash: record.token_hash,
        action,
        target: normalizeTarget(record.target),
        issued_at: record.issued_at,
        expires_at: record.expires_at,
        used_at:
          typeof record.used_at === "string" ? record.used_at : null,
      },
    ];
  });
}

async function getTokenRecords(userId: string) {
  const state = await stateStore.getState(userId);
  const data = (state as UserState<Record<string, unknown>>).data;
  return normalizeTask052ActionTokens(data.task052_action_tokens);
}

async function patchTokenRecords(
  userId: string,
  records: Task052ActionTokenRecord[],
  note: string
) {
  await stateStore.patchState(
    userId,
    { task052_action_tokens: records },
    note
  );
}

function pruneExpiredTokens(
  records: Task052ActionTokenRecord[],
  now: Date
): Task052ActionTokenRecord[] {
  const nowMs = now.getTime();
  return records.filter(
    (record) => Date.parse(record.expires_at) > nowMs
  );
}

function targetMatches(
  actual: Task052ActionTokenTarget,
  expected: Task052ActionTokenTarget
): boolean {
  return (
    (expected.hotel_id === undefined ||
      actual.hotel_id === expected.hotel_id) &&
    (expected.room === undefined || actual.room === expected.room)
  );
}

function parseTokenId(rawToken: string): string | null {
  const [id, secret] = rawToken.split(".");
  if (!id || !secret) {
    return null;
  }
  return id;
}

export async function issueTask052ActionToken(
  userId: string,
  action: Task052Action,
  target: Task052ActionTokenTarget = {},
  options: TokenTimingOptions = {}
): Promise<string> {
  const now = options.now ?? new Date();
  const ttlMs = options.ttlMs ?? TASK052_ACTION_TOKEN_TTL_MS;
  const id = uuidv4();
  const secret = randomBytes(32).toString("base64url");
  const rawToken = `${id}.${secret}`;
  const tokenRecord: Task052ActionTokenRecord = {
    id,
    token_hash: hashToken(rawToken),
    action,
    target,
    issued_at: now.toISOString(),
    expires_at: new Date(now.getTime() + ttlMs).toISOString(),
    used_at: null,
  };

  const existing = await getTokenRecords(userId);
  await patchTokenRecords(
    userId,
    [...pruneExpiredTokens(existing, now), tokenRecord],
    "Task 052 action token issued"
  );

  return rawToken;
}

export async function consumeTask052ActionToken(
  userId: string,
  rawToken: string,
  expectedAction: Task052Action,
  expectedTarget: Task052ActionTokenTarget = {},
  options: Pick<TokenTimingOptions, "now"> = {}
): Promise<Task052ActionTokenConsumeResult> {
  if (!rawToken) {
    return {
      ok: false,
      detail: "Missing task action token",
      status: 403,
    };
  }

  const tokenId = parseTokenId(rawToken);
  if (!tokenId) {
    return {
      ok: false,
      detail: "Invalid task action token",
      status: 403,
    };
  }

  const now = options.now ?? new Date();
  const records = await getTokenRecords(userId);
  const tokenIndex = records.findIndex((record) => record.id === tokenId);

  if (tokenIndex === -1) {
    return {
      ok: false,
      detail: "Invalid task action token",
      status: 403,
    };
  }

  const token = records[tokenIndex];

  if (!isSameHash(token.token_hash, hashToken(rawToken))) {
    return {
      ok: false,
      detail: "Invalid task action token",
      status: 403,
    };
  }

  if (token.used_at !== null) {
    return {
      ok: false,
      detail: "Task action token has already been used",
      status: 403,
    };
  }

  if (Date.parse(token.expires_at) <= now.getTime()) {
    return {
      ok: false,
      detail: "Task action token has expired",
      status: 403,
    };
  }

  if (token.action !== expectedAction) {
    return {
      ok: false,
      detail: "Task action token does not match this action",
      status: 403,
    };
  }

  if (!targetMatches(token.target, expectedTarget)) {
    return {
      ok: false,
      detail: "Task action token does not match this target",
      status: 403,
    };
  }

  const nextRecords = [...records];
  nextRecords[tokenIndex] = {
    ...token,
    used_at: now.toISOString(),
  };
  await patchTokenRecords(
    userId,
    pruneExpiredTokens(nextRecords, now),
    "Task 052 action token consumed"
  );

  return { ok: true };
}

