import { NextPageWithApollo, throwGraphQLErrors } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { ArticlePageTag, hasContent, RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import Hero from "src/ui/base/hero";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  mx,
  percentage,
  py,
  s,
  useTheme,
} from "@/common/ui/utils";
import type {
  ArticlePageCore,
  ArticlePageListingData,
  ArticlePageListingVariables,
} from "@/modules/articles/article-queries";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import HEADER_TRANS_IMG from "../../../assets/images/science/HEADER_TRANS.png";
import HEADER_TRANS_MOBILE_IMG from "../../../assets/images/science/HEADER_TRANS_MOBILE.png";
import OG_IMG from "../../../assets/images/science/OPENGRAPH.jpg";
import RESEARCH_IMG from "../../../assets/images/science/RESEARCH.jpg";
import SAFETY_IMG from "../../../assets/images/science/SAFETY.jpg";
import TRIALS_IMG from "../../../assets/images/science/TRIALS.jpg";
import type { ExpertsPageData } from "../../../cms/experts";
import { RichText } from "../../../cms/prismic";
import { textButton } from "../../../ui/base/button";
import { Grid, Item } from "../../../ui/base/grid";
import ResponsiveImage from "../../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
} from "../../../ui/base/typography";
import ArticlePageListingItem from "../../../ui/modules/article-page/listing-item";
import { spacing } from "../../../ui/styles/variables";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  experts: {
    link: "Read bio",
    text:
      "Our Science Advisory Board brings together the brightest minds in biochemistry, immunology, animal nutrition and veterinary science.",
    title: "World-Leading Experts",
  },
  header: {
    label: "Our experts",
    title:
      "Our Science Advisory Board brings together the brightest minds in biochemistry, immunology, animal nutrition and veterinary science.",
  },
  latestWriting: "Latest Writing",
  meta: {
    description:
      "Our Science Advisory Board brings together the brightest minds in biochemistry, immunology, animal nutrition and veterinary science to create best dog supplements.",
    openGraph: {
      description: "A team of leading vets, biochemists & dog lovers",
      title: "Meet The Experts Behind Our World-Class Products",
    },
    title: "Meet The Experts Behind Our World-Class Dog Supplements",
  },
  resource: {
    tasks: {
      research: {
        text:
          "Whether it’s scrutinizing a new nutritional product or alpha testing their own, our experts’ appetite for innovation knows no limit.",
        title: "Research and development",
      },
      safety: {
        text:
          "We test every one of our ingredients 7 times. It’s a lot. But with the help of our Science Advisory Board, we never miss a beat.",
        title: "Safety testing",
      },
      trials: {
        text:
          "Unlike most supplement brands, we invest in university-led clinical trials to ensure our blends are safe and effective.",
        title: "Clinical trials",
      },
    },
    text:
      "Our experts meet monthly to ensure our supplements continue to meet the highest quality standards. Here’s a little taste of what else they do.",
    title: "How we work together",
  },
};

interface ExpertsPageProps {
  articles: ArticlePageCore[];
  data: ExpertsPageData["expertsPage"];
}

