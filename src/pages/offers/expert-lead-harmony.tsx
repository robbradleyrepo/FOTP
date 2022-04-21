import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
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
import LARGE_IMG from "../../assets/images/common/sizes/LARGE.png";
import MEDIUM_IMG from "../../assets/images/common/sizes/MEDIUM.png";
import SMALL_IMG from "../../assets/images/common/sizes/SMALL.png";
import DOGS2_IMG from "../../assets/images/offers/DOGS2.jpg";
import HARMONY_BEADLETS_IMG from "../../assets/images/offers/HARMONY_BEADLETS.jpg";
import HARMONY_BENEFIT_1_IMG from "../../assets/images/offers/HARMONY_BENEFIT_1.png";
import HARMONY_BENEFIT_2_IMG from "../../assets/images/offers/HARMONY_BENEFIT_2.png";
import HARMONY_BENEFIT_3_IMG from "../../assets/images/offers/HARMONY_BENEFIT_3.png";
import OFFERS_HARMONY_HERO_IMG from "../../assets/images/offers/HARMONY_HERO.jpg";
import OFFERS_HARMONY_HERO_MOBILE_IMG from "../../assets/images/offers/HARMONY_HERO_MOBILE.jpg";
import OFFERS_HARMONY_INTRO_IMG from "../../assets/images/offers/HARMONY_INTRO.jpg";
import OG_IMG from "../../assets/images/offers/open-graph/HARMONY_EXPERT_LEAD.jpg";
import SAGE_IMG from "../../assets/images/offers/SAGE.png";
import { RichText } from "../../cms/prismic";
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
import Rating from "../../ui/modules/reviews/rating";
import { ReviewsProductWidget } from "../../ui/modules/reviews/widgets";
import SalesFunnelHeader from "../../ui/modules/sales-funnel-header";
import { StyleProps } from "../../ui/styles/helpers";
import { height, spacing } from "../../ui/styles/variables";

const enUsResource = {
  banner: "90 day ‘No Questions Asked’ Guarantee",
  benefits: {
    feature1: {
      text:
        "Ashwagandha regulates cortisol levels and supports healthy stress responses in the body",
      title: "Moderates stress",
    },
    feature2: {
      text:
        "L-theanine balances brain chemicals so that a non-drowsy state of calm can be achieved",
      title: "Promotes an alert-state of calm",
    },
    feature3: {
      text: "Relora alleviates nerves and cuts off anxiety at the source",
      title: "Alleviates anxiety",
    },
    text:
      "Our experts identified the key anxiety areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on. To keep your dog calm, stress free and alert all day long.",
    title: "3 anxiety reducing benefits in 1 world class supplement",
  },
  compare: {
    fotp: "Harmony",
    item1: "Clinically proven ingredients",
    item2: "No binders, fillers or additives",
    item3: "100% traceable ingredients",
    item4: "Rigorous third party testing",
    item5: "Industry leading suppliers",
    others: "Other brands",
    title: "So, how does Harmony compare?",
  },
  cta: "Buy now",
  experts: {
    anthony: {
      name: "Sage's mom",
      quote:
        "We started giving our 8 year old border collie Sage Harmony about 2 weeks ago and the difference is remarkable! She's happier and a bit calmer and has less trouble going up the stairs.",
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
      guide: "Dogs over 50lbs = 3 sachets a day",
      supply: "1 box = 10 days supply",
    },
    medium: {
      guide: "Dogs between 25-50lbs = 2 sachets a day",
      supply: "1 box = 15 days supply",
    },
    small: {
      guide: "Dogs under 25lbs = 1 sachet a day",
      supply: "1 box = 1 months supply",
    },
    text:
      "Each box contains 30 1g sachets. That's enough for up to 1 months supply. Check your dog's weight below for the ideal package size:",
    text1:
      "Sprinkle the recommended number of sachets onto your dog’s food once a day, or mix it in with one of their favorite healthy snacks.",
    text2:
      "Use it as-and-when you need it or on a daily basis 60-90 minutes before an anxious episode.",
    title: "How much does my dog need?",
  },
  header: {
    expert: "Dr Scott Miller BVSc",
    quote:
      "Harmony is one of the most effective ways to alleviate your dog's anxiety",
    title:
      "Introducing Harmony, A Vet Recommended Non-Drowsy Anxiety Supplement ",
  },
  ingredients: {
    text:
      "Harmony is the only dog supplement to combine clinically-proven adaptogens and nootropics into one revolutionary blend.",
    title: "3 powerful, natural ingredients for targeted support",
  },
  meta: {
    description:
      "Alleviate your dog's anxiety with our natural, non-drowsy calming supplement. Vet-recommended and made in America it works fast to soothe your dog's anxiety.",
    openGraph: {
      description: "A natural, non-drowsy calming supplement for dogs",
      title: "Keep Your Dog Calm & Relaxed Whatever The Situation",
    },
    title: "Keep Your Dog Calm & Relaxed Whatever The Situation | FOTP",
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
      item1: "Alleviate anxiety",
      item2: "Moderate stress",
      item3: "Promote an alert-state of calm",
      item4: "Without drowsy side-effects",
    },
    title:
      "You’ll be amazed how effectively this world-class anxiety supplement helps",
  },
};

