import { NextPageWithApollo, throwGraphQLErrors } from "@sss/apollo";
import { useInView } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { ArticlePageTag, RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { motion, Variants } from "framer-motion";
import React, { FC } from "react";
import { Trans } from "react-i18next";
import { secondaryButton } from "src/ui/base/button";
import Hero from "src/ui/base/hero";
import Icon from "src/ui/base/icon";
import LazyAnimation from "src/ui/base/lazy-animation";
import ResponsiveImage from "src/ui/base/responsive-image";
import book from "src/ui/icons/book";
import chartMag from "src/ui/icons/chartMag";
import { theme } from "src/ui/styles/theme";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  percentage,
  px,
  py,
  s,
  size,
  StyleFn,
} from "@/common/ui/utils";
import {
  ArticlePageCore,
  ArticlePageListingData,
  ArticlePageListingVariables,
} from "@/modules/articles/article-queries";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import EVIDENCE_IMG from "../../../assets/images/science/evidence-img.jpg";
import HEADER_TRANS_IMG from "../../../assets/images/science/HEADER_TRANS.png";
import HEADER_TRANS_MOBILE_IMG from "../../../assets/images/science/HEADER_TRANS_MOBILE.png";
import INGREDIENTS_IMG from "../../../assets/images/science/ingredients.jpg";
import {
  EvidencePage,
  EvidencePageData,
  returnReference,
  StudyCountData,
} from "../../../cms/evidence-page";
import { getIngredientTitle } from "../../../cms/ingredient";
import type { Study } from "../../../cms/study";
import { Grid, Item } from "../../../ui/base/grid";
import {
  bodyText,
  bodyTextSmall,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../../../ui/base/typography";
import ArticlePageListingItem from "../../../ui/modules/article-page/listing-item";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  articlesTitle: "Latest Writing",
  cta: "Read all studies",
  header: {
    text:
      "Our experts have assembled a catalogue of over 400 research publications verifying the health claims of every one of our ingredients",
    title: "Evidence & Research",
  },

  meta: {
    description:
      "Our experts have assembled a catalogue of over 400 research publications verifying the health claims of every one of our ingredients",
    openGraph: {
      description: "100% Of Our Ingredients Are Backed By Trusted Research",
      title: "All our ingredients have verified health claims",
    },
    title: "100% Of Our Ingredients Are Backed By Trusted Research | FOTP",
  },
  stats: {
    cta: "<sup>1</sup> Data from Banfield study",
    item: {
      dentalText: "<i>80%</i> have dental disease by 3",
      dentalTitle: "Dental",
      digestionText:
        "<i>50% rise</i> in gastrointestinal problems over past 5 years",
      digestionTitle: "Digestion",
      jointsText: "<i>66% rise</i> in arthritis over past decade",
      jointsTitle: "Joints",
      obText: "<i>1 in 3</i> dogs are now clinically obese<sup>1</sup>",
      obTitle: "Obesity",
      skinText: "<i>1 in 4</i> vet visits is for a skin complaint",
      skinTitle: "Skin Issues",
      stressText: "<i>1 in 3</i> suffer from canine anxiety",
      stressTitle: "Stress",
    },
    strapline1:
      "Canine health is in decline. And the most painful thing? It doesn’t need to be this way.",
    strapline2:
      "In fact, the most common diagnoses made by US veterinarians are preventable with the right support.",
    title: "Our experts identify and target important trends in dog health",
  },
  studies: {
    doubleBlind: "Double-blind",
    institute: "Institute",
    keyFindings: "Key findings",

    length: "Length",
    participants: "Participants",
    placeboControlled: "Placebo-controlled",
    randomised: "Randomized",
    study: "Study",
    type: "Type",
    view: "View all studies",
  },
  trusted: {
    stat1: "{{ totalStudies }} rigorously backed research publications",
    stat2:
      "{{ directlyFocusedStudies }} studies for our exact branded ingredients",
    text:
      "Most dog supplements rely on generic ingredients and anecdotal claims. We’re taking the opposite approach, to guarantee that all of our ingredients are backed by verifiable research publications.",
    title: "We ensure every ingredient is backed by trusted research",
  },
};

const statItems = [
  {
    keyText: "jointsText",
    keyTitle: "jointsTitle",
  },
  {
    keyText: "stressText",
    keyTitle: "stressTitle",
  },
  {
    keyText: "dentalText",
    keyTitle: "dentalTitle",
  },
  {
    keyText: "obText",
    keyTitle: "obTitle",
  },
  {
    keyText: "skinText",
    keyTitle: "skinTitle",
  },
  {
    keyText: "digestionText",
    keyTitle: "digestionTitle",
  },
];

