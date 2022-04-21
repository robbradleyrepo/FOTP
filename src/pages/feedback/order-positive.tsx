import {
  FeedbackSentiment,
  useCaptureOrderFeedbackOnPageLoad,
} from "@sss/ecommerce/feedback";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import { primaryButton, secondaryButton } from "src/ui/base/button";
import Hero from "src/ui/base/hero";

import { belt, greedy, gutter, px, py, s, size } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import REVIEWS_DOG_IMG from "../../assets/images/reviews/Dog.jpg";
import POSITIVE_IMG from "../../assets/images/reviews/POSITIVE_BG.jpg";
import OG_IMG from "../../assets/images/sustainability/OPENGRAPH.jpg";
import { Grid, Item } from "../../ui/base/grid";
import ResponsiveImage from "../../ui/base/responsive-image";
import Spinner from "../../ui/base/spinner";
import { bodyText, headingAlpha } from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  header: {
    cta: "Give feedback now",
    description:
      "We’re always looking at how we can improve our products. If you have a spare moment, we would really appreciate any feedback you have on our products, services or anything at all. Thank you!",
    title:
      "We’re So Happy Our Products Are Having A Positive Impact On Your Dog!",
  },
  meta: {
    description:
      "We’re always looking at how we can improve our products. If you have a spare moment, we would really appreciate any feedback you have on our products, services or anything at all. Thank you!",
    openGraph: {
      description: "We’re always looking at how we can improve our products.",
      title: "We’d love to hear your feedback",
    },
    title: "We’d love to hear your feedback | FOTP",
  },
  refer: {
    cta: "Refer a friend",
    text:
      "Give your friends $20 off. When they buy from your invite link, you get $20 off!",
    title: "Refer your friends and get $20 off!",
  },
};

export const FeedbackOrderPositivePage = () => {
  const { i18n, t } = useLocale();

  const feedback = useCaptureOrderFeedbackOnPageLoad({
    fallbackSurveyUrl: `mailto:${t(
      "common:email"
    )}?subject=Feedback on my order`,
    sentiment: FeedbackSentiment.HAPPY,
    surveyLookup: [
      [/^the-one/, "https://fotp2021.typeform.com/to/UHUD8Nju"],
      [/^harmony/, "https://fotp2021.typeform.com/to/Me7DXSpT"],
    ],
  });

  i18n.addResourceBundle("en-US", "feedbackPositivePage", enUsResource);

  const loading = feedback.status === "LOADING";

  return (
    <Standard>
      <Metadata
        description={t("feedbackPositivePage:meta.description")}
        noindex={true}
        openGraph={{
          description: t("feedbackPositivePage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("feedbackPositivePage:meta.openGraph.title"),
        }}
        title={t("feedbackPositivePage:meta.title")}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.tint.pistachio,
            height: ["auto", null, "100vh"],
            maxHeight: [null, null, 600, 720],
            ...py([t.spacing.xxl, t.spacing.xxxl, t.spacing.xxl]),
            ...px([t.spacing.md, null, 0]),
            position: "relative",
            textAlign: "center",
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "cover",
                objectPosition: [null, null, "bottom center"],
              },
              zIndex: 0,
            })}
            priority
            quality={60}
            urls={[null, null, POSITIVE_IMG.src]}
          />
          <div
            css={s(belt, {
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              position: "relative",
              zIndex: 5,
            })}
          >
            <h1
              css={s(headingAlpha, (t) => ({
                margin: "0 auto",
                maxWidth: ["none", null, 500, 640],
                paddingBottom: [t.spacing.md, null, t.spacing.lg],
              }))}
            >
              <Trans i18nKey="feedbackPositivePage:header.title" />
            </h1>
            <p
              css={s(bodyText, (t) => ({
                fontSize: [18, null, 20],
                margin: "0 auto",
                marginBottom: t.spacing.lg,
                maxWidth: ["none", null, 500, 640],
              }))}
            >
              {t("feedbackPositivePage:header.description")}
            </p>
            <a
              css={s(primaryButton({ disabled: loading }), {
                position: "relative",
              })}
              href={feedback.surveyUrl}
            >
              <span
                css={s({
                  opacity: loading ? 0 : 1,
                  transition: "opacity 250ms",
                })}
              >
                {t("feedbackPositivePage:header.cta")}
              </span>

              <Spinner
                _css={s((t) => ({
                  ...size(t.spacing.md),
                  opacity: loading ? 1 : 0,
                  transition: "opacity 250ms",
                }))}
              />
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
                  src={REVIEWS_DOG_IMG}
                  sizes={{ width: [500, 720] }}
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
                    {t("feedbackPositivePage:refer.title")}
                  </h2>
                  <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.xl }))}>
                    {t("feedbackPositivePage:refer.text")}
                  </p>
                  <Link css={s(secondaryButton())} to="/work-with-us/refer">
                    {t("feedbackPositivePage:refer.cta")}
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

export default FeedbackOrderPositivePage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
