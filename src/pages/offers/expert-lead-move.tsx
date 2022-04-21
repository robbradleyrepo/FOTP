import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { ProductSchema } from "@sss/ecommerce";
import { getProductComputedMetadata } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import {
  CUSTOMIZATION,
  CustomizationDict,
  CustomizationProvider,
  Elements,
  ImageCustomization,
  RichTextCustomization,
  RichTextFragment,
  TitleCustomization,
  toCustomizationDictionary,
} from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { Trans } from "react-i18next";
import { Link as ScrollLink } from "react-scroll";
import Guarantee from "src/ui/modules/offers/guarantee";

import {
  belt,
  greedy,
  gutter,
  mx,
  my,
  percentage,
  px,
  py,
  ResponsiveCSSValue,
  s,
  size,
} from "@/common/ui/utils";

import COMMON_EXPERTS_SCOTT_MILLER_IMG from "../../assets/images/common/experts/SCOTT_MILLER.jpg";
import LARGE_IMG from "../../assets/images/common/sizes/LARGE.png";
import MEDIUM_IMG from "../../assets/images/common/sizes/MEDIUM.png";
import SMALL_IMG from "../../assets/images/common/sizes/SMALL.png";
import DOGS_IMG from "../../assets/images/offers/DOGS.jpg";
import DOGS2_IMG from "../../assets/images/offers/DOGS2.jpg";
import FERGUS_IMG from "../../assets/images/offers/FERGUS.png";
import MOVE_BENEFIT_1_IMG from "../../assets/images/offers/MOVE_BENEFIT_1.jpg";
import MOVE_BENEFIT_2_IMG from "../../assets/images/offers/MOVE_BENEFIT_2.jpg";
import MOVE_BENEFIT_3_IMG from "../../assets/images/offers/MOVE_BENEFIT_3.jpg";
import OFFERS_MOVE_HERO_IMG from "../../assets/images/offers/MOVE_HERO.jpg";
import OFFERS_MOVE_HERO_MOBILE_IMG from "../../assets/images/offers/MOVE_HERO_MOBILE.jpg";
import OG_IMG from "../../assets/images/offers/open-graph/MOVE_EXPERT_LEAD.jpg";
import { RichText } from "../../cms/prismic";
import {
  makeProductPageStaticPropsGetter,
  ProductPageDataProvider,
  UnifiedProductPageData,
} from "../../cms/product-page";
import Accordion from "../../ui/base/accordion";
import banner from "../../ui/base/banner";
import { contrastButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import Hero from "../../ui/base/hero";
import Icon from "../../ui/base/icon";
import { decorativeListItem } from "../../ui/base/list";
import ResponsiveImage from "../../ui/base/responsive-image";
import { ToastRack } from "../../ui/base/toast";
import {
  bodyText,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../../ui/base/typography";
import cross from "../../ui/icons/cross";
import tick from "../../ui/icons/tick";
import Footer from "../../ui/modules/footer";
import { IngredientsGrid } from "../../ui/modules/ingredients";
import BundlePicker from "../../ui/modules/offers/bundle-picker";
import RecentPurchases from "../../ui/modules/recent-purchases";
import SalesFunnelHeader from "../../ui/modules/sales-funnel-header";
import { StyleProps } from "../../ui/styles/helpers";
import { height, spacing } from "../../ui/styles/variables";
const enUsResource = {
  banner: "90 day ‘No Questions Asked’ Guarantee",
  benefits: {
    feature1: {
      text:
        "Glucosamine and Chondroitin help maintain cartilage strength and support healthy joint function.",
      title: "Promotes healthy cartilage growth",
    },
    feature2: {
      text:
        "MSM is critical to the repair and regeneration of joint cartilage and muscle.",
      title: "Cushions aging hips and joints",
    },
    feature3: {
      text:
        "Collagen and Curcumin support a healthy inflammatory response and balance.",
      title: "Relieves stiffness and discomfort",
    },
    text:
      "Our experts identified the key joint areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on. To keep your dog active and free of discomfort as they age.",
    title: "3 joint enhancing benefits in 1 world class supplement",
  },
  compare: {
    fotp: "Move",
    item1: "Clinically proven ingredients",
    item2: "No binders, fillers or additives",
    item3: "100% traceable ingredients",
    item4: "Rigorous third party testing",
    item5: "Industry leading suppliers",
    others: "Other brands",
    title: "So, how does Move compare?",
  },
  cta: "Buy now",
  experts: {
    anthony: {
      name: "Fergus’s Dad",
      quote: "Fergus is like a pup again, no stiffness & full of energy",
    },
    azza: {
      name: "A. Gadir,  Immunology Specialist",
      quote: "Now more than ever your dogs immune system health is vital",
    },
    elan: {
      name: "E. Sudberg, NASC Board Member",
      quote: "This supplement is at the forefront of dog healthcare",
    },
    title:
      "Thousands of dogs are seeing incredible improvements in their joint health in as little as 4-6 weeks",
  },
  faqs: {
    title: "Frequently asked questions",
  },
  feeding: {
    large: {
      guide: "Dogs over 50lbs = 3 scoops a day",
      supply: "1 tub = 20 days supply",
    },
    medium: {
      guide: "Dogs between 25-50lbs = 2 scoops a day",
      supply: "1 tub = 1 months supply",
    },
    small: {
      guide: "Dogs under 25lbs = 1 scoop a day",
      supply: "1 tub = 2 months supply",
    },
    text:
      "Each tub contains 60 scoops. That's enough for up to 2 months supply. Check your dog's weight below for the ideal package size:",
    text1:
      "Sprinkle the recommended number of scoops onto your dog’s food once a day, or mix it in with one of their favorite healthy snacks.",
    text2:
      "When used on a consistent daily basis, positive improvements should begin to appear within 4 - 6 weeks.",
    title: "How much does my dog need?",
  },
  header: {
    expert: "Dr Scott Miller BVSc",
    quote:
      "Our new and improved joint supplement, Move™ is even more powerful than before",
    title:
      "A <i>Vet Recommended</i> Supplement To Soothe Joint Discomfort & Improve Mobility",
  },
  ingredients: {
    text:
      "Millions of dogs suffer with joint discomfort and mobility issues and as dogs age it becomes more and more common. That’s why our team of expert vets and biochemists decided to upgrade our popular joint supplement, Move. We’ve added an extra ingredient and sourced an even more powerful collagen, making this our best joint support supplement, ever. Don’t be surprised if  dog your dog begins to play and jump around like a puppy again.",
    title: "6 clinically-tested ingredients in every tub",
  },
  meta: {
    description:
      "A vet-recommended joint supplement to help restore cartilage, soothe muscles and promote healthy joint function. Made in America | Click for offers",
    openGraph: {
      description: "Enhance your dog's joint health",
      title: "Keep Your Dog's Joints Active & Mobile As They Age",
    },
    title: "Keep Your Dog's Joints Active & Mobile As They Age | FOTP",
  },
  refunds: {
    subtext: "Customer satisfaction is our #1 priority",
    text1:
      "If you are unhappy with a product, simply return it within 90 days of receiving it and we’ll give you a full refund.",
    text2: "It’s that simple.",
    title: "Refund policy",
  },
  support: {
    list: {
      item1: "Support healthy joint function",
      item2: "Promote healthy cartilage metabolism",
      item3: "Support healthy inflammatory response",
      item4: "Support flexibility and mobility",
      item5: "And more...",
    },
    title:
      "Our upgraded joint and mobility support supplement, Move™ now packs an even bigger punch with upgraded ingredients to help:",
  },
};

const comparisonItems = ["item1", "item2", "item3", "item4", "item5"];

const Benefits: FC<StyleProps> = () => {
  const { t } = useLocale();

  return (
    <Grid
      _css={s((t) => ({
        marginTop: [0, null, 96, t.spacing.xxxl],
        textAlign: "center",
      }))}
      gx={spacing.lg}
      gy={spacing.xl}
      itemWidth={[percentage(1), null, percentage(1 / 3)]}
    >
      <Item>
        <div
          css={s({
            margin: "auto",
            maxWidth: [180, null, null],
          })}
        >
          <ResponsiveImage
            alt=""
            sizes={{
              width: "100vw",
            }}
            src={MOVE_BENEFIT_1_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("expertLeadTest:benefits.feature1.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("expertLeadTest:benefits.feature1.text")}
        </div>
      </Item>
      <Item>
        <div
          css={s({
            margin: "auto",
            maxWidth: [180, null, null],
          })}
        >
          <ResponsiveImage
            alt=""
            sizes={{
              width: "100vw",
            }}
            src={MOVE_BENEFIT_2_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("expertLeadTest:benefits.feature2.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("expertLeadTest:benefits.feature2.text")}
        </div>
      </Item>
      <Item>
        <div
          css={s({
            margin: "auto",
            maxWidth: [180, null, null],
          })}
        >
          <ResponsiveImage
            alt=""
            sizes={{
              width: "100vw",
            }}
            src={MOVE_BENEFIT_3_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("expertLeadTest:benefits.feature3.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("expertLeadTest:benefits.feature3.text")}
        </div>
      </Item>
    </Grid>
  );
};

interface ExpertLeadProps {
  customizationDict?: CustomizationDict;
  data: UnifiedProductPageData;
}

export const ExpertLeadMove: NextPageWithApollo<ExpertLeadProps> = ({
  customizationDict,
  data,
}) => {
  const { i18n, locale, t } = useLocale();
  const { query } = useRouter();

  const meta = getProductComputedMetadata(data.ecommerce, query, locale);

  i18n.addResourceBundle("en-US", "expertLeadTest", enUsResource);

  const { cms } = data;

  // We find the first FAQ on the product page type
  const faq = cms?.faqs?.body?.[0];

  const hasBanner = i18n.exists("expertLeadTest:banner");

  const headerHeights: ResponsiveCSSValue = [
    height.nav.mobile + (hasBanner ? height.banner.mobile : 0),
    null,
    height.nav.desktop + (hasBanner ? height.banner.desktop : 0),
  ];

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <CustomizationProvider dictionary={customizationDict}>
        <Metadata
          description={t("expertLeadTest:meta.description")}
          noindex={!!customizationDict}
          title={t("expertLeadTest:meta.title")}
          openGraph={{
            description: t("expertLeadTest:meta.openGraph.description"),
            image: OG_IMG.src,
            title: t("expertLeadTest:meta.openGraph.title"),
          }}
        />
        {hasBanner && <div css={s(banner)}>{t("expertLeadTest:banner")}</div>}
        <SalesFunnelHeader
          _css={s((t) => ({
            top: hasBanner
              ? [t.height.banner.mobile, null, t.height.banner.desktop]
              : 0,
          }))}
          faqsPath="#faqs"
          shopPath="#bundles"
        />
        <main>
          <header
            css={s((t) => ({
              backgroundColor: "#CDD5CC",
              color: t.color.text.dark.base,
              height: ["auto", null, "100vh"],
              marginTop: headerHeights,
              maxHeight: ["none", null, 760, 800],
              paddingBottom: t.spacing.xxl,
              paddingTop: [t.spacing.lg, t.spacing.xl, t.spacing.xxl],
              ...px([0, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
              position: "relative",
            }))}
          >
            <Hero
              _css={s(greedy, {
                "& > *": {
                  ...greedy,
                  objectFit: "contain",
                  objectPosition: [
                    "center 35%",
                    null,
                    "45% center",
                    null,
                    "60% center",
                  ],
                },
                zIndex: 1,
              })}
              priority
              quality={60}
              urls={[
                OFFERS_MOVE_HERO_MOBILE_IMG.src,
                null,
                OFFERS_MOVE_HERO_IMG.src,
              ]}
            />
            <div
              css={s(belt, {
                height: "100%",
                maxWidth: 1440,
                position: "relative",
                zIndex: 5,
              })}
            >
              <div
                css={s({
                  alignItems: ["flex-start", null, "center"],
                  display: "flex",
                  height: "100%",
                  textAlign: "left",
                })}
              >
                <div
                  css={s((t) => ({
                    ...px([t.spacing.md, t.spacing.lg, 0]),
                    width: "100%",
                  }))}
                >
                  <h1
                    css={s(headingAlpha, (t) => ({
                      fontSize: [32, 36, 42, 48],
                      lineHeight: ["36px", "38px", "48px", "54px"],
                      marginBottom: ["73%", null, t.spacing.xl],
                      maxWidth: [null, null, 500, 580],
                      textAlign: ["center", null, "left"],
                    }))}
                  >
                    <TitleCustomization target="header:title">
                      <Trans i18nKey="expertLeadTest:header.title" />
                    </TitleCustomization>
                  </h1>
                  <div
                    css={s((t) => ({
                      alignItems: ["flex-start", null, null, "center"],
                      display: "flex",
                      marginBottom: [30, null, t.spacing.xl],
                      maxWidth: [null, null, 500, 640],
                    }))}
                  >
                    <div css={s({ flexShrink: 0, width: [72, null, 100] })}>
                      <ResponsiveImage
                        _css={s((t) => ({
                          borderRadius: t.radius.xxl,
                        }))}
                        alt=""
                        priority
                        sizes={{ width: [80, null, 100] }}
                        src={COMMON_EXPERTS_SCOTT_MILLER_IMG}
                      />
                    </div>
                    <div
                      css={s((t) => ({
                        paddingLeft: [t.spacing.sm, null, t.spacing.md],
                      }))}
                    >
                      <p css={s(bodyText, { fontSize: [14, 16, 18] })}>
                        {t("expertLeadTest:header.expert")}
                      </p>
                      <p
                        css={s(headingCharlie, (t) => ({
                          fontSize: [20, 22, 28],
                          fontStyle: "italic",
                          fontWeight: t.font.secondary.weight.book,
                          lineHeight: ["24px", "28px", "32px"],
                        }))}
                      >
                        &ldquo;
                        <TitleCustomization target="header:quote">
                          {t("expertLeadTest:header.quote")}
                        </TitleCustomization>
                        &rdquo;
                      </p>
                    </div>
                  </div>
                  <ScrollLink
                    css={s(contrastButton(), {
                      maxWidth: ["none", null, 300],
                      ...mx("auto"),
                      fontSize: 18,
                      width: "100%",
                    })}
                    duration={500}
                    href="#bundles"
                    offset={-60}
                    smooth={true}
                    to="bundles"
                  >
                    {t("expertLeadTest:cta")}
                  </ScrollLink>
                </div>
              </div>
            </div>
          </header>

          <section
            css={s((t) => ({
              color: t.color.text.dark.base,
              paddingTop: [t.spacing.xxl, null, 96, t.spacing.xxxl],
              ...mx("auto"),
            }))}
          >
            <Grid _css={s(mx("auto"))} itemWidth={["100%", null, "47%"]}>
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
                  css={s((t) => ({
                    maxWidth: 680,
                    paddingBottom: [t.spacing.xxl, null, 0],
                    paddingTop: 0,
                    ...px([t.spacing.md, t.spacing.xl]),
                    width: "100%",
                  }))}
                >
                  <h2
                    css={s(headingAlpha, (t) => ({
                      fontSize: [32, 36, 42, 48],
                      lineHeight: ["36px", "38px", "48px", "54px"],
                      marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                    }))}
                  >
                    <TitleCustomization target="support:title">
                      <Trans i18nKey="expertLeadTest:support.title" />
                    </TitleCustomization>
                  </h2>
                  <div
                    css={s({
                      fontSize: [16, 18, 20],
                      lineHeight: ["24px", "28px", "30px"],
                    })}
                  >
                    <RichTextCustomization
                      components={{
                        [Elements.listItem]: <li css={s(decorativeListItem)} />,
                      }}
                      target="support:body"
                    >
                      <ul css={s(bodyText)}>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTest:support.list.item1")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTest:support.list.item2")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTest:support.list.item3")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTest:support.list.item4")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTest:support.list.item5")}
                        </li>
                      </ul>
                    </RichTextCustomization>
                  </div>
                </div>
              </Item>
              <Item>
                <div
                  css={s({
                    display: ["none", null, null, "block"],
                    height: ["auto", null, 500, 600, 700],
                    position: "relative",
                    width: "100%",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    quality={60}
                    sizes="100vw"
                    src={DOGS_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, null, "none"] })}>
                  <ResponsiveImage alt="" src={DOGS_IMG} sizes="100vw" />
                </div>
              </Item>
            </Grid>
          </section>

          <section
            css={s(gutter, (t) => ({
              color: t.color.text.dark.base,
              textAlign: "center",
            }))}
          >
            <div
              css={s(belt, (t) => ({
                maxWidth: 1040,
                ...my([0, null, t.spacing.lg]),
              }))}
            >
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: [t.spacing.xl, null, 96],
                  maxWidth: 900,
                  ...mx("auto"),
                }))}
              >
                <Trans i18nKey="expertLeadTest:experts.title" />
              </h2>
              <blockquote
                css={s({
                  alignItems: "center",
                  display: [null, null, "flex"],
                  textAlign: ["center", null, "left"],
                })}
              >
                <div
                  css={s((t) => ({
                    borderRadius: 600,
                    flexShrink: 0,
                    marginBottom: [t.spacing.md, null, 0],
                    marginLeft: ["auto", null],
                    marginRight: ["auto", null, t.spacing.xl, t.spacing.xxl],
                    overflow: "hidden",
                    width: [150, 180, 220],
                  }))}
                >
                  <ImageCustomization target="testimonial:image" width={440}>
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        maxWidth: [null, null, 440],
                        width: [150, 180, 220],
                      }}
                      src={FERGUS_IMG}
                    />
                  </ImageCustomization>
                </div>
                <div>
                  <p
                    css={s(headingBravo, (t) => ({
                      fontFamily: t.font.secondary.family,
                      fontStyle: "italic",
                      fontWeight: t.font.secondary.weight.book,
                      marginBottom: [t.spacing.lg, null, t.spacing.md],
                    }))}
                  >
                    &ldquo;
                    <TitleCustomization target="testimonial:quote">
                      {t("expertLeadTest:experts.anthony.quote")}
                    </TitleCustomization>
                    &rdquo;
                  </p>
                  <footer css={s(bodyText)}>
                    –{" "}
                    <TitleCustomization target="testimonial:attribution">
                      {t("expertLeadTest:experts.anthony.name")}
                    </TitleCustomization>
                  </footer>
                </div>
              </blockquote>
            </div>
          </section>

          <Guarantee />

          <section css={s(gutter, { textAlign: "center" })} id="bundles">
            <BundlePicker
              skus={["FPMV01-PHx3", "FPMV01-PHx2", "FPMV01-PH"]}
              trackingSource="expert-lead"
            />
          </section>

          <section
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.feature3,
              color: t.color.text.dark.base,
              textAlign: "center",
            }))}
            id="intro"
          >
            <div css={s(belt)}>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: t.spacing.md,
                  maxWidth: 800,
                  ...mx("auto"),
                }))}
              >
                <Trans i18nKey="expertLeadTest:feeding.title" />
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.xxl],
                  maxWidth: 620,
                  ...mx("auto"),
                  textAlign: "center",
                }))}
              >
                {t("expertLeadTest:feeding.text")}
              </p>
              <Grid
                gx={spacing.lg}
                gy={spacing.xl}
                itemWidth={["100%", null, percentage(1 / 3)]}
              >
                <Item>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [160, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={SMALL_IMG}
                    />
                  </div>
                  <h3
                    css={s(headingDelta, (t) => ({
                      marginBottom: t.spacing.xs,
                    }))}
                  >
                    {t("expertLeadTest:feeding.small.guide")}
                  </h3>
                  <p css={s(bodyText)}>
                    {t("expertLeadTest:feeding.small.supply")}
                  </p>
                </Item>
                <Item>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [160, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={MEDIUM_IMG}
                    />
                  </div>
                  <h3
                    css={s(headingDelta, (t) => ({
                      marginBottom: t.spacing.xs,
                    }))}
                  >
                    {t("expertLeadTest:feeding.medium.guide")}
                  </h3>
                  <p css={s(bodyText)}>
                    {t("expertLeadTest:feeding.medium.supply")}
                  </p>
                </Item>
                <Item>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [160, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={LARGE_IMG}
                    />
                  </div>
                  <h3
                    css={s(headingDelta, (t) => ({
                      marginBottom: t.spacing.xs,
                    }))}
                  >
                    {t("expertLeadTest:feeding.large.guide")}
                  </h3>
                  <p css={s(bodyText)}>
                    {t("expertLeadTest:feeding.large.supply")}
                  </p>
                </Item>
              </Grid>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.md,
                  marginTop: [t.spacing.xxl, null, 96],
                  ...mx("auto"),
                  maxWidth: 640,
                }))}
              >
                {t("expertLeadTest:feeding.text1")}
              </p>
              <p
                css={s(bodyText, {
                  maxWidth: 640,
                  ...mx("auto"),
                })}
              >
                {t("expertLeadTest:feeding.text2")}
              </p>
              <ScrollLink
                css={s(contrastButton(), (t) => ({
                  fontSize: 18,
                  marginTop: t.spacing.xl,
                  maxWidth: ["none", null, 300],
                  ...mx("auto"),
                  width: "100%",
                }))}
                duration={500}
                href="#bundles"
                offset={-60}
                smooth={true}
                to="bundles"
              >
                {t("expertLeadTest:cta")}
              </ScrollLink>
            </div>
          </section>

          <div
            css={s({
              display: ["block", null, "none"],
              position: "relative",
            })}
          >
            <ResponsiveImage
              alt=""
              sizes={{ width: ["100vw", null, null] }}
              src={DOGS2_IMG}
            />
          </div>

          {/* Benefits */}
          <section css={s(gutter, { textAlign: "center " })}>
            <div css={s(belt, { maxWidth: [480, null, 1280] })}>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: t.spacing.md,
                  ...mx("auto"),
                }))}
              >
                <Trans i18nKey="expertLeadTest:benefits.title" />
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.xxl,
                  maxWidth: 700,
                  ...mx("auto"),
                  textAlign: "center",
                }))}
              >
                {t("expertLeadTest:benefits.text")}
              </p>
              <Benefits />
              <ScrollLink
                css={s(contrastButton(), (t) => ({
                  fontSize: 18,
                  marginTop: t.spacing.xxl,
                  maxWidth: ["none", null, 300],
                  ...mx("auto"),
                  width: "100%",
                }))}
                duration={500}
                href="#bundles"
                offset={-60}
                smooth={true}
                to="bundles"
              >
                {t("expertLeadTest:cta")}
              </ScrollLink>
            </div>
          </section>

          <Guarantee />

          {cms.product?.ingredients && (
            <section
              css={s(gutter, (t) => ({
                backgroundColor: t.color.background.feature2,
                textAlign: "center",
              }))}
            >
              <div css={s(belt)}>
                <h2
                  css={s(headingAlpha, (t) => ({
                    fontSize: [32, 36, 42, 48],
                    lineHeight: ["36px", "38px", "48px", "54px"],
                    marginBottom: t.spacing.md,
                    ...mx("auto"),
                  }))}
                >
                  <Trans i18nKey="expertLeadTest:ingredients.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xxl,
                    maxWidth: 800,
                    ...mx("auto"),
                    textAlign: "center",
                  }))}
                >
                  {t("expertLeadTest:ingredients.text")}
                </p>
                <IngredientsGrid ingredients={cms.product.ingredients} />
              </div>
            </section>
          )}

          <section css={s(gutter, { textAlign: "center" })}>
            <div css={s(belt, { maxWidth: 840 })}>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: [t.spacing.lg, t.spacing.xl, t.spacing.xxl],
                }))}
              >
                {t("expertLeadTest:compare.title")}
              </h2>
              <table css={s({ width: "100%" })}>
                <colgroup>
                  <col css={s({ width: ["60%", null, "50%"] })} span={1} />
                  <col css={s({ width: ["20%", null, "25%"] })} span={1} />
                  <col css={s({ width: ["20%", null, "25%"] })} span={1} />
                </colgroup>
                <thead>
                  <tr
                    css={s((t) => ({
                      borderBottom: `solid 1px ${t.color.tint.algae}`,
                    }))}
                  >
                    <td />
                    <th css={s(headingEcho, (t) => py(t.spacing.md))}>
                      {t(`expertLeadTest:compare.fotp`)}
                    </th>
                    <th css={s(headingEcho, (t) => py(t.spacing.md))}>
                      {t(`expertLeadTest:compare.others`)}
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
                          textAlign: "left",
                        }))}
                      >
                        {t(`expertLeadTest:compare.${item}`)}
                      </td>
                      <td
                        css={s((t) => ({
                          color: t.color.state.success,
                          ...py(t.spacing.md),
                        }))}
                      >
                        <Icon _css={s(size([14, null, 16]))} path={tick} />
                      </td>
                      <td
                        css={s((t) => ({
                          color: t.color.tint.sage,
                          ...py(t.spacing.md),
                        }))}
                      >
                        <Icon _css={s(size([14, null, 16]))} path={cross} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ScrollLink
                css={s(contrastButton(), (t) => ({
                  fontSize: 18,
                  marginTop: t.spacing.xl,
                  maxWidth: ["none", null, 300],
                  ...mx("auto"),
                  width: "100%",
                }))}
                duration={500}
                href="#bundles"
                offset={-60}
                smooth={true}
                to="bundles"
              >
                {t("expertLeadTest:cta")}
              </ScrollLink>
            </div>
          </section>

          <div
            css={s({
              display: ["block", null, "none"],
              position: "relative",
            })}
          >
            <ResponsiveImage
              alt=""
              sizes={{ width: ["100vw", null, null] }}
              src={DOGS_IMG}
            />
          </div>

          {faq && (
            <section
              css={s(gutter, (t) => ({ paddingTop: [t.spacing.xxl, null, 0] }))}
              id="faqs"
            >
              <div css={s(belt, { maxWidth: 840 })}>
                <h2
                  css={s(headingAlpha, (t) => ({
                    fontSize: [32, 36, 42, 48],
                    lineHeight: ["36px", "38px", "48px", "54px"],
                    marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                    textAlign: "center",
                  }))}
                >
                  {t("expertLeadTest:faqs.title")}
                </h2>
                {faq?.fields?.map(
                  ({
                    faq: {
                      _meta: { uid },
                      answer,
                      question,
                    },
                  }) =>
                    answer &&
                    question && (
                      <Accordion
                        key={uid}
                        id={`faq-${uid}`}
                        label={<RichTextFragment render={question} />}
                        labelAs="h3"
                      >
                        <div
                          css={s(bodyText, (t) => ({
                            marginBottom: t.spacing.md,
                          }))}
                        >
                          <RichText render={answer} />
                        </div>
                      </Accordion>
                    )
                )}
              </div>
            </section>
          )}

          <section
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.feature3,
              textAlign: "center",
            }))}
          >
            <div css={s(belt)}>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: [t.spacing.lg, null, t.spacing.xl],
                }))}
              >
                {t("expertLeadTest:refunds.title")}
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  fontWeight: t.font.primary.weight.medium,
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("expertLeadTest:refunds.subtext")}
              </p>
              <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.sm }))}>
                {t("expertLeadTest:refunds.text1")}
              </p>
              <p css={s(bodyText)}>{t("expertLeadTest:refunds.text2")}</p>
              <ScrollLink
                css={s(contrastButton(), (t) => ({
                  fontSize: 18,
                  marginTop: t.spacing.xl,
                  maxWidth: ["none", null, 300],
                  ...mx("auto"),
                  width: "100%",
                }))}
                duration={500}
                href="#bundles"
                offset={-60}
                smooth={true}
                to="bundles"
              >
                {t("expertLeadTest:cta")}
              </ScrollLink>
            </div>
          </section>
        </main>

        <Footer />

        <RecentPurchases />
        <ProductSchema product={data.ecommerce} />

        <ToastRack
          _css={s({
            height: 0,
            position: "fixed",
            right: 0,
            top: [height.nav.mobile, null, height.nav.desktop],
            zIndex: 99999,
          })}
        />
      </CustomizationProvider>
    </ProductPageDataProvider>
  );
};

export default ExpertLeadMove;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [{ params: { customization: [] } }],
  };
};

export const getStaticProps = makeProductPageStaticPropsGetter(
  "move",
  async (result, { params }, { apolloClient }) => {
    if (params && Array.isArray(params.customization)) {
      // Ingore invalid routes
      if (params.customization.length !== 1) {
        return {
          notFound: true,
        };
      }

      const customization = params.customization[0];

      const { data } = await runServerSideQuery(apolloClient, {
        query: CUSTOMIZATION,
        variables: {
          handle: `move-expert-lead-${customization}`,
        },
      });

      if (!data?.pCustomization) {
        return { notFound: true };
      }

      return {
        ...result,
        props: {
          ...result.props,
          customizationDict: toCustomizationDictionary(
            data.pCustomization.body
          ),
        },
      };
    }

    return result;
  }
);
