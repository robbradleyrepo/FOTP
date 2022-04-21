import { throwGraphQLErrors } from "@sss/apollo";
import {
  CartLineItem,
  CartLineItemActionType,
  CartStatus,
  getCoreCartLineItem,
  useCart,
} from "@sss/ecommerce/cart";
import { moneyFns, parseIntegerMetafield } from "@sss/ecommerce/common";
import {
  CartOfferDestinationType,
  useCartOfferRedirect,
} from "@sss/ecommerce/offer/cart";
import {
  findVariantBySku,
  formValuesToFrequency,
  getInitialProductFormValues,
  getProductComputedMetadata,
  getVariantPrices,
  Product,
  ProductContainerOption,
  ProductContainerType,
  ProductData,
  ProductFormValues,
  Variant,
} from "@sss/ecommerce/product";
import { useInView } from "@sss/hooks";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef } from "react";
import { Form } from "react-final-form";

import { isDefined } from "@/common/filters";
import {
  belt,
  greedy,
  gutter,
  gutterTop,
  gutterX,
  percentage,
  px,
  py,
  s,
  size,
  StyleFn,
  visuallyHidden,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../pages/_app";
import LARGE_DOG_IMG from "../assets/images/common/sizes/LARGE.png";
import MEDIUM_DOG_IMG from "../assets/images/common/sizes/MEDIUM.png";
import SMALL_DOG_IMG from "../assets/images/common/sizes/SMALL.png";
import { RichText } from "../cms/prismic";
import { FaqCategorySlice, FaqCategorySnippetData } from "../cms/snippets";
import Accordion from "../ui/base/accordion";
import { primaryButton, secondaryButton } from "../ui/base/button";
import { Grid, Item } from "../ui/base/grid";
import Icon from "../ui/base/icon";
import ResponsiveImage from "../ui/base/responsive-image";
import { PageSpinner } from "../ui/base/spinner";
import {
  bodyText,
  bodyTextSmall,
  bodyTextStatic,
  headingAlpha,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../ui/base/typography";
import Field from "../ui/forms/field";
import cross from "../ui/icons/cross";
import starburst from "../ui/icons/starburst";
import tick from "../ui/icons/tick";
import { getBundleDuration } from "../ui/modules/offers/the-one-bundle-picker";
import SalesFunnelHeader from "../ui/modules/sales-funnel-header";
import { dataUriFromPath } from "../ui/styles/utils";

const enUsResource = {
  duration: {
    description:
      "Check your dog’s weight below for the ideal delivery frequency:",
    guide: {
      large: "Dogs over 50lbs = 3 scoops a day",
      medium: "Dogs between 25-50lbs = 2 scoops a day",
      small: "Dogs under 25lbs = 1 scoop a day",
    },
    title: "How Often Do I Need It?",
    usage:
      "Sprinkle the recommended number of scoops onto your dog’s food once a day, or mix it in with one of their favorite healthy snacks.",
    value: {
      DAY_one: "{{ count }} day’s supply",
      DAY_other: "{{ count }} days’ supply",
      MONTH_one: "{{ count }} month’s supply",
      MONTH_other: "{{ count }} months’ supply",
    },
  },
  form: {
    cancel: "No, I don’t want to subscribe",
    container: {
      free: "Premium Tin",
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
    price: "Price",
    rrp: "RRP",
    submit: "Yes, I want to subscribe & Save\u00A010%",
  },
  header: {
    benefits: {
      benefit: {
        control: {
          description:
            "You have complete control, no contracts or strings attached.",
          title: "Cancel, pause or skip anytime",
        },
        guarantee: {
          description:
            "Simply return it within 90 days and we’ll give you a full refund.",
          title: "Risk free money-back guarantee",
        },
        save: {
          description:
            "Avoid the hassle of re-ordering and save 10% every time!",
          title: "Save 10% on every delivery",
        },
        tin: {
          description: "Use your FREE tin to keep your dog’s supplement fresh.",
          title: "FREE Premium Tin worth {{ compareAtPrice }}",
        },
      },
      title: "Benefits of a subscription",
    },
    title: "Why Not Upgrade To A Subscription?",
  },
  meta: {
    description:
      "Hook your doggo up with a subscription and save on every delivery. You can cancel or change your delivery schedule any time.",
    title: "Subscribe & Save An Extra 10%",
  },
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
      paddingTop: 0,
    },
    borderBottomColor: t.color.border.light,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    paddingLeft: [38, null, 44],
    position: "relative",
    ...py([t.spacing.sm, null, t.spacing.md]),
  },
  textAlign: "left",
}));

