import {
  initializeApollo,
  runServerSideQuery,
  throwGraphQLErrors,
} from "@sss/apollo";
import {
  CartLineItem,
  CartLineItemActionType,
  CartStatus,
  getCoreCartLineItem,
  useCart,
} from "@sss/ecommerce/cart";
import type { CollectionData } from "@sss/ecommerce/collection";
import { moneyFns } from "@sss/ecommerce/common";
import {
  CartOfferDestinationType,
  useCartOfferRedirect,
} from "@sss/ecommerce/offer/cart";
import { getVariantPrices, Product } from "@sss/ecommerce/product";
import { useInView } from "@sss/hooks";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef } from "react";
import { Trans } from "react-i18next";
import { DogProfileActivityLevel } from "src/dogs/profile";
import Hero from "src/ui/base/hero";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  gutterTop,
  gutterX,
  link,
  mx,
  percentage,
  px,
  py,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import FOOD_AIR_DRIED_IMG from "../../../../assets/images/food/AIR_DRIED.jpg";
import FOOD_NATURAL_IMG from "../../../../assets/images/food/NATURAL.jpg";
import SAD_PUG_LARGE_IMG from "../../../../assets/images/food/SAD_PUG_LARGE.jpg";
import SAD_PUG_MEDIUM_IMG from "../../../../assets/images/food/SAD_PUG_MEDIUM.jpg";
import SAD_PUG_SMALL_IMG from "../../../../assets/images/food/SAD_PUG_SMALL.jpg";
import FOOD_TASTY_IMG from "../../../../assets/images/food/TASTY.jpg";
import { RichText } from "../../../../cms/prismic";
import {
  makeProductPageStaticPropsGetter,
  UnifiedProductPageData,
} from "../../../../cms/product-page";
import { FoodPlanData, useFoodPlan } from "../../../../food/plan";
import Accordion from "../../../../ui/base/accordion";
import { badge } from "../../../../ui/base/badge";
import { primaryButton } from "../../../../ui/base/button";
import { Grid, Item } from "../../../../ui/base/grid";
import ResponsiveImage from "../../../../ui/base/responsive-image";
import { PageSpinner } from "../../../../ui/base/spinner";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingBravoStatic,
  headingCharlie,
  headingCharlieStatic,
  headingDelta,
} from "../../../../ui/base/typography";
import { wave } from "../../../../ui/base/wave";
import tick from "../../../../ui/icons/tick";
import Footer from "../../../../ui/modules/footer";
import ProductFeaturesFood from "../../../../ui/modules/products/features/food";
import ProductImageCarousel from "../../../../ui/modules/products/image-carousel";
import ReviewsCarousel from "../../../../ui/modules/reviews/carousel";
import SalesFunnelHeader from "../../../../ui/modules/sales-funnel-header";
import { dataUriFromPath } from "../../../../ui/styles/utils";

