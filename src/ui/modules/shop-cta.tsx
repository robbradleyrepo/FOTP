import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { belt, greedy, gutterY, mx, px, s } from "@/common/ui/utils";

import SHOP_IMG from "../../assets/images/science/SHOP.jpg";
import SHOP_MOBILE_IMG from "../../assets/images/science/SHOP_MOBILE.jpg";
import { primaryButton, secondaryButton } from "../base/button";
import { Grid, GridProps, Item } from "../base/grid";
import ResponsiveImage from "../base/responsive-image";
import { headingAlpha } from "../base/typography";
const enUsResource = {
  alt: "White dog running in field",
  cta: "Shop supplements",
  title:
    "It’s time to grab the leash and get <i>proactive</i> with your dog’s health.",
};

const ShopCTA: FC<GridProps> = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "shopCTA", enUsResource);

  return (
    <section
      css={s((t) => ({
        backgroundColor: t.color.background.base,
        color: [t.color.text.dark.base, null, t.color.text.light.base],
        paddingBottom: [t.spacing.xl, null, null],
        paddingTop: [0, null, null],
        ...px([0, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
        position: "relative",
      }))}
    >
      <div
        css={s(greedy, (t) => ({
          backgroundColor: t.color.background.dark,
          display: ["none", null, "block"],
          zIndex: 0,
        }))}
      >
        <ResponsiveImage
          {...SHOP_IMG}
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition="center center"
          quality={60}
          sizes="100vw"
        />
      </div>
      <div css={s({ display: [null, null, "none"] })}>
        <ResponsiveImage alt="" src={SHOP_MOBILE_IMG} sizes="100vw" />
      </div>
      <div
        css={s(belt, gutterY, (t) => ({
          height: "100%",
          ...mx([t.spacing.lg, null, 0]),
          zIndex: 5,
        }))}
      >
        <Grid
          _css={s({
            textAlign: ["center", null, "left"],
          })}
          itemWidth={["100%", null, "50%"]}
        >
          <Item
            _css={s({
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              zIndex: 5,
            })}
          >
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: t.spacing.xl,
                ...mx(["auto", null, 0]),
                maxWidth: "500px",
              }))}
            >
              <Trans i18nKey="shopCTA:title" />
            </h2>
            <div>
              <Link
                css={s(secondaryButton({ reverse: true }), {
                  display: ["none", null, "inline-block"],
                  ...mx(["auto", null, 0]),
                })}
                to="/products"
              >
                {t("shopCTA:cta")}
              </Link>
              <Link
                css={s(primaryButton({ reverse: true }), (t) => ({
                  display: ["inline-block", null, "none"],
                  marginBottom: t.spacing.lg,
                  ...mx(["auto", null, 0]),
                }))}
                to="/products"
              >
                {t("shopCTA:cta")}
              </Link>
            </div>
          </Item>
        </Grid>
      </div>
    </section>
  );
};

export default ShopCTA;
