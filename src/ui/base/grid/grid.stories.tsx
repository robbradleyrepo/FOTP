import React from "react";

import { percentage, s } from "@/common/ui/utils";

import { Grid, Item } from "./index";

export default {
  component: Grid,
  subcomponents: { Item },
  title: "Layout/Grid",
};

export const Default = () => (
  <div
    css={s({
      button: {
        marginRight: "1rem",
      },
    })}
  >
    <Grid
      gx={(t) => t.spacing.md}
      gy={(t) => t.spacing.md}
      itemWidth={[percentage(1 / 4)]}
    >
      {["Item 1", "Item 2", "Item 3", "Item 4"].map((i) => (
        <Item key={i}>
          <div
            css={s({
              backgroundColor: "#ccc",
            })}
          >
            {i}
          </div>
        </Item>
      ))}
    </Grid>
  </div>
);

export const TwoColumn = () => (
  <div
    css={s({
      button: {
        marginRight: "1rem",
      },
    })}
  >
    <Grid
      gx={(t) => t.spacing.md}
      gy={(t) => t.spacing.md}
      itemWidth={[percentage(1 / 2)]}
    >
      {["Item 1", "Item 2", "Item 3", "Item 4"].map((i) => (
        <Item key={i}>
          <div
            css={s({
              backgroundColor: "#ccc",
            })}
          >
            {i}
          </div>
        </Item>
      ))}
    </Grid>
  </div>
);

export const ThreeColumn = () => (
  <div
    css={s({
      button: {
        marginRight: "1rem",
      },
    })}
  >
    <Grid
      gx={(t) => t.spacing.md}
      gy={(t) => t.spacing.md}
      itemWidth={[percentage(1 / 3)]}
    >
      {["Item 1", "Item 2", "Item 3", "Item 4"].map((i) => (
        <Item key={i}>
          <div
            css={s({
              backgroundColor: "#ccc",
            })}
          >
            {i}
          </div>
        </Item>
      ))}
    </Grid>
  </div>
);

export const Responsive = () => (
  <div
    css={s({
      button: {
        marginRight: "1rem",
      },
    })}
  >
    <Grid
      gx={(t) => t.spacing.md}
      gy={(t) => t.spacing.md}
      itemWidth={[percentage(1 / 1), percentage(1 / 2), percentage(1 / 3)]}
    >
      {["Item 1", "Item 2", "Item 3", "Item 4"].map((i) => (
        <Item key={i}>
          <div
            css={s({
              backgroundColor: "#ccc",
            })}
          >
            {i}
          </div>
        </Item>
      ))}
    </Grid>
  </div>
);