const enUsResource = {
  benefits: {
    airDried: {
      description:
        "Air dried low & slow to preserve nutrients and kills germs. Ready to eat – no fridge, no prep, no clean-up.",
      title: "Gently Air-Dried",
    },
    natural: {
      description:
        "The same whole-food ingredients you’d eat yourself, transparently sourced from world leading suppliers.",
      title: "Natural Ingredients, Backed By Science",
    },
    tasty: {
      description:
        "Perfected by UC Davis’ Jamie Peyton and her 12 shelter dogs. A flavor devoured by even the pickiest of pups.",
      title: "Taste Tested By The Best",
    },
    title: "Dog Food With Nothing To Hide",
  },
  disclaimer: {
    description: `<Paragraph>These recommendations are only intended to provide a starting point and since every dog is different, finding the correct amount of food for yours will likely require at least a little trial and error.</Paragraph>
    <Paragraph>Dogs’ nutritional needs also change over time so be sure to recheck how your dog is doing regularly. Please speak to your vet if your dog is malnourished, obese or has any other dietary issues. If you are ever in any doubt, be sure to consult your vet.</Paragraph>
    <Paragraph>The figures provided here are based on studies carried out by the <ExternalLink href="https://vet.osu.edu/vmc/companion/our-services/nutrition-support-service/basic-calorie-calculator">Hummel & Trueman Hospital for Companion Animals</ExternalLink> in the US.</Paragraph>`,
    title: "Please note",
  },
  faqs: {
    extra: "Can’t find what you need? <Link>View All FAQ’s</Link>",
    title: "Frequently asked questions",
  },
  features: {
    title: "{{ title }} is:",
  },
  header: {
    activity: {
      [DogProfileActivityLevel.HIGH]: "An active",
      [DogProfileActivityLevel.LOW]: "An inactive",
      [DogProfileActivityLevel.NORMAL]: "A",
      [DogProfileActivityLevel.WORKING]: "An extremely active",
    },
    age: {
      month: "{{ count }} month",
      year: "{{ count }} year",
    },
    breed: {
      fallback: "dog",
    },
    plan: {
      benefit: {
        frequency: "{{ count }} weeks of tasty food",
        guarantee: "100% Money Back Guarantee",
        shipping: "FREE U.S. Shipping",
      },
      checkout: "Checkout",
      description:
        "This plan contains the perfect amount of food for a complete diet, shipped every {{ count }} weeks.",
      edit: "Edit {{ name }}’s details",
      frequency: {
        WEEK: "week",
      },
      outOfStock: "Out of stock",
      price: {
        current: "Your price",
        rrp: "RRP",
        save: "Save {{ percentage }}%",
      },
      title: "{{ name }}’s Plan",
    },
    subtitle:
      "{{ activity }} {{ age }} old, {{ weight }}lb {{ breed }} needs {{ calories, number(maximumFractionDigits: 0) }} calories of nutritious balanced meals a day to maintain a healthy active lifestyle.",
    title: "{{ name }}’s Meal Plan",
  },
  ingredients: {
    title: "{{ title }} Recipe",
  },
  meta: {
    openGraph: {
      title: "{{ name }}’s Meal Plan",
    },
    title: "{{ name }}’s Meal Plan | Front Of The Pack",
  },
  puppy: {
    cta: "Return to homepage",
    description:
      "Our air-dried food is not yet recommended for dogs younger than 12 months old. But there’s good news! We’re tweaking the formula as we speak and expect the next batch to be perfect for all life stages.",
    title: "Sorry…",
  },
  reviews: { title: "What Pet Parents Are Saying" },
};

