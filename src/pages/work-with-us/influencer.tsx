import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, gutter, mx, my, px, py, s } from "@/common/ui/utils";
import HERO_MOBILE2_IMG from "@/modules/home/assets/HERO_MOBILE2.jpg";

import { makeStaticPropsGetter } from "../../../pages/_app";
import LOVE_IMG from "../../assets/images/common/LOVE-SCIENCE.png";
import TWIGGY_IMG from "../../assets/images/common/testimonials/TWIGGY.jpg";
import OG_IMG from "../../assets/images/influencer/OPENGRAPH.jpg";
import SARAH_IMG from "../../assets/images/mission/SARAH.jpg";
import { primaryButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import {
  bodyText,
  bodyTextStatic,
  headingAlpha,
  headingDelta,
} from "../../ui/base/typography";
import SocialIcons from "../../ui/modules/social-icons";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  brand: {
    item1: {
      text:
        "We value authentic relationships so you control the narrative. No scripts, no micromanagement - in your own words, in your own way.",
      title: "You do you",
    },
    item2: {
      text:
        "We use more clinically-proven ingredients than any other dog supplement. Your bestie deserves the best and we’re confident you’ll genuinely love our product.",
      title: "A trusted brand",
    },
    item3: {
      text:
        "We set clear expectations, compensate fairly and are flexible on deliverables and timelines. We also value long term relationships over one time things.",
      title: "A true partner",
    },
    title: "Say hello to your new<br /> favorite brand",
  },
  cta: {
    button: "Apply now",
    title:
      "Join our influencer community and help lead the revolution on pet health!",
  },
  header: {
    alt: "Your love, our science",
    text:
      "Your dog loves you. Completely, perfectly, unconditionally. We know you’d do anything to return the love. That’s why we created the most science-backed dog supplements, ever. Because your unconditional love deserves our uncompromising science.",
    title: "A community of unconditional love",
  },
  meta: {
    description:
      "Join our influencer community and help lead the revolution on pet health!",
    openGraph: {
      description: "Join our influencer community today",
      title: "Join The Pack! Become a Front Of The Pack Influencer",
    },
    title: "Join The Pack! Become a Front Of The Pack Influencer | FOTP",
  },
  person: {
    item1: {
      text:
        "You treat your dog like a member of the family. They’re your everything and you’d do anything to help give them their healthiest future.",
      title: "Pets are family",
    },
    item2: {
      text:
        "You have an active community of 5k+. We’re open to categories but are drawn to pets (naturally!), food, nutrition, health, fitness, mindfulness, beauty and fashion.",
      title: "Engaged community",
    },
    item3: {
      text:
        "We’d love you to inspire others with unconditional love stories about how your dog is a positive force in your life.",
      title: "Great storytellers",
    },
    title: "Am I the one?",
  },
};

