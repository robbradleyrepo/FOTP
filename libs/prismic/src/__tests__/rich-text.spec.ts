import { hasContent } from "../rich-text";
import { Elements } from "../types";

describe("hasContent", () => {
  it("should return `true` if more than one rich text block is provided", () => {
    expect(
      hasContent([
        { spans: [], text: "Hello world", type: "paragraph" },
        { spans: [], text: "Is it me you’re looking for?", type: "paragraph" },
      ])
    ).toBe(true);

    expect(
      hasContent([
        { spans: [], text: "", type: "paragraph" },
        { spans: [], text: "", type: "paragraph" },
      ])
    ).toBe(true);
  });

  it("should return `true` if a single, non-empty rich text block is provided", () => {
    expect(
      hasContent([{ spans: [], text: "Hello world", type: "paragraph" }])
    ).toBe(true);
  });

  it("should return `false` if a single, empty rich text block is provided", () => {
    expect(hasContent([{ spans: [], text: "", type: "paragraph" }])).toBe(
      false
    );
    expect(hasContent([{ spans: [], text: " ", type: "paragraph" }])).toBe(
      false
    );
    expect(
      hasContent([
        {
          spans: [{ end: 2, start: 1, type: Elements.em }],
          text: "   ",
          type: "paragraph",
        },
      ])
    ).toBe(false);
  });

  it("should return `false` if no rich text blocks are provided", () => {
    expect(hasContent([])).toBe(false);
  });

  it("should return `false` when null", () => {
    expect(hasContent(null)).toBe(false);
  });
});
