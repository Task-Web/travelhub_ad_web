import { webcrypto } from "crypto";
import { describe, expect, it } from "vitest";
import {
  consumeTask052ClickProof,
  createTask052ClickSession,
  createTask052PageToken,
  normalizeTask052ClickSessions,
  normalizeTask052PageTokens,
} from "./task052-click-sessions";
import { normalizeTask052Flow } from "./task052-flow";
import {
  createTask052ClickProofMessage,
  type Task052Action,
  type Task052ActionTarget,
  type Task052ClickProof,
} from "./task052-protocol";
import { stateStore } from "./state-store";

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
  target: Task052ActionTarget,
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
    const seed = {
      ad_closed: false,
      can_view_target_hotel: false,
      can_view_checkout: false,
      checkout_page_visited: false,
      checkout: null,
    };

    expect(normalizeTask052Flow(seed)).toEqual(seed);
    expect(normalizeTask052ClickSessions(undefined)).toEqual([]);
    expect(normalizeTask052PageTokens(undefined)).toEqual([]);
  });

  it("stores click sessions separately from evaluator-visible task052 state", async () => {
    const userId = createUserId();
    const seed = {
      ad_closed: false,
      can_view_target_hotel: false,
      can_view_checkout: false,
      checkout_page_visited: false,
      checkout: null,
    };
    const keyPair = await webcrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"]
    );
    const publicKey = await webcrypto.subtle.exportKey("jwk", keyPair.publicKey);

    await stateStore.replaceState(userId, {
      data: { task052: seed },
      note: null,
    });

    const pageToken = await createTask052PageToken(userId);
    const session = await createTask052ClickSession(
      userId,
      publicKey,
      pageToken
    );
    expect(session.ok).toBe(true);
    if (!session.ok) {
      return;
    }

    const state = await stateStore.getState(userId);
    expect(state.data.task052).toEqual(seed);
    expect(Array.isArray(state.data.task052_click_sessions)).toBe(true);
    expect(Array.isArray(state.data.task052_page_tokens)).toBe(true);
    expect(JSON.stringify(state.data.task052_click_sessions)).not.toContain(
      session.challenge
    );
    expect(JSON.stringify(state.data.task052_page_tokens)).not.toContain(
      pageToken
    );
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
    const pageToken = await createTask052PageToken(userId, { now });
    const session = await createTask052ClickSession(userId, publicKey, pageToken, {
      now,
    });

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

  it("requires a page token and lets a refreshed page replace the old session", async () => {
    const userId = createUserId();
    const now = new Date("2026-01-01T00:00:00.000Z");
    const firstKeyPair = await webcrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"]
    );
    const firstPublicKey = await webcrypto.subtle.exportKey(
      "jwk",
      firstKeyPair.publicKey
    );

    expect(
      (await createTask052ClickSession(userId, firstPublicKey, "", { now })).ok
    ).toBe(false);

    const firstPageToken = await createTask052PageToken(userId, { now });
    const firstSession = await createTask052ClickSession(
      userId,
      firstPublicKey,
      firstPageToken,
      { now }
    );
    expect(firstSession.ok).toBe(true);
    if (!firstSession.ok) {
      return;
    }

    const secondKeyPair = await webcrypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"]
    );
    const secondPublicKey = await webcrypto.subtle.exportKey(
      "jwk",
      secondKeyPair.publicKey
    );
    const secondPageToken = await createTask052PageToken(userId, { now });
    const secondSession = await createTask052ClickSession(
      userId,
      secondPublicKey,
      secondPageToken,
      { now }
    );
    expect(secondSession.ok).toBe(true);
    if (!secondSession.ok) {
      return;
    }

    const oldProof = await createProof(
      firstKeyPair.privateKey,
      firstSession.session_id,
      firstSession.challenge,
      "close_ad",
      {},
      now
    );
    expect(
      (await consumeTask052ClickProof(userId, oldProof, "close_ad", {}, { now }))
        .ok
    ).toBe(false);

    const newProof = await createProof(
      secondKeyPair.privateKey,
      secondSession.session_id,
      secondSession.challenge,
      "close_ad",
      {},
      now
    );
    expect(
      await consumeTask052ClickProof(userId, newProof, "close_ad", {}, { now })
    ).toMatchObject({ ok: true });
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
    const pageToken = await createTask052PageToken(userId, { now });
    const session = await createTask052ClickSession(userId, publicKey, pageToken, {
      now,
    });

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
