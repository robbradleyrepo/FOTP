import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import { primaryButton, secondaryButton } from "src/ui/base/button";

import { belt, gutter, px, py, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import REVIEWS_DOG_IMG from "../../assets/images/reviews/Dog.jpg";
import POSITIVE_IMG from "../../assets/images/reviews/POSITIVE_BG.jpg";
import { Grid, Item } from "../../ui/base/grid";
import ResponsiveImage from "../../ui/base/responsive-image";
import { bodyText, headingAlpha } from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  ctas: {
    facebook: "Write a Facebook Review",
  },
  header: {
    description:
      "Reviews are one of the most powerful ways pet parents like yourself decide if a product is right for their pup. If you could also spare us 60 seconds and review us on Facebook we would greatly appreciate it.",
    title: "Thank you!",
  },
  meta: {
    title: "We love hearing your feedback | $t(common:fotp)",
  },
  refer: {
    cta: "Refer a friend",
    text:
      "Give your friends $20 off. When they buy from your invite link, you get $20 off!",
    title: "Refer your friends and get $20 off!",
  },
};

export const ReviewsThankYouPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "reviewsTYPage", enUsResource);

  return (
    <Standard>
      <Metadata noindex={true} title={t("reviewsTYPage:meta.title")} />
      <main>
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.tint.pistachio,
            height: ["auto", null, "100vh"],
            maxHeight: [null, null, 500],
            ...py([t.spacing.xxl, t.spacing.xxxl, t.spacing.xxl]),
            ...px([t.spacing.md, null, 0]),
            position: "relative",
            textAlign: "center",
          }))}
        >
          <div
            css={s({
              display: ["none", null, null, "block"],
            })}
          >
            <ResponsiveImage
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition="bottom center"
              priority
              sizes={{ width: "100vw" }}
              src={POSITIVE_IMG}
            />
          </div>
          <div
            css={s(belt, {
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              position: "relative",
            })}
          >
            <h1
              css={s(headingAlpha, (t) => ({
                margin: "0 auto",
                maxWidth: ["none", null, 500, 640],
                paddingBottom: [t.spacing.md, null, t.spacing.lg],
              }))}
            >
              <Trans i18nKey="reviewsTYPage:header.title" />
            </h1>
            <p
              css={s(bodyText, (t) => ({
                fontSize: [18, null, 20],
                margin: "0 auto",
                marginBottom: t.spacing.lg,
                maxWidth: ["none", null, 500, 640],
              }))}
            >
              {t("reviewsTYPage:header.description")}
            </p>

            <a
              css={s(primaryButton(), (t) => ({
                position: "relative",
                ...px([t.spacing.lg, t.spacing.xl]),
              }))}
              href="https://facebook.com/fotpdotcom/reviews"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("reviewsTYPage:ctas.facebook")}
            </a>
          </div>
        </header>

        <section
          css={s(gutter, (t) => ({
            color: t.color.text.dark.base,
          }))}
        >
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              itemWidth={["100%", null, "50%"]}
              _css={s({
                margin: "0 auto",
              })}
            >
              <Item>
                <ResponsiveImage
                  alt=""
                  sizes={{ width: [500, 720] }}
                  src={REVIEWS_DOG_IMG}
                />
              </Item>
              <Item
                _css={s({
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                  textAlign: "left",
                })}
              >
                <div
                  css={s((t) => ({
                    maxWidth: 680,
                    paddingLeft: [0, t.spacing.xl, t.spacing.md, t.spacing.xl],
                    paddingRight: [0, t.spacing.xl, null, 96],
                    paddingTop: [t.spacing.xl, null, 0],
                  }))}
                >
                  <h2
                    css={s(headingAlpha, (t) => ({
                      margin: ["0 auto", null, 0],
                      marginBottom: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    {t("reviewsTYPage:refer.title")}
                  </h2>
                  <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.xl }))}>
                    {t("reviewsTYPage:refer.text")}
                  </p>
                  <Link css={s(secondaryButton())} to="/work-with-us/refer">
                    {t("reviewsTYPage:refer.cta")}
                  </Link>
                </div>
              </Item>
            </Grid>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default ReviewsThankYouPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
