import { s } from "@/common/ui/utils";

const horizontalRule = s((t) => ({
  border: "none",
  borderBottom: `${t.spacing.xxs}px solid currentColor`,
}));

export default horizontalRule;
