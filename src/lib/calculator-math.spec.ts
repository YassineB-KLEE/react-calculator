import { describe, expect, it } from "vitest";
import { Big } from "big.js";

import {
  applyUnary,
  evaluateBinary,
  formatConstant,
  toError,
} from "./calculator-math";

describe("toError", () => {
  it("returns string for finite numbers", () => {
    expect(toError(42)).toBe("42");
    expect(toError(0)).toBe("0");
    expect(toError(-3.5)).toBe("-3.5");
  });

  it('returns "Error" for NaN', () => {
    expect(toError(Number.NaN)).toBe("Error");
  });

  it('returns "Error" for positive Infinity', () => {
    expect(toError(Number.POSITIVE_INFINITY)).toBe("Error");
  });

  it('returns "Error" for negative Infinity', () => {
    expect(toError(Number.NEGATIVE_INFINITY)).toBe("Error");
  });
});

describe("formatConstant", () => {
  it("formats π using Math.PI", () => {
    expect(formatConstant("π")).toBe(String(Math.PI));
  });

  it("formats e using Math.E", () => {
    expect(formatConstant("e")).toBe(String(Math.E));
  });
});

describe("evaluateBinary", () => {
  describe("addition (+)", () => {
    it("adds two numbers", () => {
      expect(evaluateBinary("+", "2", "3", true)).toBe("5");
    });

    it("ignores overwrite for addition", () => {
      expect(evaluateBinary("+", "2", "3", false)).toBe("5");
    });
  });

  describe("subtraction (−)", () => {
    it("subtracts b from a when overwrite is true", () => {
      expect(evaluateBinary("-", "10", "3", true)).toBe("7");
    });

    it("subtracts a from b when overwrite is false", () => {
      expect(evaluateBinary("-", "10", "3", false)).toBe("-7");
    });
  });

  describe("multiplication (×)", () => {
    it("multiplies two numbers", () => {
      expect(evaluateBinary("×", "4", "2", true)).toBe("8");
    });

    it("ignores overwrite for multiplication", () => {
      expect(evaluateBinary("×", "4", "2", false)).toBe("8");
    });
  });

  describe("division (÷)", () => {
    it("divides a by b when overwrite is true", () => {
      expect(evaluateBinary("÷", "12", "2", true)).toBe("6");
    });

    it("divides b by a when overwrite is false", () => {
      expect(evaluateBinary("÷", "12", "2", false)).toBe(
        new Big("2").div("12").toString(),
      );
    });

    it('returns "Error" on division by zero (overwrite true)', () => {
      expect(evaluateBinary("÷", "5", "0", true)).toBe("Error");
    });

    it('returns "Error" on division by zero (overwrite false)', () => {
      expect(evaluateBinary("÷", "0", "5", false)).toBe("Error");
    });
  });

  describe("exponentiation (^)", () => {
    it("raises a to the power of b", () => {
      expect(evaluateBinary("^", "2", "3", true)).toBe("8");
    });

    it("handles fractional exponents", () => {
      expect(evaluateBinary("^", "9", "0.5", true)).toBe("3");
    });
  });
});

describe("applyUnary", () => {
  describe("trigonometry (deg mode)", () => {
    it("computes sin in degrees", () => {
      expect(applyUnary("sin", "30", "deg")).toBe(String(Math.sin(Math.PI / 6)));
    });

    it("computes cos in degrees", () => {
      expect(applyUnary("cos", "60", "deg")).toBe(String(Math.cos(Math.PI / 3)));
    });

    it("computes tan in degrees", () => {
      expect(applyUnary("tan", "45", "deg")).toBe(
        String(Math.tan(Math.PI / 4)),
      );
    });

    it('returns "Error" for tan(90°)', () => {
      expect(applyUnary("tan", "90", "deg")).toBe("Error");
    });

    it('returns "Error" for tan(270°)', () => {
      expect(applyUnary("tan", "270", "deg")).toBe("Error");
    });

    it('returns "Error" for tan(-90°)', () => {
      expect(applyUnary("tan", "-90", "deg")).toBe("Error");
    });
  });

  describe("trigonometry (rad mode)", () => {
    it("computes sin in radians", () => {
      expect(applyUnary("sin", String(Math.PI / 2), "rad")).toBe("1");
    });

    it("computes cos in radians", () => {
      expect(applyUnary("cos", "0", "rad")).toBe("1");
    });

    it("computes tan in radians", () => {
      expect(applyUnary("tan", String(Math.PI / 4), "rad")).toBe(
        String(Math.tan(Math.PI / 4)),
      );
    });

    it('returns "Error" for tan(π/2 rad)', () => {
      expect(applyUnary("tan", String(Math.PI / 2), "rad")).toBe("Error");
    });
  });

  describe("logarithms", () => {
    it("computes natural log", () => {
      expect(applyUnary("ln", String(Math.E), "deg")).toBe("1");
    });

    it('returns "Error" for ln(0)', () => {
      expect(applyUnary("ln", "0", "deg")).toBe("Error");
    });

    it('returns "Error" for ln of negative number', () => {
      expect(applyUnary("ln", "-1", "deg")).toBe("Error");
    });

    it("computes log10", () => {
      expect(applyUnary("log10", "100", "deg")).toBe("2");
    });

    it('returns "Error" for log10(0)', () => {
      expect(applyUnary("log10", "0", "deg")).toBe("Error");
    });

    it('returns "Error" for log10 of negative number', () => {
      expect(applyUnary("log10", "-5", "deg")).toBe("Error");
    });
  });

  describe("exp", () => {
    it("computes e^x", () => {
      expect(applyUnary("exp", "1", "deg")).toBe(String(Math.E));
    });

    it("computes e^0", () => {
      expect(applyUnary("exp", "0", "deg")).toBe("1");
    });
  });

  describe("sqrt", () => {
    it("computes square root", () => {
      expect(applyUnary("sqrt", "9", "deg")).toBe("3");
    });

    it("computes sqrt(0)", () => {
      expect(applyUnary("sqrt", "0", "deg")).toBe("0");
    });

    it('returns "Error" for sqrt of negative number', () => {
      expect(applyUnary("sqrt", "-4", "deg")).toBe("Error");
    });
  });

  describe("factorial", () => {
    it("computes factorial of positive integer", () => {
      expect(applyUnary("factorial", "5", "deg")).toBe("120");
    });

    it("computes factorial of 0", () => {
      expect(applyUnary("factorial", "0", "deg")).toBe("1");
    });

    it('returns "Error" for factorial of negative number', () => {
      expect(applyUnary("factorial", "-1", "deg")).toBe("Error");
    });

    it('returns "Error" for factorial of non-integer', () => {
      expect(applyUnary("factorial", "3.5", "deg")).toBe("Error");
    });
  });
});
