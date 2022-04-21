import React, { FC } from "react";

import { ComponentStyleProps, ResponsiveCSSObject, s } from "@/common/ui/utils";

type IconProps = {
  fill?: string;
  path: string;
  title?: string;
  viewBox?: string;
} & ComponentStyleProps;

const Icon: FC<IconProps> = ({
  _css = {},
  path,
  title,
  viewBox = "0 0 100 100",
}) => (
  <svg
    css={s(_css)}
    role={title ? undefined : "presentation"}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
  >
    {title && <title>{title}</title>}
    <path d={path} />
  </svg>
);

export const iconWrapperRadius: ResponsiveCSSObject = {
  alignItems: "center",
  borderRadius: "24px",
  display: "flex",
  height: "24px",
  justifyContent: "center",
  margin: "auto",
  width: "24px",
};

export const iconBackground = s(iconWrapperRadius, (t) => ({
  backgroundColor: t.color.state.selected,
}));

export const iconBorder = s(iconWrapperRadius, (t) => ({
  border: `solid 2px ${t.color.state.alt}`,
}));

export default Icon;
