import { NextPageWithApollo } from "@sss/apollo";
import { getProductComputedMetadata } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { hasContent, RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
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
  StyleFn,
} from "@/common/ui/utils";

import COMMON_EXPERTS_SCOTT_MILLER_IMG from "../../assets/images/common/experts/SCOTT_MILLER.jpg";
import LARGE_IMG from "../../assets/images/common/sizes/LARGE.png";
import MEDIUM_IMG from "../../assets/images/common/sizes/MEDIUM.png";
import SMALL_IMG from "../../assets/images/common/sizes/SMALL.png";
import DOGS_IMG from "../../assets/images/offers/DOGS.jpg";
import DOGS2_IMG from "../../assets/images/offers/DOGS2.jpg";
import GUNNER_IMG from "../../assets/images/offers/GUNNER.png";
import OG_IMG from "../../assets/images/offers/open-graph/SOOTHE_EXPERT_LEAD.jpg";
import OFFERS_SOOTHE_HERO_IMG from "../../assets/images/offers/SOOTHE_HERO.jpg";
import OFFERS_SOOTHE_HERO_MOBILE_IMG from "../../assets/images/offers/SOOTHE_HERO_MOBILE.jpg";
import SOOTHE_BENEFIT_1_IMG from "../../assets/images/offers/tests/ITCH_BENEFIT_3.png";
import SOOTHE_BENEFIT_3_IMG from "../../assets/images/offers/tests/SETTLE_BENEFIT_1.png";
import SOOTHE_BENEFIT_2_IMG from "../../assets/images/offers/tests/SETTLE_BENEFIT_3.png";
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
import ResponsiveImage from "../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../../ui/base/typography";
import cross from "../../ui/icons/cross";
import paw from "../../ui/icons/paw";
import tick from "../../ui/icons/tick";
import Footer from "../../ui/modules/footer";
import BundlePicker from "../../ui/modules/offers/bundle-picker";
import SalesFunnelHeader from "../../ui/modules/sales-funnel-header";
import { StyleProps } from "../../ui/styles/helpers";
import { dataUriFromPath } from "../../ui/styles/utils";
import { height, spacing } from "../../ui/styles/variables";