const trustedFigure = {
  alignItems: ["center", null, "flex-start"],
  display: "flex",
  flexFlow: ["row", null, "column"],
  justifyContent: "flex-start",
  textAlign: "left",
};

const trustedCaption: StyleFn = (t) => ({
  fontWeight: "bold",
  marginTop: [null, null, t.spacing.xs],
  maxWidth: ["60%", null, "90%"],
  paddingLeft: [t.spacing.sm, null, 0],
});

const KeyStudy: FC<{ index: number; study: Study; totalStudies: number }> = ({
  index,
  study,
}) => {
  const isEven = !(index % 2);
  const ingredientTitle = study.focus && getIngredientTitle(study.focus);

  return (
    <div
      css={s(belt, (t) => ({
        marginTop: index > 0 ? t.spacing.xxl : 0,
        paddingTop: index > 0 ? t.spacing.xxl : 0,
      }))}
      key={index}
    >
      <div
        css={s((t) => ({
          alignItems: "center",
          display: "flex",
          marginBottom: [t.spacing.xl, null, t.spacing.xxl],
        }))}
      >
        {study.focus?.image && (
          <div
            css={s((t) => ({
              flexShrink: 0,
              marginRight: [t.spacing.sm, null, t.spacing.md],
              width: [72, null, 84],
            }))}
          >
            <ResponsiveImage
              alt=""
              width={168}
              height={168}
              sizes={{ width: 168 }}
              src={study.focus.image.url}
            />
          </div>
        )}
        <h2>
          {ingredientTitle && (
            <span
              css={s(headingBravo, (t) => ({
                display: "block",
                fontSize: [22, 28, 36],
                marginBottom: t.spacing.xxs,
              }))}
            >
              {ingredientTitle}
            </span>
          )}
          <span
            css={s(bodyText, (t) => ({
              display: "block",
              fontWeight: t.font.primary.weight.medium,
              lineHeight: "1.2em",
            }))}
          >
            {study.focus?.summary && (
              <RichTextFragment render={study.focus.summary} />
            )}
          </span>
        </h2>
      </div>
      <Grid
        _css={s({ position: "relative" })}
        direction={isEven ? "ltr" : "rtl"}
        key={index}
        gx={(t) => [t.spacing.xl, null, t.spacing.xl]}
      >
        <Item
          _css={s({
            minHeight: ["none", null, null, 460],
          })}
          width={["100%", null, null, "49%"]}
        >
          <p
            css={s(headingCharlie, (t) => ({
              marginBottom: [t.spacing.sm, null, t.spacing.lg, t.spacing.xl],
            }))}
          >
            {study.message && <RichTextFragment render={study.message} />}
          </p>
          {study.diagram && (
            <div
              css={s((t) => ({
                left: isEven ? "initial" : 0,
                paddingLeft: isEven ? [0, null, null, t.spacing.md] : 0,
                paddingRight: isEven ? 0 : [0, null, null, t.spacing.md],
                position: ["static", null, null, "absolute"],
                right: isEven ? 0 : "initial",
                textAlign: "center",
                top: 0,
                width: ["auto", null, null, "50%"],
                ...py([t.spacing.xl, null, null, 0]),
              }))}
            >
              <div
                css={s({
                  flexShrink: 0,
                  maxWidth: ["88vw", null, "44vw"],
                })}
              >
                <ResponsiveImage
                  alt=""
                  width={1280}
                  height={923}
                  sizes={{ width: "100vw" }}
                  src={study.diagram.url}
                />
              </div>
            </div>
          )}
          <div
            css={s((t) => ({
              borderTop: `1px solid ${t.color.border.light}`,
              marginTop: [0, null, null, t.spacing.lg],
              paddingBottom: [t.spacing.lg, null, null, t.spacing.xl],
              paddingTop: t.spacing.sm,
            }))}
          >
            <p
              css={s(bodyTextSmall, (t) => ({
                fontWeight: t.font.primary.weight.medium,
                lineHeight: ["20px", null, "22px"],
              }))}
            >
              <a
                href={study.link?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {study.title && <RichTextFragment render={study.title} />}
              </a>
            </p>
            <p
              css={s((t) => ({
                fontSize: [12, null, 14],
                fontStyle: "italic",
                marginTop: t.spacing.xs,
              }))}
            >
              {returnReference(study)}
            </p>
          </div>
          <Link css={s(secondaryButton())} to="/science/evidence/studies">
            <Trans i18nKey="evidenceSummaryPage:cta" />
          </Link>
        </Item>
        <Item width={["100%", null, null, "51%"]} />
      </Grid>
    </div>
  );
};

const MotionGrid = motion.custom(Grid);
const MotionItem = motion.custom(Item);

const statsContainer: Variants = {
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    transition: { delayChildren: 0.05, staggerChildren: 0.08 },
  },
};

