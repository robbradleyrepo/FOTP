import { ResponsiveCSSObject, ResponsiveCSSValue } from "../types";

export const ratio = (ratio: ResponsiveCSSValue): ResponsiveCSSObject => {
  const ratioArray = Array.isArray(ratio) ? ratio : [ratio];

  return {
    "& > *": {
      bottom: 0,
      height: "100%",
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      width: "100%",
    },
    ":before": {
      content: "''",
      display: "block",
      height: 0,
      paddingBottom: ratioArray.map((value) =>
        typeof value === "number" ? `${value * 100}%` : null
      ),
      width: "100%",
    },
    position: "relative",
  };
};
