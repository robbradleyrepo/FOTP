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
      "Want to know how much shipping will cost? Unsure when your order will arrive? Check out our shipping policy",
    openGraph: {
      description:
        "Want to know how much shipping will cost? Unsure when your order will arrive?",
      title: "Shipping Policy | Front Of The Pack",
    },
    title: "Shipping Policy | Front Of The Pack",
  },
};

const ShippingPolicyPage: NextPageWithApollo<LegalProps> = ({
  body,
  title,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "shippingPage", enUsResource);

  return (
    <>
      <Metadata
        description={t("shippingPage:meta.description")}
        title={t("shippingPage:meta.title")}
        openGraph={{
          description: t("shippingPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("shippingPage:meta.openGraph.title"),
        }}
      />
      <Legal body={body} title={title} />
    </>
  );
};

export default ShippingPolicyPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { data } = await runServerSideQuery(
      apolloClient,
      gql`
        query SHIPPING_POLICY {
          shop {
            policy: shippingPolicy {
              body
              title
            }
          }
        }
      `
    );

    if (!data?.shop?.policy) {
      throw new Error("Unexpected missing shop shipping policy");
    }

    return {
      props: data.shop.policy,
      revalidate: 15 * 60,
    };
  }
);
