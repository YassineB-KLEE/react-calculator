import { Big } from "big.js";

export type BinaryOp = "+" | "-" | "×" | "÷" | "^";
export type UnaryFn =
  | "sin"
  | "cos"
  | "tan"
  | "ln"
  | "log10"
  | "exp"
  | "sqrt"
  | "factorial";
export type AngleMode = "deg" | "rad";
export type ConstantName = "π" | "e";

/** cos(angleRad) below this threshold is treated as zero for tan. */
const TAN_COS_EPSILON = 1e-10;

/**
 * Edge-case policy:
 * - Non-finite numeric results (NaN, ±Infinity) → "Error"
 */
export function toError(result: number): string {
  if (!Number.isFinite(result)) {
    return "Error";
  }
  return String(result);
}

export function formatConstant(name: ConstantName): string {
  switch (name) {
    case "π":
      return String(Math.PI);
    case "e":
      return String(Math.E);
    default: {
      const exhaustive: never = name;
      throw new Error(`Unknown constant ${exhaustive}`);
    }
  }
}

/**
 * Binary arithmetic extracted from use-calculator evaluate().
 * Uses big.js for +, −, ×, ÷; ^ uses Math.pow then toError.
 *
 * Edge-case policy:
 * - ÷0 → "Error" (big.js throws on division by zero)
 *
 * For − and ÷, overwrite mirrors the hook: when true, computes a op b;
 * when false, computes b op a.
 */
export function evaluateBinary(
  op: BinaryOp,
  a: string,
  b: string,
  overwrite: boolean,
): string {
  try {
    switch (op) {
      case "+":
        return new Big(a).plus(b).toString();
      case "-":
        return overwrite
          ? new Big(a).minus(b).toString()
          : new Big(b).minus(a).toString();
      case "×":
        return new Big(a).mul(b).toString();
      case "÷":
        return overwrite
          ? new Big(a).div(b).toString()
          : new Big(b).div(a).toString();
      case "^": {
        const base = Number.parseFloat(a);
        const exponent = Number.parseFloat(b);
        return toError(base ** exponent);
      }
      default: {
        const exhaustive: never = op;
        throw new Error(`Unknown operation ${exhaustive}`);
      }
    }
  } catch {
    return "Error";
  }
}

function toRadians(value: number, angleMode: AngleMode): number {
  return angleMode === "deg" ? (value * Math.PI) / 180 : value;
}

function factorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Unary operations for scientific calculator functions.
 *
 * Edge-case policy:
 * - ln/log10 of ≤0 → "Error"
 * - sqrt of negative → "Error"
 * - factorial of negative or non-integer → "Error"
 * - tan when cos(angleRad) ≈ 0 (e.g. 90°, 270° in deg mode) → "Error"
 */
export function applyUnary(
  fn: UnaryFn,
  value: string,
  angleMode: AngleMode,
): string {
  const num = Number.parseFloat(value);

  switch (fn) {
    case "sin":
      return toError(Math.sin(toRadians(num, angleMode)));
    case "cos":
      return toError(Math.cos(toRadians(num, angleMode)));
    case "tan": {
      const angleRad = toRadians(num, angleMode);
      if (Math.abs(Math.cos(angleRad)) < TAN_COS_EPSILON) {
        return "Error";
      }
      return toError(Math.tan(angleRad));
    }
    case "ln":
      if (num <= 0) {
        return "Error";
      }
      return toError(Math.log(num));
    case "log10":
      if (num <= 0) {
        return "Error";
      }
      return toError(Math.log10(num));
    case "exp":
      return toError(Math.exp(num));
    case "sqrt":
      if (num < 0) {
        return "Error";
      }
      return toError(Math.sqrt(num));
    case "factorial":
      if (num < 0 || !Number.isInteger(num)) {
        return "Error";
      }
      return toError(factorial(num));
    default: {
      const exhaustive: never = fn;
      throw new Error(`Unknown unary function ${exhaustive}`);
    }
  }
}