const benefitList = s(bodyTextSmall, (t) => ({
  "& > *": {
    "&:before": {
      backgroundColor: t.color.border.selected,
      backgroundImage: `url(${dataUriFromPath({
        fill: t.color.background.base,
        path: tick,
      })})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "50%",
      borderRadius: t.radius.xxl,
      content: '""',
      display: "block",
      left: 0,
      marginTop: [-3, null, -2],
      position: "absolute",
      ...size([24, null, 28]),
    },
    "&:first-child": {
      marginTop: 0,
    },
    marginTop: [t.spacing.sm, null, t.spacing.md],
    paddingLeft: [38, null, 44],
    position: "relative",
  },
}));

const getCartLineItem = (
  data: FoodPlanData,
  ecommerce: Product
): CartLineItem => ({
  ...getCoreCartLineItem(data.variant, ecommerce),
  frequency: data.frequency,
  properties: { dogProfile: data.dogProfile.uuid },
  quantity: data.quantity,
});

interface FoodPlanRecommendationStepProps {
  data: UnifiedProductPageData;
}

const FoodPlanRecommendationStep: FC<FoodPlanRecommendationStepProps> = ({
  data: { cms, ecommerce },
}) => {
  const cart = useCart();
  const cartOffer = useCartOfferRedirect({
    destinationType: CartOfferDestinationType.CHECKOUT,
    ignoreCart: true,
    offers: [],
    product: ecommerce,
  });
  const formatCurrency = useCurrencyFormatter();
  const [ref, isInView] = useInView();
  const { i18n, t } = useLocale();
  const hasSyncedCartRef = useRef(false);
  const router = useRouter();

  i18n.addResourceBundle("en-US", "FoodPlanRecommendationStep", enUsResource);

  const uuid =
    typeof router.query.dog_profile === "string"
      ? router.query.dog_profile
      : null;

  const { data, error, loading } = useFoodPlan({ product: ecommerce, uuid });

  // Handle errors
  useEffect(() => {
    if (error) {
      throw error;
    }

    if (router.isReady && !uuid) {
      throw new Error("Missing dog profile UUID");
    }

    if (uuid && !data?.dogProfile && !loading) {
      throw new Error("Error loading dog profile data");
    }
  }, [data, error, loading, router, uuid]);

  // Sync the cart
  useEffect(() => {
    if (hasSyncedCartRef.current || !data || cart.status !== CartStatus.READY) {
      return;
    }

    const staleLineItem =
      cart.lineItems.find(
        ({ properties }) => properties.dogProfile === data.dogProfile.uuid
      ) ?? null;

    if (staleLineItem) {
      cart.lineItemUpdate({
        payload: staleLineItem,
        type: CartLineItemActionType.REMOVE,
      });
    }

    if (data.availableForSale) {
      cart.lineItemUpdate({
        payload: getCartLineItem(data, ecommerce),
        type: CartLineItemActionType.INCREMENT,
      });
    }

    hasSyncedCartRef.current = true;
  }, [cart, data, ecommerce]);

  // Prefetch the offer page
  useEffect(() => {
    if (data && isInView) {
      cartOffer.prefetch(data.variant.sku);
    }
  }, [cartOffer, data, isInView]);

  if (!data) {
    return (
      <>
        <Metadata noindex title={t("common:loading")} />
        <PageSpinner label={t("common:loading")} />
      </>
    );
  }

  const isPuppy = data.dogProfile.ageMonths < 12;

  const {
    regularPrice,
    subscriptionDiscount,
    subscriptionPrice,
  } = getVariantPrices(data.variant);

  // Typeguard - we should always have a subscription price by this point
  if (!subscriptionPrice) {
    throw new Error(
      `Missing subscription price data for food variant "${data.variant.sku}"`
    );
  }

  const weeklyRegularPrice = moneyFns.multiply(
    moneyFns.divide(regularPrice, data.frequency.orderIntervalFrequency),
    data.quantity
  );
  const weeklySubscriptionPrice = moneyFns.multiply(
    moneyFns.divide(subscriptionPrice, data.frequency.orderIntervalFrequency),
    data.quantity
  );

  const columnOneLgPlusWidth = 0.56;
  const columnTwoLgPlusWidth = 1 - columnOneLgPlusWidth;

  return (
    <>
      <Metadata
        description={t("FoodPlanRecommendationStep:meta.description")}
        noindex
        title={t("FoodPlanRecommendationStep:meta.title", {
          name: data.dogProfile.name,
        })}
        openGraph={{
          title: t("FoodPlanRecommendationStep:meta.openGraph.title", {
            name: data.dogProfile.name,
          }),
        }}
      />

      <SalesFunnelHeader showContact={false} showLinks={false} />

      <main
        css={s((t) => ({
          marginTop: [t.height?.nav.mobile, null, t.height?.nav.desktop],
        }))}
      >
        {isPuppy ? (
          <header
            css={s(gutter, (t) => ({
              backgroundImage:
                "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 250%)",
              color: t.color.text.light.base,
              position: "relative",
              textAlign: "center",
              textShadow: "0 0 16px black",
            }))}
          >
            <div css={s(belt, { maxWidth: 640 })}>
              <h1 css={s(headingAlpha)}>
                {t("FoodPlanRecommendationStep:puppy.title")}
              </h1>
              <p
                css={s(bodyText, (t) => ({
                  marginTop: [180, t.spacing.lg, t.spacing.xl],
                }))}
              >
                {t("FoodPlanRecommendationStep:puppy.description")}
              </p>

              <Link
                css={s(link, (t) => ({
                  display: "block",
                  fontFamily: t.font.secondary.family,
                  fontWeight: t.font.secondary.weight.bold,
                  marginTop: [t.spacing.xl, null, t.spacing.xxl],
                }))}
                to={`/food/plan/edit?dog_profile=${uuid}`}
              >
                {t("FoodPlanRecommendationStep:header.plan.edit", {
                  name: data.dogProfile.name,
                })}
              </Link>
              <Link
                css={s(primaryButton(), (t) => ({
                  marginTop: [t.spacing.md, null, t.spacing.lg],
                  textShadow: "none",
                }))}
                to="/"
              >
                {t("FoodPlanRecommendationStep:puppy.cta")}
              </Link>
            </div>
            <Hero
              _css={s(greedy, {
                "& > *": { ...greedy, objectFit: "cover", opacity: 0.6 },
                background: "black",
                zIndex: -1,
              })}
              priority
              quality={60}
              urls={[
                SAD_PUG_SMALL_IMG.src,
                SAD_PUG_MEDIUM_IMG.src,
                null,
                SAD_PUG_LARGE_IMG.src,
              ]}
            />
          </header>
        ) : (
          <header
            css={s(gutter, (t) => ({
              "&:after, &:before": {
                ...greedy,
                content: "''",
                display: "block",
                height: null,
                position: "absolute",
                top: null,
                zIndex: -1,
              },
              // eslint-disable-next-line sort-keys
              "&:after": {
                backgroundColor: t.color.background.feature1,
                top: [percentage(3 / 4), null, percentage(1 / 2)],
              },
              "&:before": {
                ...wave({ color: t.color.background.feature1 }),
                bottom: [percentage(1 / 4), null, percentage(1 / 2)],
              },
              paddingTop: t.spacing.xl,
              position: "relative",
            }))}
          >
            <div css={s(belt)}>
              <div
                css={s((t) => ({
                  marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                  textAlign: "center",
                }))}
              >
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("FoodPlanRecommendationStep:header.title", {
                    name: data.dogProfile.name,
                  })}
                </h1>
                <p css={s(belt, { maxWidth: "35em" })}>
                  {t("FoodPlanRecommendationStep:header.subtitle", {
                    activity: t(
                      `FoodPlanRecommendationStep:header.activity.${data.dogProfile.activityLevel}`
                    ),
                    age:
                      data.dogProfile.ageMonths < 12
                        ? t("FoodPlanRecommendationStep:header.age.month", {
                            count: data.dogProfile.ageMonths,
                          })
                        : t("FoodPlanRecommendationStep:header.age.year", {
                            count: Math.round(data.dogProfile.ageMonths / 12),
                          }),
                    breed:
                      data.dogProfile.breed?.name ??
                      t("FoodPlanRecommendationStep:header.breed.fallback"),
                    calories: data.dailyCalories,
                    weight: data.dogProfile.weightLb,
                  })}
                </p>
              </div>
              <Grid
                innerCss={s({ alignItems: "center" })}
                gx={(t) => [t.spacing.lg, null, t.spacing.xl, t.spacing.xxl]}
                gy={(t) => [t.spacing.lg, null, t.spacing.xl]}
              >
                <Item
                  width={[
                    percentage(1),
                    null,
                    percentage(1 / 2),
                    percentage(columnOneLgPlusWidth),
                  ]}
                >
                  <div
                    css={s((t) => ({
                      display: "flex",
                      flexDirection: "column-reverse",
                      ...mx([-t.spacing.md, null, 0]), // Compensate for `gutter` padding
                    }))}
                  >
                    <h2
                      css={s(headingCharlie, (t) => ({
                        fontSize: [20, null, 24],
                        fontStyle: "italic",
                        fontWeight: t.font.secondary.weight.book,
                        marginTop: t.spacing.sm,
                        textAlign: "center",
                      }))}
                    >
                      {ecommerce.title}
                    </h2>
                    <ProductImageCarousel product={ecommerce}>
                      {({ image: { id, url, ...dimensions }, index }) => {
                        const height = dimensions.height ?? 2048;
                        const width = dimensions.width ?? 2048;

                        return (
                          <div
                            key={id}
                            css={s((t) => ({
                              backgroundColor: t.color.background.feature3,
                            }))}
                          >
                            <ResponsiveImage
                              alt=""
                              height={height}
                              priority={index === 0}
                              sizes={{
                                maxWidth: [1280, null, 640],
                                width: ["100vw", null, "50vw"],
                              }}
                              src={url}
                              width={width}
                            />
                          </div>
                        );
                      }}
                    </ProductImageCarousel>
                  </div>
                </Item>
                <Item
                  width={[
                    percentage(1),
                    null,
                    percentage(1 / 2),
                    percentage(columnTwoLgPlusWidth),
                  ]}
                >
                  <div
                    css={s(belt, (t) => ({
                      backgroundColor: t.color.background.base,
                      borderColor: t.color.tint.algae,
                      borderRadius: t.radius.sm,
                      borderStyle: "solid",
                      borderWidth: 1,
                      marginBottom: t.spacing.lg,
                      maxWidth: [400, null, 600],
                      ...px([t.spacing.md, null, t.spacing.xl, t.spacing.xxl]),
                      ...py([t.spacing.lg, null, t.spacing.xl]),
                    }))}
                  >
                    <div
                      css={s((t) => ({
                        marginBottom: [t.spacing.md, null, t.spacing.lg],
                        textAlign: "center",
                      }))}
                    >
                      <h2
                        css={s(headingBravo, (t) => ({
                          marginBottom: t.spacing.sm,
                        }))}
                      >
                        {t("FoodPlanRecommendationStep:header.plan.title", {
                          name: data.dogProfile.name,
                        })}
                      </h2>
                      <p>
                        {t(
                          "FoodPlanRecommendationStep:header.plan.description",
                          {
                            count: data.frequency.orderIntervalFrequency,
                          }
                        )}
                      </p>
                    </div>
                    <div
                      css={s((t) => ({
                        borderBottomColor: t.color.tint.algae,
                        borderBottomStyle: "solid",
                        borderBottomWidth: 1,
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      <div
                        css={s({
                          alignItems: "flex-end",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        })}
                      >
                        <dl>
                          {subscriptionDiscount && (
                            <>
                              <dt css={s(visuallyHidden)}>
                                {t(
                                  "FoodPlanRecommendationStep:header.plan.price.rrp"
                                )}
                              </dt>
                              <dd
                                css={s(headingCharlieStatic, {
                                  opacity: 0.6,
                                  textDecoration: "line-through",
                                })}
                              >
                                {formatCurrency(weeklyRegularPrice)}
                              </dd>
                            </>
                          )}
                          <dt css={s(visuallyHidden)}>
                            {t(
                              "FoodPlanRecommendationStep:header.plan.price.current"
                            )}
                          </dt>
                          <dd>
                            <span css={s(headingBravoStatic)}>
                              {formatCurrency(weeklySubscriptionPrice)}
                            </span>
                            <span
                              css={s(headingCharlieStatic, {
                                whiteSpace: "nowrap",
                              })}
                            >
                              {" "}
                              /{" "}
                              {t(
                                "FoodPlanRecommendationStep:header.plan.frequency.WEEK"
                              )}
                            </span>
                          </dd>
                        </dl>
                        {subscriptionDiscount && (
                          <p
                            css={s(badge, (t) => ({
                              bottom: "0.2em",
                              marginLeft: t.spacing.sm,
                              position: "relative",
                            }))}
                          >
                            {t(
                              "FoodPlanRecommendationStep:header.plan.price.save",
                              {
                                percentage: subscriptionDiscount.percentage.toFixed(
                                  0
                                ),
                              }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <ul
                      css={s(benefitList, (t) => ({
                        marginTop: t.spacing.md,
                      }))}
                    >
                      {["frequency", "shipping", "guarantee"].map((key) => {
                        let options = {};

                        if (key === "frequency") {
                          options = {
                            ...options,
                            count: data.frequency.orderIntervalFrequency,
                          };
                        }

                        return (
                          <li key={key}>
                            {t(
                              `FoodPlanRecommendationStep:header.plan.benefit.${key}`,
                              options
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      ref={ref}
                      css={s(
                        primaryButton({
                          disabled: !data.availableForSale,
                        }),
                        (t) => ({
                          marginTop: t.spacing.lg,
                          width: "100%",
                        })
                      )}
                      disabled={!data.availableForSale}
                      onClick={() =>
                        cartOffer.redirect({
                          ...getCartLineItem(data, ecommerce),
                          sku: data.variant.sku,
                        })
                      }
                    >
                      {t(
                        `FoodPlanRecommendationStep:header.plan.${
                          data.availableForSale ? "checkout" : "outOfStock"
                        }`
                      )}
                    </button>
                  </div>
                  <ul css={s({ textAlign: "center" })}>
                    <li>
                      <Link
                        css={s(link, (t) => ({
                          fontFamily: t.font.secondary.family,
                          fontWeight: t.font.secondary.weight.bold,
                        }))}
                        to={`/food/plan/edit?dog_profile=${uuid}`}
                      >
                        {t("FoodPlanRecommendationStep:header.plan.edit", {
                          name: data.dogProfile.name,
                        })}
                      </Link>
                    </li>
                  </ul>
                </Item>
              </Grid>
            </div>
          </header>
        )}

        {cms?.product?.otherIngredients && (
          <section
            css={s(gutterTop, gutterX, (t) => ({
              backgroundColor: t.color.background.feature5,
              textAlign: "center",
            }))}
          >
            <div css={s(belt, { maxWidth: 960 })}>
              <h2 css={s(headingAlpha)}>
                {t("FoodPlanRecommendationStep:ingredients.title", {
                  title: ecommerce.title,
                })}
              </h2>
              <p
                css={s(headingCharlie, (t) => ({
                  fontSize: [20, null, 24],
                  marginTop: t.spacing.xl,
                  ...px([t.spacing.md, null, 0]),
                }))}
              >
                <RichTextFragment render={cms.product.otherIngredients} />
              </p>
            </div>
          </section>
        )}

        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature5,
            marginTop: cms?.product?.otherIngredients
              ? [null, null, -t.spacing.lg, -t.spacing.xl]
              : null,
            textAlign: "center",
          }))}
        >
          <h2 css={s(visuallyHidden)}>
            {t("FoodPlanRecommendationStep:features.title", {
              title: ecommerce.title,
            })}
          </h2>
          <ProductFeaturesFood />
        </section>

        <section css={s(gutter)}>
          <div css={s(belt)}>
            <h2 css={s(headingAlpha, { textAlign: "center" })}>
              {t("FoodPlanRecommendationStep:benefits.title")}
            </h2>
            <Grid
              _css={s((t) => ({
                marginTop: [t.spacing.xl, null, t.spacing.xxl],
              }))}
              gx={(t) => [t.spacing.lg, null, null, t.spacing.xl]}
              gy={(t) => t.spacing.xl}
              itemWidth={[percentage(1), null, percentage(1 / 3)]}
            >
              {[
                { image: FOOD_NATURAL_IMG, key: "natural" },
                { image: FOOD_AIR_DRIED_IMG, key: "airDried" },
                { image: FOOD_TASTY_IMG, key: "tasty" },
              ].map(({ image, key }) => (
                <Item key={key}>
                  <div css={s(belt, { maxWidth: 400 })}>
                    <ResponsiveImage {...image} alt="" sizes="100vw" />
                    <h3
                      css={s(headingBravo, (t) => ({
                        marginTop: [t.spacing.md, null, t.spacing.lg],
                      }))}
                    >
                      {t(`FoodPlanRecommendationStep:benefits.${key}.title`)}
                    </h3>
                    <p css={s((t) => ({ marginTop: t.spacing.md }))}>
                      {t(
                        `FoodPlanRecommendationStep:benefits.${key}.description`
                      )}
                    </p>
                  </div>
                </Item>
              ))}
            </Grid>
          </div>
        </section>

        {!!cms.reviews?.length && (
          <section css={s(gutterBottom)}>
            <div css={s(belt, { textAlign: "center" })}>
              <h2 css={s(headingAlpha)}>
                {t("FoodPlanRecommendationStep:reviews.title")}
              </h2>
              <ReviewsCarousel
                _css={s((t) => ({
                  marginTop: [t.spacing.xl, null, t.spacing.xxl],
                }))}
                reviews={cms.reviews}
              />
            </div>
          </section>
        )}

        {cms.faqs?.body?.map(
          (snippet, index) =>
            !!snippet?.fields?.length && (
              <section
                key={index}
                css={s(gutterTop, gutterX, (t) => ({
                  backgroundColor: t.color.background.feature3,
                }))}
              >
                <div css={s(belt, { maxWidth: 960 })}>
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                      textAlign: "center",
                    }))}
                  >
                    {t("FoodPlanRecommendationStep:faqs.title")}
                  </h2>
                  {snippet.fields.map(
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
                          <div css={s((t) => ({ marginBottom: t.spacing.md }))}>
                            <RichText render={answer} />
                          </div>
                        </Accordion>
                      )
                  )}
                  <p
                    css={s(bodyTextSmall, (t) => ({
                      marginTop: t.spacing.xl,
                    }))}
                  >
                    <Trans
                      components={{
                        Link: (
                          <Link
                            css={s(link, (t) => ({
                              fontWeight: t.font.primary.weight.medium,
                            }))}
                            to="/help/faq"
                          />
                        ),
                      }}
                      i18nKey="FoodPlanRecommendationStep:faqs.extra"
                    />
                  </p>
                </div>
              </section>
            )
        )}

        <footer
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
          }))}
        >
          <div css={s(belt, { maxWidth: 960 })}>
            <h2 css={s(headingDelta)}>
              {t("FoodPlanRecommendationStep:disclaimer.title")}
            </h2>
            <Trans
              components={{
                ExternalLink: (
                  <a
                    css={s(link, (t) => ({
                      fontWeight: t.font.primary.weight.medium,
                    }))}
                    rel="noopener"
                    target="_blank"
                  />
                ),
                Paragraph: <p css={s((t) => ({ marginTop: t.spacing.md }))} />,
              }}
              i18nKey="FoodPlanRecommendationStep:disclaimer.description"
            />
          </div>
        </footer>
      </main>

      <Footer />
    </>
  );
};

export default FoodPlanRecommendationStep;

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo({});

  const { COLLECTION_BY_HANDLE } = await import("@sss/ecommerce/collection");

  const handle = "food";

  const result = await runServerSideQuery<CollectionData>(apolloClient, {
    query: COLLECTION_BY_HANDLE,
    variables: { handle },
  });

  throwGraphQLErrors(result);

  return {
    fallback: "blocking",
    paths: result.data.collection.products.edges.map(
      ({ node: { handle } }) => ({
        params: { handle },
      })
    ),
  };
};

export const getStaticProps = makeProductPageStaticPropsGetter(
  undefined,
  async (result) => {
    if (result.props.data.ecommerce.productType !== "Dog Food") {
      return { notFound: true };
    }

    return result;
  }
);
