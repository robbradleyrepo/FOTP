import { Checkout } from "@sss/ecommerce/checkout";
import { Money } from "@sss/ecommerce/common";
import React, { FC } from "react";

import { gutterX, percentage, s } from "@/common/ui/utils";

import { Grid, Item } from "../base/grid";
import { ToastRack } from "../base/toast";
import { belt, height } from "../modules/checkout/common";
import Footer from "../modules/checkout/footer";
import Header from "../modules/checkout/header";
import Sidebar from "../modules/checkout/sidebar";
import { theme } from "../styles/theme";

interface CheckoutTemplateProps {
  checkout: Checkout;
  shippingThreshold: Money | null;
}

const CheckoutTemplate: FC<CheckoutTemplateProps> = ({
  checkout,
  children,
  shippingThreshold,
}) => {
  const mainColumnWidth = [
    percentage(1),
    null,
    percentage(1 / 2),
    percentage(6 / 11),
  ];

  return (
    <>
      <Header />
      <div css={s(gutterX, { marginTop: [height.summary, null, 0] })}>
        <Grid
          _css={s(belt)}
          gx={[theme.spacing.lg, null, null, theme.spacing.xxl]}
        >
          <Item width={mainColumnWidth}>
            <div
              css={s((t) => ({
                borderBottomColor: t.color.border.light,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                height: "100%",
              }))}
            >
              {children}
            </div>
          </Item>
          <Item
            width={[percentage(1), null, percentage(1 / 2), percentage(5 / 11)]}
          >
            <Sidebar
              _css={s({
                height: [null, null, "100%"],
                left: 0,
                position: ["absolute", null, "static"],
                top: height.header,
                width: "100%",
                zIndex: 999,
              })}
              checkout={checkout}
              shippingThreshold={shippingThreshold}
            />
          </Item>
          <Item width={mainColumnWidth}>
            <Footer />
          </Item>
        </Grid>
      </div>
      <ToastRack
        _css={s({
          height: 0,
          position: "fixed",
          right: 0,
          top: height.header,
          zIndex: 99999,
        })}
      />
    </>
  );
};

export default CheckoutTemplate;
