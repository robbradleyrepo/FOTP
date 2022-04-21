import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import Hero from "src/ui/base/hero";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, greedy, gutter, percentage, px, py, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import HERO_IMG from "../../assets/images/sustainability/HERO.jpg";
import HERO_MOBILE_IMG from "../../assets/images/sustainability/HERO_MOBILE.jpg";
import LEAF_IMG from "../../assets/images/sustainability/LEAF.jpg";
import OG_IMG from "../../assets/images/sustainability/OPENGRAPH.jpg";
import POUCH_IMG from "../../assets/images/sustainability/POUCH.jpg";
import SCOOP_IMG from "../../assets/images/sustainability/SCOOP.jpg";
import SHIPPER_IMG from "../../assets/images/sustainability/SHIPPER.jpg";
import TIN_IMG from "../../assets/images/sustainability/TIN.jpg";
import TUB_IMG from "../../assets/images/sustainability/TUB.jpg";
import { Grid, Item } from "../../ui/base/grid";
import Icon from "../../ui/base/icon";
import LazyAnimation from "../../ui/base/lazy-animation";
import { bodyText, headingAlpha } from "../../ui/base/typography";
import biodegradable from "../../ui/icons/biodegradable";
import noPlastic from "../../ui/icons/noPlastic";
import recyclable from "../../ui/icons/recyclable";
import { spacing } from "../../ui/styles/variables";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  header: {
    description:
      "Our pups deserve to play in a clean, safe and natural world. That’s why we’re committed to lessening our carbon footprint wherever possible",
    title: "Here’s To A World Without Plastic",
  },
  icons: {
    biodegradable: "Biodegradable",
    noPlastic: "Plastic-free",
    recyclable: "Recyclable",
  },
  ingredients: {
    text:
      "We have exhaustively vetted our partners to ensure where possible they meet our exacting standards for living lightly on the earth and acting responsibly.",
    title: "Sustainably<br /> sourced ingredients",
  },
  meta: {
    description:
      "We've done away with white plastic tubs. Instead we use recycled card tubs and shippers, compostable pouchs and sustainable bamboo measuring scoops.",
    openGraph: {
      description: "We've done away with white plastic tubs.",
      title: "Here’s To A World Without Plastic",
    },
    title: "Our pups deserve to play in a clean, safe and natural world | FOTP",
  },
  pouch: {
    text1:
      "Made from 100% Recycled Content Paper and Non-GMO PLA Glue that is manufactured using a base of cassava roots. It sounds so good we could eat it! But don't. It wouldn't taste great.",
    text2:
      "Great for the environment, fully composts, no microplastics and perfect for keeping your supplement as fresh as the day it was tested!",
    title: "Compostable stay-fresh pouch",
  },
  scoop: {
    text1: "Panda lovin bamboo - nothing else. Simple.",
    text2:
      "Fun fact about bamboo - did you know that it requires no fertiliser and self-regenerates from its own roots, so it doesn't need to be replanted? It can also grow up to 36 inches in a day!",
    title: "Sustainable bamboo measuring scoop",
  },
  shipper: {
    text1:
      "90% of our card is recycled, then recycled, then recycled some more before you get it and recycle it ahead of the next recycle.",
    text2:
      "Made from 90% post consumer recycled card. Keeping the world turning at each turn.",
    title: "90% recycled card shipper box",
  },
  tin: {
    text:
      "Elegant, recycled tinplate steel tins - perfect for refilling and storing your dog's favorite supplement. They last much longer than cardboard tubes (they are, quite literally, infinitely recyclable), so they're way better for the planet.",
    title: "100% Recycled, Refill Tins",
  },
  tub: {
    text:
      "Instead of plastic tubs or packets, we chose to store our powder supplements in small tubs made from 100% post consumer recycled brown board. This way we can ensure we have the smallest possible impact on the planet, while still giving you a beautiful container to store your bestie’s supplement.",
    title: "Earth-friendly recycled card tubs",
  },
};