export const ExpertsPage: NextPageWithApollo<ExpertsPageProps> = ({
  articles,
  data,
}) => {
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "expertsPage", enUsResource);

  const { experts, featuredExperts } = data;

  return (
    <Standard>
      <Metadata
        description={t("expertsPage:meta.description")}
        title={t("expertsPage:meta.title")}
        openGraph={{
          description: t("expertsPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("expertsPage:meta.openGraph.title"),
        }}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.tint.pistachio,
            height: ["auto", null, "100vh"],
            marginBottom: [0, null, 96, t.spacing.xxxl],
            maxHeight: ["none", null, 360, 400],
            position: "relative",
            ...py([140, null, 0]),
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "cover",
                objectPosition: ["center center", null, null],
              },
              zIndex: 1,
            })}
            priority
            quality={60}
            urls={[HEADER_TRANS_MOBILE_IMG.src, null, HEADER_TRANS_IMG.src]}
          />
          <div
            css={s(belt, {
              alignItems: "center",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              maxWidth: 820,
              textAlign: "center",
            })}
          >
            <div>
              <p
                css={s((t) => ({
                  fontFamily: t.font.secondary.family,
                  fontSize: [16],
                  fontStyle: "italic",
                  letterSpacing: "0.25em",
                  marginBottom: [t.spacing.sm, null, t.spacing.md],
                  textTransform: "uppercase",
                }))}
              >
                {t("expertsPage:header.label")}
              </p>
              <h1 css={s(headingBravo)}>
                <Trans i18nKey="expertsPage:header.title" />
              </h1>
            </div>
          </div>
        </header>

        {featuredExperts?.map(({ expert, image }, index) => {
          if (!expert) return null;

          return (
            <section key={index} css={s(gutterBottom)}>
              <Grid
                direction={index % 2 == 0 ? "rtl" : "ltr"}
                gx={theme.spacing.md}
                gy={theme.spacing.xl}
                itemWidth={["100%", null, "50%"]}
              >
                <Item>
                  {image && (
                    <>
                      <div
                        css={s({
                          display: ["none", null, "block"],
                          height: [null, null, 500, 600],
                          position: "relative",
                          width: "100%",
                        })}
                      >
                        <ResponsiveImage
                          alt=""
                          src={image.url}
                          layout="fill"
                          objectFit="cover"
                          quality={50}
                          sizes={"50vw"}
                        />
                      </div>
                      <div css={s({ display: [null, null, "none"] })}>
                        <ResponsiveImage
                          alt=""
                          src={image.url}
                          height={1154}
                          sizes="100vw"
                          width={1576}
                        />
                      </div>
                    </>
                  )}
                </Item>
                <Item
                  _css={s({
                    alignItems: index % 2 == 0 ? "flex-end" : "flex-start",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: "1",
                    justifyContent: "center",
                    textAlign: ["center", null, "left"],
                  })}
                >
                  <div
                    css={s((t) => ({
                      maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                      paddingLeft:
                        index % 2 == 0
                          ? [t.spacing.md, t.spacing.xl, t.spacing.xxl]
                          : [
                              t.spacing.md,
                              t.spacing.xl,
                              null,
                              t.spacing.xxl,
                              t.spacing.xxxl,
                            ],
                      paddingRight:
                        index % 2 == 0
                          ? [
                              t.spacing.md,
                              t.spacing.xl,
                              null,
                              t.spacing.xxl,
                              t.spacing.xxxl,
                            ]
                          : [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                      width: "100%",
                    }))}
                  >
                    <h3
                      css={s(headingAlpha, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {expert.name && <RichTextFragment render={expert.name} />}
                    </h3>
                    <p
                      css={s(bodyText, (t) => ({
                        fontFamily: t.font.secondary.family,
                        fontStyle: "italic",
                        marginBottom: t.spacing.lg,
                      }))}
                    >
                      {expert.postNominal && (
                        <>
                          <RichTextFragment render={expert.postNominal} />
                          {", "}
                        </>
                      )}
                      {expert.role && <RichTextFragment render={expert.role} />}
                    </p>
                    <p
                      css={s(bodyTextStatic, (t) => ({
                        marginBottom: t.spacing.lg,
                      }))}
                    >
                      {hasContent(expert.summary) && (
                        <RichText render={expert.summary} />
                      )}
                    </p>
                    <Link
                      to={`/science/experts/${expert._meta.uid}`}
                      css={s(textButton())}
                    >
                      {t("expertsPage:experts.link")}
                    </Link>
                  </div>
                </Item>
              </Grid>
            </section>
          );
        })}

        <section
          css={s(gutterBottom, gutterX, (t) => ({
            backgroundColor: t.color.background.base,
            color: t.color.text.dark.base,
            textAlign: "center",
          }))}
        >
          <div css={s(belt, { maxWidth: 640 })}>
            <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
              {t("expertsPage:experts.title")}
            </h2>
            <p
              css={s(bodyTextStatic, (t) => ({ marginBottom: t.spacing.xxl }))}
            >
              {t("expertsPage:experts.text")}
            </p>
          </div>
          <div css={s(belt)}>
            <Grid
              align="center"
              gx={[theme.spacing.xl, null, theme.spacing.xl, theme.spacing.xxl]}
              gy={theme.spacing.xxl}
              itemWidth={["100%", null, "33.333333%"]}
            >
              {experts?.map(({ expert }, index) => (
                <Item key={index}>
                  {expert.image && (
                    <div
                      css={s({
                        "& img": {
                          borderRadius: 250,
                        },
                        flexShrink: 0,
                        margin: "auto",
                        maxWidth: 250,
                        width: "100%",
                      })}
                    >
                      <ResponsiveImage
                        alt=""
                        width={500}
                        height={500}
                        sizes={{ width: "100vw" }}
                        src={expert.image.url}
                      />
                    </div>
                  )}
                  <h3
                    css={s(headingDelta, (t) => ({
                      marginBottom: t.spacing.xs,
                      marginTop: t.spacing.md,
                    }))}
                  >
                    {expert.name && <RichTextFragment render={expert.name} />}
                  </h3>
                  <p
                    css={s(bodyTextStatic, (t) => ({
                      marginBottom: t.spacing.sm,
                      maxWidth: 280,
                      ...mx("auto"),
                    }))}
                  >
                    {expert.postNominal && (
                      <>
                        <RichTextFragment render={expert.postNominal} />
                        {", "}
                      </>
                    )}
                    {expert.role && <RichTextFragment render={expert.role} />}
                  </p>
                  <Link
                    to={`/science/experts/${expert._meta.uid}`}
                    css={s(textButton())}
                  >
                    {t("expertsPage:experts.link")}
                  </Link>
                </Item>
              ))}
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature1,
            textAlign: "center",
            ...py([90, t.spacing.xxxl, null, 160]),
          }))}
        >
          <div css={s(belt)}>
            <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
              {t("expertsPage:resource.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
                ...mx("auto"),
                maxWidth: 720,
              }))}
            >
              {t("expertsPage:resource.text")}
            </p>
            <Grid
              gx={[spacing.md, null, spacing.lg, spacing.xl]}
              itemWidth={["100%", null, "33.33333%"]}
            >
              <Item>
                <div
                  css={s({
                    margin: "auto",
                    maxWidth: 250,
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      width: "100vw",
                    }}
                    src={RESEARCH_IMG}
                  />
                </div>
                <h3
                  css={s(headingCharlie, (t) => ({
                    marginBottom: t.spacing.sm,
                    marginTop: t.spacing.lg,
                  }))}
                >
                  {t("expertsPage:resource.tasks.research.title")}
                </h3>
                <p css={s(bodyTextStatic, { maxWidth: 400, ...mx("auto") })}>
                  {t("expertsPage:resource.tasks.research.text")}
                </p>
              </Item>
              <Item _css={s((t) => ({ marginTop: [t.spacing.xl, null, 0] }))}>
                <div
                  css={s({
                    margin: "auto",
                    maxWidth: 250,
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      width: "100vw",
                    }}
                    src={SAFETY_IMG}
                  />
                </div>
                <h3
                  css={s(headingCharlie, (t) => ({
                    marginBottom: t.spacing.sm,
                    marginTop: t.spacing.lg,
                  }))}
                >
                  {t("expertsPage:resource.tasks.safety.title")}
                </h3>
                <p css={s(bodyTextStatic, { maxWidth: 400, ...mx("auto") })}>
                  {t("expertsPage:resource.tasks.safety.text")}
                </p>
              </Item>
              <Item _css={s((t) => ({ marginTop: [t.spacing.xl, null, 0] }))}>
                <div
                  css={s({
                    margin: "auto",
                    maxWidth: 250,
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      width: "100vw",
                    }}
                    src={TRIALS_IMG}
                  />
                </div>
                <h3
                  css={s(headingCharlie, (t) => ({
                    marginBottom: t.spacing.sm,
                    marginTop: t.spacing.lg,
                  }))}
                >
                  {t("expertsPage:resource.tasks.trials.title")}
                </h3>
                <p css={s(bodyTextStatic, { maxWidth: 400, ...mx("auto") })}>
                  {t("expertsPage:resource.tasks.trials.text")}
                </p>
              </Item>
            </Grid>
          </div>
        </section>

        {/* blog */}
        <aside css={s(gutter)}>
          <h2
            css={s(headingAlpha, (t) => ({
              marginBottom: [t.spacing.xl, null, t.spacing.xxl],
              textAlign: "center",
            }))}
          >
            {t("expertsPage:latestWriting")}
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
            {articles.map((article) => (
              <Item key={article._meta.uid}>
                <Link to={`/blog/${article._meta.uid}`}>
                  <ArticlePageListingItem
                    {...article}
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
        </aside>
      </main>
    </Standard>
  );
};

export default ExpertsPage;

export const getStaticProps = makeStaticPropsGetter<ExpertsPageProps>(
  async (_context, { apolloClient }) => {
    const [{ EXPERTS_PAGE }, { ARTICLE_PAGES }] = await Promise.all([
      import("../../../cms/experts"),
      import("@/modules/articles/article-queries"),
    ]);

    const result = await Promise.all([
      apolloClient.query<ArticlePageListingData, ArticlePageListingVariables>({
        fetchPolicy: "no-cache",
        query: ARTICLE_PAGES,
        variables: {
          first: 3,
          tags: [ArticlePageTag.BLOG],
        },
      }),
      apolloClient.query<ExpertsPageData>({
        fetchPolicy: "no-cache",
        query: EXPERTS_PAGE,
      }),
    ]);
    throwGraphQLErrors(result);

    const [articles, experts] = result;

    if (!experts.data?.expertsPage) {
      throw new Error("Unexpected missing 'experts_page' singleton type");
    }

    return {
      props: {
        articles: articles.data.articlePages.edges.map(
          ({ node: article }) => article
        ),
        data: experts.data.expertsPage,
      },
      revalidate: 5 * 60,
    };
  }
);
