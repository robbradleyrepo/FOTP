import { captureException } from "@sentry/nextjs";
import {
  initializeApollo,
  NextPageWithApollo,
  runServerSideQuery,
  throwGraphQLErrors,
} from "@sss/apollo";
import { getFetchedImageUrl } from "@sss/cloudinary";
import { ProductSchema, useProductSchemaJson } from "@sss/ecommerce";
import {
  trackAddToCartEvent,
  trackViewItemEvent,
} from "@sss/ecommerce/analytics";
import {
  CartLineItemActionType,
  getCoreCartLineItem,
  useCart,
} from "@sss/ecommerce/cart";
import type { Collection, CollectionData } from "@sss/ecommerce/collection";
import { useBumpOffer } from "@sss/ecommerce/offer/bump";
import {
  CartOfferDestinationType,
  useCartOfferRedirect,
} from "@sss/ecommerce/offer/cart";
import {
  findVariantBySku,
  formValuesToFrequency,
  getInitialProductFormValues,
  getProductComputedMetadata,
  PreorderType,
  ProductContainerOption,
  ProductCore,
  ProductFormValues,
  useProductSelectionDecorator,
} from "@sss/ecommerce/product";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Elements, RichTextFragment } from "@sss/prismic";
import { Metadata, OpenGraphProps } from "@sss/seo";
import { FORM_ERROR } from "final-form";
import { GetStaticPaths } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { rgba } from "polished";
import React, { FC, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Trans } from "react-i18next";
import { Link as ScrollLink } from "react-scroll";
import styled from "styled-components";

import {
  belt,
  ComponentStyleProps,
  greedy,
  gutter,
  gutterBottom,
  gutterLeft,
  gutterSpacingX,
  gutterSpacingY,
  gutterTop,
  gutterX,
  gutterY,
  my,
  percentage,
  px,
  py,
  s,
  size,
  useTheme,
  visuallyHidden,
} from "@/common/ui/utils";

import ASHWAGANDHA_IMG from "../assets/images/food/ASHWAGANDHA.png";
import { ExpertQuote } from "../cms/common";
import {
  OpinionatedRichText,
  prismicImageToStaticImage,
  RichText,
  RichTextProps,
} from "../cms/prismic";
import { Product } from "../cms/product";
import CmsProductIngredientsInformation from "../cms/product/ingredients-information";
import {
  makeProductPageStaticPropsGetter,
  ProductPageDataProvider,
  UnifiedProductPageData,
  useProductPageData,
} from "../cms/product-page";
import Accordion, { AccordionUI, AccordionUIProps } from "../ui/base/accordion";
import Box from "../ui/base/box";
import { primaryButton, secondaryButton } from "../ui/base/button";
import Carousel from "../ui/base/carousel";
import FeatureLayout from "../ui/base/feature-layout";
import { Grid, Item } from "../ui/base/grid";
import { decorativeListItem } from "../ui/base/list";
import ResponsiveImage from "../ui/base/responsive-image";
import { squiggleImageY, squiggleX } from "../ui/base/squiggle";
import { Tab, TabList, TabPanel, Tabs } from "../ui/base/tabs";
import { ToastType, useToastController } from "../ui/base/toast";
import {
  bodyText,
  bodyTextSmall,
  bodyTextSmallStatic,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingBravoStatic,
  headingCharlie,
  headingCharlieStatic,
  headingDelta,
  headingEcho,
} from "../ui/base/typography";
import { wave } from "../ui/base/wave";
import paw from "../ui/icons/paw";
import { useCartController } from "../ui/modules/cart/controller";
import BundlePickerUI from "../ui/modules/products/bundle-picker-ui";
import ProductFeaturesFood from "../ui/modules/products/features/food";
import ProductFeaturesSupplement from "../ui/modules/products/features/supplement";
import ProductImageCarousel from "../ui/modules/products/image-carousel";
import ProductListingItem from "../ui/modules/products/listing-item";
import ProductServingSizes from "../ui/modules/products/serving-sizes";
import ReviewsCarousel from "../ui/modules/reviews/carousel";
import Rating from "../ui/modules/reviews/rating";
import { ReviewsProductWidget } from "../ui/modules/reviews/widgets";
import { dataUriFromPath } from "../ui/styles/utils";
import { color, spacing } from "../ui/styles/variables";
import Standard, { useHeaderHeights } from "../ui/templates/standard";

const TRACKING_SOURCE = "main-site";

