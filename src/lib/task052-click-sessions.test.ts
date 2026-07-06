import { webcrypto } from "crypto";
import { describe, expect, it } from "vitest";
import {
  consumeTask052ClickProof,
  createTask052ClickSession,
  normalizeTask052ClickSessions,
} from "./task052-click-sessions";
import {
  createTask052ClickProofMessage,
  type Task052Action,
  type Task052ActionTokenTarget,
  type Task052ClickProof,
} from "./task052-protocol";

let userCounter = 0;

function createUserId() {
  userCounter += 1;
  return `task052-click-test-${userCounter}`;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64url");
}

async function createProof(
  privateKey: CryptoKey,
  sessionId: string,
  challenge: string,
  action: Task052Action,
  target: Task052ActionTokenTarget,
  signedAt: Date
): Promise<Task052ClickProof> {
  const unsignedProof = {
    session_id: sessionId,
    challenge,
    action,
    target,
    signed_at: signedAt.toISOString(),
  };
  const signature = await webcrypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(createTask052ClickProofMessage(unsignedProof))
  );

  return {
    ...unsignedProof,
    signature: arrayBufferToBase64Url(signature),
  };
}

describe("task052 click sessions", () => {
  it("normalizes missing click session state as empty", () => {
    expect(normalizeTask052ClickSessions(undefined)).toEqual([]);
  });

  it("accepts a trusted-click signature once and rotates the challenge", async () => {
    const userId = createUserId();
    const now = new Date("2026-01-01T00:00:00.000Z");
    const keyPair = await webcrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"]
    );
    const publicKey = await webcrypto.subtle.exportKey("jwk", keyPair.publicKey);
    const session = await createTask052ClickSession(userId, publicKey, { now });

    expect(session.ok).toBe(true);
    if (!session.ok) {
      return;
    }

    const proof = await createProof(
      keyPair.privateKey,
      session.session_id,
      session.challenge,
      "close_ad",
      {},
      now
    );

    const firstResult = await consumeTask052ClickProof(
      userId,
      proof,
      "close_ad",
      {},
      { now }
    );
    expect(firstResult.ok).toBe(true);

    const replayResult = await consumeTask052ClickProof(
      userId,
      proof,
      "close_ad",
      {},
      { now }
    );
    expect(replayResult.ok).toBe(false);
  });

  it("rejects wrong action and expired click proofs", async () => {
    const userId = createUserId();
    const now = new Date("2026-01-01T00:00:00.000Z");
    const keyPair = await webcrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"]
    );
    const publicKey = await webcrypto.subtle.exportKey("jwk", keyPair.publicKey);
    const session = await createTask052ClickSession(userId, publicKey, { now });

    expect(session.ok).toBe(true);
    if (!session.ok) {
      return;
    }

    const proof = await createProof(
      keyPair.privateKey,
      session.session_id,
      session.challenge,
      "close_ad",
      {},
      now
    );

    expect(
      (
        await consumeTask052ClickProof(
          userId,
          proof,
          "open_hotel",
          { hotel_id: "hotel-paris-1" },
          { now }
        )
      ).ok
    ).toBe(false);

    expect(
      (
        await consumeTask052ClickProof(userId, proof, "close_ad", {}, {
          now: new Date("2026-01-01T00:02:00.000Z"),
        })
      ).ok
    ).toBe(false);
  });
});
