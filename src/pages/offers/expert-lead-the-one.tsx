import useGoogleOptimize from "@react-hook/google-optimize";
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
  gutter,
  gutterTop,
  gutterX,
  mx,
  my,
  navigationTarget,
  percentage,
  px,
  py,
  ResponsiveCSSValue,
  s,
  size,
} from "@/common/ui/utils";

import COMMON_EXPERTS_SCOTT_MILLER_IMG from "../../assets/images/common/experts/SCOTT_MILLER.jpg";
import COMMON_SIZES_LARGE_IMG from "../../assets/images/common/sizes/LARGE.png";
import COMMON_SIZES_MEDIUM_IMG from "../../assets/images/common/sizes/MEDIUM.png";
import COMMON_SIZES_SMALL_IMG from "../../assets/images/common/sizes/SMALL.png";
import CHURCHILL_IMG from "../../assets/images/offers/CHURCHILL.png";
import DOGS2_IMG from "../../assets/images/offers/DOGS2.jpg";
import OG_IMG from "../../assets/images/offers/open-graph/THE_ONE_EXPERT_LEAD.jpg";
import OFFERS_THE_ONE_HERO_IMG from "../../assets/images/offers/THE_ONE_HERO.jpg";
import OFFERS_THE_ONE_HERO_MOBILE_IMG from "../../assets/images/offers/THE_ONE_HERO_MOBILE.jpg";
import OFFERS_THE_ONE_INTRO_IMG from "../../assets/images/offers/THE_ONE_INTRO.jpg";
import OFFERS_WILLOW_ONE_IMG from "../../assets/images/offers/WILLOW_ONE.jpg";
import { RichText } from "../../cms/prismic";
import { Product as CMSProduct } from "../../cms/product";
import {
  makeProductPageStaticPropsGetter,
  ProductPageDataProvider,
  UnifiedProductPageData,
  useProductPageData,
} from "../../cms/product-page";
import Accordion from "../../ui/base/accordion";
import banner from "../../ui/base/banner";
import { contrastButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import Icon from "../../ui/base/icon";
import { decorativeListItem } from "../../ui/base/list";
import ResponsiveImage from "../../ui/base/responsive-image";
import { ToastRack } from "../../ui/base/toast";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../../ui/base/typography";
import benfitIcons from "../../ui/icons/benefits";
import cross from "../../ui/icons/cross";
import tick from "../../ui/icons/tick";
import Footer from "../../ui/modules/footer";
import { IngredientsGrid } from "../../ui/modules/ingredients";
import BundlePicker from "../../ui/modules/offers/bundle-picker";
import TheOneBundlePicker from "../../ui/modules/offers/the-one-bundle-picker";
import RecentPurchases from "../../ui/modules/recent-purchases";
import Rating from "../../ui/modules/reviews/rating";
import { ReviewsProductWidget } from "../../ui/modules/reviews/widgets";
import SalesFunnelHeader from "../../ui/modules/sales-funnel-header";
import { font, height, spacing } from "../../ui/styles/variables";

const enUsResource = {
  banner: "90 day ‘No Questions Asked’ Guarantee",
  benefits: {
    text:
      "Our experts identified the eight areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on.",
    title: "8 health benefits in 1 world class supplement",
  },
  compare: {
    fotp: "The One",
    item1: "Clinically proven ingredients",
    item2: "No binders, fillers or additives",
    item3: "100% traceable ingredients",
    item4: "Rigorous third party testing",
    item5: "Industry leading suppliers",
    others: "Other brands",
    title: "So, how does The One compare?",
  },
  cta: "Buy now",
  experts: {
    anthony: {
      name: "Churchill's mom",
      quote:
        "Churchill is one of the fussiest eaters around. We just got our first tub of The One and he LOVES it. You absolutely have a customer for life.",
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
      "Thousands of dogs are seeing incredible health improvements in as little as 4-6 weeks",
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
      "The powerful ingredients in The One could be life-changing for your dog",
    title:
      "A Vet <i>Recommended Supplement</i> With 8 Powerful Health-Boosting Benefits",
  },
  ingredients: {
    text:
      "Most dog supplements lack evidence and rely on borrowed scientific claims. The One is different. All twelve ingredients are patented and clinically-proven to do precisely what they say.",
    title: "12 clinically-proven ingredients in every tub",
  },
  meta: {
    description:
      "Fight joint discomfort, itchy skin, smelly breath, anxiety, digestive issues & boost immunity with The One. Eight essential benefits in one daily supplement.",
    openGraph: {
      description: "Eight essential benefits in one daily dog supplement. ",
      title: "8 Targeted Health Benefits In 1 Daily Dog Supplement",
    },
    title: "8 Targeted Health Benefits In 1 Daily Dog Supplement | FOTP",
  },
  refunds: {
    subtext: "Customer satisfaction is our #1 priority",
    text1:
      "If you are unhappy with a product, simply return it within 90 days of receiving it and we’ll give you a full refund.",
    text2: "It’s that simple.",
    title: "Refund policy",
  },
  reviews: {
    title: "Customer reviews",
  },
  support: {
    list: {
      item1: "Relieve Joint Discomfort",
      item2: "Fight Stress",
      item3: "Support Healthy Digestion",
      item4: "Boost Immunity",
      item5: "And more...",
    },
    title:
      "Packed with 12 clinically proven ingredients it offers <i>unparalleled</i> support to help:",
  },
};

const comparisonItems = ["item1", "item2", "item3", "item4", "item5"];

const Benefits: FC<CMSProduct> = ({ benefits }) =>
  benefits && (
    <Grid
      _css={s({ textAlign: "center" })}
      gx={spacing.md}
      gy={[spacing.lg, null, spacing.xl]}
      itemWidth={[percentage(1 / 2), null, percentage(1 / 4)]}
    >
      {benefits.map(({ benefit: { icon, name, value } }, index) => (
        <Item key={index}>
          <div css={s(belt, { maxWidth: 200 })}>
            {icon && (
              <Icon
                _css={s((t) => ({
                  marginBottom: t.spacing.sm,
                  ...size([80, null, 90, null, 100]),
                }))}
                path={benfitIcons[icon]}
              />
            )}
            {name && (
              <h3
                css={s(headingDelta, (t) => ({ marginBottom: t.spacing.sm }))}
              >
                <RichTextFragment render={name} />
              </h3>
            )}
            {value && (
              <p css={s(bodyTextSmall)}>
                <RichTextFragment render={value} />
              </p>
            )}
          </div>
        </Item>
      ))}
    </Grid>
  );

const Reviews = () => {
  const { t } = useLocale();
  const { ecommerce } = useProductPageData();

  return ecommerce.bottomline?.totalReviews ? (
    <section css={s(gutter, (t) => ({ paddingTop: [t.spacing.xxl, null, 0] }))}>
      <div id="product-reviews">
        <div css={s(belt)}>
          <h2 css={s(headingBravo, { textAlign: "center" })}>
            {t("expertLeadTheOne:reviews.title")}
          </h2>
          <ReviewsProductWidget
            _css={s({ minHeight: [3500, 3150, 2800] })}
            product={ecommerce}
          />
        </div>
      </div>
    </section>
  ) : null;
};

enum GoogleOptimizeVariant {
  ALTERNATIVE = "ALTERNATIVE",
  ORIGINAL = "ORIGINAL",
}

interface ExpertLeadProps {
  customizationDict?: CustomizationDict;
  data: UnifiedProductPageData;
}

export const ExpertLeadTheOne: NextPageWithApollo<ExpertLeadProps> = ({
  customizationDict,
  data,
}) => {
  const googleOptimizeVariant = useGoogleOptimize(
    "LyOrh2YTTyC2sat6G-aD5A", // https://optimize.google.com/optimize/home/#/accounts/4703495009/containers/13785524/experiments/194
    [GoogleOptimizeVariant.ORIGINAL, GoogleOptimizeVariant.ALTERNATIVE],
    4000 // Timeout after 4 seconds to prevent delayed UI changes
  );
  const { i18n, locale, t } = useLocale();
  const { query } = useRouter();

  const skus = ["FPTO01-PHx3", "FPTO01-PHx2", "FPTO01-PH"];

  const meta = getProductComputedMetadata(data.ecommerce, query, locale);

  const hasTwoStepBundlePicker =
    (googleOptimizeVariant === GoogleOptimizeVariant.ALTERNATIVE ||
      query.picker === "alternative") &&
    !(
      meta.subscription.hasSubscription && meta.subscription.isSubscriptionOnly
    );

  i18n.addResourceBundle("en-US", "expertLeadTheOne", enUsResource);

  const {
    cms,
    ecommerce: { bottomline },
  } = data;

  // We find the first FAQ on the product page type
  const faq = cms?.faqs?.body?.[0];

  const hasBanner = i18n.exists("expertLeadTheOne:banner");

  const headerHeights: ResponsiveCSSValue = [
    height.nav.mobile + (hasBanner ? height.banner.mobile : 0),
    null,
    height.nav.desktop + (hasBanner ? height.banner.desktop : 0),
  ];

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <CustomizationProvider dictionary={customizationDict}>
        <Metadata
          description={t("expertLeadTheOne:meta.description")}
          noindex={!!customizationDict}
          title={t("expertLeadTheOne:meta.title")}
          openGraph={{
            description: t("expertLeadTheOne:meta.openGraph.description"),
            image: OG_IMG.src,
            title: t("expertLeadTheOne:meta.openGraph.title"),
          }}
        />

        {hasBanner && <div css={s(banner)}>{t("expertLeadTheOne:banner")}</div>}
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
              color: t.color.text.dark.base,
              marginTop: headerHeights,
              position: "relative",
            }))}
          >
            <Grid
              _css={s(mx("auto"))}
              direction="rtl"
              itemWidth={["100%", null, null, "50%"]}
            >
              <Item>
                <div
                  css={s({
                    display: ["none", null, null, "block"],
                    height: [null, null, 640, 760],
                    position: "relative",
                    width: "100%",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    quality={50}
                    sizes="100vw"
                    src={OFFERS_THE_ONE_HERO_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, null, "none"] })}>
                  <ResponsiveImage
                    alt=""
                    sizes="100vw"
                    src={OFFERS_THE_ONE_HERO_MOBILE_IMG}
                  />
                </div>
              </Item>
              <Item>
                <div
                  css={s(belt, (t) => ({
                    height: "100%",
                    maxWidth: 640,
                    ...px([t.spacing.md, null, t.spacing.lg]),
                    paddingBottom: [0, null, null, t.spacing.xl],
                    paddingTop: [t.spacing.lg, null, t.spacing.xl],
                    position: "relative",
                    zIndex: 5,
                  }))}
                >
                  <div
                    css={s({
                      alignItems: ["flex-start", null, null, "center"],
                      display: "flex",
                      height: "100%",
                      textAlign: ["center", null, null, "left"],
                    })}
                  >
                    <div
                      css={s((t) => ({
                        ...px([0, t.spacing.md, 0]),
                        width: "100%",
                      }))}
                    >
                      <h1
                        css={s(headingAlpha, (t) => ({
                          fontSize: [28, 32, 40, 48],
                          lineHeight: ["36px", "38px", "48px", "54px"],
                          marginBottom: [t.spacing.md, null, t.spacing.xl],
                          maxWidth: [null, null, null, 500, 580],
                          textAlign: ["center", null, null, "left"],
                        }))}
                      >
                        <TitleCustomization target="header:title">
                          <Trans i18nKey="expertLeadTheOne:header.title" />
                        </TitleCustomization>
                      </h1>
                      <div
                        css={s((t) => ({
                          alignItems: "flex-start",
                          display: "flex",
                          marginBottom: [30, null, t.spacing.xl],
                          textAlign: "left",
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
                            {t("expertLeadTheOne:header.expert")}
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
                              {t("expertLeadTheOne:header.quote")}
                            </TitleCustomization>
                            &rdquo;
                          </p>
                        </div>
                      </div>
                      <ScrollLink
                        css={s(contrastButton(), {
                          maxWidth: ["none", null, 400, 320],
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
                        {t("expertLeadTheOne:cta")}
                      </ScrollLink>
                      {bottomline && (
                        <div
                          css={s((t) => ({
                            marginTop: t.spacing.md,
                            textAlign: ["center", null, null, "left"],
                          }))}
                        >
                          <ScrollLink
                            duration={500}
                            smooth={true}
                            to="product-reviews"
                          >
                            <Rating {...bottomline} clickable />
                          </ScrollLink>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Item>
            </Grid>
          </header>
          <section
            css={s((t) => ({
              color: t.color.text.dark.base,
              paddingTop: [t.spacing.xl, null, 96],
              ...mx("auto"),
            }))}
          >
            <Grid
              _css={s(mx("auto"))}
              itemWidth={["100%", null, "47%"]}
              direction="rtl"
            >
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
                    paddingBottom: [t.spacing.xl, t.spacing.xxl, 0],
                    paddingTop: 0,
                    ...px([t.spacing.md, t.spacing.xl]),
                    width: "100%",
                  }))}
                >
                  <h2
                    css={s(headingAlpha, (t) => ({
                      fontSize: [32, 36, 42, 48],
                      lineHeight: ["36px", "38px", "48px", "54px"],
                      marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    }))}
                  >
                    <TitleCustomization target="support:title">
                      <Trans i18nKey="expertLeadTheOne:support.title" />
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
                          {t("expertLeadTheOne:support.list.item1")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTheOne:support.list.item2")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTheOne:support.list.item3")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTheOne:support.list.item4")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadTheOne:support.list.item5")}
                        </li>
                      </ul>
                    </RichTextCustomization>
                  </div>
                </div>
              </Item>
              <Item>
                {/* It's not possible to switch `layout` prop using media queries, so we'll render both images, but Next will only load the visible one */}
                <div
                  css={s({
                    display: ["none", null, "block"],
                    height: [null, null, 500, 600, 700],
                    position: "relative",
                    width: "100%",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    quality={50}
                    sizes={{
                      width: [null, null, 500, 600, 700].map(
                        (height) => height && height * (1280 / 862)
                      ),
                    }}
                    src={OFFERS_THE_ONE_INTRO_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, "none"] })}>
                  <ResponsiveImage
                    alt=""
                    sizes="100vw"
                    src={OFFERS_THE_ONE_INTRO_IMG}
                  />
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
                <Trans i18nKey="expertLeadTheOne:experts.title" />
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
                      src={CHURCHILL_IMG}
                    />
                  </ImageCustomization>
                </div>
                <div>
                  <p
                    css={s(headingBravo, (t) => ({
                      fontFamily: font.secondary.family,
                      fontStyle: "italic",
                      fontWeight: font.secondary.weight.book,
                      marginBottom: [t.spacing.lg, null, t.spacing.md],
                    }))}
                  >
                    &ldquo;
                    <TitleCustomization target="testimonial:quote">
                      {t("expertLeadTheOne:experts.anthony.quote")}
                    </TitleCustomization>
                    &rdquo;
                  </p>
                  <footer css={s(bodyText)}>
                    –{" "}
                    <TitleCustomization target="testimonial:attribution">
                      {t("expertLeadTheOne:experts.anthony.name")}
                    </TitleCustomization>
                  </footer>
                </div>
              </blockquote>
            </div>
          </section>

          <Guarantee />

          <section
            css={s(
              ...(hasTwoStepBundlePicker ? [gutterX, gutterTop] : [gutter]),
              {
                textAlign: "center",
              }
            )}
            id="bundles"
          >
            {hasTwoStepBundlePicker ? (
              <TheOneBundlePicker skus={skus} trackingSource="expert-lead" />
            ) : (
              <BundlePicker skus={skus} trackingSource="expert-lead" />
            )}
          </section>

          {!hasTwoStepBundlePicker && (
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
                  <Trans i18nKey="expertLeadTheOne:feeding.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: [t.spacing.md, null, t.spacing.xxl],
                    maxWidth: 620,
                    ...mx("auto"),
                    textAlign: "center",
                  }))}
                >
                  {t("expertLeadTheOne:feeding.text")}
                </p>
                <Grid
                  gx={spacing.lg}
                  gy={spacing.xl}
                  itemWidth={["100%", null, percentage(1 / 3)]}
                >
                  <Item>
                    <div
                      css={s((t) => ({
                        display: "inline-block",
                        marginBottom: t.spacing.lg,
                        width: 160,
                      }))}
                    >
                      <ResponsiveImage
                        alt=""
                        sizes={{ width: 160 }}
                        src={COMMON_SIZES_SMALL_IMG}
                      />
                    </div>
                    <h3
                      css={s(headingDelta, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t("expertLeadTheOne:feeding.small.guide")}
                    </h3>
                    <p css={s(bodyText)}>
                      {t("expertLeadTheOne:feeding.small.supply")}
                    </p>
                  </Item>
                  <Item>
                    <div
                      css={s((t) => ({
                        display: "inline-block",
                        marginBottom: t.spacing.lg,
                        width: 160,
                      }))}
                    >
                      <ResponsiveImage
                        alt=""
                        sizes={{ width: 160 }}
                        src={COMMON_SIZES_MEDIUM_IMG}
                      />
                    </div>
                    <h3
                      css={s(headingDelta, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t("expertLeadTheOne:feeding.medium.guide")}
                    </h3>
                    <p css={s(bodyText)}>
                      {t("expertLeadTheOne:feeding.medium.supply")}
                    </p>
                  </Item>
                  <Item>
                    <div
                      css={s((t) => ({
                        display: "inline-block",
                        marginBottom: t.spacing.lg,
                        width: 160,
                      }))}
                    >
                      <ResponsiveImage
                        alt=""
                        sizes={{ width: 160 }}
                        src={COMMON_SIZES_LARGE_IMG}
                      />
                    </div>
                    <h3
                      css={s(headingDelta, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t("expertLeadTheOne:feeding.large.guide")}
                    </h3>
                    <p css={s(bodyText)}>
                      {t("expertLeadTheOne:feeding.large.supply")}
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
                  {t("expertLeadTheOne:feeding.text1")}
                </p>
                <p
                  css={s(bodyText, {
                    maxWidth: 640,
                    ...mx("auto"),
                  })}
                >
                  {t("expertLeadTheOne:feeding.text2")}
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
                  {t("expertLeadTheOne:cta")}
                </ScrollLink>
              </div>
            </section>
          )}

          <div css={s({ display: ["block", null, "none"] })}>
            <ResponsiveImage alt="" sizes="100vw" src={DOGS2_IMG} />
          </div>

          {/* Benefits */}
          {data.cms?.product?.benefits && (
            <section css={s(gutter, { textAlign: "center" })}>
              <div
                css={s(belt, {
                  maxWidth: [480, null, 1280],
                })}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    fontSize: [32, 36, 42, 48],
                    lineHeight: ["36px", "38px", "48px", "54px"],
                    marginBottom: t.spacing.md,
                    ...mx("auto"),
                  }))}
                >
                  <Trans i18nKey="expertLeadTheOne:benefits.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xxl,
                    maxWidth: 700,
                    ...mx("auto"),
                    textAlign: "center",
                  }))}
                >
                  {t("expertLeadTheOne:benefits.text")}
                </p>
                <Benefits {...data.cms.product} />
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
                  {t("expertLeadTheOne:cta")}
                </ScrollLink>
              </div>
            </section>
          )}

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
                  <Trans i18nKey="expertLeadTheOne:ingredients.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xxl,
                    maxWidth: 800,
                    ...mx("auto"),
                    textAlign: "center",
                  }))}
                >
                  {t("expertLeadTheOne:ingredients.text")}
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
                {t("expertLeadTheOne:compare.title")}
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
                      {t(`expertLeadTheOne:compare.fotp`)}
                    </th>
                    <th css={s(headingEcho, (t) => py(t.spacing.md))}>
                      {t(`expertLeadTheOne:compare.others`)}
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
                        {t(`expertLeadTheOne:compare.${item}`)}
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
                {t("expertLeadTheOne:cta")}
              </ScrollLink>
            </div>
          </section>

          <div css={s({ display: ["block", null, "none"] })}>
            <ResponsiveImage alt="" sizes="100vw" src={OFFERS_WILLOW_ONE_IMG} />
          </div>

          <Reviews />

          {faq && (
            <section
              css={s(gutter, navigationTarget(headerHeights), (t) => ({
                paddingTop: [t.spacing.xxl, null, 0],
              }))}
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
                  {t("expertLeadTheOne:faqs.title")}
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
                {t("expertLeadTheOne:refunds.title")}
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  fontWeight: t.font.primary.weight.medium,
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("expertLeadTheOne:refunds.subtext")}
              </p>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("expertLeadTheOne:refunds.text1")}
              </p>
              <p css={s(bodyText)}>{t("expertLeadTheOne:refunds.text2")}</p>
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
                {t("expertLeadTheOne:cta")}
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

export default ExpertLeadTheOne;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [{ params: { customization: [] } }],
  };
};

export const getStaticProps = makeProductPageStaticPropsGetter(
  "the-one",
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
          handle: `the-one-expert-lead-${customization}`,
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
