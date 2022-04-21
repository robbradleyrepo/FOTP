import { s, size } from "@/common/ui/utils";

export const orderedList = s({
  counterReset: "feature-ordered-list",
});

export const orderedListItem = s((t) => ({
  "&:before": {
    backgroundColor: t.color.background.feature5,
    borderRadius: t.radius.xxl,
    content: "counter(feature-ordered-list)",
    counterIncrement: "feature-ordered-list",
    display: "inline-block",
    fontFamiliy: t.font.secondary.family,
    fontSize: 18,
    fontWeight: t.font.secondary.weight.bold,
    left: 0,
    lineHeight: 1,
    marginRight: t.spacing.sm,
    padding: t.spacing.xs,
    position: "absolute",
    ...size(32),
    textAlign: "center",
    verticalAlign: "baseline",
  },
  paddingLeft: 48,
  position: "relative",
}));