const enUsResource = {
  benefits: {
    title: "Key benefits",
  },
  crossSell: {
    title: "You may also like",
  },
  details: {
    ingredients: {
      activeIngredients: {
        columnHeading: "Ingredient",
        title: "Active ingredients",
      },
      macronutrientFacts: {
        calories: "Calories",
        caloriesFromFat: "Calories from fat",
        columnHeading: "Amount per serving",
        dietaryFiber: "Dietary fiber",
        protein: "Protein",
        servingSize: "Serving size",
        servingsPerContainer: "Servings per container",
        sugars: "Sugars",
        title: "Macronutrient facts",
        totalCarbohydrate: "Total carbohydrate",
        totalFat: "Total fat",
      },
      otherIngredients: {
        title: "Other ingredients",
      },
      title: "Ingredients",
    },
    serving: {
      title: "Serving guide",
    },
    shipping: {
      description: `
        <Paragraph>Shipping is free for orders over {{ amount }} and we’ll ship your order in 3-5 business days.</Paragraph>
        <Paragraph>For subscription orders you can change your delivery date or frequency at any time in your account. Or cancel your subscription if you no longer need the products.</Paragraph>
        <Paragraph>We want you to be 100% happy with your purchase. So in the event that you change your mind or your dog isn’t a fan of their supplement, we’ll refund your order in full within 90 days of purchase.</Paragraph>`,
      title: "Shipping & returns",
    },
  },
  expertQuotes: {
    title: "Praised by Leading Experts",
  },
  faqs: {
    title: "Frequently asked questions",
  },
  food: {
    transparency: {
      description:
        "We’re so proud of our ingredients we list them ALL on the front of the pack",
      title: "Dog Food With Nothing To Hide",
    },
  },
  header: {
    addToCart: {
      cta: {
        outOfStock: "Out of stock",
        preorder: "Pre-order now",
        regular: "Add to cart",
      },
      error:
        "There was a problem adding the item to your cart. Please try again.",
      options: {
        bundle: {
          label: "Select quantity",
          unitPrice_one: "{{ price }}",
          unitPrice_other: "{{ price }} each",
        },
        frequency: {
          label: "Deliver every",
          value: {
            DAY_one: "{{ count }} day",
            DAY_other: "{{ count }} days",
            MONTH_one: "{{ count }} month",
            MONTH_other: "{{ count }} months",
            WEEK_one: "{{ count }} week",
            WEEK_other: "{{ count }} weeks",
          },
        },
        oneTime: {
          label: "One-time purchase",
        },
        subscription: {
          info: "Change or cancel anytime.",
          label: "Subscribe + save",
        },
      },
      save: "save {{ amount }}",
      total: "Your price",
    },
    discount: "save",
    today: "today",
  },
  ingredients: {
    cta: "Full nutritional info",
  },
  reviewHighlights: {
    cta: "Read more reviews",
    description: "See what our customers have to say",
    title: "Over $t(common:happyPups) Happy & Healthy Pups",
  },
  reviews: {
    title: "Customer reviews",
  },
  sale: {
    save: "save",
  },
  usage: {
    serving: {
      title: "Directions",
    },
  },
};

const ProductHeading: FC = ({ children, ...props }) => (
  <h3
    css={s(headingDelta, (t) => ({
      marginBottom: t.spacing.md,
    }))}
    {...props}
  >
    <div
      css={s(headingDelta, (t) => ({
        "&:before": {
          ...squiggleX({ color: t.color.background.feature5 }),
          content: "''",
          display: "inline-block",
        },
        marginBottom: t.spacing.md,
      }))}
    />
    {children}
  </h3>
);

const ButtonElement = dynamic(
  () => import("../ui/modules/purple-dot/button-element")
);

const ProductRichText: FC<RichTextProps> = ({ components, render }) => (
  <OpinionatedRichText
    components={{
      [Elements.heading1]: <ProductHeading />,
      [Elements.list]: (
        <ul
          css={s(belt, (t) => ({
            columnCount: 2,
            marginBottom: [t.spacing.md, null, t.spacing.lg],
            maxWidth: [420, null, "unset"],
          }))}
        />
      ),
      [Elements.listItem]: (
        <li css={s(decorativeListItem, { textAlign: "left" })} />
      ),
      [Elements.paragraph]: (
        <p
          css={s((t) => ({ marginBottom: [t.spacing.sm, null, t.spacing.md] }))}
        />
      ),
      ...components,
    }}
    render={render}
  />
);

const FeatureUnorderedListItem = styled(Box)`
  padding-left: 2em;
  position: relative;

  & + & {
    margin-top: ${spacing.xs}px;
  }

  &:before {
    content: url(${dataUriFromPath({
      fill: color.tint.pistachio,
      path: paw,
    })});
    display: block;
    height: 1em;
    left: 0;
    position: absolute;
    transform: rotate(-30deg);
    width: 1em;
  }

  &:nth-child(even):before {
    transform: rotate(30deg);
  }
`;

type TabControls = Pick<AccordionUIProps, "isOpen" | "onClick">;

interface AddToCartProps {
  ingredientsTab: TabControls;
}

