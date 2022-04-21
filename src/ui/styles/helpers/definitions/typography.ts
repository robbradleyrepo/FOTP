import factory, { StyleHelperProps } from "../factory";

type TypographyReservedKeys = "responsiveTypography";
type TypographyStyleKeys =
  | "_fontColor"
  | "_fontFamily"
  | "_fontSize"
  | "_fontStyle"
  | "_fontWeight"
  | "_letterSpacing"
  | "_lineHeight"
  | "_textAlign"
  | "_textDecoration"
  | "_textTransform"
  | "_whiteSpace";

export type TypographyProps = StyleHelperProps<
  TypographyStyleKeys,
  TypographyReservedKeys
>;

const typography = factory<TypographyStyleKeys, TypographyReservedKeys>(
  [
    { prop: "_fontColor", properties: ["color"] },
    { prop: "_fontFamily", properties: ["fontFamily"] },
    { prop: "_fontSize", properties: ["fontSize"] },
    { prop: "_fontStyle", properties: ["fontStyle"] },
    { prop: "_fontWeight", properties: ["fontWeight"] },
    { prop: "_letterSpacing", properties: ["letterSpacing"] },
    { prop: "_lineHeight", properties: ["lineHeight"] },
    { prop: "_textAlign", properties: ["textAlign"] },
    { prop: "_textDecoration", properties: ["textDecoration"] },
    { prop: "_textTransform", properties: ["textTransform"] },
    { prop: "_whiteSpace", properties: ["whiteSpace"] },
  ],
  "responsiveTypography"
);

export default typography;