const buttonIcon: StyleFn = (t) => ({
  display: ["none", "inline-block"],
  marginBottom: -3,
  marginRight: t.spacing.xs,
  ...size(t.spacing.sm),
  verticalAlign: "baseline",
});

const buttonStyleOverride: StyleFn = (t) => ({
  ...px(t.spacing.md),
  width: "100%",
});

const gridItemContent = s(belt, { maxWidth: 420 });

interface SubscriptionUpsellPageProps {
  faqs: FaqCategorySlice;
  product: Product;
  sku: string;
}

const SubscriptionUpsellPage: FC<SubscriptionUpsellPageProps> = ({
  faqs,
  product,
  sku,
}) => {
  const { lineItems, lineItemUpdate, status } = useCart();
  const cartOffer = useCartOfferRedirect({
    destinationType: CartOfferDestinationType.CHECKOUT,
    ignoreCart: true,
    offers: [
      {
        handle: "the-one",
        include: { skus: ["FPHM01-HM30", "FPHM01-HM30x2", "FPHM01-HM30x3"] },
        products: ["the-one"],
      },
      {
        handle: "treats",
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
    product,
  });
  const formatCurrency = useCurrencyFormatter();
  const [ref, isInView] = useInView();
  const { i18n, locale, t } = useLocale();
  const router = useRouter();

  i18n.addResourceBundle("en-US", "SubscriptionUpsellPage", enUsResource);

  const meta = getProductComputedMetadata(product, router.query, locale);
  const variant = findVariantBySku(product.variants, sku);

  // Typeguard: we'll have a valid variant because we validate during
  // `getStaticProps`
  if (!variant) {
    throw new Error(
      `Missing variant for product with handle "${product.handle}" && SKU "${sku}"`
    );
  }

  const bundleSize = parseIntegerMetafield(variant.bundleSize);
  const bundleUnit = product.bundleUnit?.value ?? null;
  const bundleUnits = parseIntegerMetafield(variant.units);
  const subBaseContainer =
    product.containers?.[ProductContainerType.SUB][
      ProductContainerOption.BASE
    ] ?? null;

  const { regularPrice, subscriptionPrice } = getVariantPrices(variant);

  // Typeguard: we'll have subscription pricing because we validate during
  // `getStaticProps`
  if (!subscriptionPrice) {
    throw new Error(
      `Missing subscription data for variant with ID "${variant.id}"`
    );
  }

  // We'll store the original upgradeable line item in a ref to make sure
  // we don't cause render errors between setting the subscription and
  // redirecting to checkout
  const upgradeableLineItemRef = useRef<CartLineItem | null>(null);

  if (!upgradeableLineItemRef.current) {
    // We can only reliably apply the upgrade if there's only a single
    // matching line item that doesn't already have a subscription
    const applicableLineItems = lineItems.filter(
      ({ frequency, variantId }) => variantId === variant.id && !frequency
    );

    if (applicableLineItems.length === 1) {
      upgradeableLineItemRef.current = applicableLineItems[0];
    }
  }

  useEffect(() => {
    if (upgradeableLineItemRef.current || status === CartStatus.INITIALIZING) {
      return;
    }

    router.replace("/cart");
  }, [router, status]);

  // Prefetch the offer page for the currently selected variant when in view
  useEffect(() => {
    if (isInView) {
      cartOffer.prefetch(variant.sku);
    }
  }, [isInView, cartOffer, variant.sku]);

  const formDefaults = getInitialProductFormValues(meta.selection, null);

  const handleAddToCart = (values: ProductFormValues) => {
    if (!upgradeableLineItemRef.current) {
      throw new Error("Missing cart line item to update");
    }

    const frequency = formValuesToFrequency(values, meta);

    lineItemUpdate({
      payload: {
        ...upgradeableLineItemRef.current,
        ...getCoreCartLineItem(variant, product),
        newFrequency: frequency,
      },
      type: CartLineItemActionType.SET_SUBSCRIPTION,
    });

    cartOffer.redirect({
      frequency,
      properties: upgradeableLineItemRef.current?.properties ?? {},
      sku: variant.sku,
      variantId: variant.id,
    });
  };

  if (!upgradeableLineItemRef.current) {
    return <PageSpinner label="Loading..." />;
  }

  return (
    <>
      <Metadata
        description={t("SubscriptionUpsellPage:meta.description")}
        noindex
        title={t("SubscriptionUpsellPage:meta.title")}
      />
      <SalesFunnelHeader faqsPath="#faqs" />
      <main
        css={s((t) => ({
          marginTop: [t.height?.nav.mobile, null, t.height?.nav.desktop],
        }))}
      >
        <div
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
          }))}
        >
          <Grid
            _css={s(belt)}
            align="center"
            direction="rtl"
            gx={(t) => [t.spacing.xl, null, null, t.spacing.xxl]}
            gy={(t) => t.spacing.lg}
            itemWidth={[percentage(1), null, percentage(1 / 2)]}
          >
            <Item>
              <header css={s(gridItemContent)}>
                <h1
                  css={s(headingAlpha, { textAlign: ["center", null, "left"] })}
                >
                  {t("SubscriptionUpsellPage:header.title")}
                </h1>
                <h2 css={s(visuallyHidden)}>
                  {t("SubscriptionUpsellPage:header.benefits.title")}
                </h2>
                <ul
                  css={s(benefitList, (t) => ({
                    marginTop: [t.spacing.lg, null, t.spacing.xl],
                  }))}
                >
                  {["save", "tin", "control", "guarantee"].map((key) => {
                    let titleOptions = {};

                    if (key === "tin") {
                      if (!subBaseContainer?.compareAtPrice) {
                        return null;
                      }

                      titleOptions = {
                        compareAtPrice: formatCurrency(
                          subBaseContainer.compareAtPrice
                        ).replace(/\.00$/, ""),
                      };
                    }

                    const baseI18nKey = `SubscriptionUpsellPage:header.benefits.benefit.${key}`;

                    return (
                      <li key={key}>
                        <h3 css={s(headingDelta)}>
                          {t(`${baseI18nKey}.title`, titleOptions)}
                        </h3>
                        <p
                          css={s(bodyTextSmall, (t) => ({
                            display: ["none", null, "block"],
                            marginTop: t.spacing.xxs,
                          }))}
                        >
                          {t(`${baseI18nKey}.description`)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </header>
            </Item>
            <Item>
              <section css={s(gridItemContent)}>
                <Form
                  key={product.id} // Provide a key to make sure a new form is mounted if the product changes
                  initialValues={formDefaults}
                  onSubmit={handleAddToCart}
                >
                  {({ handleSubmit, submitSucceeded, submitting }) => {
                    if (!meta.subscription.hasSubscription) {
                      throw new Error(
                        "Cannot use `SubscriptionUpsellPage` on a product without a subscription"
                      );
                    }

                    const busy = submitSucceeded || submitting;

                    return (
                      <form onSubmit={handleSubmit}>
                        <div css={s({ position: "relative" })}>
                          <ResponsiveImage
                            alt=""
                            height={1224}
                            sizes={{ width: [145, 165, 312, 296] }}
                            width={1800}
                            src={`/images/product/the-one/tin-${bundleUnit}-x${bundleSize}.jpg`}
                          />
                          {subBaseContainer?.price &&
                            moneyFns.toFloat(subBaseContainer.price) === 0 && (
                              <p
                                css={s((t) => ({
                                  alignItems: "center",
                                  color: t.color.text.light.base,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  padding: t.spacing.sm,
                                  position: "absolute",
                                  right: [-t.spacing.sm, null, t.spacing.md],
                                  ...size([110, null, 128]),
                                  textAlign: "center",
                                  top: [-t.spacing.sm, null, t.spacing.sm],
                                  zIndex: 1,
                                }))}
                              >
                                <Icon
                                  _css={s(greedy, (t) => ({
                                    color: t.color.accent.light,
                                    filter:
                                      "drop-shadow(0px 4px 8px #00000026)",
                                    zIndex: -1,
                                  }))}
                                  path={starburst}
                                />
                                <span
                                  css={s(headingCharlie, {
                                    textTransform: "uppercase",
                                  })}
                                >
                                  {t("common:free")}
                                </span>
                                <span
                                  css={s(headingEcho, (t) => ({
                                    fontSize: [16, null, 18],
                                    marginBottom: -t.spacing.xxs,
                                  }))}
                                >
                                  {t(
                                    "SubscriptionUpsellPage:form.container.free"
                                  )}
                                </span>
                              </p>
                            )}
                        </div>
                        <dl css={s((t) => ({ marginTop: t.spacing.md }))}>
                          <dt css={s(visuallyHidden)}>
                            {t("SubscriptionUpsellPage:form.rrp")}
                          </dt>
                          <dd
                            css={s(headingCharlie, (t) => ({
                              marginBottom: t.spacing.xxs,
                              opacity: 0.8,
                              textDecoration: "line-through",
                            }))}
                          >
                            {bundleSize && bundleUnit ? (
                              <>
                                {formatCurrency(
                                  moneyFns.divide(regularPrice, bundleSize)
                                )}
                                <span css={s(visuallyHidden)}>
                                  {" "}
                                  / {bundleUnit}
                                </span>
                              </>
                            ) : (
                              <>{formatCurrency(regularPrice)}</>
                            )}
                          </dd>
                          <dt css={s(visuallyHidden)}>
                            {t("SubscriptionUpsellPage:form.price")}
                          </dt>
                          <dd
                            css={s(headingAlpha, (t) => ({
                              color: t.color.border.selected,
                              fontSize: [36, null, 40, 54],
                              lineHeight: 1,
                            }))}
                          >
                            {bundleSize && bundleUnit ? (
                              <>
                                {formatCurrency(
                                  moneyFns.divide(subscriptionPrice, bundleSize)
                                )}
                                <span
                                  css={s((t) => ({
                                    fontSize: [18, null, null, 20],
                                    fontStyle: "italic",
                                    fontWeight: t.font.secondary.weight.book,
                                    letterSpacing: 0,
                                  }))}
                                >
                                  {" "}
                                  / {bundleUnit}
                                </span>
                              </>
                            ) : (
                              <>{formatCurrency(subscriptionPrice)}</>
                            )}
                          </dd>
                        </dl>
                        <Field
                          _css={s((t) => ({
                            height: 54,
                            marginTop: t.spacing.lg,
                          }))}
                          busy={busy}
                          inputCss={s({
                            flexGrow: 1,
                            flexShrink: 1,
                            maxWidth: [null, 192],
                          })}
                          label={t(
                            "SubscriptionUpsellPage:form.frequency.label"
                          )}
                          labelCss={s(bodyTextStatic, (t) => ({
                            flexShrink: 0,
                            paddingRight: t.spacing.md,
                            whiteSpace: "nowrap",
                            width: [null, (420 - 192) / 2], // Centre the input
                          }))}
                          labelWrapperCss={s({
                            alignItems: "baseline",
                            display: "flex",
                            flexWrap: 0,
                          })}
                          name="frequency"
                          type="select"
                        >
                          {meta.subscription.frequencies.map(
                            (value) =>
                              meta.subscription.hasSubscription && (
                                <option key={value} value={value}>
                                  {t(
                                    `SubscriptionUpsellPage:form.frequency.value.${meta.subscription.unit}`,
                                    { count: Number(value) }
                                  )}
                                </option>
                              )
                          )}
                        </Field>
                        <div
                          css={s((t) => ({ marginTop: t.spacing.md }))}
                          ref={ref}
                        >
                          <button
                            css={s(
                              primaryButton({ disabled: busy }),
                              buttonStyleOverride
                            )}
                            disabled={busy}
                            type="submit"
                          >
                            <Icon _css={s(buttonIcon)} path={tick} />{" "}
                            {t("SubscriptionUpsellPage:form.submit")}
                          </button>
                          <button
                            css={s(
                              secondaryButton({ disabled: busy }),
                              buttonStyleOverride,
                              (t) => ({ marginTop: t.spacing.sm })
                            )}
                            onClick={() =>
                              cartOffer.redirect({
                                frequency: null,
                                properties:
                                  upgradeableLineItemRef.current?.properties ??
                                  {},
                                sku: variant.sku,
                                variantId: variant.id,
                              })
                            }
                            type="button"
                          >
                            <Icon _css={s(buttonIcon)} path={cross} />{" "}
                            {t("SubscriptionUpsellPage:form.cancel")}
                          </button>
                        </div>
                      </form>
                    );
                  }}
                </Form>
              </section>
            </Item>
          </Grid>
        </div>
        {bundleUnits && (
          <section
            css={s(gutterTop, gutterX, {
              textAlign: "center",
            })}
          >
            <div css={s(belt)}>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: t.spacing.md,
                }))}
              >
                {t("SubscriptionUpsellPage:duration.title")}
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.xxl],
                }))}
              >
                {t("SubscriptionUpsellPage:duration.description")}
              </p>
              <Grid
                gx={(t) => t.spacing.lg}
                gy={(t) => t.spacing.xl}
                itemWidth={["100%", null, percentage(1 / 3)]}
              >
                {[
                  {
                    image: SMALL_DOG_IMG,
                    key: "small",
                    unitsPerDay: 1,
                  },
                  {
                    image: MEDIUM_DOG_IMG,
                    key: "medium",
                    unitsPerDay: 2,
                  },
                  {
                    image: LARGE_DOG_IMG,
                    key: "large",
                    unitsPerDay: 3,
                  },
                ].map(({ image, key, unitsPerDay }) => {
                  const bundleDuration = getBundleDuration(
                    bundleUnits,
                    unitsPerDay
                  );

                  return (
                    <Item key={key}>
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
                          {...image}
                        />
                      </div>
                      <h3
                        css={s(bodyText, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        {t(`SubscriptionUpsellPage:duration.guide.${key}`)}
                      </h3>
                      <p css={s(headingDelta)}>
                        {t(
                          `SubscriptionUpsellPage:duration.value.${bundleDuration.unit}`,
                          {
                            count: bundleDuration.value,
                          }
                        )}
                      </p>
                    </Item>
                  );
                })}
              </Grid>
              <p
                css={s(belt, bodyText, (t) => ({
                  marginBottom: t.spacing.md,
                  marginTop: [t.spacing.xxl, null, 96],
                  maxWidth: 640,
                }))}
              >
                {t("SubscriptionUpsellPage:duration.usage")}
              </p>
            </div>
          </section>
        )}
        <section css={s(gutter)} id="faqs">
          <div css={s(belt, { maxWidth: 700 })}>
            {faqs.primary.heading && (
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: [t.spacing.lg, null, t.spacing.xl],
                  textAlign: "center",
                }))}
              >
                <RichTextFragment render={faqs.primary.heading} />
              </h2>
            )}
            {faqs.fields?.filter(isDefined).map(
              ({ faq: { answer, question } }, uid) =>
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
      </main>
    </>
  );
};

