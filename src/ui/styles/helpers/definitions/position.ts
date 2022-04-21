import factory, { StyleHelperProps } from "../factory";

type PositionStyleKeys =
  | "_bottom"
  | "_clear"
  | "_float"
  | "_left"
  | "_position"
  | "_right"
  | "_top"
  | "_zIndex";

export type PositionProps = StyleHelperProps<PositionStyleKeys>;

const position = factory<PositionStyleKeys>([
  { prop: "_bottom", properties: ["bottom"] },
  { prop: "_clear", properties: ["clear"] },
  { prop: "_float", properties: ["float"] },
  { prop: "_left", properties: ["left"] },
  { prop: "_position", properties: ["position"] },
  { prop: "_right", properties: ["right"] },
  { prop: "_top", properties: ["top"] },
  { prop: "_zIndex", properties: ["zIndex"] },
]);

export default position;
