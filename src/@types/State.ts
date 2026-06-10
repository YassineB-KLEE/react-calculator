export interface State {
  previousValue: string;
  currentValue?: string | null;
  operation?: "+" | "-" | "×" | "÷" | "^";
  overwrite?: boolean;
  mode?: "basic" | "scientific";
  angleMode?: "deg" | "rad";
}
