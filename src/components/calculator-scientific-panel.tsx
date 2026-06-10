import type { Action } from "../@types/action";
import type { State } from "../@types/state";
import { CalculatorButton } from "./calculator-button";

interface CalculatorScientificPanelProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function CalculatorScientificPanel({
  state,
  dispatch,
}: CalculatorScientificPanelProps) {
  if (state.mode !== "scientific") {
    return null;
  }

  const angleMode = state.angleMode ?? "deg";
  const applyFunction = (
    fn: NonNullable<Action["payload"]>["fn"],
  ) => {
    dispatch({ payload: { fn }, type: "APPLY_FUNCTION" });
  };

  return (
    <div className="flex w-72 flex-col gap-3">
      <div className="grid grid-cols-5 gap-2">
        <CalculatorButton
          className="!size-12 text-xl text-[#FF9500]"
          onPress={() => dispatch({ type: "TOGGLE_ANGLE_MODE" })}
          variant="clear"
        >
          {angleMode === "rad" ? "RAD" : "DEG"}
        </CalculatorButton>
        <CalculatorButton
          className="!size-12"
          onPress={() => applyFunction("sin")}
          variant="scientific"
        >
          sin
        </CalculatorButton>
        <CalculatorButton
          className="!size-12"
          onPress={() => applyFunction("cos")}
          variant="scientific"
        >
          cos
        </CalculatorButton>
        <CalculatorButton
          className="!size-12"
          onPress={() => applyFunction("tan")}
          variant="scientific"
        >
          tan
        </CalculatorButton>
        <CalculatorButton
          className="!size-12"
          onPress={() => applyFunction("ln")}
          variant="scientific"
        >
          ln
        </CalculatorButton>
      </div>

      <div className="grid grid-cols-7 gap-1">
        <CalculatorButton
          className="!size-9 text-base"
          onPress={() => applyFunction("log10")}
          variant="scientific"
        >
          log
        </CalculatorButton>
        <CalculatorButton
          className="!size-9 text-base"
          onPress={() => applyFunction("exp")}
          variant="scientific"
        >
          exp
        </CalculatorButton>
        <CalculatorButton
          className="!size-9 text-xl"
          onPress={() => applyFunction("sqrt")}
          variant="scientific"
        >
          √
        </CalculatorButton>
        <CalculatorButton
          className="!size-9 text-base"
          onPress={() =>
            dispatch({ payload: { operation: "^" }, type: "SET_OPERATION" })
          }
          variant="operator"
        >
          x^y
        </CalculatorButton>
        <CalculatorButton
          className="!size-9 text-base"
          onPress={() => applyFunction("factorial")}
          variant="scientific"
        >
          x!
        </CalculatorButton>
        <CalculatorButton
          className="!size-9 text-xl"
          onPress={() =>
            dispatch({
              payload: { constant: "pi" },
              type: "INSERT_CONSTANT",
            })
          }
          variant="scientific"
        >
          π
        </CalculatorButton>
        <CalculatorButton
          className="!size-9 text-xl"
          onPress={() =>
            dispatch({
              payload: { constant: "e" },
              type: "INSERT_CONSTANT",
            })
          }
          variant="scientific"
        >
          e
        </CalculatorButton>
      </div>
    </div>
  );
}
