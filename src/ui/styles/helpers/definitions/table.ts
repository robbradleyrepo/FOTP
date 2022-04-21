import factory, { StyleHelperProps } from "../factory";

type TableStyleKeys =
  | "_borderCollapse"
  | "_borderSpacing"
  | "_captionSide"
  | "_emptyCells"
  | "_tableLayout";

export type TableProps = StyleHelperProps<TableStyleKeys>;

const table = factory<TableStyleKeys>([
  { prop: "_borderCollapse", properties: ["borderCollapse"] },
  { prop: "_borderSpacing", properties: ["borderSpacing"] },
  { prop: "_captionSide", properties: ["captionSide"] },
  { prop: "_emptyCells", properties: ["emptyCells"] },
  { prop: "_tableLayout", properties: ["tableLayout"] },
]);

export default table;
