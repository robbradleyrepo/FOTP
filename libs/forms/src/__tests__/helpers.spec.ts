import { removeEmptyFields } from "../helpers";

describe("removeEmptyFields", () => {
  const falsyValues = {
    false: false,
    negativeZero: -0,
    notANumber: NaN,
    zero: 0,
  };

  it("should remove top-level properties that have a `null` value", () => {
    const result = removeEmptyFields({
      ...falsyValues,
      null: null,
    });

    expect(result).toEqual(falsyValues);
  });

  it("should remove top-level properties that have an `undefined` value", () => {
    const result = removeEmptyFields({
      ...falsyValues,
      undefined: undefined,
    });

    expect(result).toEqual(falsyValues);
  });

  it("should not change nested values", () => {
    const nested = {
      object: {
        null: null,
        undefined: undefined,
      },
    };

    expect(removeEmptyFields(nested)).toEqual(nested);
  });
});
