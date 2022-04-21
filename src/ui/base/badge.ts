import { px, py, s } from "@/common/ui/utils";

import { headingEcho } from "./typography";

export const badge = s(headingEcho, (t) => ({
  backgroundColor: t.color.tint.lightGreen,
  borderRadius: t.radius.xs,
  color: t.color.text.dark.base,
  fontSize: [12, null, 14],
  ...px(t.spacing.xs),
  ...py(1),
  whiteSpace: "nowrap",
}));
