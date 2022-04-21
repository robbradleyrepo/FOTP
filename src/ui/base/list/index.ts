import { StyleFn } from "@/common/ui/utils";

import paw from "../../icons/paw";
import { dataUriFromPath } from "../../styles/utils";

export const decorativeListItem: StyleFn = (t) => ({
  "& + &": {
    marginTop: t.spacing.xs,
  },
  "&:before": {
    content: `url(${dataUriFromPath({
      fill: t.color.tint.pistachio,
      path: paw,
    })})`,
    display: "block",
    height: "1em",
    left: 0,
    position: "absolute",
    top: "0.15em",
    transform: "rotate(-30deg)",
    width: "1em",
  },
  "&:nth-child(even):before": {
    transform: "rotate(30deg)",
  },
  paddingLeft: "2em",
  position: "relative",
});