const statsItem: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
    y: 50,
  },
  visible: {
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
    y: 0,
  },
};

interface EvidenceSummaryPageProps {
  articles: ArticlePageCore[];
  directlyFocusedStudies: number;
  evidence: EvidencePage;
  totalStudies: number;
}

export const EvidenceSummaryPage: NextPageWithApollo<EvidenceSummaryPageProps> = ({
  articles,
  directlyFocusedStudies,
  evidence: { keyStudies },
  totalStudies,
}) => {
  const { i18n, t } = useLocale();

  const [statsRef, statsInView] = useInView({
    rootMargin: "-20% 0px",
    triggerOnce: true,
  });

  i18n.addResourceBundle("en-US", "evidenceSummaryPage", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("evidenceSummaryPage:meta.description")}
        title={t("evidenceSummaryPage:meta.title")}
        openGraph={{
          description: t("evidenceSummaryPage:meta.openGraph.description"),
          image: EVIDENCE_IMG.src,
          title: t("evidenceSummaryPage:meta.openGraph.title"),
        }}
      />
      <main>
        {/* header */}
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature4,
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
                {t("evidenceSummaryPage:header.title")}
              </p>
              <h1 css={s(headingBravo)}>
                <Trans i18nKey="evidenceSummaryPage:header.text" />
              </h1>
            </div>
          </div>
        </header>

        {/* content block */}
        <LazyAnimation>
          <section css={s(gutterBottom)}>
            <Grid
              direction={"ltr"}
              gx={(t) => t.spacing.lg}
              gy={(t) => t.spacing.xl}
              itemWidth={["100%", null, "50%"]}
            >
              <Item>
                <div
                  css={s({
                    display: ["none", null, "block"],
                    height: [null, null, 500, 669],
                    position: "relative",
                    width: "100%",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    sizes={{
                      width: ["100vw", null, "50vw"],
                    }}
                    src={INGREDIENTS_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, "none"] })}>
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      width: ["100vw", null, "50vw"],
                    }}
                    src={INGREDIENTS_IMG}
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
                <div
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
                      textAlign: "left",
                    }))}
                  >
                    <Trans i18nKey="evidenceSummaryPage:trusted.title" />
                  </h2>
                  <p
                    css={s(bodyTextStatic, (t) => ({
                      marginBottom: t.spacing.md,
                    }))}
                  >
                    <Trans i18nKey="evidenceSummaryPage:trusted.text" />
                  </p>
                  <Grid
                    direction={"ltr"}
                    gx={[0]}
                    gy={[theme.spacing.md]}
                    itemWidth={["100%", null, "50%"]}
                  >
                    {[
                      { key: "stat1", path: book },
                      { key: "stat2", path: chartMag },
                    ].map(({ key, path }) => (
                      <Item key={key}>
                        <figure css={s(trustedFigure)}>
                          <Icon _css={s(size([30, null, 32]))} path={path} />
                          <figcaption css={s(trustedCaption)}>
                            <Trans
                              i18nKey={`evidenceSummaryPage:trusted.${key}`}
                              values={{
                                directlyFocusedStudies,
                                totalStudies,
                              }}
                            />
                          </figcaption>
                        </figure>
                      </Item>
                    ))}
                  </Grid>
                </div>
              </Item>
            </Grid>
          </section>
        </LazyAnimation>
        {/* studies */}
        <section
          css={s(gutterBottom, (t) => ({
            backgroundColor: t.color.background.base,
            color: t.color.text.dark.base,
            ...px([t.spacing.md, null, t.spacing.xxl]),
          }))}
        >
          {keyStudies?.map(({ study }, index) => (
            <LazyAnimation key={index}>
              <KeyStudy
                index={index}
                study={study}
                totalStudies={totalStudies}
              />
            </LazyAnimation>
          ))}
        </section>
        {/* stats */}
        <section
          css={s((t) => ({
            backgroundColor: t.color.background.feature5,
            marginBottom: t.spacing.xxl,
          }))}
        >
          <Grid
            _css={s(belt, gutter)}
            gx={theme.spacing.xl}
            gy={theme.spacing.xl}
            itemWidth={["100%", null, "50%"]}
          >
            <Item>
              <LazyAnimation>
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                    maxWidth: "500px",
                  }))}
                >
                  {t("evidenceSummaryPage:stats.title")}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("evidenceSummaryPage:stats.strapline1")}
                </p>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("evidenceSummaryPage:stats.strapline2")}
                </p>

                <a
                  target="_blank"
                  css={s(headingEcho, (t) => ({
                    "& > sup": {
                      borderBottom: "0px",
                    },
                    borderBottom: `1px solid ${t.color.border.dark}`,
                    textDecoration: "none",
                  }))}
                  href="https://www.banfield.com/pet-health/state-of-pet-health"
                  rel="noopener noreferrer"
                >
                  <Trans i18nKey="evidenceSummaryPage:stats.cta" />
                </a>
              </LazyAnimation>
            </Item>
            <Item>
              <MotionGrid
                animate={statsInView ? "visible" : "hidden"}
                gy={(t) => t.spacing.lg}
                gx={(t) => t.spacing.xl}
                initial="hidden"
                itemWidth={[percentage(1 / 2), null, null, percentage(1 / 3)]}
                ref={statsRef}
                variants={statsContainer}
              >
                {statItems.map((item, index) => (
                  <MotionItem key={index} variants={statsItem}>
                    <h3
                      css={s(headingEcho, (t) => ({
                        borderBottom: `1px solid ${t.color.border.dark}`,
                        display: "block",
                        fontSize: [12, null, 14],
                        fontWeight: "normal",
                        letterSpacing: "2px",
                        marginBottom: t.spacing.md,
                        paddingBottom: t.spacing.xs,
                        textTransform: "uppercase",
                        width: "90%",
                      }))}
                    >
                      {t(`evidenceSummaryPage:stats.item.${item.keyTitle}`)}
                    </h3>
                    <p
                      css={s(headingDelta, {
                        "& i": {
                          fontStyle: "italic",
                          fontWeight: "normal",
                        },
                        "& sup": {
                          fontSize: [14],
                          fontWeight: "normal",
                        },
                      })}
                    >
                      <Trans
                        i18nKey={`evidenceSummaryPage:stats.item.${item.keyText}`}
                      />
                    </p>
                  </MotionItem>
                ))}
              </MotionGrid>
            </Item>
          </Grid>
        </section>

        {/* blog */}
        <LazyAnimation>
          <aside css={s(gutter)}>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                textAlign: "center",
              }))}
            >
              {t("evidenceSummaryPage:articlesTitle")}
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
        </LazyAnimation>
      </main>
    </Standard>
  );
};

