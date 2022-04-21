import { ResponsiveCSSObject, ResponsiveCSSValue } from "../types";

export const navigationTarget = (
  offset: ResponsiveCSSValue
): ResponsiveCSSObject => {
  const offsetArray = Array.isArray(offset) ? offset : [offset];

  return {
    "&:before": {
      content: "''",
      display: "block",
      height: offset,
      marginTop: offsetArray.map((offset) =>
        typeof offset === "number" || typeof offset === "string"
          ? -offset
          : offset
      ),
      pointerEvents: "none",
      position: "relative",
      visibility: "hidden",
    },
  };
};
