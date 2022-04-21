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
import { OpinionatedRichText } from "../../cms/prismic";
import type { VetPageData } from "../../cms/vet-page";
import Accordion from "../../ui/base/accordion";
import { bodyText, headingAlpha, textLink } from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  header: {
    body:
      "Below we have tried to answer any questions your vet might have about our products, so you can feel comfortable about the suitability for your dog. If you still have more questions then you can email us at <EmailLink>$t(common:email)</EmailLink>",
    title: "Answers for Veterinarians",
  },
  meta: {
    description:
      "Trying to find an answer to a question for one of your patients? We've got an extensive list of answers for veterinarians. Can't find what you are looking for? Email us!",
    openGraph: {
      description: "We've got an extensive list of FAQs",
      title: "Answers for Veterinarians | Front Of The Pack",
    },
    title: "Answers for Veterinarians | FOTP | Best Dog Supplements",
  },
};

interface VetPageProps {
  data: VetPageData;
}

export const VetPage: NextPageWithApollo<VetPageProps> = ({ data }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "VetPage", enUsResource);

  const { questions } = data.vetPage;

  return (
    <Standard>
      <Metadata
        description={t("VetPage:meta.description")}
        title={t("VetPage:meta.title")}
        openGraph={{
          description: t("VetPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("VetPage:meta.openGraph.title"),
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
              {t("VetPage:header.title")}
            </h1>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.xxl,
              }))}
            >
              <Trans
                i18nKey="VetPage:header.body"
                components={{
                  EmailLink: (
                    <a css={s(textLink)} href={`mailto:${t("common:email")}`} />
                  ),
                }}
              />
            </p>
            {questions?.map(({ answer, question }, index) => (
              <Fragment key={index}>
                {answer && question && (
                  <Accordion
                    id={`${index}-details-use`}
                    label={renderAsString(question)}
                    labelAs="h2"
                  >
                    <p
                      css={s(bodyText, (t) => ({
                        paddingBottom: t.spacing.lg,
                      }))}
                    >
                      <OpinionatedRichText render={answer} />
                    </p>
                  </Accordion>
                )}
              </Fragment>
            ))}
          </div>
        </header>
      </main>
      <JsonLd<FAQPageDts>
        item={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions
            ?.filter((question) => question?.question && question?.answer)
            .map(
              ({ answer, question }): Question => ({
                "@type": "Question",
                acceptedAnswer: {
                  "@type": "Answer",
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  text: renderAsString(answer!),
                },
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                name: renderAsString(question!),
              })
            ),
        }}
      />
    </Standard>
  );
};

export default VetPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const VET_PAGE = (await import("../../cms/vet-page")).VET_PAGE;
    const { data } = await runServerSideQuery<VetPageData>(
      apolloClient,
      VET_PAGE
    );

    if (!data?.vetPage) {
      throw new Error("Unexpected missing 'vet_page' singleton type");
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
