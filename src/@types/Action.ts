export interface Action {
  type:
    | "ADD_DIGIT"
    | "SET_OPERATION"
    | "EVALUATE"
    | "PERCENTAGE"
    | "INVERT"
    | "CLEAR"
    | "TOGGLE_MODE"
    | "TOGGLE_ANGLE_MODE"
    | "APPLY_FUNCTION"
    | "INSERT_CONSTANT";
  payload?: {
    digit?: string;
    operation?: "+" | "-" | "×" | "÷" | "^";
    fn?: "sin" | "cos" | "tan" | "ln" | "log10" | "exp" | "sqrt" | "factorial";
    constant?: "pi" | "e";
  };
}
