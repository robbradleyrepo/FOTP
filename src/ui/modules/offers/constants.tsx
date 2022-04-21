import { StyleFn } from "@/common/ui/utils";

export enum ComparisonItemType {
  FALSE = "false",
  TRUE = "true",
  UNKNOWN = "unknown",
}

export const comparisonItems = [
  {
    key: "science",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "tested",
    them: ComparisonItemType.UNKNOWN,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "results",
    them: ComparisonItemType.UNKNOWN,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "mouth",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "gmo",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },

  {
    key: "order",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
];

export const comparisonOtherItems = [
  {
    key: "unproven",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "dirty",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "transparency",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "chemical",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "metals",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "reg",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "guarantee",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
];

export const faqArray = [
  { key: "item1" },
  { key: "item2" },
  { key: "item3" },
  { key: "item4" },
  { key: "item5" },
  { key: "item6" },
  { key: "item7" },
  { key: "item8" },
  { key: "item9a" },
  { key: "item9b" },
  { key: "item9c" },
];

export const headerIcons = [
  { key: "item1" },
  { key: "item2" },
  { key: "item3" },
  { key: "item4" },
  { key: "item5" },
  { key: "item6" },
];

export const naturalIcons = [
  { key: "item1" },
  { key: "item2" },
  { key: "item3" },
  { key: "item4" },
  { key: "item5" },
  { key: "item6" },
];

export const trustedIcons = [
  { key: "stat1" },
  { key: "stat2" },
  { key: "stat3" },
  { key: "stat4" },
];

export const trustedFigure = {
  "& svg": {
    minWidth: 30,
  },
  alignItems: "flex-start",
  display: "flex",
  flexFlow: ["row", null, "column"],
  justifyContent: "flex-start",
  textAlign: "left",
};

export const trustedCaption: StyleFn = (t) => ({
  fontWeight: "bold",
  marginTop: [null, null, t.spacing.xs],
  maxWidth: ["90%", null, "80%"],
  paddingLeft: [t.spacing.sm, null, 0],
});