export const AddToCart: FC<AddToCartProps> = ({ ingredientsTab }) => {
  const { setIsOpen } = useCartController();
  const { lineItemUpdate } = useCart();
  const { t } = useLocale();
  const { push } = useToastController();
  const { headerHeights } = useHeaderHeights();
  const data = useProductPageData();
  const productSchemaJson = useProductSchemaJson(data.ecommerce);
  const [busyAfterSubmit, setBusyAfterSubmit] = useState(false);
  const theme = useTheme();
  const bumpOfferResult = useBumpOffer({
    offers: [
      {
        include: { handles: ["harmony", "the-one", "move", "soothe"] },
        product: {
          handle: "free-range-beef-tripe-dog-treats",
          sku: "FPTR03-BEEF",
        },
      },
    ],
    product: data.ecommerce,
  });
  const cartOffer = useCartOfferRedirect({
    destinationType: CartOfferDestinationType.CART,
    offers: [
      {
        handle: "the-one-main",
        include: { skus: ["FPHM01-HM30", "FPHM01-HM30x2", "FPHM01-HM30x3"] },
        products: ["the-one"],
      },
      {
        handle: "harmony-main",
        include: {
          skus: [
            "FPTO01-PH",
            "FPTO01-PHx2",
            "FPTO01-PHx3",
            "FPTO01-PHx6",
            "FPMV01-PH",
            "FPMV01-PHx2",
            "FPMV01-PHx3",
            "FPSH01-PH",
            "FPSH01-PHx2",
            "FPSH01-PHx3",
          ],
        },
        products: ["harmony"],
      },
      {
        handle: "treats-main",
        include: {
          skus: [
            "FPHM01-HM30",
            "FPHM01-HM30x2",
            "FPHM01-HM30x3",
            "FPTO01-PH",
            "FPTO01-PHx2",
            "FPTO01-PHx3",
            "FPTO01-PHx6",
          ],
        },
        products: [
          "free-range-beef-tripe-dog-treats",
          "farm-raised-rabbit-dog-treats",
          "wild-alaskan-salmon-dog-treats",
          "variety-pack-dog-treats",
        ],
      },
    ],
    product: data.ecommerce,
  });

  const {
    ecommerce: { bottomline, containers, id, subtitle, title, variants },
    meta,
  } = data;

  const formDefaults = getInitialProductFormValues(meta.selection, containers);

  const productSelectionDecorator = useProductSelectionDecorator(meta);

  const handleAddToCart = async (values: ProductFormValues) => {
    try {
      const variant = findVariantBySku(variants, values.sku);
      const addOns: string[] = [];
      const properties = {};

      // We shouldn't hit this error, as the user shouldn't be able
      // to make an invalid selection
      if (!variant) {
        throw new Error("Invalid variant ID");
      }

      const frequency = formValuesToFrequency(values, meta);
      const quantity = values.quantity;

      lineItemUpdate({
        payload: {
          ...getCoreCartLineItem(variant, data.ecommerce),
          containerUpgrade:
            values.containerOptionOtp === ProductContainerOption.UPGRADE,
          frequency,
          properties,
          quantity,
        },
        type: CartLineItemActionType.INCREMENT,
      });

      trackAddToCartEvent(
        data.ecommerce,
        variant,
        TRACKING_SOURCE,
        quantity,
        frequency
      );

      if (values.bumpOffer && "variant" in bumpOfferResult) {
        lineItemUpdate({
          payload: {
            ...getCoreCartLineItem(
              bumpOfferResult.variant,
              bumpOfferResult.product
            ),
            frequency,
            properties: {},
            quantity,
          },
          type: CartLineItemActionType.INCREMENT,
        });

        trackAddToCartEvent(
          bumpOfferResult.product,
          bumpOfferResult.variant,
          `${TRACKING_SOURCE}-bump-offer`,
          quantity,
          frequency
        );

        addOns.push(bumpOfferResult.product.handle);
      }

      if (cartOffer.getOffer(variant.sku, addOns)) {
        setBusyAfterSubmit(true);
        cartOffer.redirect({
          addOns,
          frequency,
          properties,
          sku: variant.sku,
          variantId: variant.id,
        });
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      push({
        children: t("product:header.addToCart.error"),
        type: ToastType.ERROR,
      });

      return { [FORM_ERROR]: true };
    }
  };

  const columnOneLgPlusWidth = 0.56;
  const columnTwoLgPlusWidth = 1 - columnOneLgPlusWidth;

  return (
    <header
      css={s((t) => ({
        paddingTop: [0, null, null, t.spacing.lg, t.spacing.xl],
      }))}
    >
      <Grid
        _css={s((t) => ({
          // Use pseudo-elements to apply gutters
          "&:after, &:before": {
            content: [null, null, null, '""'],
            display: "block",
            flexGrow: 0,
            flexShrink: 0,
            width: gutterSpacingX(t),
          },
          // Use a high `flex-shrink` value so the left-hand gutter doesn't
          // occupy any space until the main content is at its max width
          "&:before": {
            flexShrink: 999,
          },
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "stretch",
        }))}
        innerCss={s(belt, {
          flexGrow: 1,
          justifyContent: "center",
          width: "100%",
        })}
        gy={[theme.spacing.lg, null, theme.spacing.xl]}
      >
        <Item
          _css={s({
            maxWidth: [720, null, null, 1280 * columnOneLgPlusWidth],
            position: "relative",
          })}
          width={[percentage(1), null, null, percentage(columnOneLgPlusWidth)]}
        >
          <ProductImageCarousel
            _css={s({
              position: ["relative", null, "sticky"],
              top: [null, null, ...headerHeights.slice(2)],
            })}
            product={data.ecommerce}
          >
            {({ image: { id, url, ...dimensions }, index }) => {
              const height = dimensions.height ?? 2048;
              const width = dimensions.width ?? 2048;

              // Use the same `sizes` for desktop and mobile images as both
              // have the `priority` prop, but we don't want to download
              // multiple copies unnecessarily
              const sizes = {
                maxWidth: [720, null, null, 640],
                width: ["100vw", null, null, 720, 800].map((value, index) =>
                  index < 2 && typeof value === "number"
                    ? value * (width / value)
                    : value
                ),
              };

              return (
                <div
                  key={id}
                  css={s((t) => ({
                    backgroundColor: t.color.background.feature3,
                  }))}
                >
                  <div
                    css={s({
                      display: ["none", null, null, "block"],
                      height: [null, null, null, 720, 800],
                      position: "relative",
                      width: "100%",
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      priority={index === 0}
                      src={url}
                      sizes={sizes}
                    />
                  </div>
                  <div css={s({ display: [null, null, null, "none"] })}>
                    <ResponsiveImage
                      alt=""
                      height={height}
                      priority={index === 0}
                      sizes={sizes}
                      src={url}
                      width={width}
                    />
                  </div>
                </div>
              );
            }}
          </ProductImageCarousel>
        </Item>
        <Item
          _css={s({
            maxWidth: [640, null, null, 1280 * columnTwoLgPlusWidth],
          })}
          width={[percentage(1), null, null, percentage(columnTwoLgPlusWidth)]}
        >
          <div
            css={s(gutterLeft, (t) => ({
              paddingRight: [t.spacing.md, null, t.spacing.lg, 0],
            }))}
          >
            <div
              css={s((t) => ({
                alignItems: ["flex-start", null, "flex-end"],
                display: "flex",
                flexDirection: ["column", null, "row"],
                justifyContent: ["flex-start", null, "space-between"],
                marginBottom: t.spacing.md,
              }))}
            >
              <div>
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.xxs,
                  }))}
                  id="product-title"
                >
                  {title}
                </h1>
                {subtitle?.value && (
                  <p
                    css={s(bodyTextStatic, (t) => ({
                      fontFamily: t.font.secondary.family,
                      fontStyle: "italic",
                      marginBottom: [t.spacing.xs, null, 0],
                    }))}
                  >
                    {subtitle.value}
                  </p>
                )}
              </div>
              {!!bottomline?.totalReviews && (
                <ScrollLink duration={500} smooth={true} to="product-reviews">
                  <Rating {...bottomline} clickable />
                </ScrollLink>
              )}
            </div>
            {data.cms?.product?.description && (
              <div
                css={s(bodyTextStatic, (t) => ({ marginBottom: t.spacing.xl }))}
              >
                <RichText
                  components={{
                    [Elements.listItem]: <FeatureUnorderedListItem as="li" />,
                  }}
                  render={data.cms.product.description}
                />
              </div>
            )}

            <Form
              key={id} // Provide a key to make sure a new form is mounted when the product changes
              decorators={[productSelectionDecorator]}
              initialValues={formDefaults}
              onSubmit={handleAddToCart}
            >
              {({ handleSubmit, submitSucceeded, submitting, values }) => {
                const variant = findVariantBySku(variants, values.sku);

                // We shouldn't hit this error, as the user shouldn't be able
                // to make an invalid selection
                if (!variant) {
                  throw new Error("Invalid variant selected");
                }

                const offerSchemaJson = productSchemaJson.offers.find(
                  (offer) => offer?.sku === variant.sku
                );

                // Typeguard: we will always have an offer for each variant
                if (!offerSchemaJson) {
                  throw new Error("Invalid product schema data");
                }

                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(
                  () =>
                    trackViewItemEvent(
                      data.ecommerce,
                      variant,
                      TRACKING_SOURCE,
                      formValuesToFrequency(values, meta)
                    ),
                  [
                    variant.id,
                    values.subscription,
                    values.frequency,
                    variant,
                    values,
                  ]
                );

                // Prefetch the offer page for the currently selected variant
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                  cartOffer.prefetch(
                    variant.sku,
                    values.bumpOffer && "product" in bumpOfferResult
                      ? [bumpOfferResult.product.handle]
                      : undefined
                  );
                }, [values.bumpOffer, variant.sku]);

                return (
                  <BundlePickerUI
                    bumpOfferResult={bumpOfferResult}
                    busyAfterSubmit={busyAfterSubmit}
                    data={data}
                    handleSubmit={handleSubmit}
                    skus={meta.selection.listedSkus}
                    submit={({ children, disabled }) =>
                      meta.subscription.preorder.type ===
                      PreorderType.PURPLE_DOT ? (
                        <div
                          css={s((t) => ({
                            margin: `${t.spacing.lg}px 0`,
                            minHeight: 96,
                          }))}
                        >
                          <ButtonElement
                            product={data.ecommerce}
                            variant={variant}
                          />
                        </div>
                      ) : (
                        <button
                          css={s(primaryButton({ disabled }), (t) => ({
                            ...my(t.spacing.lg),
                            width: "100%!important",
                          }))}
                          disabled={disabled}
                          type="submit"
                        >
                          {children}
                        </button>
                      )
                    }
                    submitSucceeded={submitSucceeded}
                    submitting={submitting}
                    values={values}
                    variant={variant}
                  />
                );
              }}
            </Form>
            {data.cms.product && (
              <Details
                _css={s((t) => ({ marginTop: t.spacing.xl }))}
                {...data.cms.product}
                ingredientsTab={ingredientsTab}
              />
            )}
          </div>
        </Item>
      </Grid>
    </header>
  );
};

