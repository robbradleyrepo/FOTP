import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React from "react";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, gutter, percentage, py, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import ERROR_IMG from "../../assets/images/error/walkies.jpg";
import { primaryButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import { bodyText, headingAlpha } from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  cta: "Continue shopping",
  info: "Unfortunately, the page you were trying to view could not be found.",
  title: "Oops! Looks like this page went walkies",
};

const NoRoute = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "noRoute", enUsResource);

  return (
    <Standard>
      <main css={s({ textAlign: "center" })}>
        <Grid itemWidth={[percentage(1), null, percentage(1 / 2)]}>
          <Item
            _css={s({
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            })}
          >
            <div css={s(gutter, (t) => py([t.spacing.xxl, null, 0]))}>
              <div css={s(belt, { maxWidth: 540 })}>
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("noRoute:title")}
                </h1>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                  }))}
                >
                  {t("noRoute:info")}
                </p>
                <Link css={s(primaryButton())} to="/">
                  {t("noRoute:cta")}
                </Link>
              </div>
            </div>
          </Item>
          <Item>
            <div
              css={s({
                display: [null, null, "none"],
                width: "100%",
              })}
            >
              <ResponsiveImage
                alt=""
                sizes={{ width: ["100vw", null, "50vw"] }}
                src={ERROR_IMG}
              />
            </div>
            <div
              css={s({
                display: ["none", null, "block"],
                height: [null, null, 600, 800, 900],
                position: "relative",
              })}
            >
              <ResponsiveImage
                alt=""
                layout="fill"
                objectFit="cover"
                sizes={{ width: ["100vw", null, "50vw"] }}
                src={ERROR_IMG}
              />
            </div>
          </Item>
        </Grid>
      </main>
    </Standard>
  );
};

export default NoRoute;

export const getStaticProps = makeStaticPropsGetter(async () => {
  return {
    props: {},
  };
});
