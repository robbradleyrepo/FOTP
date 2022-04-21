import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import type { CollectionData } from "@sss/ecommerce/collection";
import { useTimedLoop } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { motion, Variants } from "framer-motion";
import React from "react";
import { Trans } from "react-i18next";
import ResponsiveImage from "src/ui/base/responsive-image";
import ProductListingItem from "src/ui/modules/products/listing-item";
import Standard from "src/ui/templates/standard";

import {
  belt,
  greedy,
  gutter,
  mx,
  percentage,
  px,
  py,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import BULLDOG_IMG from "../../assets/images/mission/BULLDOG.jpg";
import CLOUD_IMG from "../../assets/images/mission/CLOUD.png";
import GOLDEN_IMG from "../../assets/images/mission/GOLDEN.png";
import HERO_IMG from "../../assets/images/mission/HERO.jpg";
import LOVE_IMG from "../../assets/images/mission/LOVE_SCIENCE.png";
import OG_IMG from "../../assets/images/mission/OPENGRAPH.jpg";
import SARAH_IMG from "../../assets/images/mission/SARAH.jpg";
import { textButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import Hero from "../../ui/base/hero";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingEcho,
} from "../../ui/base/typography";

const enUsResource = {
  bio: {
    image: "Your love • Our science",
    text:
      "And we made it our mission to put the power back in your hands. By doing away with pseudoscience and embracing next-level standards, we’ve developed dog food and supplements deserving of your bestie and the unconditional love you share with them.",
    title: "So, we started<br /> Front Of The Pack",
  },
  claim: {
    text:
      "But scrape below the surface and you’ll find they use untested ingredients, are jam-packed with fillers and aren’t backed up by any clinical research whatsoever. Put simply, they’re a waste of your time and money.",
    title: "<i>Sure.</i> Plenty of products claim to help. ",
  },
  header: {
    strapline:
      "A team of vets, biochemists and dog lovers leading the revolution on pet nutrition. But first, a little on how we got here.",
    title: "<i>Hi.</i> We're<br /> Front Of The Pack.",
  },
  intro: {
    text:
      "The love you share with your dog is one of the most <i>positive</i> forces on the planet.",
    title: "It all begins with love",
  },
  meta: {
    description:
      "We're a team of world-leading vets, biochemists and dog lovers leading the pet nutrition revolution. Your unconditional love deserves our uncompromising science.",
    openGraph: {
      description: "We're a team of leading vets, biochemists & dog lovers",
      title: "Discover The Story Behind Front Of The Pack | FOTP",
    },
    title: "Discover The Story Behind Front Of The Pack Dog Supplements",
  },
  odds: {
    text:
      "And we’re not just talking about shady ‘wellness’ trends and misinformation online. We’re talking about an outdated pet care industry that focuses more on reacting to problems, rather than preventing them before they arise. It’s no wonder pet parents are struggling to maintain their dogs’ health.",
    title: "The odds are stacked against pet parents",
  },
  products: {
    text:
      "We’ve combined patented technology and clinically-proven ingredients to develop a first-of-its-kind pure powder dog supplement.",
    title: "Say <i>hello</i> to our range of dog supplements",
  },
  testimonials: {
    first: {
      author: "Sarah & Billie",
      quote:
        "He's the best friend I've ever had. I love him like he were my baby.",
    },
    second: {
      author: "Jess & Barney",
      quote:
        "Barney’s been fart free for 2 months! Thanks to <i>The One</i>, his poops have been firmer and his flatulence haunts us no more.",
    },
  },
  why: {
    citation: "Data from Banfield study",
    stats: {
      anxiety: {
        bold: "1 in 3",
        text: "dogs suffer from canine anxiety",
      },
      arthritis: {
        bold: "66%",
        text: "rise in arthritis over the past decade",
      },
      dental: {
        bold: "80%",
        text: "of dogs have dental disease by age 3",
      },
      digestion: {
        bold: "50%",
        text: "rise in gut problems over past 5 years",
      },
      obesity: {
        bold: "1 in 3",
        text: "dogs are now clinically obese",
      },
      skin: {
        bold: "1 in 4",
        text: "vet visits is for a skin complaint",
      },
    },
    subtitle: "The latest stats",
    text1:
      "Canine health is in decline. And the most painful thing? It doesn’t need to be this way.",
    text2:
      "In fact, the most common diagnoses made by US veterinarians are preventable with the right nutritional diet and additional supplements for specific conditions.",
    title: "But there’s a problem. And it’s getting <i>bigger.</i>",
  },
};

const statsContainer: Variants = {
  hidden: {
    transition: { staggerChildren: 0.05 },
  },
  visible: {
    transition: { delayChildren: 0.5, staggerChildren: 0.1 },
  },
};

const stats: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
    y: 20,
  },
  visible: {
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
    y: 0,
  },
};