const enUsResource = {
  benefits: {
    feature1: {
      text:
        "Omega-3 fish oil - as a concentrated powder - enriches skin cell membranes and supports healthy skin and inflammatory balance.",
      title: "Soothes & nourishes dry, itchy skin",
    },
    feature2: {
      text:
        "Powerful postbiotics support a strong and healthy gut microbiome and reinforce healthy skin immune responses.",
      title: "Supports healthy gut function",
    },
    feature3: {
      text:
        "Protein-rich egg membrane reduces free radicals and oxidative damage, supporting skin & immune health",
      title: "Promotes healthy immune response",
    },
    text:
      "Itchy skin and digestive issues are two of the most common health concerns found in dogs. So our team of expert vets and biochemists developed a postbiotic supplement to tackle these two specific health issues head on, to keep your dog’s skin and coat healthy all year round, while also supporting their digestive health.",
    title: "3 health benefits in 1 world class postbiotic",
  },
  compare: {
    fotp: "Soothe",
    item1: "Clinically proven ingredients",
    item2: "No binders, fillers or additives",
    item3: "100% traceable ingredients",
    item4: "Rigorous third party testing",
    item5: "Industry leading suppliers",
    others: "Other brands",
    title: "So, how does Soothe compare?",
  },
  cta: "Buy now",
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
      "Packed with the benefits of billions of ‘good’ microbes it could be life-changing for your dog’s health",
    title:
      "A Vet Recommended Probiotic To Soothe Your Dog’s Itching & Support A Healthy Gut",
  },
  ingredients: {
    text:
      "Soothe is the only supplement to combine three clinically-tested-in-dogs postbiotics with high purity fish oil and egg-membrane protein, creating one revolutionary blend.",
    title: "5 powerful ingredients for targeted skin & digestive support",
  },
  meta: {
    description:
      "Soothe combines three clinically-tested-in-dogs postbiotics shown to support healthy, clear skin, a strong gut & healthy microbiome as well as a healthy immune response.",
    openGraph: {
      description:
        "Soothe combines three clinically-tested-in-dogs postbiotics shown to support healthy, clear skin, a strong gut & healthy microbiome as well as a healthy immune response.",
      title:
        "A Vet Recommended Probiotic To Soothe Your Dog’s Itching & Support A Healthy Gut",
    },
    title:
      "A Vet Recommended Probiotic To Soothe Your Dog’s Itching & Support A Healthy Gut | FOTP",
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
      item1: "Support healthy, clear skin and coat",
      item2: "Promote healthy gut function",
      item3: "Support a healthy immune response",
      item4: "And more...",
    },
    title:
      "Soothe™ is the first dog supplement that combines three clinically-tested-in-dogs postbiotics, shown to:",
  },
  testimonial: {
    name: "Gunner's Dad",
    quote: "Gunner’s skin is much less itchy & he’s much more energetic",
    title:
      "Thousands of dogs are seeing incredible health improvements in as little as 4-6 weeks",
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
          css={s((t) => ({
            margin: "auto",
            marginBottom: t.spacing.xl,
            maxWidth: [180, null, null],
          }))}
        >
          <ResponsiveImage
            alt=""
            sizes={{
              width: "100vw",
            }}
            src={SOOTHE_BENEFIT_1_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("ExpertLeadSoothe:benefits.feature1.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("ExpertLeadSoothe:benefits.feature1.text")}
        </div>
      </Item>
      <Item>
        <div
          css={s((t) => ({
            margin: "auto",
            marginBottom: t.spacing.xl,
            maxWidth: [180, null, null],
          }))}
        >
          <ResponsiveImage
            alt=""
            sizes={{
              width: "100vw",
            }}
            src={SOOTHE_BENEFIT_2_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("ExpertLeadSoothe:benefits.feature2.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("ExpertLeadSoothe:benefits.feature2.text")}
        </div>
      </Item>
      <Item>
        <div
          css={s((t) => ({
            margin: "auto",
            marginBottom: t.spacing.xl,
            maxWidth: [180, null, null],
          }))}
        >
          <ResponsiveImage
            alt=""
            sizes={{
              width: "100vw",
            }}
            src={SOOTHE_BENEFIT_3_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("ExpertLeadSoothe:benefits.feature3.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("ExpertLeadSoothe:benefits.feature3.text")}
        </div>
      </Item>
    </Grid>
  );
};

const featureUnorderedListItemStyle: StyleFn = (t) => ({
  "& + &": {
    marginTop: t.spacing.xs,
  },
  "&:before": {
    content: `url(${dataUriFromPath({
      fill: t.color.tint.pistachio,
      path: paw,
    })})`,
    display: "block",
    height: "1em",
    left: 0,
    position: "absolute",
    transform: "rotate(-30deg)",
    width: "1em",
  },
  "&:nth-child(even):before": {
    transform: "rotate(30deg)",
  },
  paddingLeft: "2em",
  position: "relative",
});

interface ExpertLeadProps {
  data: UnifiedProductPageData;
}

export const ExpertLeadSoothe: NextPageWithApollo<ExpertLeadProps> = ({
  data,
}) => {
  const { i18n, locale, t } = useLocale();
  const { query } = useRouter();

  const meta = getProductComputedMetadata(data.ecommerce, query, locale);

  i18n.addResourceBundle("en-US", "ExpertLeadSoothe", enUsResource);

  const { cms } = data;

  // We find the first FAQ on the product page type
  const faq = cms?.faqs?.body?.[0];

  const hasBanner = i18n.exists("ExpertLeadSoothe:banner");

  const headerHeights: ResponsiveCSSValue = [
    height.nav.mobile + (hasBanner ? height.banner.mobile : 0),
    null,
    height.nav.desktop + (hasBanner ? height.banner.desktop : 0),
  ];

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <Metadata
        description={t("ExpertLeadSoothe:meta.description")}
        noindex
        title={t("ExpertLeadSoothe:meta.title")}
        openGraph={{
          description: t("ExpertLeadSoothe:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("ExpertLeadSoothe:meta.openGraph.title"),
        }}
      />
      {hasBanner && <div css={s(banner)}>{t("ExpertLeadSoothe:banner")}</div>}
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
              zIndex: 0,
            })}
            priority
            quality={60}
            urls={[
              OFFERS_SOOTHE_HERO_MOBILE_IMG.src,
              null,
              OFFERS_SOOTHE_HERO_IMG.src,
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
                  <Trans i18nKey="ExpertLeadSoothe:header.title" />
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
                      {t("ExpertLeadSoothe:header.expert")}
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
                      {t("ExpertLeadSoothe:header.quote")}
                      &rdquo;
                    </p>
                  </div>
                </div>
                <ScrollLink
                  css={s(belt, contrastButton(), {
                    fontSize: 18,
                    maxWidth: ["none", null, 300],
                    width: "100%",
                  })}
                  duration={500}
                  href="#bundles"
                  offset={-60}
                  smooth={true}
                  to="bundles"
                >
                  {t("ExpertLeadSoothe:cta")}
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
                  <Trans i18nKey="ExpertLeadSoothe:support.title" />
                </h2>
                <div
                  css={s({
                    fontSize: [16, 18, 20],
                    lineHeight: ["24px", "28px", "30px"],
                  })}
                >
                  <ul css={s(bodyText)}>
                    <li css={s(featureUnorderedListItemStyle)}>
                      {t("ExpertLeadSoothe:support.list.item1")}
                    </li>
                    <li css={s(featureUnorderedListItemStyle)}>
                      {t("ExpertLeadSoothe:support.list.item2")}
                    </li>
                    <li css={s(featureUnorderedListItemStyle)}>
                      {t("ExpertLeadSoothe:support.list.item3")}
                    </li>
                    <li css={s(featureUnorderedListItemStyle)}>
                      {t("ExpertLeadSoothe:support.list.item4")}
                    </li>
                  </ul>
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
              <Trans i18nKey="ExpertLeadSoothe:testimonial.title" />
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
                <ResponsiveImage
                  alt=""
                  sizes={{
                    maxWidth: [null, null, 440],
                    width: [150, 180, 220],
                  }}
                  src={GUNNER_IMG}
                />
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
                  {t("ExpertLeadSoothe:testimonial.quote")}
                  &rdquo;
                </p>
                <footer css={s(bodyText)}>
                  – {t("ExpertLeadSoothe:testimonial.name")}
                </footer>
              </div>
            </blockquote>
          </div>
        </section>

        <Guarantee />

        <section css={s(gutter, { textAlign: "center" })} id="bundles">
          <BundlePicker
            skus={["FPSH01-PHx3", "FPSH01-PHx2", "FPSH01-PH"]}
            trackingSource="expert-lead"
          />
        </section>

        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
            color: t.color.text.dark.base,
            textAlign: "center",
          }))}
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
              <Trans i18nKey="ExpertLeadSoothe:feeding.title" />
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: [t.spacing.md, null, t.spacing.xxl],
                maxWidth: 620,
                ...mx("auto"),
                textAlign: "center",
              }))}
            >
              {t("ExpertLeadSoothe:feeding.text")}
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
                    marginTop: t.spacing.lg,
                  }))}
                >
                  {t("ExpertLeadSoothe:feeding.small.guide")}
                </h3>
                <p css={s(bodyText)}>
                  {t("ExpertLeadSoothe:feeding.small.supply")}
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
                    marginTop: t.spacing.lg,
                  }))}
                >
                  {t("ExpertLeadSoothe:feeding.medium.guide")}
                </h3>
                <p css={s(bodyText)}>
                  {t("ExpertLeadSoothe:feeding.medium.supply")}
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
                    marginTop: t.spacing.lg,
                  }))}
                >
                  {t("ExpertLeadSoothe:feeding.large.guide")}
                </h3>
                <p css={s(bodyText)}>
                  {t("ExpertLeadSoothe:feeding.large.supply")}
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
              {t("ExpertLeadSoothe:feeding.text1")}
            </p>
            <p
              css={s(bodyText, {
                maxWidth: 640,
                ...mx("auto"),
              })}
            >
              {t("ExpertLeadSoothe:feeding.text2")}
            </p>
            <ScrollLink
              css={s(belt, contrastButton(), (t) => ({
                fontSize: 18,
                marginTop: t.spacing.xl,
                maxWidth: ["none", null, 300],
                width: "100%",
              }))}
              duration={500}
              href="#bundles"
              offset={-60}
              smooth={true}
              to="bundles"
            >
              {t("ExpertLeadSoothe:cta")}
            </ScrollLink>
          </div>
        </section>

        <div css={s({ display: ["block", null, "none"] })}>
          <ResponsiveImage alt="" sizes="100vw" src={DOGS2_IMG} />
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
              <Trans i18nKey="ExpertLeadSoothe:benefits.title" />
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.xxl,
                maxWidth: 650,
                ...mx("auto"),
                textAlign: "center",
              }))}
            >
              {t("ExpertLeadSoothe:benefits.text")}
            </p>
            <Benefits />
            <ScrollLink
              css={s(belt, contrastButton(), (t) => ({
                fontSize: 18,
                marginTop: t.spacing.xxl,
                maxWidth: ["none", null, 300],
                width: "100%",
              }))}
              duration={500}
              href="#bundles"
              offset={-60}
              smooth={true}
              to="bundles"
            >
              {t("ExpertLeadSoothe:cta")}
            </ScrollLink>
          </div>
        </section>

        <Guarantee />

        {cms.product?.ingredients && (
          <section
            css={s(gutter, {
              paddingBottom: 0,
              textAlign: "center",
            })}
          >
            <div css={s(belt)}>
              <div css={s(belt, { maxWidth: 800 })}>
                <h2
                  css={s(headingAlpha, (t) => ({
                    fontSize: [32, 36, 42, 48],
                    lineHeight: ["36px", "38px", "48px", "54px"],
                    marginBottom: t.spacing.md,
                    ...mx("auto"),
                  }))}
                >
                  <Trans i18nKey="ExpertLeadSoothe:ingredients.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xxl,
                    maxWidth: 800,
                    ...mx("auto"),
                    textAlign: "center",
                  }))}
                >
                  {t("ExpertLeadSoothe:ingredients.text")}
                </p>
              </div>
              <Grid
                _css={s({ maxWidth: 1140, ...mx("auto") })}
                gx={spacing.xl}
                gy={spacing.xxl}
                itemWidth={["100%", null, percentage(1 / 3)]}
              >
                {cms.product?.ingredients.map(({ ingredient }) => (
                  <Item key={ingredient._meta.uid}>
                    {ingredient.image?.url && (
                      <div
                        css={s((t) => ({
                          borderRadius: t.radius.xxl,
                          marginBottom: t.spacing.md,
                          width: 200,
                          ...mx("auto"),
                        }))}
                      >
                        <ResponsiveImage
                          _css={s((t) => ({ borderRadius: t.radius.xxl }))}
                          alt=""
                          height={400}
                          width={400}
                          sizes={{ width: 200 }}
                          src={ingredient.image.url}
                        />
                      </div>
                    )}
                    {hasContent(ingredient.type) && (
                      <h3
                        css={s(headingDelta, (t) => ({
                          marginBottom: [t.spacing.xs, null, t.spacing.sm],
                        }))}
                      >
                        <RichTextFragment render={ingredient.type} />
                      </h3>
                    )}
                    {hasContent(ingredient.productName) && (
                      <h4
                        css={s(bodyText, (t) => ({
                          marginBottom: t.spacing.md,
                        }))}
                      >
                        <em>
                          <RichTextFragment render={ingredient.productName} />
                        </em>
                      </h4>
                    )}
                    {hasContent(ingredient.summary) && (
                      <p
                        css={s(bodyTextSmall, { maxWidth: 320, ...mx("auto") })}
                      >
                        <RichTextFragment render={ingredient.summary} />
                      </p>
                    )}
                  </Item>
                ))}
              </Grid>
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
              {t("ExpertLeadSoothe:compare.title")}
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
                    {t(`ExpertLeadSoothe:compare.fotp`)}
                  </th>
                  <th css={s(headingEcho, (t) => py(t.spacing.md))}>
                    {t(`ExpertLeadSoothe:compare.others`)}
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
                      {t(`ExpertLeadSoothe:compare.${item}`)}
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
              css={s(belt, contrastButton(), (t) => ({
                fontSize: 18,
                marginTop: t.spacing.xl,
                maxWidth: ["none", null, 300],
                width: "100%",
              }))}
              duration={500}
              href="#bundles"
              offset={-60}
              smooth={true}
              to="bundles"
            >
              {t("ExpertLeadSoothe:cta")}
            </ScrollLink>
          </div>
        </section>
        <div css={s({ display: ["block", null, "none"] })}>
          <ResponsiveImage alt="" sizes="100vw" src={DOGS_IMG} />
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
                {t("ExpertLeadSoothe:faqs.title")}
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
              {t("ExpertLeadSoothe:refunds.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                fontWeight: t.font.primary.weight.medium,
                marginBottom: t.spacing.sm,
              }))}
            >
              {t("ExpertLeadSoothe:refunds.subtext")}
            </p>
            <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.sm }))}>
              {t("ExpertLeadSoothe:refunds.text1")}
            </p>
            <p css={s(bodyText)}>{t("ExpertLeadSoothe:refunds.text2")}</p>
            <ScrollLink
              css={s(belt, contrastButton(), (t) => ({
                fontSize: 18,
                marginTop: t.spacing.xl,
                maxWidth: ["none", null, 300],
                width: "100%",
              }))}
              duration={500}
              href="#bundles"
              offset={-60}
              smooth={true}
              to="bundles"
            >
              {t("ExpertLeadSoothe:cta")}
            </ScrollLink>
          </div>
        </section>
      </main>

      <Footer />
    </ProductPageDataProvider>
  );
};

export default ExpertLeadSoothe;

export const getStaticProps = makeProductPageStaticPropsGetter("soothe");