type DetailsProps = Pick<
  Product,
  | "macronutrientFacts"
  | "otherIngredients"
  | "servingSizes"
  | "suitability"
  | "typicalValues"
  | "typicalValuesLabel"
  | "use"
> & { ingredientsTab: TabControls } & ComponentStyleProps;

const Details: FC<DetailsProps> = ({
  _css = {},
  ingredientsTab,
  macronutrientFacts,
  otherIngredients,
  servingSizes,
  suitability,
  typicalValues,
  typicalValuesLabel,
  use,
}) => {
  const { shippingThreshold } = useCart();
  const formatCurrency = useCurrencyFormatter();
  const { t } = useLocale();

  return (
    <div css={s(_css)}>
      {use && (
        <Accordion
          _css={s(bodyTextStatic, { borderTopStyle: "solid" })}
          id="details-use"
          label={t("product:details.serving.title")}
          labelAs="h2"
        >
          <div css={s(bodyTextStatic, (t) => ({ marginBottom: t.spacing.md }))}>
            <RichText render={use} />

            {!!servingSizes?.length && (
              <ProductServingSizes
                _css={s((t) => ({ marginBottom: t.spacing.md }))}
                servingSizes={servingSizes}
              />
            )}

            {suitability && (
              <p css={s(bodyTextSmallStatic, { fontStyle: "italic" })}>
                * <RichTextFragment render={suitability} />
              </p>
            )}
          </div>
        </Accordion>
      )}
      {(!!typicalValues?.length ||
        otherIngredients ||
        !!macronutrientFacts?.length) && (
        <AccordionUI
          _css={s(bodyTextStatic)}
          id="details-typical-values"
          label={t("product:details.ingredients.title")}
          labelAs="h2"
          {...ingredientsTab}
        >
          <CmsProductIngredientsInformation
            _css={s(bodyTextSmallStatic, (t) => ({
              marginBottom: t.spacing.md,
            }))}
            macronutrientFacts={macronutrientFacts}
            otherIngredientsCss={s((t) => ({
              "&:first-child": bodyTextStatic(t),
            }))}
            otherIngredients={otherIngredients}
            typicalValues={typicalValues}
            typicalValuesLabel={typicalValuesLabel}
          />
        </AccordionUI>
      )}
      <Accordion
        _css={s(bodyTextStatic)}
        id="details-shipping"
        label={t("product:details.shipping.title")}
        labelAs="h2"
      >
        <div css={s(bodyTextStatic, (t) => ({ marginBottom: t.spacing.md }))}>
          <Trans
            components={{
              Paragraph: (
                <p
                  css={s((t) => ({
                    "&:first-child": { marginTop: 0 },
                    marginTop: t.spacing.md,
                  }))}
                />
              ),
            }}
            i18nKey="product:details.shipping.description"
            values={{
              amount:
                shippingThreshold &&
                formatCurrency({
                  ...shippingThreshold,
                  fractionDigits: 0,
                }),
            }}
          />
        </div>
      </Accordion>
    </div>
  );
};

