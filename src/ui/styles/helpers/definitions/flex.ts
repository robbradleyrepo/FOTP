import factory, { StyleHelperProps } from "../factory";

type FlexStyleKeys =
  | "_alignContent"
  | "_alignItems"
  | "_alignSelf"
  | "_flex"
  | "_flexBasis"
  | "_flexDirection"
  | "_flexGrow"
  | "_flexShrink"
  | "_flexWrap"
  | "_justifyContent"
  | "_justifyItems"
  | "_justifySelf"
  | "_order";

export type FlexProps = StyleHelperProps<FlexStyleKeys>;

const flex = factory<FlexStyleKeys>([
  { prop: "_alignContent", properties: ["alignContent"] },
  { prop: "_alignItems", properties: ["alignItems"] },
  { prop: "_alignSelf", properties: ["alignSelf"] },
  { prop: "_flex", properties: ["flex"] },
  { prop: "_flexBasis", properties: ["flexBasis"] },
  { prop: "_flexDirection", properties: ["flexDirection"] },
  { prop: "_flexGrow", properties: ["flexGrow"] },
  { prop: "_flexShrink", properties: ["flexShrink"] },
  { prop: "_flexWrap", properties: ["flexWrap"] },
  { prop: "_justifyContent", properties: ["justifyContent"] },
  { prop: "_justifyItems", properties: ["justifyItems"] },
  { prop: "_justifySelf", properties: ["justifySelf"] },
  { prop: "_order", properties: ["order"] },
]);

export default flex;
