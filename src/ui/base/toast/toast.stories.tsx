import React from "react";

import { gutter, percentage, s } from "@/common/ui/utils";

import { Grid, Item } from "../grid";
import { headingAlpha } from "../typography";
import { ToastRack, ToastType, useToastController } from ".";

export default {
  title: "Components/Toast",
};

// eslint-disable-next-line react-hooks/rules-of-hooks
const toastController = useToastController();

export const Toast = () => (
  <section css={s(gutter)}>
    <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
      Toast
    </h2>

    <ToastRack
      _css={s({
        height: 0,
        position: "fixed",
        right: 0,
        top: 20,
        zIndex: 99999,
      })}
    />
    <Grid
      gx={(t) => t.spacing.xl}
      gy={(t) => t.spacing.xl}
      itemWidth={percentage(1 / 3)}
    >
      <Item>
        <button
          onClick={() =>
            toastController.push({
              children: "Info toast",
              type: ToastType.INFO,
            })
          }
        >
          Add info toast
        </button>
      </Item>
      <Item>
        <button
          onClick={() =>
            toastController.push({
              children: "Warning toast",
              type: ToastType.WARNING,
            })
          }
        >
          Add warning toast
        </button>
      </Item>
      <Item>
        <button
          onClick={() =>
            toastController.push({
              children: "Error toast",
              type: ToastType.ERROR,
            })
          }
        >
          Add error toast
        </button>
      </Item>
    </Grid>
  </section>
);
