import factory, { StyleHelperProps } from "../factory";

type BorderStyleKeys =
  | "_border"
  | "_borderBottom"
  | "_borderBottomColor"
  | "_borderBottomStyle"
  | "_borderBottomWidth"
  | "_borderBottomLeftRadius"
  | "_borderBottomRightRadius"
  | "_borderColor"
  | "_borderLeft"
  | "_borderLeftColor"
  | "_borderLeftStyle"
  | "_borderLeftWidth"
  | "_borderStyle"
  | "_borderRadius"
  | "_borderRight"
  | "_borderRightColor"
  | "_borderRightStyle"
  | "_borderRightWidth"
  | "_borderTop"
  | "_borderTopColor"
  | "_borderTopLeftRadius"
  | "_borderTopRightRadius"
  | "_borderTopStyle"
  | "_borderTopWidth"
  | "_borderWidth"
  | "_borderX"
  | "_borderXColor"
  | "_borderXStyle"
  | "_borderXWidth"
  | "_borderY"
  | "_borderYColor"
  | "_borderYStyle"
  | "_borderYWidth";

export type BorderProps = StyleHelperProps<BorderStyleKeys>;

const border = factory<BorderStyleKeys>([
  { prop: "_border", properties: ["border"] },
  { prop: "_borderColor", properties: ["borderColor"] },
  { prop: "_borderStyle", properties: ["borderStyle"] },
  { prop: "_borderWidth", properties: ["borderWidth"] },
  { prop: "_borderX", properties: ["borderLeft", "borderRight"] },
  {
    prop: "_borderXColor",
    properties: ["borderLeftColor", "borderRightColor"],
  },
  { prop: "_borderXStyle", properties: ["borderLeftStyle", "borderRight"] },
  {
    prop: "_borderXWidth",
    properties: ["borderLeftWidth", "borderRightWidth"],
  },
  { prop: "_borderY", properties: ["borderBottom", "borderTop"] },
  {
    prop: "_borderYColor",
    properties: ["borderBottomColor", "borderTopColor"],
  },
  { prop: "_borderYStyle", properties: ["borderBottomStyle", "borderTop"] },
  {
    prop: "_borderYWidth",
    properties: ["borderBottomWidth", "borderTopWidth"],
  },
  { prop: "_borderBottom", properties: ["borderBottom"] },
  { prop: "_borderBottomColor", properties: ["borderBottomColor"] },
  { prop: "_borderBottomStyle", properties: ["borderBottomStyle"] },
  { prop: "_borderBottomWidth", properties: ["borderBottomWidth"] },
  { prop: "_borderLeft", properties: ["borderLeft"] },
  { prop: "_borderLeftColor", properties: ["borderLeftColor"] },
  { prop: "_borderLeftStyle", properties: ["borderLeftStyle"] },
  { prop: "_borderLeftWidth", properties: ["borderLeftWidth"] },
  { prop: "_borderRight", properties: ["borderRight"] },
  { prop: "_borderRightColor", properties: ["borderRightColor"] },
  { prop: "_borderRightStyle", properties: ["borderRightStyle"] },
  { prop: "_borderRightWidth", properties: ["borderRightWidth"] },
  { prop: "_borderTop", properties: ["borderTop"] },
  { prop: "_borderTopColor", properties: ["borderTopColor"] },
  { prop: "_borderTopStyle", properties: ["borderTopStyle"] },
  { prop: "_borderTopWidth", properties: ["borderTopWidth"] },
  { prop: "_borderRadius", properties: ["borderRadius"] },
  { prop: "_borderTopLeftRadius", properties: ["borderTopLeftRadius"] },
  { prop: "_borderTopRightRadius", properties: ["borderTopRightRadius"] },
  { prop: "_borderBottomLeftRadius", properties: ["borderBottomLeftRadius"] },
  { prop: "_borderBottomRightRadius", properties: ["borderBottomRightRadius"] },
]);

export default border;
