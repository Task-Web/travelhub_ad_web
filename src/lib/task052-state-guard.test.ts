import { describe, expect, it } from "vitest";
import {
  DEFAULT_TASK052_FLOW,
  TASK052_TARGET_HOTEL_ID,
  TASK052_TARGET_HOTEL_NAME,
  TASK052_TARGET_ROOM,
  type Task052FlowState,
} from "./task052-flow";
import {
  shouldMergeTask052Seed,
  validateTask052StatePatch,
  validateTask052StatePut,
} from "./task052-state-guard";

const initialSeed = {
  ad_closed: false,
  can_view_target_hotel: false,
  can_view_checkout: false,
  checkout_page_visited: false,
  checkout: null,
};

const verifiedCheckoutFlow: Task052FlowState = {
  ad_closed: true,
  can_view_target_hotel: true,
  can_view_checkout: true,
  checkout_page_visited: false,
  checkout: {
    hotel_id: TASK052_TARGET_HOTEL_ID,
    hotel_name: TASK052_TARGET_HOTEL_NAME,
    room: TASK052_TARGET_ROOM,
  },
};

describe("task052 state guard", () => {
  it("allows the task setup seed and preserves the merge shortcut", () => {
    expect(validateTask052StatePut({ task052: initialSeed })).toEqual({
      ok: true,
    });
    expect(shouldMergeTask052Seed({ task052: initialSeed })).toBe(true);
  });

  it("rejects direct writes to successful evaluator-visible task052 state", () => {
    expect(
      validateTask052StatePut({
        task052: {
          ...initialSeed,
          ad_closed: true,
        },
      }).ok
    ).toBe(false);

    expect(
      validateTask052StatePatch(
        {
          task052: {
            ad_closed: true,
            can_view_target_hotel: true,
            can_view_checkout: true,
          },
        },
        DEFAULT_TASK052_FLOW
      ).ok
    ).toBe(false);
  });

  it("rejects task052 internal stores through /api/state", () => {
    expect(
      validateTask052StatePut({
        task052: initialSeed,
        task052_click_sessions: [],
      }).ok
    ).toBe(false);

    expect(
      validateTask052StatePatch(
        {
          task052_click_sessions: [],
        },
        DEFAULT_TASK052_FLOW
      ).ok
    ).toBe(false);

    expect(
      validateTask052StatePut({
        task052: initialSeed,
        task052_page_tokens: [],
      }).ok
    ).toBe(false);

    expect(
      validateTask052StatePatch(
        {
          task052_page_tokens: [],
        },
        DEFAULT_TASK052_FLOW
      ).ok
    ).toBe(false);
  });

  it("only allows checkout_page_visited after the verified checkout exists", () => {
    expect(
      validateTask052StatePatch(
        {
          task052: {
            checkout_page_visited: true,
          },
        },
        DEFAULT_TASK052_FLOW
      ).ok
    ).toBe(false);

    expect(
      validateTask052StatePatch(
        {
          task052: {
            checkout_page_visited: true,
            checkout: verifiedCheckoutFlow.checkout,
          },
        },
        verifiedCheckoutFlow
      )
    ).toEqual({ ok: true });
  });

  it("rejects checkout_page_visited patches with mismatched checkout details", () => {
    expect(
      validateTask052StatePatch(
        {
          task052: {
            checkout_page_visited: true,
            checkout: {
              hotel_id: TASK052_TARGET_HOTEL_ID,
              hotel_name: TASK052_TARGET_HOTEL_NAME,
              room: "Superior Room",
            },
          },
        },
        verifiedCheckoutFlow
      ).ok
    ).toBe(false);
  });
});
