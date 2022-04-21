import { negate, percentage } from "../css";

describe("negate", () => {
  it("should convert a number to its corresponding negative value", () => {
    expect(negate(123)).toBe(-123);
  });

  it("should prefix a string with a hyphen-minus", () => {
    expect(negate("123px")).toBe("-123px");
  });

  it("should pass through `null` or undefined values", () => {
    expect(negate(null)).toBeNull();
    expect(negate(undefined)).toBeUndefined();
  });
});

describe("percentage", () => {
  it("should convert a number to its corresponding percentage", () => {
    expect(percentage(-0.3333)).toBe("-33.33%");
    expect(percentage(1 / 2)).toBe("50%");
    expect(percentage(10)).toBe("1000%");
  });
});
