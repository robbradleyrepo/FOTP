import { rgba } from "polished";

import { StyleFn } from "@/common/ui/utils";

import info from "../icons/info";
import { dataUriFromPath } from "../styles/utils";

export enum NoteType {
  ERROR = "ERROR",
  INFO = "INFO",
  WARNING = "WARNING",
}

export const note = (type: NoteType): StyleFn => (t) => {
  let color = t.color.state.error;

  if (type === NoteType.INFO) {
    color = t.color.state.success;
  } else if (type === NoteType.WARNING) {
    color = t.color.state.warning;
  }

  return {
    "&:before": {
      content: `url(${dataUriFromPath({
        fill: color,
        height: t.spacing.sm,
        path: info,
        width: t.spacing.sm,
      })})`,
      display: "block",
      left: t.spacing.sm,
      position: "absolute",
    },
    backgroundColor: rgba(color, 0.1),
    color,
    padding: [t.spacing.sm, null, t.spacing.md],
    paddingLeft: [t.spacing.xl, null, t.spacing.xl],
    position: "relative",
  };
};
