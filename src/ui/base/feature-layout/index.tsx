import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { Grid, GridDirection, Item } from "../grid";
import ResponsiveImage from "../responsive-image";

interface FeatureLayoutProps extends ComponentStyleProps {
  direction?: GridDirection;
  height?: [null, null, ...Array<number | null>];
  image: StaticImageData;
}

const FeatureLayout: FC<FeatureLayoutProps> = ({
  _css = {},
  children,
  direction,
  height = [null, null, 500, 600, 700],
  image,
}) => (
  <Grid
    _css={s(_css)}
    direction={direction}
    gx={(t) => t.spacing.md}
    gy={(t) => t.spacing.xl}
    itemWidth={["100%", null, "50%"]}
  >
    <Item>
      {/* It's not possible to switch `layout` prop using media queries, so we'll render both images, but Next will only load the visible one */}
      <div
        css={s({
          display: ["none", null, "block"],
          height: [null, null, 500, 600, 700],
          position: "relative",
          width: "100%",
        })}
      >
        <ResponsiveImage
          alt=""
          layout="fill"
          objectFit="cover"
          quality={50}
          src={image.src}
          sizes={{
            width: height.map(
              // Calculate the required width to cover the specified height
              (height) => height && height * (image.width / image.height)
            ),
          }}
        />
      </div>
      <div css={s({ display: [null, null, "none"] })}>
        <ResponsiveImage alt="" sizes="100vw" {...image} />
      </div>
    </Item>
    <Item
      _css={s({
        alignItems: direction === "rtl" ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        justifyContent: "center",
        textAlign: ["center", null, "left"],
      })}
    >
      <div
        css={s((t) => ({
          maxWidth: [null, null, (1280 - t.spacing.md) / 2],
          [direction === "rtl" ? "paddingRight" : "paddingLeft"]: [
            t.spacing.md,
            t.spacing.xl,
            null,
            t.spacing.xxl,
            t.spacing.xxxl,
          ],
          [direction === "rtl" ? "paddingLeft" : "paddingRight"]: [
            t.spacing.md,
            t.spacing.xl,
            t.spacing.xxl,
          ],
          width: "100%",
        }))}
      >
        {children}
      </div>
    </Item>
  </Grid>
);

export default FeatureLayout;
