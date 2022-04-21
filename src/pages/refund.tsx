import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import gql from "graphql-tag";
import React from "react";

import { makeStaticPropsGetter } from "../../pages/_app";
import OG_IMG from "../assets/images/legal/open-graph/PRIVACY.jpg";
import Legal from "../ui/templates/legal";

interface LegalProps {
  body: string;
  title: string;
}

const enUsResource = {
  meta: {
    description:
      "We want you to be 100% happy with your purchase. That's why we offer a 90 day money back guarantee on all orders.",
    openGraph: {
      description: "We want you to be 100% happy with your purchase",
      title: "Refund Policy | Front Of The Pack",
    },
    title: "Refund Policy | Front Of The Pack Top Dog Supplements",
  },
};

const RefundPage: NextPageWithApollo<LegalProps> = ({ body, title }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "refundPage", enUsResource);

  return (
    <>
      <Metadata
        description={t("refundPage:meta.description")}
        title={t("refundPage:meta.title")}
        openGraph={{
          description: t("refundPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("refundPage:meta.openGraph.title"),
        }}
      />
      <Legal body={body} title={title} />
    </>
  );
};

export default RefundPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { data } = await runServerSideQuery(
      apolloClient,
      gql`
        query REFUND_POLICY {
          shop {
            policy: refundPolicy {
              body
              title
            }
          }
        }
      `
    );

    if (!data?.shop?.policy) {
      throw new Error("Unexpected missing shop refund policy");
    }

    return {
      props: data.shop.policy,
      revalidate: 15 * 60,
    };
  }
);
