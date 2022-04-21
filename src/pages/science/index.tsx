import { runServerSideQuery, throwGraphQLErrors } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { ArticlePageTag } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React, { FC } from "react";
import Hero from "src/ui/base/hero";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  mx,
  percentage,
  px,
  py,
  s,
  size,
} from "@/common/ui/utils";
import {
  ArticlePageCore,
  ArticlePageListingData,
  ArticlePageListingVariables,
} from "@/modules/articles/article-queries";

import { makeStaticPropsGetter } from "../../../pages/_app";
import HEADER_TRANS_IMG from "../../assets/images/science/HEADER_TRANS.png";
import HEADER_TRANS_MOBILE_IMG from "../../assets/images/science/HEADER_TRANS_MOBILE.png";
import SCIENCE_SOURCING_IMG from "../../assets/images/science/sourcing.png";
import SCIENCE_SURGEON_IMG from "../../assets/images/science/surgeon.png";
import { textButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import Icon, { iconBackground, iconBorder } from "../../ui/base/icon";
import Logo from "../../ui/base/logo";
import ResponsiveImage from "../../ui/base/responsive-image";
import { squiggleX } from "../../ui/base/squiggle";
import {
  bodyText,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingEcho,
} from "../../ui/base/typography";
import cross from "../../ui/icons/cross";
import question from "../../ui/icons/question";
import tick from "../../ui/icons/tick";
import ArticlePageListingItem from "../../ui/modules/article-page/listing-item";
import { theme } from "../../ui/styles/theme";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  compare: {
    false: "No",
    item: {
      binders: "No binders, fillers or additives",
      clinicallyProven: "Clinically proven ingredients",
      standarized: "Standardized extracts",
      testing: "Rigorous third party testing",
      traceable: "100% traceable",
    },
    others: "Other dog supplements",
    text:
      "Many supplement companies source their ingredients indirectly from low-cost, low-quality suppliers. We’re taking the opposite approach, and in time, we hope others will follow.",
    title: "A New Standard In Dog Supplements",
    true: "Yes",
    unknown: "Unknown",
  },
  credibility: {
    ctaLabel: "Our Experts",
    text:
      "Our Science Advisory Board brings together the brightest minds in biochemistry, immunology, animal nutrition and veterinary science.",
    title: "Credibility",
  },
  evidence: {
    ctaLabel: "Our Evidence",
    text:
      "Our supplement ingredients are patented and proven, which means you can be confident that they’ll do exactly what they claim",
    title: "Evidence",
  },
  header: {
    text:
      "Unconditional love deserves uncompromising science: our products stand up to scrutiny, and our supplement ingredients have clinical proof behind their claims.",
    title: "Our Approach",
  },
  latestWriting: "Latest Writing",
  meta: {
    description:
      "Unconditional love deserves uncompromising science: our products stand up to scrutiny, and our ingredients have clinical proof behind their claims.",
    openGraph: {
      description: "Unconditional love deserves uncompromising science.",
      title: "A New Standard In Dog Supplements | Front of the Pack",
    },
    title: "Our Approach",
  },
  sourcing: {
    ctaLabel: "Our Ingredients",
    text:
      "We’ve scoured the globe for the very best. Our supply chain proudly spans 3 continents, 7 countries and 10 industry-leading suppliers.",
    title: "Sourcing",
  },
  transparency: {
    ctaLabel: "Our Testing",
    text:
      "We only partner with industry leading suppliers who can guarantee safety and tracebility on all their products",
    title: "Transparency",
  },
};

enum ComparisonItemType {
  FALSE = "false",
  TRUE = "true",
  UNKNOWN = "unknown",
}

const comparisonItems = [
  {
    key: "clinicallyProven",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "standarized",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "binders",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "testing",
    them: ComparisonItemType.FALSE,
    us: ComparisonItemType.TRUE,
  },
  {
    key: "traceable",
    them: ComparisonItemType.UNKNOWN,
    us: ComparisonItemType.TRUE,
  },
];

interface OurApproachProps {
  articles: ArticlePageCore[];
}

