import { renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";

import {
  getMostContrasting,
  getValueAtBreakpoint,
  unresponsiveFactory,
  useResponsiveImageSizes,
} from "../helpers";
import { ThemeProvider } from "../provider";
import { EnhancedTheme, StyleFn, Theme } from "../types";

describe("unresponsiveFactory", () => {
  it("should return a function that removes responsive values for the specified properties on style functions and objects", () => {
    const theme = ({} as unknown) as EnhancedTheme<Theme>;

    const unresponsive = unresponsiveFactory([
      "display",
      "textAlign",
      "whiteSpace",
    ]);

    const style = {
      display: ["block", null, "none"],
      height: 123,
      position: ["static", null, "relative"],
      textAlign: ["left", "right"],
      whiteSpace: "no-wrap",
    };
    const styleFn: StyleFn = () => style;

    const expectedStyle = {
      display: "block",
      height: 123,
      position: ["static", null, "relative"],
      textAlign: "left",
      whiteSpace: "no-wrap",
    };

    expect(unresponsive(style)(theme)).toEqual(expectedStyle);
    expect(unresponsive(styleFn)(theme)).toEqual(expectedStyle);
  });
});

describe("getMostContrasting", () => {
  it("should return the color from the provided array that has the greatest contrast with the provided reference", () => {
    expect(getMostContrasting("black", ["red", "white", "blue", "green"])).toBe(
      "white"
    );
    expect(
      getMostContrasting("#999999", ["#000000", "#444444", "#ffffff"])
    ).toBe("#000000");
  });
});

describe("getValueAtBreakpoint", () => {
  it("should return the effective value for the provided breakpoint index", () => {
    expect(getValueAtBreakpoint(["default", "sm", "md", "lg", "xl"], 3)).toBe(
      "lg"
    );
    expect(getValueAtBreakpoint(["default", "sm", null, null, "xl"], 3)).toBe(
      "sm"
    );
    expect(getValueAtBreakpoint(["default", "sm"], 3)).toBe("sm");
    expect(getValueAtBreakpoint("default", 3)).toBe("default");
  });
});

describe("useResponsiveImageSizes", () => {
  const theme = {
    breakpoint: {
      lg: 1140,
      md: 768,
      sm: 480,
      xl: 1280,
    },
  } as Theme;
  const wrapper: FC = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  const { result } = renderHook(() => useResponsiveImageSizes(), { wrapper });

  it("should generate `sizes` for images that have a proportional width", () => {
    expect(result.current({ width: "100vw" })).toBe("100vw");
    expect(result.current({ width: ["100vw", "50vw"] })).toBe(
      "(min-width:480px) 50vw, 100vw"
    );
    expect(
      result.current({ width: ["100vw", null, "50vw", null, "25vw"] })
    ).toBe("(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw");
  });

  it("should generate `sizes` for images that have a fixed (pixel value) width", () => {
    expect(result.current({ width: 500 })).toBe(
      "(min-width:500px) 500px, 100vw"
    );
    expect(result.current({ width: [320, 400] })).toBe(
      "(min-width:480px) 400px, (min-width:320px) 320px, 100vw"
    );
    expect(result.current({ width: [320, "unset", 1200] })).toBe(
      "(min-width:1200px) 1200px, (min-width:480px) 100vw, (min-width:320px) 320px, 100vw"
    );
  });

  it("should generate `sizes` for images with a fixed (pixel value) max width", () => {
    expect(result.current({ maxWidth: 123, width: "100vw" })).toBe(
      "(min-width:123px) 123px, 100vw"
    );
    expect(
      result.current({
        maxWidth: [400, null, null, 1000],
        width: ["100vw", null, null, "50vw"],
      })
    ).toBe(
      "(min-width:2000px) 1000px, (min-width:1140px) 50vw, (min-width:400px) 400px, 100vw"
    );
    expect(
      result.current({ maxWidth: [123, null, "unset"], width: "100vw" })
    ).toBe("(min-width:768px) 100vw, (min-width:123px) 123px, 100vw");
    expect(
      result.current({
        maxWidth: [400, null, 480, null, "unset"],
        width: ["100vw", "50vw", null, 400, 500],
      })
    ).toBe(
      "(min-width:1280px) 500px, (min-width:1140px) 400px, (min-width:960px) 480px, (min-width:480px) 50vw, (min-width:400px) 400px, 100vw"
    );
  });

  it("should generate `sizes` for images with a proportional max width", () => {
    expect(result.current({ maxWidth: "50vw", width: "100vw" })).toBe("50vw");
    expect(
      result.current({ maxWidth: ["50vw", null, 960], width: "100vw" })
    ).toBe("(min-width:960px) 960px, (min-width:768px) 100vw, 50vw");
    expect(
      result.current({
        maxWidth: [400, null, "25vw", null, "unset"],
        width: ["100vw", "50vw", null, 300, 500],
      })
    ).toBe(
      "(min-width:1280px) 500px, (min-width:1200px) 300px, (min-width:768px) 25vw, (min-width:480px) 50vw, (min-width:400px) 400px, 100vw"
    );
  });

  it("should throw an error if an invalid length unit is used", () => {
    expect(() =>
      result.current({ maxWidth: "50vw", width: "100%" })
    ).toThrowError('Invalid length unit used in "100%": expected "px" or "vw"');
  });
});
