import { runServerSideQuery } from "@sss/apollo";
import { GetStaticPaths } from "next";

import { makeStaticPropsGetter } from "../../pages/_app";
import {
  InfluencerRedirectData,
  transformInfluencerRedirect,
} from "../cms/influencer-redirect";

const InfluencerRedirectPage = () => null;

export default InfluencerRedirectPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    // Typeguard: we won't hit this if the route is configured correctly
    if (typeof params?.handle !== "string") {
      return { notFound: true };
    }

    const { INFLUENCER_REDIRECT } = await import("../cms/influencer-redirect");

    const { data } = await runServerSideQuery<InfluencerRedirectData>(
      apolloClient,
      {
        query: INFLUENCER_REDIRECT,
        variables: { handle: params.handle },
      }
    );

    if (!data?.influencerRedirect) {
      return {
        notFound: true,
      };
    }

    const { destination } = transformInfluencerRedirect(
      data.influencerRedirect
    );

    return {
      redirect: {
        destination,
        permanent: false,
      },
      revalidate: 60,
    };
  }
);