export const SustainabilityPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "sustainabilityPage", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("sustainabilityPage:meta.description")}
        title={t("sustainabilityPage:meta.title")}
        openGraph={{
          description: t("sustainabilityPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("sustainabilityPage:meta.openGraph.title"),
        }}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            color: t.color.text.light.base,
            height: ["auto", null, "100vh"],
            maxHeight: [null, null, 600, 720],
            ...py([t.spacing.xxl, t.spacing.xxxl, t.spacing.xxl]),
            ...px([t.spacing.md, null, 0]),
            position: "relative",
            textAlign: "center",
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": { ...greedy, objectFit: "cover" },
              zIndex: -1,
            })}
            priority
            quality={60}
            urls={[HERO_MOBILE_IMG.src, null, HERO_IMG.src]}
          />
          <div
            css={s(belt, {
              alignItems: "center",
              display: "flex",
              height: "100%",
              justifyContent: "center",
            })}
          >
            <LazyAnimation>
              <h1
                css={s(headingAlpha, (t) => ({
                  fontSize: [48, null, 56, 64, 72],
                  lineHeight: "1.1em",
                  margin: "0 auto",
                  maxWidth: ["none", null, 500, 700],
                  paddingBottom: [t.spacing.md, null, t.spacing.lg],
                }))}
              >
                <Trans i18nKey="sustainabilityPage:header.title" />
              </h1>
              <p
                css={s(bodyText, {
                  fontSize: [18, null, 20],
                  margin: "0 auto",
                  maxWidth: ["none", null, 500, 600],
                })}
              >
                {t("sustainabilityPage:header.description")}
              </p>
            </LazyAnimation>
          </div>
        </header>

        <section
          css={s(gutter, (t) => ({
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={TIN_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: ["center", null, "flex-start"],
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:tin.title")}
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:tin.text")}
                    </p>

                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={biodegradable}
                      title={t("sustainabilityPage:icons.recyclable")}
                      viewBox="0 0 32 32"
                    />
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginLeft: t.spacing.sm,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={noPlastic}
                      title={t("sustainabilityPage:icons.noPlastic")}
                      viewBox="0 0 32 32"
                    />
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            paddingTop: 0,
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              gy={spacing.lg}
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={TUB_IMG}
                  />
                </LazyAnimation>
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
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      <Trans i18nKey="sustainabilityPage:tub.title" />
                    </h2>
                    <p
                      css={s(bodyText, {
                        fontSize: 16,
                      })}
                    >
                      {t("sustainabilityPage:tub.text")}
                    </p>
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={recyclable}
                      title={t("sustainabilityPage:icons.recyclable")}
                      viewBox="0 0 32 32"
                    />
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginLeft: t.spacing.sm,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={noPlastic}
                      title={t("sustainabilityPage:icons.noPlastic")}
                      viewBox="0 0 32 32"
                    />
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            paddingTop: 0,
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={POUCH_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: ["center", null, "flex-start"],
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:pouch.title")}
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:pouch.text1")}
                    </p>
                    <p
                      css={s(bodyText, {
                        fontSize: 16,
                      })}
                    >
                      {t("sustainabilityPage:pouch.text2")}
                    </p>
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={biodegradable}
                      title={t("sustainabilityPage:icons.biodegradable")}
                      viewBox="0 0 32 32"
                    />
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginLeft: t.spacing.sm,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={noPlastic}
                      title={t("sustainabilityPage:icons.noPlastic")}
                      viewBox="0 0 32 32"
                    />
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            ...px([t.spacing.md, null, 0]),
            paddingTop: 0,
          }))}
        >
          <div css={s(belt)}>
            <Grid
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={SCOOP_IMG}
                  />
                </LazyAnimation>
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
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      <Trans i18nKey="sustainabilityPage:scoop.title" />
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:scoop.text1")}
                    </p>
                    <p
                      css={s(bodyText, {
                        fontSize: 16,
                      })}
                    >
                      {t("sustainabilityPage:scoop.text2")}
                    </p>
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={biodegradable}
                      title={t("sustainabilityPage:icons.biodegradable")}
                      viewBox="0 0 32 32"
                    />
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginLeft: t.spacing.sm,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={noPlastic}
                      title={t("sustainabilityPage:icons.noPlastic")}
                      viewBox="0 0 32 32"
                    />
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            ...py(0),
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={SHIPPER_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: ["center", null, "flex-start"],
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:shipper.title")}
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("sustainabilityPage:shipper.text1")}
                    </p>
                    <p
                      css={s(bodyText, {
                        fontSize: 16,
                      })}
                    >
                      {t("sustainabilityPage:shipper.text2")}
                    </p>
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={recyclable}
                      title={t("sustainabilityPage:icons.recyclable")}
                      viewBox="0 0 32 32"
                    />
                    <Icon
                      _css={s((t) => ({
                        color: t.color.tint.grass,
                        marginLeft: t.spacing.sm,
                        marginTop: t.spacing.md,
                        width: 32,
                      }))}
                      path={noPlastic}
                      title={t("sustainabilityPage:icons.noPlastic")}
                      viewBox="0 0 32 32"
                    />
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, {
            ...py([96, null, 120, 140]),
            textAlign: "center",
          })}
        >
          <div css={s(belt, { margin: "0 auto", maxWidth: 560 })}>
            <LazyAnimation>
              <div
                css={s({
                  margin: "auto",
                  maxWidth: [64, null, 128],
                })}
              >
                <ResponsiveImage
                  alt=""
                  sizes={{
                    width: "100vw",
                  }}
                  src={LEAF_IMG}
                />
              </div>
            </LazyAnimation>
            <LazyAnimation>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginTop: t.spacing.sm,
                  paddingBottom: t.spacing.md,
                }))}
              >
                <Trans i18nKey="sustainabilityPage:ingredients.title" />
              </h2>
              <p
                css={s(bodyText, {
                  fontSize: 16,
                })}
              >
                {t("sustainabilityPage:ingredients.text")}
              </p>
            </LazyAnimation>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default SustainabilityPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
