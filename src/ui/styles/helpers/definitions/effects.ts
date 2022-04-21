import factory, { StyleHelperProps } from "../factory";

type EffectsStyleKeys =
  | "_backfaceVisibility"
  | "_boxShadow"
  | "_clip"
  | "_objectFit"
  | "_opacity"
  | "_outline"
  | "_perspective"
  | "_perspectiveOrigin"
  | "_rotate"
  | "_scale"
  | "_textShadow"
  | "_transform"
  | "_transformBox"
  | "_transformOrigin"
  | "_transformStyle"
  | "_transition";

export type EffectsProps = StyleHelperProps<EffectsStyleKeys>;

const effects = factory<EffectsStyleKeys>([
  { prop: "_backfaceVisibility", properties: ["backfaceVisibility"] },
  { prop: "_boxShadow", properties: ["boxShadow"] },
  { prop: "_clip", properties: ["clip"] },
  { prop: "_objectFit", properties: ["objectFit"] },
  { prop: "_opacity", properties: ["opacity"] },
  { prop: "_outline", properties: ["outline"] },
  { prop: "_perspective", properties: ["perspective"] },
  { prop: "_perspectiveOrigin", properties: ["perspectiveOrigin"] },
  { prop: "_rotate", properties: ["rotate"] },
  { prop: "_scale", properties: ["scale"] },
  { prop: "_textShadow", properties: ["textShadow"] },
  { prop: "_transform", properties: ["transform"] },
  { prop: "_transformBox", properties: ["transformBox"] },
  { prop: "_transformOrigin", properties: ["transformOrigin"] },
  { prop: "_transformStyle", properties: ["transformStyle"] },
  { prop: "_transition", properties: ["transition"] },
]);

export default effects;
