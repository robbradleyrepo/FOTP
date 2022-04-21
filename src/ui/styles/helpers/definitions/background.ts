import factory, { StyleHelperProps } from "../factory";

type BackgroundStyleKeys =
  | "_background"
  | "_backgroundClip"
  | "_backgroundColor"
  | "_backgroundImage"
  | "_backgroundPosition"
  | "_backgroundSize"
  | "_backgroundRepeat";

export type BackgroundProps = StyleHelperProps<BackgroundStyleKeys>;

const background = factory<BackgroundStyleKeys>([
  { prop: "_background", properties: ["background"] },
  { prop: "_backgroundClip", properties: ["backgroundClip"] },
  { prop: "_backgroundColor", properties: ["backgroundColor"] },
  { prop: "_backgroundImage", properties: ["backgroundImage"] },
  { prop: "_backgroundPosition", properties: ["backgroundPosition"] },
  { prop: "_backgroundSize", properties: ["backgroundSize"] },
  { prop: "_backgroundRepeat", properties: ["backgroundRepeat"] },
]);

export default background;
