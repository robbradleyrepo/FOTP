import { useQuery } from "@apollo/react-hooks";
import { runServerSideQuery, throwGraphQLErrors } from "@sss/apollo";
import { getFetchedImageUrl } from "@sss/cloudinary";
import { useDateTimeFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { ArticlePageTag, RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { FC } from "react";

import {
  belt,
  gutterBottom,
  gutterRight,
  gutterX,
  mx,
  percentage,
  px,
  ratio,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { secondaryButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import ResponsiveImage from "../../ui/base/responsive-image";
import Spinner from "../../ui/base/spinner";
import { headingBravo } from "../../ui/base/typography";
import ArticlePageListingItem from "../../ui/modules/article-page/listing-item";
import Author from "../../ui/modules/author";
import Standard from "../../ui/templates/standard";
import {
  ARTICLE_PAGES,
  ArticlePageListingData,
  ArticlePageListingVariables,
} from "./article-queries";
import { BlogSchema } from "./blog-schemas";

const enUsResource = {
  loadMore: "Load more posts",
  meta: {
    description:
      "Everything you need to know about dogs and canine nutrition, straight from our team of experts.",
    openGraph: {
      description:
        "Everything you need to know about dogs and canine nutrition, straight from our team of experts.",
      title: "Latest Blog Posts | Front Of The Pack",
    },
    title: "Latest Blog Posts | Front Of The Pack Top Dog Supplements",
  },
  title: "Latest Blog Posts",
};

const variables = {
  first: 25,
  tags: [ArticlePageTag.BLOG],
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const MotionGrid = motion.custom(Grid);
const MotionItem = motion.custom(Item);

export const BlogPosts: FC = () => {
  const formatDateTime = useDateTimeFormatter();
  const { i18n, t } = useLocale();
  const { data, loading, fetchMore } = useQuery<ArticlePageListingData>(
    ARTICLE_PAGES,
    {
      notifyOnNetworkStatusChange: true,
      variables,
    }
  );

  i18n.addResourceBundle("en-US", "BlogPosts", enUsResource);

  if (!data) {
    return null;
  }

  const { edges, pageInfo } = data.articlePages;

  const [heroArticle, ...articles] = edges;

  const handleLoadMore = () => {
    fetchMore({
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const newEdges = fetchMoreResult.articlePages.edges;
        const pageInfo = fetchMoreResult.articlePages.pageInfo;

        return newEdges.length
          ? {
              articlePages: {
                ...previousResult.articlePages,
                edges: [...previousResult.articlePages.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
      variables: {
        ...variables,
        after: pageInfo.endCursor,
        first: 24,
      },
    });
  };

  return (
    <>
      <Standard>
        <Metadata
          description={t("BlogPosts:meta.description")}
          title={t("BlogPosts:meta.title")}
          openGraph={{
            description: t("BlogPosts:meta.openGraph.description"),
            image:
              heroArticle.node.thumbnail?.url &&
              getFetchedImageUrl({
                url: heroArticle.node.thumbnail?.url,
                width: 1200,
              }),
            title: t("BlogPosts:meta.openGraph.title"),
          }}
        />
        <main>
          <h1 css={s(visuallyHidden)}>{t("BlogPosts:title")}</h1>
          <Link to={`/blog/${heroArticle.node._meta.uid}`}>
            <article>
              <Grid
                _css={s(belt, (t) => ({
                  marginBottom: t.spacing.xl,
                  paddingTop: [null, null, null, t.spacing.xl],
                }))}
                gx={(t) => t.spacing.lg}
                gy={(t) => t.spacing.md}
              >
                {heroArticle.node.thumbnail && (
                  <Item
                    width={[
                      percentage(1),
                      null,
                      null,
                      percentage(1 / 2),
                      percentage(2 / 3),
                    ]}
                  >
                    <div
                      css={s(ratio(9 / 16), {
                        overflow: "hidden",
                        width: "100%",
                      })}
                    >
                      <ResponsiveImage
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        priority
                        src={heroArticle.node.thumbnail.url}
                        sizes={{
                          maxWidth: [1280, null, 640, 420],
                          width: ["100vw", null, "50vw", "33.333%vw"],
                        }}
                      />
                    </div>
                  </Item>
                )}
                <Item
                  _css={s({ alignItems: "center", display: "flex" })}
                  width={[
                    percentage(1),
                    null,
                    null,
                    percentage(1 / 2),
                    percentage(1 / 3),
                  ]}
                >
                  <div
                    css={s(gutterRight, (t) => ({
                      paddingLeft: [
                        t.spacing.md,
                        null,
                        t.spacing.lg,
                        0,
                        t.spacing.md,
                      ],
                    }))}
                  >
                    {heroArticle.node.title && (
                      <h2
                        css={s(headingBravo, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <RichTextFragment render={heroArticle.node.title} />
                      </h2>
                    )}
                    {heroArticle.node.summary && (
                      <p>{heroArticle.node.summary}</p>
                    )}
                    {heroArticle.node.author && (
                      <Author
                        _css={s((t) => ({
                          flexShrink: 0,
                          marginRight: t.spacing.sm,
                          marginTop: t.spacing.sm,
                        }))}
                        image={heroArticle.node.author.image}
                        imageCss={s((t) => ({
                          ...size(48),
                          marginRight: t.spacing.sm,
                        }))}
                        name={heroArticle.node.author.name}
                        sizes={{ width: 48 }}
                      >
                        {heroArticle.node.publicationDate && (
                          <time
                            css={s((t) => ({
                              flexShrink: 0,
                              marginTop: t.spacing.sm,
                            }))}
                            dateTime={heroArticle.node.publicationDate}
                          >
                            {formatDateTime(heroArticle.node.publicationDate, {
                              day: "numeric",
                              month: "long",
                              timeZone: "UTC", // Dates without times are parsed as UTC midnight
                              year: "numeric",
                            })}
                          </time>
                        )}
                      </Author>
                    )}
                  </div>
                </Item>
              </Grid>
            </article>
          </Link>
          <AnimateSharedLayout>
            <motion.div css={s(gutterX, gutterBottom)}>
              <MotionGrid
                _css={s(belt)}
                gx={(t) => t.spacing.lg}
                gy={(t) => t.spacing.xl}
                itemWidth={[
                  percentage(1),
                  null,
                  percentage(1 / 2),
                  percentage(1 / 3),
                ]}
                layout
              >
                <AnimatePresence initial={false}>
                  {articles.map(({ node }) => (
                    <MotionItem
                      key={node._meta.uid}
                      animate={variants.visible}
                      exit={variants.visible}
                      initial={variants.hidden}
                      layout
                    >
                      <Link to={`/blog/${node._meta.uid}`}>
                        <ArticlePageListingItem
                          {...node}
                          labelAs="h2"
                          sizes={{
                            maxWidth: [1280, null, 640, 420],
                            width: ["100vw", null, "50vw", "33.333%vw"],
                          }}
                        />
                      </Link>
                    </MotionItem>
                  ))}
                </AnimatePresence>
              </MotionGrid>
              <AnimatePresence initial={false}>
                {pageInfo.hasNextPage && (
                  <motion.div
                    animate={variants.visible}
                    exit={{ ...variants.hidden, height: 0 }}
                    layout
                  >
                    <div css={s((t) => ({ paddingTop: t.spacing.lg }))}>
                      <button
                        css={s(secondaryButton({ disabled: loading }), {
                          display: "block",
                          maxWidth: ["none", null, 360],
                          ...mx("auto"),
                          ...px(0),
                          position: "relative",
                          width: "100%",
                        })}
                        disabled={loading}
                        onClick={handleLoadMore}
                      >
                        <span
                          css={s({
                            opacity: loading ? 0 : 1,
                            transition: "opacity 500ms",
                          })}
                        >
                          {t("BlogPosts:loadMore")}
                        </span>
                        <Spinner
                          _css={s((t) => ({
                            ...size(t.spacing.md),
                            opacity: loading ? 1 : 0,
                            transition: "opacity 500ms",
                          }))}
                        />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimateSharedLayout>
        </main>
      </Standard>
      <BlogSchema articles={data.articlePages.edges.map(({ node }) => node)} />
    </>
  );
};

export default BlogPosts;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const result = await runServerSideQuery<
      ArticlePageListingData,
      ArticlePageListingVariables
    >(apolloClient, {
      // We're using pagination, so we'll need to make sure the initial
      // server-side data is part of the client-side cache
      fetchPolicy: "network-only",
      query: ARTICLE_PAGES,
      variables,
    });

    throwGraphQLErrors(result);

    return {
      props: {},
      revalidate: 5 * 60,
    };
  }
);
