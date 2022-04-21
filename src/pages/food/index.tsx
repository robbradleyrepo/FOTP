import { dataLayerTrack } from "@sss/analytics";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import { ApolloError } from "apollo-client";
import React, { FC, useEffect } from "react";
import { Trans } from "react-i18next";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  px,
  py,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import FOOD_AIR_DRIED_IMG from "../../assets/images/food/AIR_DRIED.jpg";
import HERO_IMG from "../../assets/images/food/HERO.jpg";
import HERO_MOBILE_IMG from "../../assets/images/food/HERO_MOBILE.jpg";
import FOOD_NATURAL_IMG from "../../assets/images/food/NATURAL.jpg";
import FOOD_TASTY_IMG from "../../assets/images/food/TASTY.jpg";
import HEADER_TRANS_IMG from "../../assets/images/science/HEADER_TRANS.png";
import type { LeadCapturePageData } from "../../cms/lead-capture-page";
import { primaryButton } from "../../ui/base/button";
import FeatureLayout from "../../ui/base/feature-layout";
import Hero from "../../ui/base/hero";
import ResponsiveImage from "../../ui/base/responsive-image";
import { bodyText, headingAlpha, headingBravo } from "../../ui/base/typography";
import ProductFeaturesFood from "../../ui/modules/products/features/food";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  accordion: {
    analysis: {
      ash: {
        label: "Ash",
        value: "12% (max)",
      },
      fat: {
        label: "Crude Fat",
        value: "30% (min)",
      },
      fibre: {
        label: "Crude Fibre",
        value: "8% (max)",
      },
      label: "Guaranteed Analysis",
      moisture: {
        label: "Moisture",
        value: "2% (max)",
      },
      protein: {
        label: "Crude Protein",
        value: "38% (min)",
      },
    },
    calorie: {
      content: "Calories: 144/oz",
      label: "Calorie Content",
      note:
        "Note: Front of the Pack is about twice as dense as kibble so you should feed about half of what you normally do.",
    },
    complete: {
      label: "Complete & Balanced",
      text:
        "Front of the Pack’s beef recipe has exceeded the nutrient levels given by the Association of American Feed Control Officials (AAFCO) for all life stages. Our food is classed as ‘complete and balanced’ and is suitable for your dog’s core diet. See ‘Full Nutrient Profile’ for the full details.",
    },
    ingredients: {
      label: "All Natural Ingredients",
      text:
        "USDA Grass-Fed Beef, Beef Hearts, Beef Liver, Beef Bone, Whole Krill Meal, Fish Oil, Organic Veggie Blend, Organic Whole Eggs, Organic Oats (gluten free), SunFiber® Prebiotic, Aquamin® Magnesium, Organic Beets, Organic Pumpkin, Organic Blueberry, Organic Icelandic Kelp, Organic Pomegranate, Organic Tart Cherry, Organic Vinegar, Organic Quinoa, Yeast Fermentate, Organic Rosemary, Organic Mushroom.",
    },
  },
  comparison: {
    text: "We lead the pack on all fronts. For the love of dogs.",
    title: "Pet Food Like Never Before",
  },
  experts: {
    anthony: {
      description:
        "Nutritional Biochemist with 45+ years experience, 3 patents and 50 clinical trials.",
      name: "Anthony Almada",
    },
    elan: {
      description:
        "National Animal Supplement Council board member and CEO of Alkemist Labs.",
      name: "Élan Sudberg",
    },
    greg: {
      description:
        "Pet Nutritionist published 200+ times in industry journals across 25 years.",
      name: "Dr. Greg Sunvold",
    },
    jamie: {
      description:
        "Chief of Integrative Medicine Service at the UC Davis Veterinary Hospital.",
      name: "Dr. Jamie Peyton",
    },
    scott: {
      description:
        "Veterinary surgeon with 20+ years experience and global TV broadcaster.",
      name: "Dr. Scott Miller",
    },
    title:
      "This is what happens when the pet industry’s brightest minds come together to create the perfect dog food.",
  },
  faqs: {
    extra: "Can’t find what you need? <Link>View All FAQ’s</Link>",
    title: "Frequently asked questions",
  },
  feature1: {
    text1:
      "We’ve packed the food with the highest quality, natural animal proteins to boost your bestie’s muscle functioning, bone mass and support healthier skin and coat.",
    text2:
      "And to top it off, we've mixed in real fruits and vegetables like organic beets, blueberries and pumpkins to provide natural immune support, antioxidants and aid nerve functioning.",
    title: "Science-backed Nutrition For Your Dog",
  },
  feature2: {
    text1:
      "Air-drying is an ancient technique — gentler, slower to preserve the quality of the nutrients in your bestie's food, whilst enabling you to store it fridge-free and making it ridiculously easy to serve.",
    text2:
      "All this means your dog gets the quality of fresh food in a kibble-like form — and for a much better price.",
    title: "Gently Air-Dried",
  },
  feature3: {
    text1:
      "We NEVER freeze the meat, it’s all dried from fresh — and dogs will really taste the difference, so your bestie’s favorite meats will be even more delicious — like chicken, beef and salmon.",
    text2:
      "And we’ve gone the extra mile to source the highest quality ingredients. Everything can be certified as organic.",
    title: "Why Dogs Love Our Air-dried Food",
  },
  hero: {
    text:
      "All natural, organic ingredients gently air-dried for fresh food quality with dry food convenience.",
    title: "Natural Air-Dried Food For Dogs",
  },
  leadForm: {
    description: `
      <Paragraph>We’re busy perfecting our air-dried food recipe but we promise that it will be available soon.</Paragraph>
      <Paragraph>If you’d like us to keep you in the loop and receive <strong>20% off your first food order</strong>, please sign up below.</Paragraph>
    `,
    subscribe: {
      description:
        "Yes, I wish to receive periodic news and updates from Front Of The Pack about their upcoming Air-Dried Fresh Food product.",
      title: "Subscribe To Email Updates",
    },
    subtitle: "Coming Soon",
    title: "Air-Dried Fresh Food",
  },
  prefooter: {
    cta: "Get 20% off and early access",
    text:
      "There's still time to get on the early-access waitlist and receive 20% off when the food is ready. We really don't want you to miss out.",
  },
  reviews: {
    cta: "Get started",
    description: "See what our customers have to say",
    title: "Over $t(common:happyPups) Happy & Healthy Pups",
  },
  usps: {
    eat: "Ready to Eat",
    human: "Human-Grade",
    natural: "All Natural",
    organic: "Organic",
    title: "Dog Food With Nothing To Hide",
    usda: "USDA Approved",
    vets: "Made by Vets",
  },
};