interface AboutProps {
  data: CollectionData;
}

const About: NextPageWithApollo<AboutProps> = ({ data }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "about", enUsResource);

  const currentStatsSlide = useTimedLoop([0, 1], 5000);

  const {
    collection: { products },
  } = data;

  return (
    <Standard>
      <Metadata
        description={t("about:meta.description")}
        title={t("about:meta.title")}
        openGraph={{
          description: t("about:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("about:meta.openGraph.title"),
        }}
      />
      <main>
        {/* header */}
        <header
          css={s((t) => ({
            color: t.color.text.light.base,
            height: ["auto", null, "100vh"],
            maxHeight: ["none", null, 640, 800],
            minHeight: [0, null, 640, null],
            position: "relative",
            width: "auto",
            ...py([t.spacing.xxxl, null, 0]),
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "cover",
                objectPosition: ["20% center", null, "top center"],
              },
              zIndex: -1,
            })}
            priority
            quality={60}
            urls={[HERO_IMG.src, null, HERO_IMG.src]}
          />
          <div
            css={s(belt, greedy, {
              height: "100%",
              maxWidth: 1440,
              position: "relative",
              zIndex: 5,
            })}
          >
            <div
              css={s({
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                textAlign: "center",
              })}
            >
              <div>
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.lg,
                    ...mx(["auto", null, 0]),
                    fontSize: [40, null, 54, 68],
                    lineHeight: 1,
                  }))}
                >
                  <Trans i18nKey="about:header.title" />
                </h1>
                <p
                  css={s(headingBravo, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    maxWidth: 700,
                    ...mx(["auto", null, 0]),
                    fontSize: [22, null, 32, 36],
                    lineHeight: ["28px", null, "36px", "42px"],
                  }))}
                >
                  {t("about:header.strapline")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Intro */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.base,
            color: t.color.text.dark.base,
            paddingBottom: [84, t.spacing.xxxl, 160, 180],
            paddingTop: [180, 260, 200],
            position: "relative",
            textAlign: "center",
          }))}
          id="intro"
        >
          <div
            css={s({
              left: [0, null, "auto"],
              margin: "auto",
              maxWidth: [240, 360, 400, 520],
              position: "absolute",
              right: [0, null, 40],
              top: [-70, -100, -180, -240],
              width: ["100%", null, 450, 600],
            })}
          >
            <ResponsiveImage
              alt=""
              sizes={{ width: ["100vw", null, "50vw"] }}
              src={CLOUD_IMG}
            />
          </div>
          <div css={s(belt)}>
            <p
              css={s(bodyText, (t) => ({
                fontFamily: t.font.secondary.family,
                letterSpacing: "0.15em",
                marginBottom: [t.spacing.sm, null, t.spacing.md],
                textTransform: "uppercase",
              }))}
            >
              <i>{t("about:intro.title")}</i>
            </p>
            <h2
              css={s(headingAlpha, {
                lineHeight: ["36px", null, "48px", "50px"],
                maxWidth: [460, null, 600],
                ...mx("auto"),
              })}
            >
              <Trans i18nKey="about:intro.text" />
            </h2>
          </div>
        </section>

        {/* Testimonial */}
        <section
          css={s((t) => ({
            color: t.color.text.dark.base,
            marginBottom: [0, null, null, t.spacing.xxxl],
            maxWidth: 2200,
            ...mx("auto"),
          }))}
        >
          <Grid
            _css={s({ margin: "0 auto" })}
            itemWidth={["100%", null, null, "47%"]}
            direction="rtl"
          >
            <Item>
              <div
                css={s({
                  display: [null, null, "none"],
                  width: "100%",
                })}
              >
                <ResponsiveImage
                  alt=""
                  sizes={{ width: ["100vw", null, "50vw"] }}
                  src={SARAH_IMG}
                />
              </div>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: ["auto", null, 600, 700, 800],
                  position: "relative",
                })}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes={{ width: ["100vw", null, "50vw"] }}
                  src={SARAH_IMG}
                />
              </div>
            </Item>
            <Item
              _css={s({
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
              })}
            >
              <div css={s(gutter, { maxWidth: 720 })}>
                <div
                  css={s((t) => ({
                    paddingRight: [0, null, t.spacing.lg],
                    paddingTop: [
                      t.spacing.lg,
                      null,
                      t.spacing.xl,
                      t.spacing.xxl,
                    ],
                    textAlign: "left",
                  }))}
                >
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: t.spacing.lg,
                      maxWidth: 480,
                      position: "relative",
                    }))}
                  >
                    <span
                      css={s((t) => ({
                        color: t.color.tint.pistachio,
                        fontSize: [90, null, null, 120],
                        position: "absolute",
                        top: [-30, null, -40, -50],
                      }))}
                    >
                      &ldquo;
                    </span>
                    <Trans i18nKey="about:testimonials.first.quote" />
                    <span
                      css={s((t) => ({
                        bottom: -70,
                        color: t.color.tint.pistachio,
                        fontSize: [90, null, null, 120],
                        position: "absolute",
                        right: 0,
                      }))}
                    >
                      &rdquo;
                    </span>
                  </h2>
                  <p css={s(bodyText)}>
                    – {t("about:testimonials.first.author")}
                  </p>
                </div>
              </div>
            </Item>
          </Grid>
        </section>

        {/* Stats */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.dark,
            color: t.color.text.light.base,
            ...py([90, t.spacing.xxxl, null, 200]),
            ...px([
              t.spacing.md,
              t.spacing.xl,
              t.spacing.xxl,
              null,
              t.spacing.xxl,
            ]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              _css={s({ margin: "0 auto" })}
              itemWidth={["100%", null, null, "50%"]}
              gx={(t) => [0, null, t.spacing.xl, t.spacing.xxl, t.spacing.xxxl]}
            >
              <Item>
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    maxWidth: 500,
                  }))}
                >
                  <Trans i18nKey="about:why.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.sm,
                    maxWidth: 600,
                  }))}
                >
                  {t("about:why.text1")}
                  <sup>1</sup>
                </p>
                <p
                  css={s(bodyText, {
                    maxWidth: 600,
                  })}
                >
                  {t("about:why.text2")}
                </p>
              </Item>
              <Item>
                <p
                  css={s(headingEcho, (t) => ({
                    letterSpacing: "0.15em",
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    marginTop: t.spacing.xxl,
                    textTransform: "uppercase",
                  }))}
                >
                  <i>{t("about:why.subtitle")}</i>
                </p>
                <div
                  css={s({
                    position: "relative",
                  })}
                >
                  <motion.div
                    animate={currentStatsSlide === 0 ? "visible" : "hidden"}
                    css={s({ display: "flex" })}
                    initial="hidden"
                    variants={statsContainer}
                  >
                    <motion.div
                      css={s((t) => ({
                        paddingRight: [t.spacing.sm, null, t.spacing.md],
                        width: percentage(1 / 3),
                      }))}
                      variants={stats}
                    >
                      <h3
                        css={s(headingAlpha, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <Trans i18nKey="about:why.stats.arthritis.bold" />
                      </h3>
                      <h4
                        css={s(headingCharlie, {
                          fontSize: [18, 20, null, 22, 28],
                          fontStyle: "italic",
                          fontWeight: "300",
                          maxWidth: 240,
                        })}
                      >
                        {t("about:why.stats.arthritis.text")}
                      </h4>
                    </motion.div>
                    <motion.div
                      css={s((t) => ({
                        paddingRight: [t.spacing.sm, null, t.spacing.md],
                        width: percentage(1 / 3),
                      }))}
                      variants={stats}
                    >
                      <h3
                        css={s(headingAlpha, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <Trans i18nKey="about:why.stats.anxiety.bold" />
                      </h3>
                      <h4
                        css={s(headingCharlie, {
                          fontSize: [18, 20, null, 22, 28],
                          fontStyle: "italic",
                          fontWeight: "300",
                          maxWidth: 240,
                        })}
                      >
                        {t("about:why.stats.anxiety.text")}
                      </h4>
                    </motion.div>
                    <motion.div
                      css={s({
                        width: percentage(1 / 3),
                      })}
                      variants={stats}
                    >
                      <h3
                        css={s(headingAlpha, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <Trans i18nKey="about:why.stats.dental.bold" />
                      </h3>
                      <h4
                        css={s(headingCharlie, {
                          fontSize: [18, 20, null, 22, 28],
                          fontStyle: "italic",
                          fontWeight: "300",
                          maxWidth: 240,
                        })}
                      >
                        {t("about:why.stats.dental.text")}
                      </h4>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    animate={currentStatsSlide === 1 ? "visible" : "hidden"}
                    css={s({
                      bottom: 0,
                      display: "flex",
                      left: 0,
                      position: "absolute",
                      right: 0,
                      top: 0,
                    })}
                    initial="hidden"
                    variants={statsContainer}
                  >
                    <motion.div
                      css={s((t) => ({
                        paddingRight: [t.spacing.sm, null, t.spacing.md],
                        width: percentage(1 / 3),
                      }))}
                      variants={stats}
                    >
                      <h3
                        css={s(headingAlpha, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <Trans i18nKey="about:why.stats.digestion.bold" />
                      </h3>
                      <h4
                        css={s(headingCharlie, {
                          fontSize: [18, 20, null, 22, 28],
                          fontStyle: "italic",
                          fontWeight: "300",
                          maxWidth: 240,
                        })}
                      >
                        {t("about:why.stats.digestion.text")}
                      </h4>
                    </motion.div>
                    <motion.div
                      css={s((t) => ({
                        paddingRight: [t.spacing.sm, null, t.spacing.md],
                        width: percentage(1 / 3),
                      }))}
                      variants={stats}
                    >
                      <h3
                        css={s(headingAlpha, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <Trans i18nKey="about:why.stats.skin.bold" />
                      </h3>
                      <h4
                        css={s(headingCharlie, {
                          fontSize: [18, 20, null, 22, 28],
                          fontStyle: "italic",
                          fontWeight: "300",
                          maxWidth: 240,
                        })}
                      >
                        {t("about:why.stats.skin.text")}
                      </h4>
                    </motion.div>
                    <motion.div
                      css={s({
                        width: percentage(1 / 3),
                      })}
                      variants={stats}
                    >
                      <h3
                        css={s(headingAlpha, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        <Trans i18nKey="about:why.stats.obesity.bold" />
                      </h3>
                      <h4
                        css={s(headingCharlie, {
                          fontSize: [18, 20, null, 22, 28],
                          fontStyle: "italic",
                          fontWeight: "300",
                          maxWidth: 240,
                        })}
                      >
                        {t("about:why.stats.obesity.text")}
                      </h4>
                    </motion.div>
                  </motion.div>
                </div>
              </Item>
            </Grid>
            <p css={s(bodyTextSmall, (t) => ({ marginTop: t.spacing.xl }))}>
              <sup>1</sup>
              <a
                css={s(textButton({ reverse: true }), { fontSize: 12 })}
                href="https://www.banfield.com/state-of-pet-health"
                rel="noreferrer"
                target="_blank"
              >
                {t("about:why.citation")}
              </a>
            </p>
          </div>
        </section>

        {/* Gold */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.tint.sand,
            color: t.color.text.dark.base,
            paddingBottom: [300, null, 180, 200],
            paddingTop: [t.spacing.xxl, t.spacing.xxxl, 180, 200],
            position: "relative",
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "contain",
                objectPosition: ["70% 580px", "50% 300px", "right 100px"],
                overflow: "hidden",
                transform: ["scale(1.8)", "scale(1.2)", "scale(1)"],
              },
              overflow: "hidden",
              zIndex: 1,
            })}
            priority
            quality={60}
            urls={[BULLDOG_IMG.src, null, BULLDOG_IMG.src]}
          />

          <div
            css={s({
              bottom: [-10, null, "auto"],
              left: [0, null, "-10%", 0],
              maxWidth: 760,
              position: "absolute",
              top: ["auto", null, 600, 500],
              width: ["100%", "70%", "40%"],
              zIndex: 2,
            })}
          >
            <ResponsiveImage
              alt=""
              sizes={{ width: ["100vw", null, "50vw"] }}
              src={GOLDEN_IMG}
            />
          </div>
          <div css={s(belt, { position: "relative", zIndex: 3 })}>
            <div
              css={s((t) => ({
                marginTop: [0, null, t.spacing.xxl],
                maxWidth: [400, null, 500],
                textAlign: "left",
              }))}
            >
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                }))}
              >
                {t("about:odds.title")}
              </h2>
              <p css={s(bodyText)}>{t("about:odds.text")}</p>
            </div>
            <div
              css={s((t) => ({
                display: "flex",
                justifyContent: ["flex-start", null, "flex-end"],
                marginTop: [260, null, t.spacing.xxxl],
                width: "100%",
              }))}
            >
              <div
                css={s((t) => ({
                  marginRight: [0, null, null, t.spacing.xxl],
                  maxWidth: [400, null, 500],
                  textAlign: "left",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                  }))}
                >
                  <Trans i18nKey="about:claim.title" />
                </h2>
                <p css={s(bodyText)}>{t("about:claim.text")}</p>
              </div>
            </div>
            <div
              css={s((t) => ({
                marginTop: [t.spacing.xxxl, null, 100, 140],
                maxWidth: 700,
                textAlign: "center",
                ...mx("auto"),
              }))}
            >
              <div
                css={s((t) => ({
                  ...mx("auto"),
                  marginBottom: [t.spacing.lg, null, t.spacing.xxl],
                  maxWidth: [120, null, 150],
                }))}
              >
                <ResponsiveImage
                  alt=""
                  sizes={{ width: "100vw" }}
                  src={LOVE_IMG}
                />
              </div>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [28, 36, 54, 68],
                  lineHeight: ["34px", "48px", "54px", "68px"],
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                }))}
              >
                <Trans i18nKey="about:bio.title" />
              </h2>
              <p
                css={s(bodyText, {
                  fontSize: [18, null, 20, 22],
                  lineHeight: ["28px", null, "30px", "32px"],
                })}
              >
                {t("about:bio.text")}
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section
          css={s(gutter, (t) => ({
            color: t.color.text.dark.base,
            textAlign: ["left", null, "center"],
            ...py([96, null, 180]),
          }))}
        >
          <div css={s(belt, { maxWidth: 900 })}>
            <header
              css={s((t) => ({
                ...mx("auto"),
                marginBottom: t.spacing.xl,
                textAlign: ["left", null, "center"],
              }))}
            >
              <h2 css={s(headingBravo)}>
                <Trans i18nKey="about:products.title" />
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  marginTop: t.spacing.sm,
                }))}
              >
                {t("about:products.text")}
              </p>
            </header>
            <Grid
              _css={s(belt, { maxWidth: 900 })}
              itemWidth={["100%", "50%"]}
              gx={(t) => [t.spacing.sm, t.spacing.md, t.spacing.xxl]}
              gy={(t) => [t.spacing.xl, t.spacing.xxl]}
            >
              {products.edges.map(({ node }, position) => (
                <Item key={node.id}>
                  <ProductListingItem
                    _css={s({ height: "100%" })}
                    collectionName="About"
                    position={position}
                    product={node}
                    sizes={{
                      maxWidth: 1280 / 3,
                      width: ["100vw", "50vw", "33.333vw"],
                    }}
                  />
                </Item>
              ))}
            </Grid>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default About;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { COLLECTION_BY_HANDLE } = await import("@sss/ecommerce/collection");

    const { data } = await runServerSideQuery<CollectionData>(apolloClient, {
      query: COLLECTION_BY_HANDLE,
      variables: {
        first: 4,
        handle: "featured",
      },
    });

    if (!data?.collection) {
      throw new Error("Unexpected missing 'featured' collection");
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
