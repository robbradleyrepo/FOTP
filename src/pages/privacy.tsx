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
      "At Front of the Pack we respect your privacy and are committed to protecting it through our compliance with our privacy policy",
    openGraph: {
      description: "At Front of the Pack we respect your privacy",
      title: "Privacy Policy | Front Of The Pack",
    },
    title: "Privacy Policy | Front Of The Pack Top Dog Supplements",
  },
};

const PrivacyPage: NextPageWithApollo<LegalProps> = ({ body, title }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "privacyPage", enUsResource);

  return (
    <>
      <Metadata
        description={t("privacyPage:meta.description")}
        title={t("privacyPage:meta.title")}
        openGraph={{
          description: t("privacyPage:meta.openGraph.description"),
          title: t("privacyPage:meta.openGraph.title"),
        }}
      />
      <Legal body={body} title={title} />
    </>
  );
};

export default PrivacyPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const PRIVACY_POLICY = gql`
      query PRIVACY_POLICY {
        shop {
          policy: privacyPolicy {
            body
            title
          }
        }
      }
    `;

    const { data } = await runServerSideQuery(apolloClient, PRIVACY_POLICY);

    if (!data?.shop?.policy) {
      throw new Error("Failed to fetch shop privacy policy");
    }

    return {
      props: data.shop.policy,
      revalidate: 15 * 60,
    };
  }
);
