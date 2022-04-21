import { trackAddToCartEvent } from "@sss/ecommerce/analytics";
import {
  CartLineItemActionType,
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
  getProductUrl,
  getVariantPrices,
  ProductContainerOption,
  ProductContainerType,
} from "@sss/ecommerce/product";
import { useCurrencyFormatter } from "@sss/i18n";
import { useLocale } from "@sss/i18n";
import { useRouter } from "next/router";
import React, { FC } from "react";

import {
  belt,
  ComponentStyleProps,
  greedy,
  mx,
  percentage,
  py,
  ResponsiveCSSObject,
  s,
  size,
  StyleFn,
  visuallyHidden,
} from "@/common/ui/utils";

import STRIPE_IMG from "../../../assets/images/checkout/STRIPE.svg";
import LARGE_DOG_IMG from "../../../assets/images/common/sizes/LARGE.png";
import MEDIUM_DOG_IMG from "../../../assets/images/common/sizes/MEDIUM.png";
import SMALL_DOG_IMG from "../../../assets/images/common/sizes/SMALL.png";
import { useProductPageData } from "../../../cms/product-page";
import { primaryButton } from "../../base/button";
import { Grid, Item } from "../../base/grid";
import Icon from "../../base/icon";
import ResponsiveImage from "../../base/responsive-image";
import {
  bodyTextSmall,
  bodyTextSmallStatic,
  bodyTextStatic,
  headingAlpha,
  headingDelta,
  headingDeltaStatic,
  headingEchoStatic,
} from "../../base/typography";
import starburst from "../../icons/starburst";
import tick from "../../icons/tick";
import { dataUriFromPath } from "../../styles/utils";
import PaymentCard, { PaymentCardBrand } from "../payment-card";

const enUsResource = {
  addToCart: "Add to cart",
  benefit: {
    guarantee: "90 Day Money-Back Guarantee",
    shipping: "FREE US Shipping",
    usa: "Made in the USA",
  },
  checkout: {
    stripe: "Secure checkout - powered by Stripe",
  },
  duration: {
    size: {
      large: "Large dog",
      medium: "Medium dog",
      small: "Small dog",
    },
    title: "How long will it last?",
    value: {
      DAY_one: "{{ count }} day",
      DAY_other: "{{ count }} days",
      MONTH_one: "{{ count }} month",
      MONTH_other: "{{ count }} months",
    },
  },
  header: {
    title:
      "Grab your pack today and start seeing a real difference in your dog’s health.",
  },
  variant: {
    price: "Your price",
    savings: "Savings",
    usp: {
      item0: "Best value pack",
      item1: "Most popular pack",
      item2: "Starter pack",
    },
  },
};

export enum BundleDurationUnit {
  DAY = "DAY",
  MONTH = "MONTH",
}

export const getBundleDuration = (bundleUnits: number, unitsPerDay: number) => {
  const days = bundleUnits / unitsPerDay;

  if (days < 1) {
    throw new Error("Invalid bundle duration");
  }

  if (days < 10) {
    return {
      unit: BundleDurationUnit.DAY,
      value: Math.round(days),
    };
  }

  if (days < 30) {
    return {
      unit: BundleDurationUnit.DAY,
      value: Math.round(days * 5) / 5,
    };
  }

  const months = days / 30;

  if (months < 2) {
    return {
      unit: BundleDurationUnit.MONTH,
      value: Math.round(months * 2) / 2,
    };
  }

  return {
    unit: BundleDurationUnit.MONTH,
    value: Math.round(months),
  };
};