export const OurApproach: FC<OurApproachProps> = ({ articles }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "OurApproach", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("OurApproach:meta.description")}
        title={t("OurApproach:meta.title")}
        openGraph={{
          description: t("OurApproach:meta.openGraph.description"),
          image: SCIENCE_SOURCING_IMG.src,
          title: t("OurApproach:meta.openGraph.title"),
        }}
      />
      <main>
        {/* header */}
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature1,
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
              <h1
                css={s((t) => ({
                  fontFamily: t.font.secondary.family,
                  fontSize: [16],
                  fontStyle: "italic",
                  letterSpacing: "0.25em",
                  marginBottom: [t.spacing.sm, null, t.spacing.md],
                  textTransform: "uppercase",
                }))}
              >
                {t("OurApproach:header.title")}
              </h1>
              <p css={s(headingBravo)}>{t("OurApproach:header.text")}</p>
            </div>
          </div>
        </header>

        {/* content block */}
        <div css={s(gutterBottom)}>
          <Grid
            direction="ltr"
            gx={theme.spacing.md}
            gy={theme.spacing.xl}
            itemWidth={["100%", null, "50%"]}
          >
            <Item>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: [null, null, 500, 655],
                  position: "relative",
                  width: "100%",
                })}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes={{
                    maxWidth: [null, null, 789],
                    width: ["100vw", "100vw", "100vw"],
                  }}
                  src={SCIENCE_SOURCING_IMG}
                />
              </div>
              <div css={s({ display: [null, null, "none"] })}>
                <ResponsiveImage
                  alt=""
                  src={SCIENCE_SOURCING_IMG}
                  sizes="100vw"
                />
              </div>
            </Item>
            <Item
              _css={s({
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
                textAlign: "left",
              })}
            >
              <section
                css={s((t) => ({
                  maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                  paddingLeft: [
                    t.spacing.md,
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  paddingRight: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                  width: "100%",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:sourcing.title")}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:sourcing.text")}
                </p>
                <Link to="/science/ingredients" css={s(textButton())}>
                  {t("OurApproach:sourcing.ctaLabel")}
                </Link>
              </section>
              <section
                css={s((t) => ({
                  "&:before": {
                    ...squiggleX({ color: t.color.background.feature5 }),
                    content: "''",
                    display: "inline-block",
                    marginBottom: t.spacing.lg,
                    marginTop: t.spacing.xl,
                  },
                  maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                  paddingLeft: [
                    t.spacing.md,
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  paddingRight: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                  width: "100%",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:credibility.title")}{" "}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:credibility.text")}
                </p>
                <Link to="/science/experts" css={s(textButton())}>
                  {t("OurApproach:credibility.ctaLabel")}
                </Link>
              </section>
            </Item>
          </Grid>
        </div>

        {/* content block */}
        <div css={s(gutterBottom)}>
          <Grid
            direction={"rtl"}
            gx={theme.spacing.md}
            gy={theme.spacing.xl}
            itemWidth={["100%", null, "50%"]}
          >
            <Item>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: [null, null, 500, 655],
                  position: "relative",
                  width: "100%",
                })}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes={{
                    maxWidth: [null, null, 789],
                    width: ["100vw", "100vw", "100vw"],
                  }}
                  src={SCIENCE_SURGEON_IMG}
                />
              </div>
              <div css={s({ display: [null, null, "none"] })}>
                <ResponsiveImage
                  alt=""
                  sizes="100vw"
                  src={SCIENCE_SURGEON_IMG}
                />
              </div>
            </Item>
            <Item
              _css={s({
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
                textAlign: "left",
              })}
            >
              <section
                css={s((t) => ({
                  maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                  paddingLeft: [
                    t.spacing.md,
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  paddingRight: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                  width: "100%",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:evidence.title")}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:evidence.text")}
                </p>
                <Link to="/science/evidence" css={s(textButton())}>
                  {t("OurApproach:evidence.ctaLabel")}
                </Link>
              </section>
              <section
                css={s((t) => ({
                  "&:before": {
                    ...squiggleX({ color: t.color.background.feature5 }),
                    content: "''",
                    display: "inline-block",
                    marginBottom: t.spacing.lg,
                    marginTop: t.spacing.xl,
                  },
                  maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                  paddingLeft: [
                    t.spacing.md,
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  paddingRight: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                  width: "100%",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:transparency.title")}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("OurApproach:transparency.text")}
                </p>
                <Link
                  to="/science/testing-and-transparency"
                  css={s(textButton())}
                >
                  {t("OurApproach:transparency.ctaLabel")}
                </Link>
              </section>
            </Item>
          </Grid>
        </div>

        {/* table */}
        <section css={s(gutterX, gutterBottom, { textAlign: "center" })}>
          <div css={s(belt, { maxWidth: 840 })}>
            <h2
              css={s(headingAlpha, (t) => ({
                fontSize: [32, 36, 42, 48],
                lineHeight: ["36px", "38px", "48px", "54px"],
                marginBottom: [t.spacing.sm, t.spacing.md, t.spacing.md],
              }))}
            >
              {t("OurApproach:compare.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.xl,
                maxWidth: 800,
                ...mx("auto"),
                textAlign: "center",
              }))}
            >
              {t("OurApproach:compare.text")}
            </p>
          </div>
          <div
            css={s(belt, (t) => ({
              borderColor: t.color.tint.algae,
              borderRadius: t.radius.md,
              borderStyle: "solid",
              borderWidth: [0, 0, 1],
              width: "100%",
              ...px([null, null, t.spacing.xxxl]),
              ...py([null, null, null]),
            }))}
          >
            <table
              css={s({
                tableLayout: "fixed",
                width: "100%",
              })}
            >
              <colgroup>
                <col css={s({ width: ["48%", null, "50%"] })} span={1} />
                <col css={s({ width: ["26%", null, "25%"] })} span={1} />
                <col css={s({ width: ["26%", null, "25%"] })} span={1} />
              </colgroup>
              <thead>
                <tr>
                  <td />
                  <td
                    css={s((t) => ({
                      ...py([null, null, t.spacing.sm]),
                      backgroundColor: t.color.background.feature1,
                    }))}
                  >
                    &nbsp;
                  </td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <th
                    css={s(headingEcho, (t) => ({
                      ...py([null, null, t.spacing.md]),
                      backgroundColor: t.color.background.feature1,
                    }))}
                  >
                    <Logo
                      _css={s({
                        height: [48, null, 60],
                        width: "auto",
                      })}
                      fill="currentColor"
                    />
                  </th>
                  <th css={s(headingEcho, (t) => py(t.spacing.md))}>
                    {t(`OurApproach:compare.others`)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, index) => (
                  <tr
                    css={s((t) => ({
                      borderBottom: `solid 1px ${t.color.tint.algae}`,
                    }))}
                    key={index}
                  >
                    <td
                      css={s(bodyText, (t) => ({
                        fontSize: [14, 16, 18],
                        fontWeight: t.font.primary.weight.medium,
                        ...py(t.spacing.md),
                        paddingRight: t.spacing.md,
                        textAlign: "left",
                        wordWrap: "break-word",
                      }))}
                    >
                      {t(`OurApproach:compare.item.${item.key}`)}
                    </td>
                    <td
                      css={s((t) => ({
                        backgroundColor: t.color.background.feature1,
                        color: t.color.state.success,
                        ...py(t.spacing.md),
                      }))}
                    >
                      <div>
                        <div css={s(iconBackground)}>
                          {item?.us === ComparisonItemType.TRUE ? (
                            <Icon
                              _css={s(size([14, null, 16]), { color: "white" })}
                              path={tick}
                              title={t("OurApproach:compare.true")}
                            />
                          ) : (
                            <Icon
                              _css={s(size([14, null, 16]), { color: "white" })}
                              path={question}
                              title={t("OurApproach:compare.unknown")}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      css={s((t) => ({
                        color: t.color.tint.sage,
                        ...py(t.spacing.md),
                      }))}
                    >
                      <div css={s(iconBorder)}>
                        {item.them && item.them === "false" ? (
                          <Icon
                            _css={s(size([14, null, 16]), (t) => ({
                              color: t.color.state.alt,
                            }))}
                            path={cross}
                            title={t("OurApproach:compare.false")}
                          />
                        ) : (
                          <Icon
                            _css={s(size([14, null, 16]), (t) => ({
                              color: t.color.state.alt,
                            }))}
                            path={question}
                            title={t("OurApproach:compare.unknown")}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td
                    css={s((t) => ({
                      ...py([null, null, t.spacing.md]),
                      backgroundColor: [
                        "none",
                        "none",
                        t.color.background.feature1,
                      ],
                      display: ["none", "none", "block"],
                    }))}
                  >
                    &nbsp;
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* blog */}
        <aside css={s(gutterX, gutterBottom)}>
          <h2
            css={s(headingAlpha, (t) => ({
              marginBottom: [t.spacing.xl, null, t.spacing.xxl],
              textAlign: "center",
            }))}
          >
            {t("OurApproach:latestWriting")}
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

export default OurApproach;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { ARTICLE_PAGES } = await import(
      "@/modules/articles/article-queries"
    );
    const result = await runServerSideQuery<
      ArticlePageListingData,
      ArticlePageListingVariables
    >(apolloClient, {
      query: ARTICLE_PAGES,
      variables: {
        first: 3,
        tags: [ArticlePageTag.BLOG],
      },
    });
    throwGraphQLErrors(result);

    return {
      props: {
        articles: result.data.articlePages.edges.map(
          ({ node: article }) => article
        ),
      },
      revalidate: 5 * 60,
    };
  }
);
