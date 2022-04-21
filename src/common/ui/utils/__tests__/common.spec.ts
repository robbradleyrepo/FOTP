import { merge } from "../common";

describe("merge", () => {
  it("should merge the provided objects from left to right", () => {
    const first = { color: "red" };
    const second = { color: "green", fontSize: 14 };
    const third = { color: "blue", textAlign: "center" };

    expect(merge(first, second, third)).toEqual({
      color: "blue",
      fontSize: 14,
      textAlign: "center",
    });
  });

  it("should merge recursively", () => {
    const first = {
      color: "red",
    };
    const second = {
      ":hover": {
        backgroundColor: "blue",
        color: "green",
      },
      color: "green",
    };
    const third = {
      ":hover": {
        backgroundColor: "red",
      },
      color: "blue",
    };

    expect(merge(first, second, third)).toEqual({
      ":hover": {
        backgroundColor: "red",
        color: "green",
      },
      color: "blue",
    });
  });

  it("should not combine arrays", () => {
    const first = { color: "red" };
    const second = { color: ["green", null, "red"] };
    const third = { color: ["blue", "red"] };

    expect(merge(first, second, third)).toEqual({
      color: ["blue", "red"],
    });
  });

  it("should not mutate the provided objects", () => {
    const first = Object.freeze({ color: "red" });
    const second = Object.freeze({ color: "green", fontSize: 14 });
    const third = Object.freeze({ color: "blue", textAlign: "center" });

    expect(() => merge(first, second, third)).not.toThrow();
  });
});
