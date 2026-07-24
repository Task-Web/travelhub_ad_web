import { describe, expect, it } from "vitest";
import {
  isTask052TargetSelection,
  shouldUseTask052CheckoutFlow,
} from "./task052-target";

describe("task052 checkout targeting", () => {
  it("uses the task flow for the evaluator target and its parameterless checkout URL", () => {
    expect(shouldUseTask052CheckoutFlow({})).toBe(true);
    expect(
      shouldUseTask052CheckoutFlow({
        hotelId: "hotel-paris-1",
        hotelName: "Le Meurice",
        room: "Deluxe Suite",
      })
    ).toBe(true);
    expect(isTask052TargetSelection("hotel-paris-1", "Deluxe Suite")).toBe(
      true
    );
  });

  it("keeps other Le Meurice rooms on the regular checkout flow", () => {
    expect(
      shouldUseTask052CheckoutFlow({
        hotelId: "hotel-paris-1",
        hotelName: "Le Meurice",
        room: "Superior Room",
      })
    ).toBe(false);
    expect(isTask052TargetSelection("hotel-paris-1", "Superior Room")).toBe(
      false
    );
  });

  it("keeps other hotels on the regular checkout flow", () => {
    expect(
      shouldUseTask052CheckoutFlow({
        hotelId: "hotel-paris-2",
        hotelName: "Hotel des Arts Montmartre",
        room: "Standard Room",
      })
    ).toBe(false);
  });
});
