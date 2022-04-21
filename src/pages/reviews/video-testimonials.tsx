import { useQuery } from "@apollo/react-hooks";
import { runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { AnimatePresence, motion } from "framer-motion";
import chunk from "lodash.chunk";
import React, { FC } from "react";
import {
  VIDEO_TESTIMONIALS,
  VideoTestimonialsData,
  VideoTestimonialSortType,
} from "src/cms/video-testimonials";

import { belt, gutter, mx, px, ratio, s, size } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import OG_IMG from "../../assets/images/reviews/OPENGRAPH.jpg";
import { secondaryButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import ResponsiveImage from "../../ui/base/responsive-image";
import Spinner from "../../ui/base/spinner";
import { headingAlpha } from "../../ui/base/typography";
import VideoLauncher from "../../ui/base/video-launcher";
import { theme } from "../../ui/styles/theme";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  loadMore: "Load more videos",
  meta: {
    description:
      "Real Stories by Real Dog Owners. Watch {{ totalCount}} Amazing Transformation Stories And Discover How Our Supplements Can Help Your Dog.",
    openGraph: {
      description:
        "Real Stories by Real Dog Owners. Watch {{ totalCount}} Amazing Transformation Stories And Discover How Our Supplements Can Help Your Dog.",
      title: "Watch {{ totalCount }} Amazing Transformation Stories",
    },
    title:
      "Watch {{ totalCount }} Amazing Transformation Stories | FOTP Dog Supplements",
  },
  play: "Play video",
  title: "{{ totalCount }} Amazing Transformation Stories",
};

const variables = {
  sort: VideoTestimonialSortType.META_LAST_PUBLICATION_DATE_DESC,
};

export const VideoTestimonialsPage: FC = () => {
  const { i18n, t } = useLocale();
  const { data, loading, fetchMore } = useQuery<VideoTestimonialsData>(
    VIDEO_TESTIMONIALS,
    {
      notifyOnNetworkStatusChange: true,
      variables,
    }
  );

  if (!data?.videoTestimonials) {
    throw new Error("Unexpected error fetching videoTestimonials");
  }

  i18n.addResourceBundle("en-US", "VideoTestimonialsPage", enUsResource);

  const { edges, pageInfo, totalCount } = data.videoTestimonials;

  const chunkedEdges = chunk(edges, 5);

  const handleLoadMore = () => {
    fetchMore({
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const newEdges = fetchMoreResult.videoTestimonials.edges;
        const pageInfo = fetchMoreResult.videoTestimonials.pageInfo;

        return newEdges.length
          ? {
              videoTestimonials: {
                ...previousResult.videoTestimonials,
                edges: [...previousResult.videoTestimonials.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
      variables: {
        after: pageInfo.endCursor,
      },
    });
  };

  return (
    <Standard>
      <Metadata
        description={t("VideoTestimonialsPage:meta.description", {
          totalCount,
        })}
        title={t("VideoTestimonialsPage:meta.title", {
          totalCount,
        })}
        openGraph={{
          description: t("VideoTestimonialsPage:meta.openGraph.description", {
            totalCount,
          }),
          image: OG_IMG.src,
          title: t("VideoTestimonialsPage:meta.openGraph.title", {
            totalCount,
          }),
        }}
      />
      <main id="main">
        <section css={s(gutter, { textAlign: "center" })}>
          <div css={s(belt)}>
            <h1
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.xl, null, t.spacing.xxl],
              }))}
            >
              {t("VideoTestimonialsPage:title", { totalCount })}
            </h1>

            {chunkedEdges?.map((chunk, index) => {
              const [firstItem, ...rest] = chunk;

              return (
                <AnimatePresence key={firstItem.node._meta.id} initial={false}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Grid
                      _css={s((t) => ({
                        marginBottom: [t.spacing.xs, null, t.spacing.sm],
                      }))}
                      direction={index % 2 == 0 ? "ltr" : "rtl"}
                      gx={[theme.spacing.xs, null, theme.spacing.sm]}
                      gy={[theme.spacing.xs, null, theme.spacing.sm]}
                      itemWidth={["100%", null, "50%"]}
                    >
                      <Item key={index}>
                        {firstItem.node.vimeoLink && (
                          <VideoLauncher
                            preload="none"
                            src={firstItem?.node.vimeoLink?.url}
                            _css={s(ratio(1), { width: "100%" })}
                          >
                            {({ isBusy }) => (
                              <>
                                {firstItem?.node.thumbnail && (
                                  <ResponsiveImage
                                    alt={firstItem.node.thumbnail.alt ?? ""}
                                    layout="fill"
                                    objectFit="cover"
                                    priority={index === 0}
                                    sizes={{
                                      maxWidth: [720, null, 640],
                                      width: ["100vw", null, "50vw"],
                                    }}
                                    src={firstItem.node.thumbnail.url}
                                  />
                                )}
                                <div
                                  css={s({
                                    ...size([64, null, 72, 96]),
                                    alignItems: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "auto",
                                    position: "absolute",
                                  })}
                                >
                                  <svg
                                    css={s({
                                      ...size([64, null, 72, 96]),
                                      opacity: isBusy ? 0 : 0.9,
                                      transition: "opacity 500ms",
                                    })}
                                    viewBox="0 0 102 102"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  >
                                    <title>Play video</title>
                                    <path
                                      d="M51 102C79.1665 102 102 79.1665 102 51C102 22.8335 79.1665 0 51 0C22.8335 0 0 22.8335 0 51C0 79.1665 22.8335 102 51 102ZM41.4375 67.5627L70.125 51L41.4375 34.4373V67.5627Z"
                                      fill="#fff"
                                    />
                                  </svg>
                                  <Spinner
                                    _css={s({
                                      ...size("50%"),
                                      opacity: isBusy ? 1 : 0,
                                      transition: "opacity 500ms",
                                    })}
                                  />
                                </div>
                              </>
                            )}
                          </VideoLauncher>
                        )}
                      </Item>
                      <Item>
                        <Grid
                          gx={[theme.spacing.xs, null, theme.spacing.sm]}
                          gy={[theme.spacing.xs, null, theme.spacing.sm]}
                          itemWidth="50%"
                        >
                          {rest.map(
                            ({ node: { _meta, thumbnail, vimeoLink } }) => (
                              <Item key={_meta.id}>
                                {vimeoLink && (
                                  <VideoLauncher
                                    preload="none"
                                    src={vimeoLink?.url}
                                    _css={s(ratio(1), { width: "100%" })}
                                  >
                                    {({ isBusy }) => (
                                      <>
                                        {thumbnail && (
                                          <ResponsiveImage
                                            alt={thumbnail.alt ?? ""}
                                            layout="fill"
                                            objectFit="cover"
                                            priority={index === 0}
                                            sizes={{
                                              maxWidth: [360, null, 320],
                                              width: ["50vw", null, "25vw"],
                                            }}
                                            src={thumbnail.url}
                                          />
                                        )}
                                        <div
                                          css={s({
                                            ...size([32, null, 36, 48]),
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            margin: "auto",
                                            position: "absolute",
                                          })}
                                        >
                                          <svg
                                            css={s({
                                              ...size([32, null, 36, 48]),
                                              opacity: isBusy ? 0 : 0.9,
                                              transition: "opacity 500ms",
                                            })}
                                            viewBox="0 0 102 102"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                          >
                                            <title>
                                              {t("VideoTestimonialsPage:play")}
                                            </title>
                                            <path
                                              d="M51 102C79.1665 102 102 79.1665 102 51C102 22.8335 79.1665 0 51 0C22.8335 0 0 22.8335 0 51C0 79.1665 22.8335 102 51 102ZM41.4375 67.5627L70.125 51L41.4375 34.4373V67.5627Z"
                                              fill="#fff"
                                            />
                                          </svg>
                                          <Spinner
                                            _css={s({
                                              ...size("50%"),
                                              opacity: isBusy ? 1 : 0,
                                              transition: "opacity 500ms",
                                            })}
                                          />
                                        </div>
                                      </>
                                    )}
                                  </VideoLauncher>
                                )}
                              </Item>
                            )
                          )}
                        </Grid>
                      </Item>
                    </Grid>
                  </motion.div>
                </AnimatePresence>
              );
            })}
            {pageInfo.hasNextPage && (
              <button
                css={s(secondaryButton({ disabled: loading }), (t) => ({
                  marginTop: t.spacing.lg,
                  maxWidth: ["none", null, 360],
                  ...mx("auto"),
                  ...px(0),
                  position: "relative",
                  width: "100%",
                }))}
                disabled={loading}
                onClick={handleLoadMore}
              >
                <span
                  css={s({
                    opacity: loading ? 0 : 1,
                    transition: "opacity 500ms",
                  })}
                >
                  {t("VideoTestimonialsPage:loadMore")}
                </span>
                <Spinner
                  _css={s((t) => ({
                    ...size(t.spacing.md),
                    opacity: loading ? 1 : 0,
                    transition: "opacity 500ms",
                  }))}
                />
              </button>
            )}
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default VideoTestimonialsPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { VIDEO_TESTIMONIALS } = await import("../../cms/video-testimonials");
    const { data } = await runServerSideQuery<VideoTestimonialsData>(
      apolloClient,
      {
        // We're using pagination, so we'll need to make sure the initial
        // server-side data is part of the client-side cache
        fetchPolicy: "network-only",
        query: VIDEO_TESTIMONIALS,
        variables,
      }
    );

    if (data.videoTestimonials.totalCount === "0") {
      throw new Error("Unexpected missing video testimonial entries");
    }

    return {
      props: {},
      revalidate: 5 * 60,
    };
  }
);
