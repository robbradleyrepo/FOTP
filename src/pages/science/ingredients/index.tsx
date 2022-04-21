import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React from "react";
import Hero from "src/ui/base/hero";
import LazyAnimation from "src/ui/base/lazy-animation";
import ResponsiveImage from "src/ui/base/responsive-image";
import { squiggleX } from "src/ui/base/squiggle";
import { theme } from "src/ui/styles/theme";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  gutterTop,
  mx,
  px,
  py,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import HEADER_TRANS_IMG from "../../../assets/images/science/HEADER_TRANS.png";
import HEADER_TRANS_MOBILE_IMG from "../../../assets/images/science/HEADER_TRANS_MOBILE.png";
import SCIENCE_SPOON_IMG from "../../../assets/images/science/spoon.jpg";
import TWO_DOGS_IMG from "../../../assets/images/science/TWO_DOGS_TRANS.png";
import type { IngredientsPageData } from "../../../cms/ingredients-page";
import { Grid, Item } from "../../../ui/base/grid";
import {
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingCharlie,
} from "../../../ui/base/typography";
import { mapCmsIngredientToCoreIngredientProperties } from "../../../ui/modules/ingredients/data-mapping";
import IngredientsGrid from "../../../ui/modules/ingredients/grid";
import ProductFeaturesSupplement from "../../../ui/modules/products/features/supplement";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  features: {
    potent: {
      text:
        "Our Scientific Advisory Board selects only ingredients with the proven potency to benefit your dog’s health",
      title: "Potent in strength",
    },
    proven: {
      text:
        "Our ingredients are non-generic and proven, which means you can be confident that they’ll do exactly what they claim",
      title: "Proven ingredients",
    },
    pure: {
      text:
        "We only partner with industry leading suppliers who can guarantee purity and traceability on all their products",
      title: "Pure in quality",
    },
  },
  header: {
    text:
      "Your dog’s supplement is only as good as what’s inside it. Which is why we’ve chosen the most pure, powerful and proven ingredients on the planet.",
    title: "Ingredients",
  },
  ingredients: {
    strapline:
      "After searching far and wide, our experts created a collection of the most clinically-proven ingredients to feature in a pet supplement. Ever.",
    title: "The world’s best ingredients",
  },
  meta: {
    description:
      "We use only the most pure, powerful and proven ingredients in our dog supplements. Everything is vet-recommended, made in America and guarantee backed",
    openGraph: {
      description: "Everything is vet-recommended & made in America",
      title: "Pure, Powerful & Proven Ingredients In Every Scoop ",
    },
    title: "Pure, Powerful Clinically Proven Ingredients In Every Scoop | FOTP",
  },
  science: {
    text:
      "Every product we create is rooted in nature and backed by science. Our carefully sourced ingredients are always non-GMO, free from artificial flavors and colors, hypoallergenic and pesticide free.",
    title: "Game-changing ingredients, backed by science",
  },
};

interface IngredientsPageProps {
  data: IngredientsPageData;
}

export const IngredientsPage: NextPageWithApollo<IngredientsPageProps> = ({
  data,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ingredientsPage", enUsResource);

  const { ingredients } = data.ingredientsPage;

  const coreIngredients =
    ingredients?.map(({ ingredient }) =>
      mapCmsIngredientToCoreIngredientProperties(ingredient)
    ) ?? null;

  return (
    <Standard>
      <Metadata
        description={t("ingredientsPage:meta.description")}
        title={t("ingredientsPage:meta.title")}
        openGraph={{
          description: t("ingredientsPage:meta.openGraph.description"),
          image: SCIENCE_SPOON_IMG.src,
          title: t("ingredientsPage:meta.openGraph.title"),
        }}
      />
      <main>
        {/* header */}
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature2,
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
                {t("ingredientsPage:header.title")}
              </h1>
              <p css={s(headingBravo)}>{t("ingredientsPage:header.text")}</p>
            </div>
          </div>
        </header>

        {/* content block - NEW */}
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
                  src={SCIENCE_SPOON_IMG}
                  layout="fill"
                  objectFit="cover"
                  sizes={{
                    maxWidth: [null, null, 789],
                    width: ["100vw", "100vw", "100vw"],
                  }}
                />
              </div>
              <div css={s({ display: [null, null, "none"] })}>
                <ResponsiveImage alt="" src={SCIENCE_SPOON_IMG} sizes="100vw" />
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
                  css={s(headingCharlie, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("ingredientsPage:features.proven.title")}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("ingredientsPage:features.proven.text")}
                </p>
              </section>
              <section
                css={s((t) => ({
                  "&:before": {
                    ...squiggleX({ color: t.color.background.feature5 }),
                    content: "''",
                    display: "inline-block",
                    marginBottom: t.spacing.lg,
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
                  css={s(headingCharlie, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("ingredientsPage:features.pure.title")}{" "}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("ingredientsPage:features.pure.text")}
                </p>
              </section>
              <section
                css={s((t) => ({
                  "&:before": {
                    ...squiggleX({ color: t.color.background.feature5 }),
                    content: "''",
                    display: "inline-block",
                    marginBottom: t.spacing.lg,
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
                  css={s(headingCharlie, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("ingredientsPage:features.potent.title")}{" "}
                </h2>
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("ingredientsPage:features.potent.text")}
                </p>
              </section>
            </Item>
          </Grid>
        </div>

        {/* tint center block */}
        <section
          css={s((t) => ({
            backgroundColor: t.color.background.feature1,
            display: "flex",
            height: ["auto", null, "100vh"],
            maxHeight: ["none", null, 463, 580],
            position: "relative",
            ...py([t.spacing.xl, null, null]),
            ...px([t.spacing.md, null, null]),
          }))}
        >
          <div
            css={s(greedy, { display: ["none", null, null, null, "block"] })}
          >
            <ResponsiveImage
              {...TWO_DOGS_IMG}
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition="center center"
              quality={60}
              sizes="100vw"
            />
          </div>
          <Grid
            _css={s({
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              maxWidth: "820px",
              textAlign: "center",
            })}
            gx={(t) => [t.spacing.xl]}
            gy={(t) => [t.spacing.xl]}
          >
            <Item>
              <LazyAnimation>
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                    maxWidth: [null, null, "80%"],
                    ...mx([null, null, "auto"]),
                  }))}
                >
                  {t("ingredientsPage:science.title")}
                </h2>
                <p css={s(bodyTextStatic)}>
                  {t("ingredientsPage:science.text")}
                </p>
              </LazyAnimation>
            </Item>
            <Item>
              <LazyAnimation>
                <ProductFeaturesSupplement />
              </LazyAnimation>
            </Item>
          </Grid>
        </section>

        {/* ingredients grid */}
        <section
          css={s(gutterTop, gutterBottom, { textAlign: "center" })}
          id="details"
        >
          <div css={s(belt, { maxWidth: 840 })}>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("ingredientsPage:ingredients.title")}
            </h2>
            <p
              css={s(bodyTextStatic, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("ingredientsPage:ingredients.strapline")}
            </p>
          </div>
          {/* GRID */}
          <div css={s(belt)}>
            <LazyAnimation>
              {coreIngredients && (
                <IngredientsGrid
                  initialShowCount={100}
                  ingredients={coreIngredients}
                />
              )}
            </LazyAnimation>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default IngredientsPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { INGREDIENTS_PAGE } = await import("../../../cms/ingredients-page");
    const { data } = await runServerSideQuery<IngredientsPageData>(
      apolloClient,
      INGREDIENTS_PAGE
    );

    if (!data?.ingredientsPage) {
      throw new Error("Failed to fetch ingredient page singleton type");
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