interface ExpertQuotesProps extends ComponentStyleProps {
  quotes: ExpertQuote[];
}

const ExpertQuotes: FC<ExpertQuotesProps> = ({ _css = {}, quotes }) => {
  const { t } = useLocale();

  const getTabId = (index: number) => `ExpertQuotes-${index}`;

  return (
    <Tabs
      _css={s(belt, { maxWidth: 960, textAlign: "center" }, _css)}
      initialTabId={getTabId(0)}
    >
      <h2
        css={s(headingAlpha, (t) => ({
          marginBottom: [t.spacing.xl, null, t.spacing.xxl],
        }))}
        id="ExpertQuotes-title"
      >
        {t("product:expertQuotes.title")}
      </h2>
      <div css={s({ textAlign: "left" })}>
        {quotes.map(({ expert, quote }, index) => {
          if (!expert || !quote) {
            const error = new Error("Missing expert quote data");

            if (process.env.NODE_ENV === "production") {
              captureException(error);

              return null;
            }

            throw error;
          }

          return (
            <TabPanel key={index} id={getTabId(index)}>
              <figure css={s({ textAlign: "center" })}>
                <blockquote
                  css={s(headingBravo, (t) => ({
                    "&:after": {
                      content: "'”'",
                    },
                    "&:before": {
                      content: "'“'",
                    },
                    fontStyle: "italic",
                    fontWeight: t.font.secondary.weight.book,
                  }))}
                >
                  <RichTextFragment render={quote} />
                </blockquote>
                <figcaption
                  css={s(bodyTextStatic, (t) => ({ marginTop: t.spacing.md }))}
                >
                  {expert?.name && <RichTextFragment render={expert.name} />}{" "}
                  {expert?.postNominal && (
                    <RichTextFragment render={expert.postNominal} />
                  )}{" "}
                  – {expert?.role && <RichTextFragment render={expert.role} />}
                </figcaption>
              </figure>
            </TabPanel>
          );
        })}
      </div>
      <TabList
        _css={s((t) => ({
          marginBottom: 0,
          marginTop: [t.spacing.lg, null, t.spacing.xl],
        }))}
        labelledBy="ExpertQuotes-title"
      >
        {quotes.map(({ expert }, index) => {
          const image = expert?.image;
          const name = expert?.name;

          if (!image || !name) {
            const error = new Error("Missing expert quote data");

            if (process.env.NODE_ENV === "production") {
              captureException(error);

              return null;
            }

            throw error;
          }

          return (
            <Tab
              key={index}
              _css={s((t) => ({
                marginRight: [t.spacing.sm, t.spacing.md, t.spacing.lg],
              }))}
              id={getTabId(index)}
            >
              {({ active }) => (
                <span
                  css={s((t) => ({
                    backgroundColor: active ? t.color.border.dark : null,
                    borderColor: "transparent",
                    borderRadius: t.radius.xxl,
                    borderStyle: "solid",
                    borderWidth: [3, null, 4],
                    display: "block",
                    opacity: active ? 1 : 0.5,
                    overflow: "hidden",
                    ...size([64, 77, 90]),
                    transition: "background-color 1s, opacity 500ms",
                  }))}
                >
                  <ResponsiveImage
                    {...image.dimensions}
                    alt=""
                    src={image.url}
                    sizes={{ width: [64, 77, 90] }}
                  />
                  {/**
                   * Some screen readers have problems accessing button labels
                   * from images or SVGs, so we'll use visually hidden text
                   * instead
                   */}
                  <span css={s(visuallyHidden)}>
                    <RichTextFragment render={name} />
                  </span>
                </span>
              )}
            </Tab>
          );
        })}
      </TabList>
    </Tabs>
  );
};