export const FoodLeadCapture: FC = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "FoodLeadCapture", enUsResource);

  useEffect(() => {
    dataLayerTrack({
      event: "food_lead_capture_viewed",
    });
  }, []);

  return (
    <Standard>
      <Metadata
        description="All natural, human-grade ingredients gently air-dried for fresh food quality with dry food convenience."
        title="Tasty Air-Dried Food. 100% Natural & Human Grade"
        openGraph={{
          description:
            "All natural, human-grade ingredients gently air-dried for fresh food quality with dry food convenience.",
          image: "",
          title: "Tasty Air-Dried Food. 100% Natural & Human Grade",
        }}
      />
      <main id="main">
        <header
          css={s(gutter, (t) => ({
            alignItems: "center",
            color: t.color.text.light.base,
            display: "flex",
            flexDirection: "column",
            height: ["auto", null, 400, 500],
            justifyContent: "center",
            position: "relative",
            textAlign: "center",
          }))}
        >
          <div
            css={s(greedy, {
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1,
            })}
          />
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "cover",
                objectPosition: ["center center", null, null],
              },
              zIndex: -1,
            })}
            priority
            quality={60}
            urls={[HERO_MOBILE_IMG.src, null, HERO_IMG.src]}
          />
          <div css={s(belt, { zIndex: 2 })}>
            <h1
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.sm, null, t.spacing.md],
              }))}
            >
              {t("FoodLeadCapture:hero.title")}
            </h1>
            <p
              css={s(bodyText, (t) => ({
                fontSize: [18, null, 22],
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
                maxWidth: 600,
              }))}
            >
              {t("FoodLeadCapture:hero.text")}
            </p>
            <Link
              css={s(primaryButton(), (t) => ({ ...px(t.spacing.sm) }))}
              to="https://fotp2021.typeform.com/to/DW6AjJ6b"
            >
              {t("FoodLeadCapture:prefooter.cta")}
            </Link>
          </div>
        </header>

        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature1,
            ...py(t.spacing.xxl),
            textAlign: "center",
          }))}
        >
          <div css={s(belt, { maxWidth: 860 })}>
            <h2
              css={s(headingBravo, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              {t("FoodLeadCapture:usps.title")}
            </h2>
            <ProductFeaturesFood />
          </div>
        </section>

        <section
          css={s(gutterBottom, (t) => ({
            paddingTop: [0, null, 96, t.spacing.xxxl],
          }))}
        >
          <FeatureLayout
            direction="rtl"
            height={[null, null, 500, 600, 640]}
            image={FOOD_NATURAL_IMG}
          >
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              {t("FoodLeadCapture:feature1.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.sm,
              }))}
            >
              {t("FoodLeadCapture:feature1.text1")}
            </p>
            <p css={s(bodyText)}>{t("FoodLeadCapture:feature1.text2")}</p>
          </FeatureLayout>
        </section>

        <section css={s(gutterBottom)}>
          <FeatureLayout
            height={[null, null, 500, 600, 640]}
            image={FOOD_AIR_DRIED_IMG}
          >
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              {t("FoodLeadCapture:feature2.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.sm,
              }))}
            >
              {t("FoodLeadCapture:feature2.text1")}
            </p>
            <p css={s(bodyText)}>{t("FoodLeadCapture:feature2.text2")}</p>
          </FeatureLayout>
        </section>

        <section css={s(gutterBottom)}>
          <FeatureLayout
            direction="rtl"
            height={[null, null, 500, 600, 640]}
            image={FOOD_TASTY_IMG}
          >
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              {t("FoodLeadCapture:feature3.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.sm,
              }))}
            >
              {t("FoodLeadCapture:feature3.text1")}
            </p>
            <p css={s(bodyText)}>{t("FoodLeadCapture:feature3.text2")}</p>
          </FeatureLayout>
        </section>
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
            height: ["auto", null, "100vh"],
            maxHeight: ["none", null, 360, 400],
            position: "relative",
            ...py([140, 72, 0]),
          }))}
        >
          <div
            css={s({
              display: ["none", null, null, "block"],
            })}
          >
            <ResponsiveImage
              alt=""
              layout="fill"
              objectFit="cover"
              sizes={{ width: "100vw" }}
              quality={60}
              src={HEADER_TRANS_IMG}
            />
          </div>
          <div
            css={s(belt, {
              alignItems: "center",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              maxWidth: 820,
              position: "relative",
              textAlign: "center",
            })}
          >
            <div>
              <h2
                css={s(headingBravo, (t) => ({ marginBottom: t.spacing.xl }))}
              >
                <Trans i18nKey="FoodLeadCapture:prefooter.text" />
              </h2>
              <Link
                css={s(primaryButton(), (t) => ({ ...px(t.spacing.sm) }))}
                to="https://fotp2021.typeform.com/to/DW6AjJ6b"
              >
                {t("FoodLeadCapture:prefooter.cta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default FoodLeadCapture;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { LEAD_CAPTURE_PAGE } = await import("../../cms/lead-capture-page");

    const { data, errors } = await apolloClient.query<LeadCapturePageData>({
      fetchPolicy: "no-cache",
      query: LEAD_CAPTURE_PAGE,
      variables: {
        handle: "food",
      },
    });

    if (errors && errors.length > 0) {
      throw new ApolloError({
        errorMessage: "Failed to fetch 'food' lead capture page data",
        extraInfo: {
          data,
        },
        graphQLErrors: errors,
      });
    }

    if (!data.leadCapturePage) {
      throw new Error("Unexpected missing 'food' lead capture page");
    }

    return {
      props: {
        data,
      },
      revalidate: 60,
    };
  }
);
