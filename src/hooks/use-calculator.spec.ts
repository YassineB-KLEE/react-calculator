import { describe, expect, it } from "vitest";

import { reducer } from "./use-calculator";

const initialState = {
  overwrite: true,
  previousValue: "0",
  mode: "basic" as const,
  angleMode: "deg" as const,
};

describe("calculator reducer", () => {
  it("applies unary function to previousValue and sets overwrite", () => {
    const state = { ...initialState, previousValue: "90" };
    const next = reducer(state, {
      type: "APPLY_FUNCTION",
      payload: { fn: "sin" },
    });
    expect(next.previousValue).toBe("1");
    expect(next.overwrite).toBe(true);
    expect(next.currentValue).toBeUndefined();
    expect(next.operation).toBeUndefined();
  });

  it("inserts constant like a digit when overwrite is true", () => {
    const next = reducer(initialState, {
      type: "INSERT_CONSTANT",
      payload: { constant: "pi" },
    });
    expect(next.previousValue).toBe(String(Math.PI));
    expect(next.overwrite).toBe(false);
  });

  it("toggles mode and angle mode", () => {
    expect(reducer(initialState, { type: "TOGGLE_MODE" }).mode).toBe(
      "scientific",
    );
    expect(
      reducer(
        { ...initialState, mode: "scientific" },
        { type: "TOGGLE_MODE" },
      ).mode,
    ).toBe("basic");
    expect(reducer(initialState, { type: "TOGGLE_ANGLE_MODE" }).angleMode).toBe(
      "rad",
    );
  });

  it("evaluates power operation via evaluateBinary", () => {
    const state = {
      ...initialState,
      previousValue: "3",
      currentValue: "2",
      operation: "^" as const,
      overwrite: false,
    };
    const next = reducer(state, { type: "EVALUATE" });
    expect(next.previousValue).toBe("8");
  });
});
