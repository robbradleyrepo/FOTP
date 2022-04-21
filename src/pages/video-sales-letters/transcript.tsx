import { runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Elements } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";

import { belt, gutter, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import OG_IMG from "../../assets/images/offers/open-graph/THE_ONE_EXPERT_LEAD.jpg";
import { OpinionatedRichText } from "../../cms/prismic";
import { VideoSalesLetterTranscriptData } from "../../cms/video-sales-letter";
import { headingAlpha } from "../../ui/base/typography";
import Footer from "../../ui/modules/video-sales-letter/footer";
import Nav, { getNavEnabled } from "../../ui/modules/video-sales-letter/nav";

const enUsResource = {
  header: {
    title: "Transcript",
  },
  meta: {
    description:
      "Regardless of your dog’s age, weight or breed, whatever food you feed your dog, every single type have the same problem…",
    openGraph: {
      description:
        "Regardless of your dog’s age, weight or breed, whatever food you feed your dog, every single type have the same problem…",
      title: "Discover 1 Simple Tweak To Supercharge Your Dog’s Health",
    },
    title: "Discover 1 Simple Tweak To Supercharge Your Dog’s Health  | FOTP",
  },
};

interface VideoSalesLetterTranscriptProps {
  data: VideoSalesLetterTranscriptData;
}

export const VideoSalesLetterTranscript: FC<VideoSalesLetterTranscriptProps> = ({
  data,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "VideoSalesLetterTranscript", enUsResource);

  const {
    transcript: { transcript },
  } = data.videoSalesLetter;

  const navEnabled = getNavEnabled(data.videoSalesLetter);

  return (
    <>
      <Metadata
        description={t("VideoSalesLetterTranscript:meta.description")}
        title={t("VideoSalesLetterTranscript:meta.title")}
        openGraph={{
          description: t(
            "VideoSalesLetterTranscript:meta.openGraph.description"
          ),
          image: OG_IMG.src,
          title: t("VideoSalesLetterTranscript:meta.openGraph.title"),
        }}
      />

      {navEnabled && (
        <Nav
          _css={s({ left: 0, position: "fixed", top: 0, width: "100%" })}
          {...data.videoSalesLetter}
        />
      )}

      <main
        css={s(gutter, (t) => ({
          marginTop: navEnabled
            ? [t.height?.nav.mobile, null, t.height?.nav.desktop]
            : null,
        }))}
      >
        <div css={s(belt, { maxWidth: 845 })}>
          <h1
            css={s(headingAlpha, (t) => ({
              marginBottom: [t.spacing.xl, null, t.spacing.xxl],
              textAlign: "center",
            }))}
          >
            {t("VideoSalesLetterTranscript:header.title")}
          </h1>
          <OpinionatedRichText
            components={{
              [Elements.heading1]: (
                <h2
                  css={s((t) => ({
                    fontWeight: t.font.primary.weight.medium,
                  }))}
                />
              ),
            }}
            render={transcript}
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VideoSalesLetterTranscript;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    // Typeguard: we won't hit this if the route is configured correctly
    if (!params?.handle || typeof params.handle !== "string") {
      return { notFound: true };
    }

    const { VIDEO_SALES_LETTER_TRANSCRIPT } = await import(
      "../../cms/video-sales-letter"
    );

    const { data } = await runServerSideQuery<VideoSalesLetterTranscriptData>(
      apolloClient,
      {
        query: VIDEO_SALES_LETTER_TRANSCRIPT,
        variables: { handle: params.handle },
      }
    );

    if (!data?.videoSalesLetter?.transcript?.transcript) {
      return { notFound: true };
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