const listStyle = s(bodyTextSmall, (t) => ({
  "& > *": {
    "&:before": {
      backgroundColor: t.color.border.selected,
      backgroundImage: `url(${dataUriFromPath({
        fill: t.color.background.base,
        path: tick,
      })})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "60%",
      borderRadius: t.radius.xxl,
      content: '""',
      display: "block",
      left: t.spacing.xs,
      position: "absolute",
      ...size(20),
    },
    "&:first-child": {
      marginTop: 0,
    },
    marginTop: t.spacing.xs,
    paddingLeft: 40,
    position: "relative",
  },
  textAlign: "left",
}));

const getItemStyles = (index: number) => {
  const banner = s(headingDeltaStatic, (t) => {
    const style: ResponsiveCSSObject = {
      alignItems: "center",
      backgroundColor: t.color.background.feature1,
      display: "flex",
      height: 48,
      justifyContent: "center",
      position: "relative",
      textTransform: "uppercase",
    };

    switch (index) {
      case 0:
        style.backgroundColor = t.color.border.selected;
        style.color = t.color.text.light.base;
        break;
      case 1:
        style.backgroundColor = t.color.background.feature3;
        break;
      case 2:
        style.backgroundColor = t.color.background.feature5;
        break;
    }

    return style;
  });

  const button = s(primaryButton(), {
    width: "100%",
  });

  const card: StyleFn = (t) => ({
    "&:before": {
      ...greedy,
      borderRadius: "inherit",
      boxShadow: `inset 0 0 0 1px ${t.color.tint.algae}`,
      content: "''",
      display: "block",
      zIndex: 1, // Stack on top of the banner
    },
    alignItems: "stretch",
    backgroundColor: t.color.background.base,
    borderRadius: t.radius.md,
    display: "flex",
    flexDirection: "column-reverse",
    flexGrow: 1,
    overflow: "hidden",
    position: "relative",
  });

  const content: StyleFn = (t) => ({
    padding: t.spacing.md,
    position: "relative",
    zIndex: 1, // Stack on top of `card::before`
  });

  const image: StyleFn = (t) => ({
    flexShrink: 1,
    marginTop: [t.spacing.md, null, t.spacing.sm],
    position: "relative",
    width: [145, 165, "100%"],
  });

  const price = s(headingAlpha, (t) => ({
    color: t.color.border.selected,
    fontSize: [36, null, 40, 44],
    lineHeight: 1,
  }));

  const wrapper: ResponsiveCSSObject = {
    alignItems: "stretch",
    alignSelf: "center",
    display: "flex",
    order: [null, null, null, -index],
    position: "relative",
    zIndex: 0,
  };

  const styles = {
    banner,
    button,
    card,
    content,
    image,
    price: {
      unit: s((t) => ({
        display: "block",
        fontSize: [18, null, null, 20],
        fontStyle: "italic",
        fontWeight: t.font.secondary.weight.book,
        letterSpacing: 0,
      })),
      value: price,
    },
    title: s(bodyTextStatic, {
      fontSize: [18, null, null, 16],
      lineHeight: 1,
      textTransform: "capitalize",
    }),
    wrapper,
  };

  return index === 0
    ? {
        ...styles,
        button: s(button, (t) => ({
          fontSize: [14, null, null, 16],
          ...py([23, null, null, t.spacing.md]),
        })),
        card: s(card, (t) => ({
          "&:before": null,
          boxShadow: "0px 15px 30px rgba(41, 41, 41, 0.1)",
          ...mx([null, null, null, -t.spacing.xs]),
        })),
        content: s(content, (t) => ({
          padding: [t.spacing.md, null, null, t.spacing.lg],
        })),
        price: {
          ...styles.price,
          value: s(price, { fontSize: [36, null, 40, 54] }),
        },
        wrapper: s(wrapper, {
          order: [null, null, null, -1],
          zIndex: [null, null, null, 1],
        }),
      }
    : styles;
};

interface TheOneBundlePickerProps extends ComponentStyleProps {
  skus: string[];
  trackingSource: string;
}

const TheOneBundlePicker: FC<TheOneBundlePickerProps> = ({
  _css = {},
  skus,
  trackingSource,
}) => {
  const { lineItemUpdate } = useCart();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();
  const data = useProductPageData();
  const router = useRouter();

  i18n.addResourceBundle("en-US", "TheOneBundlePicker", enUsResource);

  const cartOffer = useCartOfferRedirect({
    destinationType: CartOfferDestinationType.CHECKOUT,
    disabled: data.meta.subscription.hasSubscription,
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
    product: data.ecommerce,
  });

  return (
    <div css={s(belt, { maxWidth: 1040 }, _css)}>
      <h2
        css={s(
          belt,
          { maxWidth: [640, null, null, "unset"] },
          headingAlpha,
          (t) => ({
            marginBottom: t.spacing.xxl,
          })
        )}
      >
        {t("TheOneBundlePicker:header.title")}
      </h2>
      <Grid
        _css={s(belt, { maxWidth: [360, null, null, "unset"] })}
        gy={(t) => t.spacing.lg}
        gx={(t) => t.spacing.xxs}
        itemWidth={[percentage(1), null, null, percentage(1 / 3)]}
      >
        {skus.map((sku, index) => {
          const variant = findVariantBySku(data.ecommerce.variants, sku);

          if (!variant) {
            return null;
          }

          const bundleSize = parseIntegerMetafield(variant.bundleSize);
          const bundleUnit = data.ecommerce.bundleUnit?.value ?? null;
          const bundleUnits = parseIntegerMetafield(variant.units);
          const otpBaseContainer =
            data.ecommerce.containers?.[ProductContainerType.OTP][
              ProductContainerOption.BASE
            ] ?? null;

          const { oneOffPrice, oneOffDiscount } = getVariantPrices(variant);

          const styles = getItemStyles(index);

          const handleAddToCart = () => {
            const frequency = null;
            const properties = {};
            const quantity = 1;

            lineItemUpdate({
              payload: {
                ...getCoreCartLineItem(variant, data.ecommerce),
                frequency,
                properties,
                quantity,
              },
              type: CartLineItemActionType.REPLACE_ALL,
            });

            trackAddToCartEvent(
              data.ecommerce,
              variant,
              trackingSource,
              quantity,
              frequency
            );

            if (!data.meta.subscription.hasSubscription) {
              cartOffer.redirect({
                frequency,
                properties,
                sku: variant.sku,
                variantId: variant.id,
              });

              return;
            }

            router.push(
              `${getProductUrl(
                data.ecommerce
              )}/subscribe/${sku.toLowerCase()}?source=${encodeURIComponent(
                trackingSource
              )}`
            );
          };

          return (
            <Item key={sku} _css={s(styles.wrapper)}>
              <article css={s(styles.card)}>
                <div css={s(styles.content)}>
                  <h3 css={s(styles.title)}>
                    {variant.title}
                    {otpBaseContainer && <> + {otpBaseContainer.title}</>}
                  </h3>
                  <div
                    css={s({
                      alignItems: "center",
                      display: ["flex", null, "block"],
                      justifyContent: "space-between",
                    })}
                  >
                    <div css={s(styles.image)}>
                      <ResponsiveImage
                        alt=""
                        height={800}
                        sizes={{ width: [145, 165, 312, 296] }}
                        width={1200}
                        src={`/images/product/the-one/tube-${bundleUnit}-x${bundleSize}.jpg`}
                      />
                      {oneOffDiscount && (
                        <p
                          css={s((t) => ({
                            alignItems: "center",
                            color: t.color.text.light.base,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            position: "absolute",
                            right: [-t.spacing.sm, null, t.spacing.md],
                            ...size([72, null, 80]),
                            top: [-t.spacing.sm, null, t.spacing.sm],
                            zIndex: 1,
                          }))}
                        >
                          <Icon
                            _css={s(greedy, (t) => ({
                              color: t.color.accent.light,
                              filter: "drop-shadow(0px 4px 8px #00000026)",
                              zIndex: -1,
                            }))}
                            path={starburst}
                          />
                          <span css={s(headingDelta)}>
                            {formatCurrency(oneOffDiscount.price)}
                          </span>
                          <span
                            css={s(headingEchoStatic, (t) => ({
                              lineHeight: 1,
                              marginBottom: -t.spacing.xxs,
                            }))}
                          >
                            {t("TheOneBundlePicker:variant.savings")}
                          </span>
                        </p>
                      )}
                    </div>
                    <dl
                      css={s((t) => ({
                        flexGrow: 1,
                        marginLeft: [t.spacing.sm, null, 0],
                        marginTop: t.spacing.md,
                      }))}
                    >
                      <dt css={s(visuallyHidden)}>
                        {t("TheOneBundlePicker:variant.price")}
                      </dt>
                      <dd css={s(styles.price.value)}>
                        {bundleSize && bundleUnit ? (
                          <>
                            {formatCurrency(
                              moneyFns.divide(oneOffPrice, bundleSize)
                            )}
                            <span css={s(styles.price.unit)}>
                              {" "}
                              / {bundleUnit}
                            </span>
                          </>
                        ) : (
                          <>{formatCurrency(oneOffPrice)}</>
                        )}
                      </dd>
                    </dl>
                  </div>
                  <ul
                    css={s(listStyle, (t) => ({
                      borderTopColor: t.color.tint.algae,
                      borderTopStyle: "solid",
                      borderTopWidth: 1,
                      marginTop: t.spacing.md,
                      paddingTop: t.spacing.md,
                    }))}
                  >
                    <li>{t("TheOneBundlePicker:benefit.shipping")}</li>
                    <li>{t("TheOneBundlePicker:benefit.guarantee")}</li>
                    <li>{t("TheOneBundlePicker:benefit.usa")}</li>
                  </ul>
                  <button
                    css={s(styles.button, (t) => ({ marginTop: t.spacing.md }))}
                    onClick={handleAddToCart}
                  >
                    {t("TheOneBundlePicker:addToCart")}
                  </button>
                  {bundleUnits && (
                    <>
                      <h4
                        css={s(headingDeltaStatic, (t) => ({
                          fontSize: 16,
                          marginTop: t.spacing.md,
                        }))}
                      >
                        {t("TheOneBundlePicker:duration.title")}
                      </h4>

                      <div
                        css={s((t) => ({
                          display: "flex",
                          marginTop: t.spacing.sm,
                          width: "100%",
                        }))}
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
                            <div
                              key={key}
                              css={s((t) => ({
                                "&:first-child": {
                                  borderLeftStyle: "none",
                                  marginLeft: -t.spacing.sm,
                                },
                                "&:last-child": {
                                  marginRight: -t.spacing.sm,
                                },
                                borderLeftColor: t.color.tint.algae,
                                borderLeftStyle: "solid",
                                borderLeftWidth: 1,
                                marginLeft: t.spacing.sm,
                                paddingLeft: t.spacing.sm,
                                width: percentage(1 / 3),
                              }))}
                            >
                              <div
                                css={s((t) => ({
                                  display: "inline-block",
                                  marginBottom: t.spacing.xxs,
                                  width: 48,
                                }))}
                              >
                                <ResponsiveImage
                                  alt=""
                                  sizes={{ width: 48 }}
                                  {...image}
                                />
                              </div>
                              <h5
                                css={s(headingEchoStatic, (t) => ({
                                  fontStyle: "italic",
                                  fontWeight: t.font.secondary.weight.book,
                                  marginBottom: t.spacing.xxs,
                                }))}
                              >
                                {t(`TheOneBundlePicker:duration.size.${key}`)}
                              </h5>
                              <p css={s(bodyTextSmallStatic)}>
                                {t(
                                  `TheOneBundlePicker:duration.value.${bundleDuration.unit}`,
                                  {
                                    count: bundleDuration.value,
                                  }
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <aside css={s(styles.banner)}>
                  {t(`TheOneBundlePicker:variant.usp.item${index}`)}
                </aside>
              </article>
            </Item>
          );
        })}
      </Grid>
      <div
        css={s((t) => ({
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: [t.spacing.lg, null, t.spacing.xl],
        }))}
      >
        <div css={s({ width: 118 })}>
          <ResponsiveImage
            alt={t("TheOneBundlePicker:checkout.stripe")}
            unoptimized
            sizes={{ width: 118 }}
            src={STRIPE_IMG}
          />
        </div>
        <div css={s({ marginTop: 12, whiteSpace: "no-wrap" })}>
          {[
            PaymentCardBrand.VISA,
            PaymentCardBrand.MASTERCARD,
            PaymentCardBrand.AMEX,
            PaymentCardBrand.DISCOVER,
            PaymentCardBrand.DINERS,
            PaymentCardBrand.JCB,
          ].map((brand) => (
            <PaymentCard
              key={brand}
              _css={s((t) => ({
                marginLeft: [t.spacing.xxs, null, t.spacing.xs],
                width: 42,
              }))}
              brand={brand}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheOneBundlePicker;
