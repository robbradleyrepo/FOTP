import React from "react";

import { belt, s } from "@/common/ui/utils";

import LAB_IMG from "../../../assets/images/offers/LAB.jpg";
import CAREERS_IMG from "../../../assets/images/work-with-us/CAREERS.jpg";
import { Grid, Item } from "../grid";
import ResponsiveImage from "./index";
export default {
  component: ResponsiveImage,
  title: "Elements/Responsive Image",
};

export const StandardImage = () => (
  <div
    css={s(belt, {
      height: [400, null, 500, 740],
      position: "relative",
      width: "100%",
    })}
  >
    <ResponsiveImage
      alt=""
      layout="fill"
      objectFit="cover"
      quality={75}
      sizes={{
        maxWidth: [480, null, 840],
        width: "100vw",
      }}
      src={LAB_IMG}
    />
  </div>
);

export const GridImage = () => (
  <Grid
    direction="ltr"
    gx={(t) => t.spacing.md}
    gy={(t) => t.spacing.xl}
    itemWidth={["100%", null, "50%"]}
  >
    <Item>
      <div
        css={s({
          display: ["none", null, "block"],
          height: [null, null, 500, 655],
          position: "relative",
          width: "100%",
        })}
      >
        <ResponsiveImage
          alt=""
          layout="fill"
          objectFit="cover"
          sizes={{
            maxWidth: [null, null, 789],
            width: ["100vw", "100vw", "100vw"],
          }}
          src={CAREERS_IMG}
        />
      </div>
      <div css={s({ display: [null, null, "none"] })}>
        <ResponsiveImage
          alt=""
          layout="fill"
          objectFit="cover"
          src={CAREERS_IMG}
          sizes="100vw"
        />
      </div>
    </Item>
    <Item>text</Item>
  </Grid>
);