export default EvidenceSummaryPage;

export const getStaticProps = makeStaticPropsGetter<EvidenceSummaryPageProps>(
  async (_context, { apolloClient }) => {
    const evidenceHandle = "summary";

    const { ARTICLE_PAGES } = await import(
      "@/modules/articles/article-queries"
    );
    const { EVIDENCE_PAGE, STUDY_COUNT } = await import(
      "../../../cms/evidence-page"
    );

    const result = await Promise.all([
      apolloClient.query<ArticlePageListingData, ArticlePageListingVariables>({
        fetchPolicy: "no-cache",
        query: ARTICLE_PAGES,
        variables: {
          first: 3,
          tags: [ArticlePageTag.BLOG],
        },
      }),
      apolloClient.query<EvidencePageData>({
        fetchPolicy: "no-cache",
        query: EVIDENCE_PAGE,
        variables: {
          handle: evidenceHandle,
        },
      }),
      apolloClient.query<StudyCountData>({
        fetchPolicy: "no-cache",
        query: STUDY_COUNT,
      }),
    ]);
    throwGraphQLErrors(result);

    const [articles, evidence, studyCount] = result;

    if (!evidence?.data?.evidencePage) {
      throw new Error(
        `Unexpected missing 'evidence_page' type with handle "${evidenceHandle}""`
      );
    }

    const totalStudies = studyCount?.data?.studies?.totalCount ?? null;
    const directlyFocusedStudies =
      studyCount?.data?.directlyFocusedStudies?.totalCount ?? null;
    if (totalStudies === null || directlyFocusedStudies == null) {
      throw new Error("Unexpected missing study count");
    }

    return {
      props: {
        articles: articles.data.articlePages.edges.map(
          ({ node: article }) => article
        ),
        directlyFocusedStudies,
        evidence: evidence.data.evidencePage,
        totalStudies,
      },
      revalidate: 5 * 60,
    };
  }
);
