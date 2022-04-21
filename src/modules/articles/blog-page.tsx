import { captureException } from "@sentry/nextjs";
import {
  initializeApollo,
  runServerSideQuery,
  throwGraphQLErrors,
} from "@sss/apollo";
import type { ProductData } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { ArticlePageTag, renderAsString } from "@sss/prismic";
import { ApolloQueryResult } from "apollo-boost";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { FC } from "react";

import { isDefined } from "@/common/filters";
import {
  FacebookShareLink,
  TwitterShareLink,
  WhatsAppShareLink,
} from "@/common/share-links";
import {
  belt,
  gutter,
  gutterBottom,
  gutterX,
  percentage,
  s,
  size,
} from "@/common/ui/utils";
import {
  ArticlePageProductSummaryDict,
  ArticlePageSliceZone,
} from "@/modules/articles/slices";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { Grid, Item } from "../../ui/base/grid";
import Icon from "../../ui/base/icon";
import { bodyTextSmallStatic, headingBravo } from "../../ui/base/typography";
import facebook from "../../ui/icons/facebook";
import twitter from "../../ui/icons/twitter";
import whatsapp from "../../ui/icons/whatsapp";
import ArticlePageLayout from "../../ui/modules/article-page/layout";
import ArticlePageListingItem from "../../ui/modules/article-page/listing-item";
import Standard from "../../ui/templates/standard";
import {
  ArticlePageData,
  ArticlePageListingData,
  ArticlePageListingVariables,
} from "./article-queries";
import { ArticlePageMetadata, BlogPostingSchema } from "./blog-schemas";

const enUsResource = {
  readMore: {
    title: "Read more articles",
  },
  share: {
    text: "“{{ title }}” from Front Of The Pack",
    title: "Share with your friends",
  },
};

interface BlogPageProps {
  data: ArticlePageData &
    ArticlePageListingData & { products: ArticlePageProductSummaryDict };
}

export const BlogPage: FC<BlogPageProps> = ({ data }) => {
  const { i18n, t } = useLocale();
  const { asPath } = useRouter();

  i18n.addResourceBundle("en-US", "BlogPage", enUsResource);

  const shareLink = `${process.env.ORIGIN}${asPath}`;
  const shareText = t("BlogPage:share.text", {
    title: data.articlePage.title && renderAsString(data.articlePage.title),
  });

  return (
    <>
      <ArticlePageMetadata {...data.articlePage} />
      <Standard>
        <main>
          <article>
            <ArticlePageLayout {...data.articlePage}>
              {data.articlePage.body && (
                <ArticlePageSliceZone
                  products={data.products}
                  slices={data.articlePage.body}
                />
              )}
            </ArticlePageLayout>
          </article>
          <aside css={s(gutterBottom, gutterX, { textAlign: "center" })}>
            <h2
              css={s(bodyTextSmallStatic, (t) => ({
                fontFamily: t.font.secondary.family,
                fontStyle: "italic",
                fontWeight: t.font.secondary.weight.book,
                marginBottom: t.spacing.sm,
              }))}
            >
              {t("BlogPage:share.title")}:
            </h2>
            <ul
              css={s((t) => ({
                "& > *": {
                  "& + *": { marginLeft: t.spacing.sm },
                  display: "inline-block",
                },
              }))}
            >
              <li>
                <FacebookShareLink
                  url={shareLink}
                  css={s({ color: "#1877F2" })}
                >
                  <Icon
                    _css={s(size(32))}
                    path={facebook}
                    title="Facebook"
                    viewBox="0 0 100 100"
                  />
                </FacebookShareLink>
              </li>
              <li>
                <TwitterShareLink
                  text={shareText}
                  url={shareLink}
                  css={s({ color: "#1DA1F2" })}
                >
                  <Icon
                    _css={s(size(32))}
                    path={twitter}
                    title="Twitter"
                    viewBox="0 0 100 100"
                  />
                </TwitterShareLink>
              </li>
              <li>
                <WhatsAppShareLink
                  text={shareText + " " + shareLink}
                  css={s({ color: "#25D366" })}
                >
                  <Icon
                    _css={s(size(32))}
                    path={whatsapp}
                    title="WhatsApp"
                    viewBox="0 0 100 100"
                  />
                </WhatsAppShareLink>
              </li>
            </ul>
          </aside>
          {data.articlePages.edges.length > 0 && (
            <footer
              css={s(gutter, (t) => ({
                backgroundColor: t.color.background.feature3,
              }))}
            >
              <h2
                css={s(headingBravo, (t) => ({
                  marginBottom: [t.spacing.xl, null, null, t.spacing.xxl],
                  textAlign: "center",
                }))}
              >
                {t("BlogPage:readMore.title")}
              </h2>
              <Grid
                _css={s(belt)}
                gx={(t) => t.spacing.lg}
                gy={(t) => t.spacing.xl}
                itemWidth={[
                  percentage(1),
                  null,
                  percentage(1 / 2),
                  percentage(1 / 3),
                ]}
              >
                {data.articlePages.edges.map(({ node }) => (
                  <Item key={node._meta.id}>
                    <Link to={`/blog/${node._meta.uid}`}>
                      <ArticlePageListingItem
                        {...node}
                        labelAs="h3"
                        sizes={{
                          maxWidth: [1280, null, 640, 420],
                          width: ["100vw", null, "50vw", "33.333%vw"],
                        }}
                      />
                    </Link>
                  </Item>
                ))}
              </Grid>
            </footer>
          )}
        </main>
      </Standard>
      <BlogPostingSchema {...data.articlePage} />
    </>
  );
};

