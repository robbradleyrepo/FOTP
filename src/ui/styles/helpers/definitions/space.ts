import factory, { StyleHelperProps } from "../factory";

type SpaceStyleKeys =
  | "_m"
  | "_mb"
  | "_ml"
  | "_mr"
  | "_mt"
  | "_mx"
  | "_my"
  | "_p"
  | "_pb"
  | "_pl"
  | "_pr"
  | "_pt"
  | "_px"
  | "_py";

export type SpaceProps = StyleHelperProps<SpaceStyleKeys>;

const space = factory<SpaceStyleKeys>([
  { prop: "_m", properties: ["margin"] },
  { prop: "_mx", properties: ["marginLeft", "marginRight"] },
  { prop: "_my", properties: ["marginBottom", "marginTop"] },
  { prop: "_mb", properties: ["marginBottom"] },
  { prop: "_ml", properties: ["marginLeft"] },
  { prop: "_mr", properties: ["marginRight"] },
  { prop: "_mt", properties: ["marginTop"] },
  { prop: "_p", properties: ["padding"] },
  { prop: "_px", properties: ["paddingLeft", "paddingRight"] },
  { prop: "_py", properties: ["paddingBottom", "paddingTop"] },
  { prop: "_pb", properties: ["paddingBottom"] },
  { prop: "_pl", properties: ["paddingLeft"] },
  { prop: "_pr", properties: ["paddingRight"] },
  { prop: "_pt", properties: ["paddingTop"] },
]);

export default space;