const ProductPageMetadata: FC = () => {
  const data = useProductPageData();

  const {
    ecommerce: {
      images,
      seo: { description: seoDescription, title: seoTitle },
      title,
    },
    cms: { product },
  } = data;

  let image: OpenGraphProps["image"];
  if (product?.socialMediaImage?.url) {
    image = getFetchedImageUrl({
      url: product.socialMediaImage.url,
      width: 1200,
    });
  } else if (images.edges.length > 0) {
    const fallbackSize = 1200;
    const height = images.edges[0].node.height ?? fallbackSize;
    const width = images.edges[0].node.width ?? fallbackSize;
    image = {
      height,
      type: "image/jpeg",
      url: getFetchedImageUrl({
        url: images.edges[0].node.url,
        width,
      }),
      width,
    };
  }

  return (
    <Metadata
      description={seoDescription}
      title={seoTitle || title}
      openGraph={{
        description: product?.socialMediaDescription || seoDescription,
        image,
        title: product?.socialMediaTitle || seoTitle || title,
      }}
    />
  );
};

interface ProductPageProps {
  data: UnifiedProductPageData & { collection?: Collection };
}

export const ProductPage: NextPageWithApollo<ProductPageProps> = ({ data }) => {
  const { i18n, locale, t } = useLocale();
  const [isIngredientsTabOpen, setIsIngredientsTabOpen] = useState(false);
  const theme = useTheme();
  const { query } = useRouter();

  const meta = getProductComputedMetadata(data.ecommerce, query, locale);

  i18n.addResourceBundle("en-US", "product", enUsResource);

  const {
    cms: {
      expertQuotes,
      faqs,
      keyFeaturesContent,
      keyFeaturesImage,
      keyFeaturesTitle,
      keyIngredients,
      keyIngredientsIntro,
      keyIngredientsTitle,
      product,
      reviews,
      reviewsHighlights,
      usageImage,
      usageIntro,
      usageTitle,
    },
    collection,
    ecommerce: { bottomline, handle },
  } = data;

  if (!product) {
    throw new Error("Missing CMS `product` data");
  }

  const foodTransparencyFragment =
    data.ecommerce.productType === "Dog Food" &&
    data.cms.product?.otherIngredients ? (
      <section
        css={s(gutter, (t) => ({
          position: "relative",
          textAlign: "center",
          textShadow: `0 0 8px ${t.color.background.feature5}`,
        }))}
      >
        <div css={s(belt, { maxWidth: 800 })}>
          <h2 css={s(headingAlpha)}>{t("product:food.transparency.title")}</h2>
          <p css={s(bodyTextStatic, (t) => ({ marginTop: t.spacing.md }))}>
            {t("product:food.transparency.description")}
          </p>
          <p
            css={s(headingCharlie, (t) => ({
              fontSize: [20, null, 24],
              marginTop: t.spacing.xl,
              ...px([t.spacing.md, null, 0]),
            }))}
          >
            <RichTextFragment render={data.cms.product.otherIngredients} />
          </p>
        </div>
        <div
          css={s(greedy, (t) => ({
            backgroundColor: t.color.background.feature5,
            overflow: "hidden",
            zIndex: -1,
          }))}
        >
          {[
            {
              left: ["25%", null, "40%"],
              marginLeft: [-175, null, -240],
              transform: [
                "rotate(180deg) translate(120px, 210px)",
                null,
                "translate(-480px, 360px)",
                "translate(-570px, 90px)",
              ],
            },
            {
              marginRight: [-175, null, -240],
              right: ["25%", null, "40%"],
              transform: [
                "translate(120px, 210px)",
                null,
                "rotate(180deg) translate(-480px, 360px)",
                "rotate(180deg) translate(-570px, 90px)",
              ],
            },
          ].map((styles, index) => (
            <div
              key={index}
              css={s(
                {
                  marginTop: [-215, -250, -345],
                  position: "absolute",
                  top: "50%",
                  width: [300, 350, 480],
                },
                styles
              )}
            >
              <ResponsiveImage
                {...ASHWAGANDHA_IMG}
                alt=""
                sizes={{ width: [300, 350, 480] }}
              />
            </div>
          ))}
          <div
            css={s(greedy, (t) => ({
              backgroundImage: [
                { max: 0.8, min: 0.6 },
                null,
                { max: 0.3, min: 0.1 },
                "none",
              ].map((value) =>
                value && typeof value === "object"
                  ? `linear-gradient(90deg, ${rgba(
                      t.color.background.feature5,
                      value.min
                    )} 0%, ${rgba(
                      t.color.background.feature5,
                      value.max
                    )} 40%,  ${rgba(
                      t.color.background.feature5,
                      value.max
                    )} 60%, ${rgba(
                      t.color.background.feature5,
                      value.min
                    )} 100%)`
                  : value
              ),
            }))}
          />
        </div>
      </section>
    ) : null;

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <Standard>
        <ProductPageMetadata />
        <main id="main" key={handle}>
          <AddToCart
            ingredientsTab={{
              isOpen: isIngredientsTabOpen,
              onClick: () => setIsIngredientsTabOpen(!isIngredientsTabOpen),
            }}
          />

          <section
            css={s(
              belt,
              ...(foodTransparencyFragment ? [gutter] : [gutterTop, gutterX])
            )}
          >
            {data.ecommerce.productType === "Dog Food" ? (
              <ProductFeaturesFood />
            ) : (
              <ProductFeaturesSupplement />
            )}
          </section>
          {foodTransparencyFragment}
          <section
            css={s(
              foodTransparencyFragment
                ? (t) => ({ paddingTop: [0, ...gutterSpacingY(t).slice(1)] })
                : gutterTop
            )}
          >
            {keyFeaturesImage && (
              <FeatureLayout
                _css={s(bodyTextStatic)}
                direction="rtl"
                image={prismicImageToStaticImage(keyFeaturesImage)}
              >
                {keyFeaturesTitle && (
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    <RichTextFragment render={keyFeaturesTitle} />
                  </h2>
                )}
                {keyFeaturesContent && (
                  <ProductRichText render={keyFeaturesContent} />
                )}
              </FeatureLayout>
            )}
          </section>
          <section css={s(gutterY)}>
            {usageImage && (
              <FeatureLayout
                _css={s(bodyTextStatic)}
                direction="ltr"
                image={prismicImageToStaticImage(usageImage)}
              >
                {usageTitle && (
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    <RichTextFragment render={usageTitle} />
                  </h2>
                )}
                {usageIntro && <ProductRichText render={usageIntro} />}
                {product.servingSizes && (
                  <div
                    css={s((t) => ({
                      backgroundColor: t.color.background.feature3,
                      borderRadius: t.radius.md,
                      marginTop: t.spacing.lg,
                      ...px([t.spacing.md, null, t.spacing.lg]),
                      ...py(t.spacing.lg),
                    }))}
                  >
                    <h3
                      css={s(headingCharlieStatic, (t) => ({
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("product:usage.serving.title")}
                    </h3>
                    {product.use && <ProductRichText render={product.use} />}
                    {!!product.servingSizes?.length && (
                      <ProductServingSizes
                        servingSizes={product.servingSizes}
                      />
                    )}
                  </div>
                )}
              </FeatureLayout>
            )}
          </section>
          {!!expertQuotes?.length && (
            <section css={s(gutter, { paddingTop: 0 })}>
              <ExpertQuotes quotes={expertQuotes} />
            </section>
          )}
          {!!reviews?.length && (
            <section
              css={s(gutterY, (t) => ({
                "&:before": {
                  ...wave({ color: t.color.background.feature1 }),
                  bottom: "100%",
                  content: "''",
                  display: "block",
                  left: 0,
                  position: "absolute",
                  right: 0,
                },
                backgroundColor: t.color.background.feature1,
                position: "relative",
                ...px([null, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
              }))}
            >
              <div
                css={s(belt, gutterX, (t) => ({
                  marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                  textAlign: "center",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                  }))}
                >
                  {t("product:reviewHighlights.title")}
                </h2>
                <p css={s(bodyText)}>
                  {t("product:reviewHighlights.description")}
                </p>
                {reviewsHighlights && (
                  <ul
                    css={s(headingEcho, (t) => ({
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: t.spacing.lg,
                    }))}
                  >
                    {reviewsHighlights.map(
                      ({ highlight }, index) =>
                        highlight && (
                          <li
                            key={index}
                            css={s((t) => ({
                              "& + &": {
                                "&:before": {
                                  backgroundImage: [
                                    `url("${squiggleImageY({
                                      color: t.color.background.feature5,
                                    })}")`,
                                    `url("${dataUriFromPath({
                                      fill: t.color.background.feature5,
                                      path: paw,
                                    })}")`,
                                  ],
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "contain",
                                  content: "''",
                                  display: "block",
                                  height: [52, 18],
                                  left: 0,
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: [8, 18],
                                },
                                marginLeft: [t.spacing.md, null, t.spacing.lg],
                                paddingLeft: [t.spacing.md, null, t.spacing.lg],
                                position: "relative",
                              },
                            }))}
                          >
                            <RichTextFragment render={highlight} />
                          </li>
                        )
                    )}
                  </ul>
                )}
              </div>
              <ReviewsCarousel reviews={reviews} />
              <div
                css={s(belt, gutterX, (t) => ({
                  marginTop: t.spacing.xl,
                  textAlign: "center",
                }))}
              >
                {bottomline?.totalReviews ? (
                  <ScrollLink
                    css={s(secondaryButton())}
                    duration={500}
                    smooth={true}
                    to="product-reviews"
                  >
                    {t("product:reviewHighlights.cta")}
                  </ScrollLink>
                ) : (
                  <Link css={s(secondaryButton())} to="/reviews">
                    {t("product:reviewHighlights.cta")}
                  </Link>
                )}
              </div>
            </section>
          )}
          {!!keyIngredients?.length && (
            <section
              css={s(gutterBottom, (t) => ({
                backgroundColor: t.color.background.feature1,
                textAlign: "center",
              }))}
            >
              <div css={s(gutterX, (t) => ({ marginBottom: t.spacing.xl }))}>
                {keyIngredientsTitle && (
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    <RichTextFragment render={keyIngredientsTitle} />
                  </h2>
                )}
                {keyIngredientsIntro && (
                  <div css={s(belt, { maxWidth: 480 })}>
                    <ProductRichText render={keyIngredientsIntro} />
                  </div>
                )}
              </div>
              <div css={s(belt, (t) => px([null, null, t.spacing.xl]))}>
                <Carousel
                  controls={{ DotContainer: null }}
                  gutter={theme.spacing.md}
                  innerCss={s(px(["20%", "25%", 0]))}
                  slidesToShow={[1, null, 3]}
                >
                  {keyIngredients.map(({ ingredient }) => {
                    if (!ingredient) {
                      return null;
                    }

                    const { _meta, effects, image, type } = ingredient;

                    if (!effects || !image || !type) {
                      return null;
                    }

                    return (
                      <article
                        key={_meta.id}
                        css={s(belt, { maxWidth: 280, textAlign: "center" })}
                      >
                        <div
                          css={s(belt, (t) => ({
                            backgroundColor: t.color.background.base,
                            borderColor: "transparent",
                            borderRadius: t.radius.xxl,
                            borderStyle: "solid",
                            borderWidth: 4,
                            marginBottom: t.spacing.md,
                            maxWidth: 200,
                          }))}
                        >
                          {image && (
                            <ResponsiveImage
                              alt=""
                              {...image.dimensions}
                              sizes={{ width: 192 }}
                              src={image.url}
                            />
                          )}
                        </div>
                        <h3
                          css={s(headingBravoStatic, (t) => ({
                            marginBottom: t.spacing.sm,
                          }))}
                        >
                          <RichTextFragment render={type} />
                        </h3>
                        <ProductRichText render={effects} />
                      </article>
                    );
                  })}
                </Carousel>
              </div>
              <div
                css={s(belt, gutterX, (t) => ({
                  marginTop: t.spacing.md,
                }))}
              >
                <ScrollLink
                  css={s(secondaryButton())}
                  duration={500}
                  offset={-100}
                  onClick={() => setIsIngredientsTabOpen(true)}
                  smooth={true}
                  to="details-typical-values"
                >
                  {t("product:ingredients.cta")}
                </ScrollLink>
              </div>
            </section>
          )}
          {!!collection?.products.edges.length && (
            <section
              css={s(gutterY, {
                textAlign: "center",
              })}
            >
              <h2
                css={s(gutterX, headingAlpha, (t) => ({
                  marginBottom: t.spacing.xl,
                }))}
              >
                {t("product:crossSell.title")}
              </h2>
              <div
                css={s(belt, (t) =>
                  px([null, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl])
                )}
              >
                <Carousel
                  controls={{ DotContainer: null }}
                  gutter={theme.spacing.md}
                  innerCss={s((t) => px(t.spacing.md))}
                  slidesToShow={[1.2, 2, 3]}
                >
                  {collection.products.edges.map(({ node }, position) => (
                    <ProductListingItem
                      key={position}
                      _css={s(bodyTextSmall, { height: "100%" })}
                      collectionName="All products"
                      position={position}
                      product={node}
                      sizes={{
                        maxWidth: 1280 / 3,
                        width: ["80vw", "50vw", "33.333vw"],
                      }}
                    />
                  ))}
                </Carousel>
              </div>
            </section>
          )}
          {!!bottomline?.totalReviews && (
            <section css={s(gutterBottom, gutterX)} id="product-reviews">
              <div css={s(belt, { maxWidth: 960 })}>
                <h2 css={s(headingAlpha, { textAlign: "center" })}>
                  {t("product:reviews.title")}
                </h2>
                <ReviewsProductWidget
                  _css={s((t) => ({
                    marginTop: [t.spacing.md, null, t.spacing.lg],
                  }))}
                  product={data.ecommerce}
                />
              </div>
            </section>
          )}
          {faqs?.body?.map(
            (snippet, index) =>
              !!snippet?.fields?.length && (
                <section
                  key={index}
                  css={s(gutter, (t) => ({
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
                      {t("product:faqs.title")}
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
                            <div
                              css={s((t) => ({ marginBottom: t.spacing.md }))}
                            >
                              <RichText render={answer} />
                            </div>
                          </Accordion>
                        )
                    )}
                  </div>
                </section>
              )
          )}
        </main>
        <ProductSchema product={data.ecommerce} />
      </Standard>
    </ProductPageDataProvider>
  );
};

export default ProductPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const { COLLECTION_BY_HANDLE_CORE } = await import(
    "@sss/ecommerce/collection"
  );
  const apolloClient = initializeApollo({});

  const result = await runServerSideQuery<CollectionData<ProductCore>>(
    apolloClient,
    {
      fetchPolicy: "no-cache",
      query: COLLECTION_BY_HANDLE_CORE,
      variables: {
        // XXX: We pre-rendering the first 9 products (sups, treats + chicken).
        // This enough for the whole product catalogue. To keep the build speedy,
        // we might want to pre-renderer fewer product pages when rolling back to
        //  `fallback: "blocking",`.
        first: 9,
        handle: "all-products",
      },
    }
  );
  throwGraphQLErrors(result);

  if (!result.data) {
    throw new Error("Unexpected empty `COLLECTION_BY_HANDLE_CORE` result");
  }

  return {
    // XXX: Move back to `fallback: "blocking",` once the chicken product page is live.
    fallback: false,
    paths: result.data.collection.products.edges.map(({ node }) => ({
      params: { handle: node.handle },
    })),
  };
};

export const getStaticProps = makeProductPageStaticPropsGetter(
  undefined,
  async (result, _context, { apolloClient }) => {
    const { COLLECTION_BY_HANDLE } = await import("@sss/ecommerce/collection");
    try {
      const { data } = await apolloClient.query<CollectionData>({
        fetchPolicy: "no-cache",
        query: COLLECTION_BY_HANDLE,
        variables: {
          handle: "cross-sell",
        },
      });

      if (data?.collection) {
        // Filter out the current product from the cross-sell collection
        data.collection.products.edges = data.collection.products.edges.filter(
          ({ node }) => node.handle !== result.props.data.ecommerce.handle
        );

        return {
          ...result,
          props: {
            ...result.props,
            data: {
              ...result.props.data,
              collection: data.collection,
            },
          },
        };
      }
    } catch (error) {
      // Fail silently - we don't need it to render the key sections
    }

    return result;
  }
);
