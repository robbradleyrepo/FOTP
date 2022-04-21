import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import {
  FeedbackSentiment,
  useCaptureOrderFeedbackOnPageLoad,
} from "@sss/ecommerce/feedback";
import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import Hero from "src/ui/base/hero";

import { belt, greedy, gutter, px, py, s, size } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import NEGATIVE_IMG from "../../assets/images/reviews/NEGATIVE_BG.jpg";
import OG_IMG from "../../assets/images/sustainability/OPENGRAPH.jpg";
import { Faq } from "../../cms/common";
import { RichText } from "../../cms/prismic";
import type { FaqCategorySnippetData } from "../../cms/snippets";
import Accordion from "../../ui/base/accordion";
import { primaryButton } from "../../ui/base/button";
import Spinner from "../../ui/base/spinner";
import { bodyText, headingAlpha, textLink } from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  contact: {
    adblock: `
    If you can't see a help icon in the bottom right of your browser,
    you may have ad-blocking software enabled that prevents it from
    showing up. If you wish to get in touch via chat you might need to
    disable your ad-blocker.`,
    description:
      "Call us on <Phone>323-922-5737</Phone> 9am - 5pm PT (Mon - Fri), use the help widget to send a message directly to the team, or send us an email at: <Email>$t(common:email)</Email>",
    title: "Don’t hesitate to get in touch. We're here to help!",
  },
  faqs: {
    title: "Frequently Asked Questions",
  },
  header: {
    cta: "Get help now",
    description:
      "We’re always looking at how we can improve our products. Let us know what problems you’ve been having and we’ll be sure to help!",
    title: "Oh no! We’re sorry you’re having problems with our products",
  },
  meta: {
    description:
      "We’re always looking at how we can improve our products. Let us know what problems you’ve been having and we’ll be sure to help!",
    openGraph: {
      description: "We’re always looking at how we can improve our products.",
      title: "We’d love to hear your feedback",
    },
    title: "We’d love to hear your feedback | FOTP",
  },
};

interface FeedbackOrderNegativeProps {
  faqs: { faq: Faq }[];
}

export const FeedbackOrderNegativePage: NextPageWithApollo<FeedbackOrderNegativeProps> = ({
  faqs,
}) => {
  const { i18n, t } = useLocale();

  const feedback = useCaptureOrderFeedbackOnPageLoad({
    fallbackSurveyUrl: `mailto:${t(
      "common:email"
    )}?subject=Feedback on my order`,
    sentiment: FeedbackSentiment.SAD,
    surveyLookup: [
      [/^the-one/, "https://fotp2021.typeform.com/to/UHUD8Nju"],
      [/^harmony/, "https://fotp2021.typeform.com/to/Pt3wn0Rv"],
    ],
  });

  const loading = feedback.status === "LOADING";

  i18n.addResourceBundle("en-US", "feedbackNegativePage", enUsResource);

  return (
    <Standard gorgiasDelay={false}>
      <Metadata
        description={t("feedbackNegativePage:meta.description")}
        noindex={true}
        openGraph={{
          description: t("feedbackNegativePage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("feedbackNegativePage:meta.openGraph.title"),
        }}
        title={t("feedbackNegativePage:meta.title")}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.tint.sand,
            height: ["auto", null, "100vh"],
            maxHeight: [null, null, 560, 640],
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
            urls={[null, null, NEGATIVE_IMG.src]}
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
              <Trans i18nKey="feedbackNegativePage:header.title" />
            </h1>
            <p
              css={s(bodyText, (t) => ({
                fontSize: [18, null, 20],
                margin: "0 auto",
                marginBottom: t.spacing.lg,
                maxWidth: ["none", null, 500, 640],
              }))}
            >
              {t("feedbackNegativePage:header.description")}
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
                {t("feedbackNegativePage:header.cta")}
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
            textAlign: "center",
          }))}
        >
          <div css={s(belt, { maxWidth: 700 })}>
            <h2
              css={s(headingAlpha, (t) => ({
                margin: ["0 auto", null, 0],
                marginBottom: [t.spacing.md, null, t.spacing.lg],
              }))}
            >
              {t("feedbackNegativePage:contact.title")}
            </h2>
            <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.xl }))}>
              <Trans
                components={{
                  Email: (
                    <a css={s(textLink)} href={`mailto:${t("common:email")}`} />
                  ),
                  Phone: <a css={s(textLink)} href="tel:+13239225737" />,
                }}
                i18nKey="feedbackNegativePage:contact.description"
              />
            </p>
            <p css={s(bodyText)}>{t("feedbackNegativePage:contact.adblock")}</p>
          </div>
        </section>

        {faqs && (
          <section
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.feature3,
              color: t.color.text.dark.base,
            }))}
          >
            <div css={s(belt, { maxWidth: 700 })}>
              <h2
                css={s(headingAlpha, (t) => ({
                  margin: ["0 auto", null, 0],
                  marginBottom: [t.spacing.lg, null, t.spacing.xl],
                  textAlign: "center",
                }))}
              >
                {t("feedbackNegativePage:faqs.title")}
              </h2>
              {faqs.map(
                ({ faq: { answer, question } }, uid) =>
                  answer &&
                  question && (
                    <Accordion
                      key={uid}
                      id={`faq-${uid}`}
                      label={<RichTextFragment render={question} />}
                      labelAs="h3"
                    >
                      <div
                        css={s(bodyText, (t) => ({
                          marginBottom: t.spacing.md,
                        }))}
                      >
                        <RichText render={answer} />
                      </div>
                    </Accordion>
                  )
              )}
            </div>
          </section>
        )}
      </main>
    </Standard>
  );
};

export default FeedbackOrderNegativePage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { FAQ_CATEGORY_SNIPPET } = await import("../../cms/snippets");

    const { data } = await runServerSideQuery<FaqCategorySnippetData>(
      apolloClient,
      {
        query: FAQ_CATEGORY_SNIPPET,
        variables: { handle: "general-faqs" },
      }
    );

    if (!data?.faqCategorySnippet?.body?.[0]?.fields) {
      throw new Error("Failed to fetch general-faqs");
    }

    return {
      props: { faqs: data.faqCategorySnippet.body[0].fields },
      revalidate: 5 * 60,
    };
  }
);
