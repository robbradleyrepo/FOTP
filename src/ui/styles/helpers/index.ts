import { css } from "styled-components";

import background, { BackgroundProps } from "./definitions/background";
import border, { BorderProps } from "./definitions/border";
import effects, { EffectsProps } from "./definitions/effects";
import flex, { FlexProps } from "./definitions/flex";
import grid, { GridProps } from "./definitions/grid";
import interaction, { InteractionProps } from "./definitions/interaction";
import layout, { LayoutProps } from "./definitions/layout";
import list, { ListProps } from "./definitions/list";
import position, { PositionProps } from "./definitions/position";
import space, { SpaceProps } from "./definitions/space";
import table, { TableProps } from "./definitions/table";
import typography, { TypographyProps } from "./definitions/typography";
import * as factory from "./factory";

export type CSSValue = factory.CSSValue;
export type ResponsiveCSSValue = factory.ResponsiveCSSValue;

export type StyleProps = BackgroundProps &
  BorderProps &
  EffectsProps &
  FlexProps &
  GridProps &
  InteractionProps &
  LayoutProps &
  ListProps &
  PositionProps &
  SpaceProps &
  TableProps &
  TypographyProps;

const helpers = css<StyleProps>`
  ${background};
  ${border};
  ${effects};
  ${flex};
  ${grid};
  ${interaction};
  ${layout};
  ${list};
  ${position};
  ${space};
  ${table};
  ${typography};
`;

export default helpers;
