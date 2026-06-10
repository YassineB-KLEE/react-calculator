import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Calculator } from "./Calculator";

function setupCalculator() {
  const view = render(<Calculator />);
  const display = () => view.container.querySelector("header strong");

  const click = (name: string | RegExp) => {
    act(() => {
      view.getByRole("button", { name }).click();
    });
  };

  const enterScientific = () => click("2nd");

  return { ...view, click, display, enterScientific };
}

describe("Calculator scientific panel", () => {
  describe("happy path", () => {
    it("computes sin(30) in DEG as 0.5", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("3");
      click("0");
      click("sin");
      expect(display()?.textContent).toBe(String(Math.sin(Math.PI / 6)));
    });

    it("computes cos(0) as 1", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("cos");
      expect(display()?.textContent).toBe("1");
    });

    it("computes tan(45) in DEG as 1", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("4");
      click("5");
      click("tan");
      expect(display()?.textContent).toBe(String(Math.tan(Math.PI / 4)));
    });

    it("computes ln(e) as 1", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("e");
      click("ln");
      expect(display()?.textContent).toBe("1");
    });

    it("computes log10(100) as 2", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("1");
      click("0");
      click("0");
      click("log");
      expect(display()?.textContent).toBe("2");
    });

    it("computes exp(1) as Math.E", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("1");
      click("exp");
      expect(display()?.textContent).toBe(String(Math.E));
    });

    it("computes √9 as 3", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("9");
      click("√");
      expect(display()?.textContent).toBe("3");
    });

    it("computes 2 x^y 3 = as 8", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("2");
      click("x^y");
      click("3");
      click("=");
      expect(display()?.textContent).toBe("8");
    });

    it("inserts π via the constant button", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("π");
      expect(display()?.textContent).toBe(String(Math.PI));
    });

    it("computes 5 x! as 120", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("5");
      click("x!");
      expect(display()?.textContent).toBe("120");
    });

    it("computes sin(π) in RAD as approximately 0", () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("DEG");
      click("π");
      click("sin");
      expect(Number(display()?.textContent)).toBeCloseTo(0, 10);
    });
  });

  describe("edge cases", () => {
    it('shows "Error" for 5 ÷ 0 =', () => {
      const { click, display } = setupCalculator();
      click("5");
      click("÷");
      click("0");
      click("=");
      expect(display()?.textContent).toBe("Error");
    });

    it('shows "Error" for factorial of a negative number', () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("5");
      click("+/-");
      click("x!");
      expect(display()?.textContent).toBe("Error");
    });

    it('shows "Error" for tan(90) in DEG', () => {
      const { click, display, enterScientific } = setupCalculator();
      enterScientific();
      click("9");
      click("0");
      click("tan");
      expect(display()?.textContent).toBe("Error");
    });
  });
});
