import { describe, expect, it } from "vitest";
import {
  consumeTask052ActionToken,
  issueTask052ActionToken,
  normalizeTask052ActionTokens,
} from "./task052-action-tokens";
import { normalizeTask052Flow } from "./task052-flow";
import { stateStore } from "./state-store";

let userCounter = 0;

function createUserId() {
  userCounter += 1;
  return `task052-token-test-${userCounter}`;
}

describe("task052 action tokens", () => {
  it("normalizes setup seed state without token fields", () => {
    const seed = {
      ad_closed: false,
      can_view_target_hotel: false,
      can_view_checkout: false,
      checkout_page_visited: false,
      checkout: null,
    };

    expect(normalizeTask052Flow(seed)).toEqual(seed);
    expect(normalizeTask052ActionTokens(undefined)).toEqual([]);
  });

  it("stores tokens separately from evaluator-visible task052 state", async () => {
    const userId = createUserId();
    const seed = {
      ad_closed: false,
      can_view_target_hotel: false,
      can_view_checkout: false,
      checkout_page_visited: false,
      checkout: null,
    };

    await stateStore.replaceState(userId, {
      data: { task052: seed },
      note: null,
    });

    const token = await issueTask052ActionToken(userId, "close_ad");
    const state = await stateStore.getState(userId);

    expect(state.data.task052).toEqual(seed);
    expect(Array.isArray(state.data.task052_action_tokens)).toBe(true);
    expect(JSON.stringify(state.data.task052_action_tokens)).not.toContain(
      token
    );
  });

  it("consumes a valid token only once", async () => {
    const userId = createUserId();
    const token = await issueTask052ActionToken(userId, "close_ad");

    expect(
      await consumeTask052ActionToken(userId, token, "close_ad")
    ).toEqual({ ok: true });

    const replay = await consumeTask052ActionToken(
      userId,
      token,
      "close_ad"
    );
    expect(replay.ok).toBe(false);
  });

  it("rejects missing, wrong-action, and wrong-target tokens", async () => {
    const userId = createUserId();
    const hotelToken = await issueTask052ActionToken(
      userId,
      "open_hotel",
      { hotel_id: "hotel-paris-1" }
    );
    const checkoutToken = await issueTask052ActionToken(
      userId,
      "open_checkout",
      { hotel_id: "hotel-paris-1", room: "Deluxe Suite" }
    );

    expect(
      (await consumeTask052ActionToken(userId, "", "close_ad")).ok
    ).toBe(false);
    expect(
      (
        await consumeTask052ActionToken(userId, hotelToken, "open_checkout", {
          hotel_id: "hotel-paris-1",
          room: "Deluxe Suite",
        })
      ).ok
    ).toBe(false);
    expect(
      (
        await consumeTask052ActionToken(userId, checkoutToken, "open_checkout", {
          hotel_id: "hotel-paris-1",
          room: "Superior Room",
        })
      ).ok
    ).toBe(false);
    expect(
      await consumeTask052ActionToken(userId, hotelToken, "open_hotel", {
        hotel_id: "hotel-paris-1",
      })
    ).toEqual({ ok: true });
    expect(
      await consumeTask052ActionToken(userId, checkoutToken, "open_checkout", {
        hotel_id: "hotel-paris-1",
        room: "Deluxe Suite",
      })
    ).toEqual({ ok: true });
  });

  it("rejects expired tokens", async () => {
    const userId = createUserId();
    const issuedAt = new Date("2026-01-01T00:00:00.000Z");
    const token = await issueTask052ActionToken(userId, "close_ad", {}, {
      now: issuedAt,
      ttlMs: 1000,
    });

    const result = await consumeTask052ActionToken(
      userId,
      token,
      "close_ad",
      {},
      { now: new Date("2026-01-01T00:00:02.000Z") }
    );

    expect(result.ok).toBe(false);
  });
});

