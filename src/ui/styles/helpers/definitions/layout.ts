import factory, { StyleHelperProps } from "../factory";

type LayoutStyleKeys =
  | "_columnCount"
  | "_columnFill"
  | "_columnGap"
  | "_columnRule"
  | "_columnRuleColor"
  | "_columnRuleStyle"
  | "_columnRuleWidth"
  | "_columnSpan"
  | "_columnWidth"
  | "_display"
  | "_height"
  | "_maxHeight"
  | "_maxWidth"
  | "_minHeight"
  | "_minWidth"
  | "_overflow"
  | "_overflowX"
  | "_overflowY"
  | "_size"
  | "_verticalAlign"
  | "_visibility"
  | "_width";

export type LayoutProps = StyleHelperProps<LayoutStyleKeys>;

const layout = factory<LayoutStyleKeys>([
  { prop: "_columnCount", properties: ["columnCount"] },
  { prop: "_columnFill", properties: ["columnFill"] },
  { prop: "_columnGap", properties: ["columnGap"] },
  { prop: "_columnRule", properties: ["columnRule"] },
  { prop: "_columnRuleColor", properties: ["columnRuleColor"] },
  { prop: "_columnRuleStyle", properties: ["columnRuleStyle"] },
  { prop: "_columnRuleWidth", properties: ["columnRuleWidth"] },
  { prop: "_columnSpan", properties: ["columnSpan"] },
  { prop: "_columnWidth", properties: ["columnWidth"] },
  { prop: "_display", properties: ["display"] },
  { prop: "_height", properties: ["height"] },
  { prop: "_maxHeight", properties: ["maxHeight"] },
  { prop: "_maxWidth", properties: ["maxWidth"] },
  { prop: "_minHeight", properties: ["minHeight"] },
  { prop: "_minWidth", properties: ["minWidth"] },
  { prop: "_overflow", properties: ["overflow"] },
  { prop: "_overflowX", properties: ["overflowX"] },
  { prop: "_overflowY", properties: ["overflowY"] },
  { prop: "_size", properties: ["height", "width"] },
  { prop: "_verticalAlign", properties: ["verticalAlign"] },
  { prop: "_visibility", properties: ["visibility"] },
  { prop: "_width", properties: ["width"] },
]);

export default layout;
