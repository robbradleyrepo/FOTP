import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { renderAsString } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React, { Fragment } from "react";
import { Trans } from "react-i18next";
import { JsonLd } from "react-schemaorg";
import { FAQPage as FAQPageDts, Question } from "schema-dts";

import { belt, gutter, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import OG_IMG from "../../assets/images/FAQ/OPENGRAPH.jpg";
import type { FAQPageData } from "../../cms/faq-page";
import { OpinionatedRichText } from "../../cms/prismic";
import Accordion from "../../ui/base/accordion";
import {
  bodyText,
  headingAlpha,
  headingBravo,
  textLink,
} from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  header: {
    cta: "$t(common:email)",
    strapline:
      "Hopefully we can answer any questions you have below, if not contact us at",
    title: "Frequently Asked Questions",
  },
  meta: {
    description:
      "Trying to find an answer to a question? You've come to the right place, we've got an extensive list of FAQs. Can't find what you are looking for? Email us!",
    openGraph: {
      description: "We've got an extensive list of FAQs",
      title: "Frequently Asked Questions | Front Of The Pack",
    },
    title: "Frequently Asked Questions | Front Of The Pack Dog Supplements",
  },
};

interface FAQPageProps {
  data: FAQPageData;
}

export const FAQPage: NextPageWithApollo<FAQPageProps> = ({ data }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "FAQPage", enUsResource);

  const { body } = data.faqPage;

  return (
    <Standard>
      <Metadata
        description={t("FAQPage:meta.description")}
        title={t("FAQPage:meta.title")}
        openGraph={{
          description: t("FAQPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("FAQPage:meta.openGraph.title"),
        }}
      />
      <main id="main">
        <header css={s(gutter)}>
          <div css={s(belt, { maxWidth: 840 })}>
            <h1
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.sm, null, t.spacing.md],
              }))}
            >
              <Trans i18nKey="FAQPage:header.title" />
            </h1>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: [t.spacing.xxl, null, t.spacing.xxxl],
              }))}
            >
              {t("FAQPage:header.strapline")}{" "}
              <a css={s(textLink)} href={`mailto:${t("common:email")}`}>
                {t("common:email")}
              </a>
            </p>
            {body?.map(({ fields, primary }, categoryId) => (
              <Fragment key={categoryId}>
                {primary && (
                  <h2
                    css={s(headingBravo, (t) => ({
                      marginBottom: [t.spacing.md, null, t.spacing.lg],
                      marginTop: [t.spacing.xl, null, t.spacing.xxl],
                    }))}
                  >
                    {primary.label}
                  </h2>
                )}
                {fields?.map(({ faq }, questionId) => (
                  <Fragment key={questionId}>
                    {faq?.question && faq?.answer && (
                      <Accordion
                        id={`${categoryId}-${questionId}-detail`}
                        label={renderAsString(faq.question)}
                        labelAs="h3"
                      >
                        <p
                          css={s(bodyText, (t) => ({
                            paddingBottom: t.spacing.lg,
                            paddingTop: t.spacing.sm,
                          }))}
                        >
                          <OpinionatedRichText render={faq.answer} />
                        </p>
                      </Accordion>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </div>
        </header>
      </main>
      <JsonLd<FAQPageDts>
        item={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: body?.reduce(
            (accum, { fields }) => [
              ...accum,
              ...(fields
                ?.map(({ faq }) => faq)
                ?.filter((faq) => faq && faq?.question && faq?.answer)
                .map(
                  (faq): Question => ({
                    "@type": "Question",
                    acceptedAnswer: {
                      "@type": "Answer",
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      text: renderAsString(faq!.answer!),
                    },
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    name: renderAsString(faq!.question!),
                  })
                ) ?? []),
            ],
            [] as Question[]
          ),
        }}
      />
    </Standard>
  );
};

export default FAQPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const FAQ_PAGE = (await import("../../cms/faq-page")).FAQ_PAGE;
    const { data } = await runServerSideQuery<FAQPageData>(
      apolloClient,
      FAQ_PAGE
    );

    if (!data?.faqPage) {
      throw new Error("Unexpected missing 'faq_page' singleton type");
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