const comparisonItems = ["item1", "item2", "item3", "item4", "item5"];

const Benefits: FC<StyleProps> = () => {
  const { t } = useLocale();

  return (
    <Grid
      _css={s({ textAlign: "center" })}
      gx={spacing.md}
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
            src={HARMONY_BENEFIT_1_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("expertLeadHarmony:benefits.feature1.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("expertLeadHarmony:benefits.feature1.text")}
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
            src={HARMONY_BENEFIT_2_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("expertLeadHarmony:benefits.feature2.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("expertLeadHarmony:benefits.feature2.text")}
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
            src={HARMONY_BENEFIT_3_IMG}
          />
        </div>
        <h3
          css={s(headingDelta, (t) => ({
            ...my([t.spacing.sm, null, t.spacing.md]),
          }))}
        >
          {t("expertLeadHarmony:benefits.feature3.title")}
        </h3>
        <div css={s(bodyText)}>
          {t("expertLeadHarmony:benefits.feature3.text")}
        </div>
      </Item>
    </Grid>
  );
};

const Reviews = () => {
  const { t } = useLocale();
  const { ecommerce } = useProductPageData();

  return ecommerce.bottomline?.totalReviews ? (
    <section css={s(gutter, (t) => ({ paddingTop: [t.spacing.xxl, null, 0] }))}>
      <div id="product-reviews">
        <div css={s(belt)}>
          <h2 css={s(headingBravo, { textAlign: "center" })}>
            {t("expertLeadHarmony:reviews.title")}
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
interface ExpertLeadProps {
  customizationDict?: CustomizationDict;
  data: UnifiedProductPageData;
}

export const ExpertLeadHarmony: NextPageWithApollo<ExpertLeadProps> = ({
  customizationDict,
  data,
}) => {
  const { i18n, locale, t } = useLocale();
  const { query } = useRouter();

  const meta = getProductComputedMetadata(data.ecommerce, query, locale);

  i18n.addResourceBundle("en-US", "expertLeadHarmony", enUsResource);

  const {
    cms,
    ecommerce: { bottomline },
  } = data;

  // We find the first FAQ on the product page type
  const faq = cms?.faqs?.body?.[0];

  const hasBanner = i18n.exists("expertLeadHarmony:banner");

  const headerHeights: ResponsiveCSSValue = [
    height.nav.mobile + (hasBanner ? height.banner.mobile : 0),
    null,
    height.nav.desktop + (hasBanner ? height.banner.desktop : 0),
  ];

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <CustomizationProvider dictionary={customizationDict}>
        <Metadata
          description={t("expertLeadHarmony:meta.description")}
          noindex={!!customizationDict}
          title={t("expertLeadHarmony:meta.title")}
          openGraph={{
            description: t("expertLeadHarmony:meta.openGraph.description"),
            image: OG_IMG.src,
            title: t("expertLeadHarmony:meta.openGraph.title"),
          }}
        />

        {hasBanner && (
          <div css={s(banner)}>{t("expertLeadHarmony:banner")}</div>
        )}
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
                    src={OFFERS_HARMONY_HERO_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, null, "none"] })}>
                  <ResponsiveImage
                    alt=""
                    src={OFFERS_HARMONY_HERO_MOBILE_IMG}
                    sizes="100vw"
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
                          <Trans i18nKey="expertLeadHarmony:header.title" />
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
                            {t("expertLeadHarmony:header.expert")}
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
                              {t("expertLeadHarmony:header.quote")}
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
                        {t("expertLeadHarmony:cta")}
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
                      <Trans i18nKey="expertLeadHarmony:support.title" />
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
                          {t("expertLeadHarmony:support.list.item1")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadHarmony:support.list.item2")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadHarmony:support.list.item3")}
                        </li>
                        <li css={s(decorativeListItem)}>
                          {t("expertLeadHarmony:support.list.item4")}
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
                    src={OFFERS_HARMONY_INTRO_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, "none"] })}>
                  <ResponsiveImage
                    alt=""
                    sizes="100vw"
                    src={OFFERS_HARMONY_INTRO_IMG}
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
                  ...mx("auto"),
                  maxWidth: 900,
                }))}
              >
                <Trans i18nKey="expertLeadHarmony:experts.title" />
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
                      src={SAGE_IMG}
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
                      {t("expertLeadHarmony:experts.anthony.quote")}
                    </TitleCustomization>
                    &rdquo;
                  </p>
                  <footer css={s(bodyText)}>
                    <TitleCustomization target="testimonial:attribution">
                      {t("expertLeadHarmony:experts.anthony.name")}
                    </TitleCustomization>
                  </footer>
                </div>
              </blockquote>
            </div>
          </section>

          <Guarantee />

          <section css={s(gutter, { textAlign: "center" })} id="bundles">
            <BundlePicker
              skus={["FPHM01-HM30x3", "FPHM01-HM30x2", "FPHM01-HM30"]}
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
                <Trans i18nKey="expertLeadHarmony:feeding.title" />
              </h2>
              <p
                css={s((t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.xxl],
                  maxWidth: 620,
                  ...mx("auto"),
                  textAlign: "center",
                }))}
              >
                {t("expertLeadHarmony:feeding.text")}
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
                    {t("expertLeadHarmony:feeding.small.guide")}
                  </h3>
                  <p css={s(bodyText)}>
                    {t("expertLeadHarmony:feeding.small.supply")}
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
                    {t("expertLeadHarmony:feeding.medium.guide")}
                  </h3>
                  <p css={s(bodyText)}>
                    {t("expertLeadHarmony:feeding.medium.supply")}
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
                    {t("expertLeadHarmony:feeding.large.guide")}
                  </h3>
                  <p css={s(bodyText)}>
                    {t("expertLeadHarmony:feeding.large.supply")}
                  </p>
                </Item>
              </Grid>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.md,
                  marginTop: [t.spacing.xxl, null, 96],
                  maxWidth: 640,
                  ...mx("auto"),
                }))}
              >
                {t("expertLeadHarmony:feeding.text1")}
              </p>
              <p
                css={s(bodyText, {
                  maxWidth: 640,
                  ...mx("auto"),
                })}
              >
                {t("expertLeadHarmony:feeding.text2")}
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
                {t("expertLeadHarmony:cta")}
              </ScrollLink>
            </div>
          </section>

          <div css={s({ display: ["block", null, "none"] })}>
            <ResponsiveImage alt="" sizes="100vw" src={DOGS2_IMG} />
          </div>

          {/* Benefits */}
          <section css={s(gutter, { textAlign: "center" })}>
            <div css={s(belt, { maxWidth: [480, null, 1280] })}>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: t.spacing.md,
                  ...mx("auto"),
                }))}
              >
                <Trans i18nKey="expertLeadHarmony:benefits.title" />
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.xxl,
                  maxWidth: 700,
                  ...mx("auto"),
                  textAlign: "center",
                }))}
              >
                {t("expertLeadHarmony:benefits.text")}
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
                {t("expertLeadHarmony:cta")}
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
                  <Trans i18nKey="expertLeadHarmony:ingredients.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xxl,
                    maxWidth: 800,
                    ...mx("auto"),
                    textAlign: "center",
                  }))}
                >
                  {t("expertLeadHarmony:ingredients.text")}
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
                {t("expertLeadHarmony:compare.title")}
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
                      {t(`expertLeadHarmony:compare.fotp`)}
                    </th>
                    <th css={s(headingEcho, (t) => py(t.spacing.md))}>
                      {t(`expertLeadHarmony:compare.others`)}
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
                        {t(`expertLeadHarmony:compare.${item}`)}
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
                {t("expertLeadHarmony:cta")}
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
              src={HARMONY_BEADLETS_IMG}
            />
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
                  {t("expertLeadHarmony:faqs.title")}
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
                {t("expertLeadHarmony:refunds.title")}
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  fontWeight: t.font.primary.weight.medium,
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("expertLeadHarmony:refunds.subtext")}
              </p>
              <p
                css={s((t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("expertLeadHarmony:refunds.text1")}
              </p>
              <p css={s(bodyText)}>{t("expertLeadHarmony:refunds.text2")}</p>
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
                {t("expertLeadHarmony:cta")}
              </ScrollLink>
            </div>
          </section>
        </main>

        <Footer />

        <RecentPurchases />

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

export default ExpertLeadHarmony;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [{ params: { customization: [] } }],
  };
};

export const getStaticProps = makeProductPageStaticPropsGetter(
  "harmony",
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
          handle: `harmony-expert-lead-${customization}`,
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
