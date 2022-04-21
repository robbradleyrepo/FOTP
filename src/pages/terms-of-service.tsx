import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import gql from "graphql-tag";
import React from "react";

import { makeStaticPropsGetter } from "../../pages/_app";
import Legal from "../ui/templates/legal";

interface LegalProps {
  body: string;
  title: string;
}

const enUsResource = {
  meta: {
    description:
      "By placing an order on our website, you agree to be bound by our Terms and Conditions",
    openGraph: {
      description: "By placing an order on our site, you agree to our T&Cs",
      title: "Terms of Service | Front Of The Pack",
    },
    title: "Terms of Service | Front Of The Pack Dog Supplements",
  },
};

const TermsOfService: NextPageWithApollo<LegalProps> = ({ body, title }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "termsPage", enUsResource);

  return (
    <>
      <Metadata
        description={t("termsPage:meta.description")}
        title={t("termsPage:meta.title")}
        openGraph={{
          description: t("termsPage:meta.openGraph.description"),
          title: t("termsPage:meta.openGraph.title"),
        }}
      />
      <Legal body={body} title={title} />
    </>
  );
};

export default TermsOfService;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { data } = await runServerSideQuery(
      apolloClient,
      gql`
        query TERMS_OF_SERVICE {
          shop {
            policy: termsOfService {
              body
              title
            }
          }
        }
      `
    );

    if (!data?.shop?.policy) {
      throw new Error("Unexpected missing shop terms of service policy");
    }

    return {
      props: data.shop.policy,
      revalidate: 15 * 60,
    };
  }
);
