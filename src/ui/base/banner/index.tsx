import { px, py, s } from "@/common/ui/utils";

import { height } from "../../styles/variables";
import { bodyText } from "../typography";

const banner = s(bodyText, (t) => ({
  alignItems: "center",
  backgroundColor: t.color.background.dark,
  color: t.color.text.light.base,
  display: "flex",
  fontSize: [14, 16, 18],
  height: [height.banner.mobile, null, height.banner.desktop],
  justifyContent: "center",
  left: 0,
  lineHeight: ["18px", null, null, "22px"],
  position: "fixed",
  ...px(t.spacing.md),
  ...py(t.spacing.md),
  right: 0,
  textAlign: "center",
  top: 0,
  width: "100vw", // Use `vw` instead of percentage to match the body width with `scroll: overlay`
  zIndex: 999,
}));

export default banner;
