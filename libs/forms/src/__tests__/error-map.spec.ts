import { FORM_ERROR } from "final-form";

import { getUserErrorsMapper } from "../error-map";

describe("getUserErrorsMapper", () => {
  it("should handle generic errors", () => {
    expect(
      getUserErrorsMapper({})([
        {
          code: "CUSTOMER_DISABLED",
          field: null,
          message:
            "We have sent an email to developers@fotp.com, please click the link included to verify your email address.",
        },
      ])
    ).toEqual({
      [FORM_ERROR]: [
        "We have sent an email to developers@fotp.com, please click the link included to verify your email address.",
      ],
    });
  });

  it("should handle errors that apply to specific fields", () => {
    expect(
      getUserErrorsMapper({ input: { firstName: "bar" } })([
        {
          code: "CONTAINS_HTML_TAGS",
          field: ["input", "firstName"],
          message: "First name cannot contain HTML tags",
        },
      ])
    ).toEqual({
      bar: ["First name cannot contain HTML tags"],
    });
  });

  it("should throw if any errors are missing a map entry", () => {
    expect(() =>
      getUserErrorsMapper({
        input: { password: "password" },
      })([
        {
          code: "CUSTOMER_DISABLED",
          field: null,
          message:
            "We have sent an email to developers@fotp.com, please click the link included to verify your email address.",
        },
        {
          code: "CONTAINS_HTML_TAGS",
          field: ["input", "firstName"],
          message: "First name cannot contain HTML tags",
        },
        {
          code: "CONTAINS_HTML_TAGS",
          field: ["input", "lastName"],
          message: "Last name cannot contain HTML tags",
        },
        {
          code: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
          field: ["input", "password"],
          message: "Password starts or ends with spaces.",
        },
      ])
    ).toThrowErrorMatchingSnapshot();
  });

  it("should handle multiple overlapping errors", () => {
    expect(
      getUserErrorsMapper({ input: { password: "password" } })([
        {
          code: "TOO_SHORT",
          field: ["input", "password"],
          message: "Password is too short (minimum is 5 characters)",
        },
        {
          code: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
          field: ["input", "password"],
          message: "Password starts or ends with spaces.",
        },
      ])
    ).toEqual({
      password: [
        "Password is too short (minimum is 5 characters)",
        "Password starts or ends with spaces.",
      ],
    });
  });
});
