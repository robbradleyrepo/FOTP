import factory, { StyleHelperProps } from "../factory";

type InteractionStyleKeys = "_cursor" | "_pointerEvents" | "_userSelect";

export type InteractionProps = StyleHelperProps<InteractionStyleKeys>;

const interaction = factory<InteractionStyleKeys>([
  { prop: "_cursor", properties: ["cursor"] },
  { prop: "_pointerEvents", properties: ["pointerEvents"] },
  { prop: "_userSelect", properties: ["userSelect"] },
]);

export default interaction;