export default SubscriptionUpsellPage;

export const getStaticPaths: GetStaticPaths = () => ({
  fallback: "blocking",
  paths: [],
});

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    const handle = typeof params?.handle === "string" ? params.handle : null;
    const sku = typeof params?.sku === "string" ? params.sku : null;

    if (!handle || !sku) {
      throw new Error(
        `Missing \`SubscriptionUpsellPage\` route params - received "${JSON.stringify(
          params,
          null,
          4
        )}"`
      );
    }

    // We're only supporting The One for now
    if (handle !== "the-one") {
      return {
        notFound: true,
      };
    }

    const [
      { PRODUCT_BY_HANDLE },
      { FAQ_CATEGORY_SNIPPET },
    ] = await Promise.all([
      import("@sss/ecommerce/product"),
      import("../cms/snippets"),
    ]);

    const [ecommerce, faqs] = await Promise.all([
      apolloClient.query<ProductData>({
        query: PRODUCT_BY_HANDLE,
        variables: { handle },
      }),
      apolloClient.query<FaqCategorySnippetData>({
        query: FAQ_CATEGORY_SNIPPET,
        variables: { handle: "subscription-faqs" },
      }),
    ]);

    throwGraphQLErrors([ecommerce, faqs]);

    if (!faqs.data?.faqCategorySnippet?.body?.[0]) {
      throw new Error("Failed to fetch subscription-faqs");
    }

    if (ecommerce.data) {
      const variants = ecommerce.data.product.variants.edges.filter(
        ({ node }) => node.sku.toLowerCase() === sku.toLowerCase()
      );

      if (variants.length > 1) {
        throw Error(
          `Product with handle "${ecommerce.data.product.handle}" contains ${variants.length} SKUs that are a case insensitive match for "${sku}"`
        );
      }

      const variant: Variant | null = variants[0]?.node ?? null;

      if (variant) {
        const prices = variant && getVariantPrices(variant);

        if (prices?.subscriptionPrice) {
          return {
            props: {
              faqs: faqs.data.faqCategorySnippet.body[0],
              product: ecommerce.data.product,
              sku: variant.sku,
            },
          };
        }
      }
    }

    return {
      notFound: true,
    };
  }
);
