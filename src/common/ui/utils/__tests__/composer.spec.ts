import { theme } from "../../../../../src/ui/styles/theme";
import { s } from "../composer";
import { getDynamicStyleFn } from "../helpers";

describe("s", () => {
  const themeEnhanced = {
    ...theme,
    dynamicStyleFn: jest.fn(getDynamicStyleFn(theme)),
    styles: {},
  };

  it("should return a style function that returns a responsive CSS object when called with the current theme", () => {
    const result = s({ color: ["green", null, "blue"] }, (t) => ({
      ":hover": { color: t.color.accent.dark },
    }));

    expect(result(themeEnhanced)).toEqual({
      ":hover": { color: themeEnhanced.color.accent.dark },
      color: ["green", null, "blue"],
    });
  });

  it("should return a style function that returns a Dynamic style parsed by Facepaint when called with Styled Component's props", () => {
    const result = s({ color: ["green", null, "blue"] }, (t) => ({
      ":hover": { color: t.color.accent.dark },
    }));

    expect(result(themeEnhanced)).toEqual({
      ":hover": { color: "#DB5A41" },
      color: ["green", null, "blue"],
    });
  });
});