export default BlogPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo({});

  const { ARTICLE_PAGES } = await import("./article-queries");
  const result = await runServerSideQuery<
    ArticlePageListingData,
    ArticlePageListingVariables
  >(apolloClient, {
    query: ARTICLE_PAGES,
    variables: {
      first: 1, // render at least 1 to sanity check build time failure
      tags: [ArticlePageTag.BLOG],
    },
  });

  throwGraphQLErrors(result);

  return {
    fallback: "blocking",
    paths: result.data.articlePages.edges.map(
      ({
        node: {
          _meta: { uid },
        },
      }) => ({
        params: { handle: uid },
      })
    ),
  };
};

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    if (!params?.handle) {
      throw new Error('Missing param "handle"');
    }

    const { ARTICLE_PAGE, ARTICLE_PAGES } = await import("./article-queries");
    const { data } = await runServerSideQuery<ArticlePageData>(apolloClient, {
      query: ARTICLE_PAGE,
      variables: { handle: params.handle },
    });

    if (
      !data?.articlePage ||
      !data.articlePage._meta.tags.includes(ArticlePageTag.BLOG)
    ) {
      return { notFound: true };
    }

    const articlePageListingResult = await runServerSideQuery<
      ArticlePageListingData,
      ArticlePageListingVariables
    >(apolloClient, {
      query: ARTICLE_PAGES,
      variables: {
        first: 6,
        similar: { documentId: data.articlePage._meta.id, max: 999999999 },
        tags: [ArticlePageTag.BLOG],
      },
    });

    try {
      throwGraphQLErrors(articlePageListingResult);
    } catch (error) {
      captureException(error);
    }

    const products: ArticlePageProductSummaryDict = {};

    const handles =
      data.articlePage.body
        ?.map((slice) =>
          slice.type === "product" ? slice.primary.product?._meta?.uid : null
        )
        .filter(isDefined) ?? [];

    if (handles.length > 0) {
      try {
        const {
          findDefaultVariant,
          findVariantBySku,
          getVariantPrices,
          PRODUCT_BY_HANDLE,
        } = await import("@sss/ecommerce/product");
        const results: ApolloQueryResult<ProductData>[] = await Promise.all(
          handles.map((handle) =>
            apolloClient.query<ProductData>({
              fetchPolicy: "no-cache",
              query: PRODUCT_BY_HANDLE,
              variables: {
                handle,
              },
            })
          )
        );

        throwGraphQLErrors(results);

        results.forEach((result) => {
          const { product } = result.data;
          const { handle, title, variants } = product;

          const image = product.images.edges[0].node;
          const subtitle = (product.listingSubtitle ?? product.subtitle)?.value;
          const variant =
            (product.listingSku?.value &&
              findVariantBySku(variants, product.listingSku.value)) ||
            findDefaultVariant(variants);

          const {
            currentDiscount,
            currentPrice,
            regularPrice,
          } = getVariantPrices(
            variant,
            product.hasSubscription?.value.toLowerCase() === "true" &&
              product.listingSubscription?.value.toLowerCase() !== "false"
          );

          const productSummary = {
            currentDiscount,
            currentPrice,
            handle,
            image,
            regularPrice,
            subtitle,
            title,
          };

          products[handle] = productSummary;
        });
      } catch (error) {
        captureException(error);
      }
    }

    return {
      props: {
        data: {
          ...data,
          ...articlePageListingResult.data,
          products,
        },
      },
      revalidate: 5 * 60,
    };
  }
);
