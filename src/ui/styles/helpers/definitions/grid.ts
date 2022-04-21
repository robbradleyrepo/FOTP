import factory, { StyleHelperProps } from "../factory";

type GridStyleKeys =
  | "_alignContent"
  | "_alignItems"
  | "_alignSelf"
  | "_columnGap"
  | "_gap"
  | "_grid"
  | "_gridArea"
  | "_gridAutoColumns"
  | "_gridAutoFlow"
  | "_gridAutoRows"
  | "_gridColumn"
  | "_gridColumnEnd"
  | "_gridColumnStart"
  | "_gridRow"
  | "_gridRowEnd"
  | "_gridRowStart"
  | "_gridTemplate"
  | "_gridTemplateAreas"
  | "_gridTemplateColumns"
  | "_gridTemplateRows"
  | "_justifyContent"
  | "_justifyItems"
  | "_justifySelf"
  | "_placeContent"
  | "_placeItems"
  | "_placeSelf"
  | "_rowGap";

export type GridProps = StyleHelperProps<GridStyleKeys>;

const grid = factory<GridStyleKeys>([
  { prop: "_gap", properties: ["gap"] },
  { prop: "_columnGap", properties: ["columnGap"] },
  { prop: "_rowGap", properties: ["rowGap"] },
  { prop: "_grid", properties: ["grid"] },
  { prop: "_gridArea", properties: ["gridArea"] },
  { prop: "_gridAutoColumns", properties: ["gridAutoColumns"] },
  { prop: "_gridAutoFlow", properties: ["gridAutoFlow"] },
  { prop: "_gridAutoRows", properties: ["gridAutoRows"] },
  { prop: "_gridColumn", properties: ["gridColumn"] },
  { prop: "_gridColumnEnd", properties: ["gridColumnEnd"] },
  { prop: "_gridColumnStart", properties: ["gridColumnStart"] },
  { prop: "_gridRow", properties: ["gridRow"] },
  { prop: "_gridRowEnd", properties: ["gridRowEnd"] },
  { prop: "_gridRowStart", properties: ["gridRowStart"] },
  { prop: "_gridTemplate", properties: ["gridTemplate"] },
  { prop: "_gridTemplateAreas", properties: ["gridTemplateAreas"] },
  { prop: "_gridTemplateColumns", properties: ["gridTemplateColumns"] },
  { prop: "_gridTemplateRows", properties: ["gridTemplateRows"] },
  { prop: "_alignContent", properties: ["alignContent"] },
  { prop: "_alignItems", properties: ["alignItems"] },
  { prop: "_alignSelf", properties: ["alignSelf"] },
  { prop: "_justifyContent", properties: ["justifyContent"] },
  { prop: "_justifyItems", properties: ["justifyItems"] },
  { prop: "_justifySelf", properties: ["justifySelf"] },
  { prop: "_placeContent", properties: ["placeContent"] },
  { prop: "_placeItems", properties: ["placeItems"] },
  { prop: "_placeSelf", properties: ["placeSelf"] },
]);

export default grid;