export const InfluencerPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "influencerPage", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("influencerPage:meta.description")}
        title={t("influencerPage:meta.title")}
        openGraph={{
          description: t("influencerPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("influencerPage:meta.openGraph.title"),
        }}
      />
      <main>
        <section
          css={s((t) => ({
            backgroundColor: t.color.tint.sand,
            color: t.color.text.dark.base,
            ...mx("auto"),
          }))}
        >
          <Grid
            _css={s({ margin: "0 auto" })}
            itemWidth={["100%", null, null, "50%"]}
            direction="rtl"
          >
            <Item
              _css={s({
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
                textAlign: "center",
              })}
            >
              <div
                css={s(gutter, (t) => ({
                  maxWidth: 680,
                  ...px([t.spacing.md, t.spacing.xl]),
                  ...py([t.spacing.xxl, null, t.spacing.xxxl, 0]),
                }))}
              >
                <div
                  css={s({
                    margin: "auto",
                    maxWidth: 120,
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      width: "100vw",
                    }}
                    src={LOVE_IMG}
                  />
                </div>
                <h1
                  css={s(headingAlpha, (t) => ({
                    ...my([t.spacing.md, null, t.spacing.lg]),
                    ...mx(["auto", null, 0]),
                  }))}
                >
                  {t("influencerPage:header.title")}
                </h1>
                <p css={s(bodyText)}>{t("influencerPage:header.text")}</p>
                <SocialIcons
                  _css={s((t) => ({
                    display: "flex",
                    justifyContent: "center",
                    marginTop: t.spacing.lg,
                  }))}
                  size={32}
                />
              </div>
            </Item>
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
                  height: ["auto", null, 800, null, 900],
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
          </Grid>
        </section>

        <section
          css={s(gutter, (t) => ({
            textAlign: "center",
            ...py([t.spacing.xxl, null, 96, 140]),
          }))}
        >
          <div css={s(belt, { maxWidth: 800 })}>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              {t("influencerPage:cta.title")}
            </h2>
            <a
              css={s(primaryButton(), { maxWidth: 300, width: "100%" })}
              href="https://fotp2021.typeform.com/to/FtmpknBY"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("influencerPage:cta.button")}
            </a>
          </div>
        </section>

        <section
          css={s((t) => ({
            color: t.color.text.dark.base,
            ...mx("auto"),
          }))}
        >
          <Grid
            _css={s({ margin: "0 auto" })}
            itemWidth={["100%", null, null, "50%"]}
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
                  src={HERO_MOBILE2_IMG}
                />
              </div>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: ["auto", null, 800, null, 900],
                  position: "relative",
                })}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes={{ width: ["100vw", null, "50vw"] }}
                  src={HERO_MOBILE2_IMG}
                />
              </div>
            </Item>
            <Item
              _css={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                css={s(gutter, (t) => ({
                  maxWidth: 680,
                  ...px([t.spacing.md, t.spacing.xl]),
                  ...py([t.spacing.xxl, null, t.spacing.xxxl, 0]),
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    ...mx(["auto", null, 0]),
                  }))}
                >
                  <Trans i18nKey="influencerPage:brand.title" />
                </h2>
                <h3
                  css={s(headingDelta, (t) => ({
                    display: "block",
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("influencerPage:brand.item1.title")}
                </h3>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  {t("influencerPage:brand.item1.text")}
                </p>
                <h3
                  css={s(headingDelta, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("influencerPage:brand.item2.title")}
                </h3>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  {t("influencerPage:brand.item2.text")}
                </p>
                <h3
                  css={s(headingDelta, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("influencerPage:brand.item3.title")}
                </h3>
                <p css={s(bodyTextStatic)}>
                  {t("influencerPage:brand.item3.text")}
                </p>
              </div>
            </Item>
          </Grid>
        </section>

        <section
          css={s((t) => ({
            color: t.color.text.dark.base,
            ...mx("auto"),
            ...py([0, null, null, t.spacing.xxxl]),
          }))}
        >
          <Grid
            _css={s({ margin: "0 auto" })}
            itemWidth={["100%", null, null, "50%"]}
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
                  src={TWIGGY_IMG}
                />
              </div>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: ["auto", null, 800, null, 900],
                  position: "relative",
                })}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes={{ width: ["100vw", null, "50vw"] }}
                  src={TWIGGY_IMG}
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
                textAlign: "center",
              })}
            >
              <div
                css={s(gutter, (t) => ({
                  maxWidth: 680,
                  paddingBottom: [t.spacing.lg, t.spacing.xl, null, 0],
                  paddingTop: [t.spacing.xxl, null, t.spacing.xxxl, 0],
                  ...px([t.spacing.md, t.spacing.xl]),
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    ...mx(["auto", null, 0]),
                  }))}
                >
                  {t("influencerPage:person.title")}
                </h2>
                <h3
                  css={s(headingDelta, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("influencerPage:person.item1.title")}
                </h3>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  {t("influencerPage:person.item1.text")}
                </p>
                <h3
                  css={s(headingDelta, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("influencerPage:person.item2.title")}
                </h3>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  {t("influencerPage:person.item2.text")}
                </p>
                <h3
                  css={s(headingDelta, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("influencerPage:person.item3.title")}
                </h3>
                <p css={s(bodyTextStatic)}>
                  {t("influencerPage:person.item3.text")}
                </p>
              </div>
            </Item>
          </Grid>
        </section>

        <section css={s(gutter, { paddingTop: 0, textAlign: "center" })}>
          <div css={s(belt, { maxWidth: 800 })}>
            <a
              css={s(primaryButton(), {
                maxWidth: 300,
                width: "100%",
              })}
              href="https://fotp2021.typeform.com/to/FtmpknBY"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("influencerPage:cta.button")}
            </a>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default InfluencerPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
