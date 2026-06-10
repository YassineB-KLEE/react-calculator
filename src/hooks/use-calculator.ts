import { Big } from "big.js";
import { useCallback, useEffect, useReducer } from "react";

import type { Action } from "../@types/action";
import type { State } from "../@types/state";
import {
  applyUnary,
  evaluateBinary,
  formatConstant,
  type ConstantName,
} from "../lib/calculator-math";

const initialValue: State = {
  overwrite: true,
  previousValue: "0",
  mode: "basic",
  angleMode: "deg",
};

function constantPayloadToName(constant: "pi" | "e"): ConstantName {
  return constant === "pi" ? "π" : "e";
}

function evaluate(state: State): string {
  try {
    if (state.operation === "^") {
      const base = state.overwrite
        ? state.previousValue
        : state.currentValue;
      const exponent = state.overwrite
        ? state.currentValue
        : state.previousValue;
      return evaluateBinary(
        "^",
        base || "",
        exponent || "",
        true,
      );
    }
    return evaluateBinary(
      state.operation!,
      state.previousValue || "",
      state.currentValue || "",
      state.overwrite ?? false,
    );
  } catch {
    return "Error";
  }
}

export function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "CLEAR":
      return initialValue;
    case "ADD_DIGIT":
      if (payload?.digit === "0" && state.previousValue === "0") {
        return state;
      }
      if (payload?.digit === ".") {
        return state.previousValue?.includes(".")
          ? state
          : {
              ...state,
              overwrite: false,
              previousValue: `${state.previousValue}${payload?.digit}`,
            };
      }
      if (state.overwrite || state.previousValue === "0") {
        return {
          ...state,
          overwrite: false,
          previousValue: payload?.digit || "",
        };
      }
      return {
        ...state,
        previousValue: `${state.previousValue}${payload?.digit || ""}`,
      };
    case "SET_OPERATION":
      if (state.currentValue) {
        return {
          ...state,
          currentValue: evaluate(state),
          operation: payload?.operation,
          overwrite: true,
          previousValue: evaluate(state),
        };
      }
      return {
        ...state,
        currentValue: state.previousValue,
        operation: payload?.operation,
        overwrite: true,
      };
    case "PERCENTAGE":
      try {
        return {
          ...state,
          overwrite: true,
          previousValue: new Big(state.previousValue).div(100).toString(),
        };
      } catch {
        return {
          ...state,
          overwrite: true,
          previousValue: "Error",
        };
      }
    case "INVERT":
      return {
        ...state,
        overwrite: false,
        previousValue: (Number.parseFloat(state.previousValue) * -1).toString(),
      };
    case "EVALUATE":
      if (!(state.previousValue && state.currentValue && state.operation)) {
        return state;
      }
      return {
        ...state,
        currentValue: state.overwrite
          ? state.currentValue
          : state.previousValue,
        overwrite: true,
        previousValue: evaluate(state),
      };
    case "TOGGLE_MODE":
      return {
        ...state,
        mode: state.mode === "scientific" ? "basic" : "scientific",
      };
    case "TOGGLE_ANGLE_MODE":
      return {
        ...state,
        angleMode: state.angleMode === "rad" ? "deg" : "rad",
      };
    case "APPLY_FUNCTION": {
      if (!payload?.fn) {
        return state;
      }
      try {
        return {
          ...state,
          previousValue: applyUnary(
            payload.fn,
            state.previousValue,
            state.angleMode ?? "deg",
          ),
          overwrite: true,
          currentValue: undefined,
          operation: undefined,
        };
      } catch {
        return {
          ...state,
          previousValue: "Error",
          overwrite: true,
          currentValue: undefined,
          operation: undefined,
        };
      }
    }
    case "INSERT_CONSTANT": {
      if (!payload?.constant) {
        return state;
      }
      try {
        const constantValue = formatConstant(
          constantPayloadToName(payload.constant),
        );
        if (state.overwrite || state.previousValue === "0") {
          return {
            ...state,
            overwrite: false,
            previousValue: constantValue,
          };
        }
        return {
          ...state,
          previousValue: `${state.previousValue}${constantValue}`,
        };
      } catch {
        return {
          ...state,
          overwrite: true,
          previousValue: "Error",
        };
      }
    }
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const addDigit = useCallback((number: string) => {
    dispatch({ payload: { digit: number }, type: "ADD_DIGIT" });
  }, []);

  const setOperation = useCallback(
    (operation: "+" | "-" | "×" | "÷" | "^") => {
      dispatch({ payload: { operation }, type: "SET_OPERATION" });
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      "keyup",
      (e) => {
        const keys = {
          "-": () => setOperation("-"),
          ",": () => addDigit("."),
          ".": () => addDigit(e.key.toLowerCase()),
          "*": () => setOperation("×"),
          "/": () => setOperation("÷"),
          "%": () => dispatch({ type: "PERCENTAGE" }),
          "+": () => setOperation("+"),
          "=": () => dispatch({ type: "EVALUATE" }),
          0: () => addDigit(e.key.toLowerCase()),
          1: () => addDigit(e.key.toLowerCase()),
          2: () => addDigit(e.key.toLowerCase()),
          3: () => addDigit(e.key.toLowerCase()),
          4: () => addDigit(e.key.toLowerCase()),
          5: () => addDigit(e.key.toLowerCase()),
          6: () => addDigit(e.key.toLowerCase()),
          7: () => addDigit(e.key.toLowerCase()),
          8: () => addDigit(e.key.toLowerCase()),
          9: () => addDigit(e.key.toLowerCase()),
          c: () => dispatch({ type: "CLEAR" }),
          enter: () => dispatch({ type: "EVALUATE" }),
        };

        type Key = keyof typeof keys;

        if (keys[e.key.toLowerCase() as Key]) {
          keys[e.key.toLowerCase() as Key]();
        }
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  }, [addDigit, setOperation]);

  return { dispatch, state };
}
