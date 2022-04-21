import { StripeElementChangeEvent } from "@stripe/stripe-js";

import {
  composeValidators,
  optional,
  validateEmail,
  validateMatch,
  validatePassword,
  validateRequired,
  validateStripe,
  validateUSPhoneNumber,
} from "../validators";

describe("optional", () => {
  const validator = optional(validateEmail("error"));
  it("should skip empty value", () => {
    expect(validator("", {})).toBeUndefined();
  });

  it("should skip null value", () => {
    expect(validator(null, {})).toBeUndefined();
  });

  it("should skip undefined value", () => {
    expect(validator(null, {})).toBeUndefined();
  });

  it("should skip just spaces", () => {
    expect(validator("   ", {})).toBeUndefined();
  });

  it("should run the validator we a value is present", () => {
    expect(validator("userexample.com", {})).toEqual(["error"]);
  });
});

describe("validateEmail", () => {
  it("should return the provided message if the field value does not resemble an email address", () => {
    const message = "Foo bar baz";
    const validator = validateEmail(message);

    expect(validator(null, {})).toEqual([message]);
    expect(validator("", {})).toEqual([message]);
    expect(validator("foo@", {})).toEqual([message]);
    expect(validator("foo@bar", {})).toEqual([message]);
    expect(validator("foo@bar.com.", {})).toEqual([message]);
    expect(validator("foo.bar", {})).toEqual([message]);
  });

  it("should return undefined if the field value resembles an email address", () => {
    const message = "Foo bar baz";
    const validator = validateEmail(message);

    expect(validator(null, {})).toEqual([message]);
    expect(validator("foo@bar.baz", {})).toBeUndefined();
    expect(validator("foo.bar@baz.com", {})).toBeUndefined();
  });
});

describe("validateMatch", () => {
  it("should return the provided message if the field value does not match the value of the specified field", () => {
    const message = "Foo bar baz";
    const field = "blah";
    const validator = validateMatch(message, field);

    expect(validator("", { [field]: "blah" })).toEqual([message]);
    expect(validator("blah", { [field]: "" })).toEqual([message]);
    expect(validator("", {})).toEqual([message]);
    expect(validator("blah", {})).toEqual([message]);
  });

  it("should return undefined if the provided value matches the value of the specified field", () => {
    const message = "Foo bar baz";
    const field = "blah";
    const validator = validateMatch(message, field);

    expect(validator("", { [field]: "" })).toBeUndefined();
    expect(validator("blah", { [field]: "blah" })).toBeUndefined();
  });
});

describe("validatePassword", () => {
  it("should return the provided message if the field value is not a valid length", () => {
    const message = "Foo bar baz";
    const validator = validatePassword(message);

    expect(validator("", {})).toEqual([message]);
    expect(validator("1234", {})).toEqual([message]);
    expect(validator("12345678901234567890123456789012345678901", {})).toEqual([
      message,
    ]);
  });

  it("should return undefined if the field value is an valid length", () => {
    const message = "Foo bar baz";
    const validator = validatePassword(message);

    expect(validator("12345", {})).toBeUndefined();
    expect(
      validator("1234567890123456789012345678901234567890", {})
    ).toBeUndefined();
  });
});

describe("validateRequired", () => {
  it("should return the provided message if the field value is empty", () => {
    const message = "Foo bar baz";
    const validator = validateRequired(message);

    expect(validator(null, {})).toEqual([message]);
    expect(validator("", {})).toEqual([message]);
    expect(validator(" ", {})).toEqual([message]);
    expect(validator("  ", {})).toEqual([message]);
  });

  it("should return undefined if the field value is not empty", () => {
    const message = "Foo bar baz";
    const validator = validateRequired(message);

    expect(validator("*", {})).toBeUndefined();
    expect(validator(" * ", {})).toBeUndefined();
  });
});

describe("validateStripe", () => {
  const successEvent: StripeElementChangeEvent = {
    complete: true,
    elementType: "cardNumber",
    empty: false,
    error: undefined,
  };

  const errorEvent: StripeElementChangeEvent = {
    complete: false,
    elementType: "cardNumber",
    empty: false,
    error: {
      code: "code",
      message: "Oh no!",
      type: "validation_error",
    },
  };

  it("should return the stripe error if failed", () => {
    const validator = validateStripe();

    expect(validator(errorEvent, {})).toEqual(["Oh no!"]);
  });

  it("should return undefined if the event is a success event", () => {
    const validator = validateStripe();

    expect(validator(successEvent, {})).toBeUndefined();
  });
});

describe("validateUSPhoneNumber", () => {
  const validator = validateUSPhoneNumber("error");

  [
    "1234567890",
    "123 456 7890",
    "(123)456 7890",
    "(123) 456 7890",
    "(123)456-7890",
    "(123) 456-7890",
    "123.456.7890",
    "123-456-7890",
  ].forEach((value) => {
    it(`should validate US domestic phone number ${value}`, () => {
      expect(validator(value, {})).toBeUndefined();
    });
  });

  it("should reject too short numbers", () => {
    expect(validator("123-456-789", {})).toEqual(["error"]);
  });

  it("should reject too long numbers", () => {
    expect(validator("123-456-78901", {})).toEqual(["error"]);
  });
});

describe("composeValidators", () => {
  it("should return the stripe error if failed", () => {
    const validator = composeValidators(
      validateRequired("required"),
      validateEmail("email")
    );

    expect(validator("", {})).toEqual(["required", "email"]);
    expect(validator("eee", {})).toEqual(["email"]);
    expect(validator("user@example.com", {})).toBeUndefined();
  });
});
