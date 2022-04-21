import { breakpoint } from "../../variables";
import factory from "../factory";

describe("factory", () => {
  it("should return a function that maps the provided props to the provided CSS properties", () => {
    const helper = factory([
      { prop: "fontColor", properties: ["color"] },
      { prop: "size", properties: ["height", "width"] },
    ]);

    expect(
      helper({
        fontColor: "red",
        size: 24,
      })
    ).toContainEqual({
      color: "red",
      height: 24,
      width: 24,
    });
  });

  it("should convert arrays to media queries if there is no responsive prop specified", () => {
    const helper = factory([{ prop: "width", properties: ["width"] }]);

    expect(
      helper({
        width: ["100%", "80%", "50%", "33.333%"],
      })
    ).toContainEqual({
      width: "100%",
      [`@media(min-width: ${breakpoint.sm}px)`]: { width: "80%" },
      [`@media(min-width: ${breakpoint.md}px)`]: { width: "50%" },
      [`@media(min-width: ${breakpoint.lg}px)`]: { width: "33.333%" },
    });
  });

  it("should convert arrays to media queries if the specified responsive prop is not `false`", () => {
    const responsiveProp = "foo";
    const helper = factory(
      [{ prop: "width", properties: ["width"] }],
      responsiveProp
    );

    expect(
      helper({
        [responsiveProp]: true,
        width: ["100%", "80%", "50%", "33.333%"],
      })
    ).toContainEqual({
      width: "100%",
      [`@media(min-width: ${breakpoint.sm}px)`]: { width: "80%" },
      [`@media(min-width: ${breakpoint.md}px)`]: { width: "50%" },
      [`@media(min-width: ${breakpoint.lg}px)`]: { width: "33.333%" },
    });

    expect(
      helper({
        width: ["100%", "80%", "50%", "33.333%"],
      })
    ).toEqual(
      helper({
        [responsiveProp]: true,
        width: ["100%", "80%", "50%", "33.333%"],
      })
    );
  });

  it("should use only the first value of an array if the specified responsive prop is `false`", () => {
    const responsiveProp = "bar";
    const helper = factory(
      [{ prop: "width", properties: ["width"] }],
      responsiveProp
    );

    expect(
      helper({
        [responsiveProp]: false,
        width: ["100%", "80%", "50%", "33.333%"],
      })
    ).toContainEqual({
      width: "100%",
    });
  });

  it("should ignore other props", () => {
    const helper = factory([{ prop: "width", properties: ["width"] }]);

    const result = helper({
      bar: "baz",
      foo: true,
      width: "100%",
    });

    expect(result).toContainEqual({
      width: "100%",
    });
  });
});
