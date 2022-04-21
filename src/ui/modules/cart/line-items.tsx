import {
  trackAddToCartEvent,
  trackRemoveFromCartEvent,
} from "@sss/ecommerce/analytics";
import {
  CartLineItemAction,
  CartLineItemActionType,
  ComputedCartLineItem,
  EnhancedCartLineItem,
  getCoreCartLineItem,
  useCart,
} from "@sss/ecommerce/cart";
import {
  Frequency as FrequencyType,
  Money,
  moneyFns,
  parseIntegerMetafield,
} from "@sss/ecommerce/common";
import {
  getProductCoreSubscriptionMetadata,
  getVariantPrices,
  ProductContainer,
  ProductCore,
  ProductCoreSubscriptionMetadata,
  Variant,
  VariantPrices,
  VariantWithSelectionPrices,
} from "@sss/ecommerce/product";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useCallback, useState } from "react";

import {
  ComponentStyleProps,
  mx,
  my,
  px,
  py,
  ratio,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import Icon from "../../base/icon";
import ResponsiveImage from "../../base/responsive-image";
import {
  bodyTextSmallStatic,
  bodyTextStatic,
  headingDeltaStatic,
  headingEchoStatic,
} from "../../base/typography";
import { toggle } from "../../forms/toggle";
import minus from "../../icons/minus";
import plus from "../../icons/plus";
import times from "../../icons/times";
import Frequency from "../frequency";

const TRACKING_SOURCE = "cart";

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeWithLayout: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
  },
};

const incDecButtonStyle = { padding: 9 };
const incDecIconStyle = { ...size(12), display: "block" };
const thumbnailStyle = s(ratio(1), {
  backgroundColor: "rgba(47, 78, 37, 0.15)",
  flexGrow: 0,
  flexShrink: 0,
});

const quantityControlEnUsResource = {
  decrease: {
    label: "Decrease quantity",
  },
  increase: {
    label: "Increase quantity",
  },
  label: "Quantity",
};

type HandleLineItemUpdate = (
  input:
    | {
        payload: { quantity: number };
        type:
          | CartLineItemActionType.DECREMENT
          | CartLineItemActionType.INCREMENT;
      }
    | {
        type: CartLineItemActionType.REMOVE;
      }
    | {
        payload: {
          frequency: FrequencyType | null;
          newFrequency: FrequencyType | null;
        };
        type: CartLineItemActionType.SET_SUBSCRIPTION;
      }
) => void;

const subscriptionUpsellEnUsResource = {
  cta: "Subscribe",
  description: "Every {{ frequency }}. Change or cancel anytime.",
  frequency: {
    DAY_one: "{{ count }} day",
    DAY_other: "{{ count }} days",
    MONTH_one: "{{ count }} month",
    MONTH_other: "{{ count }} months",
    WEEK_one: "{{ count }} week",
    WEEK_other: "{{ count }} weeks",
  },
  title: "Subscribe and save {{ amount }}",
};
interface SubscriptionUpsellProps extends ComponentStyleProps {
  defaultOrderIntervalFrequency: number | null;
  frequency: FrequencyType | null;
  handleLineItemUpdate: HandleLineItemUpdate;
  meta: ProductCoreSubscriptionMetadata;
  prices: VariantPrices;
  quantity: number;
}

const SubscriptionUpsell: FC<SubscriptionUpsellProps> = ({
  _css = {},
  defaultOrderIntervalFrequency,
  frequency,
  handleLineItemUpdate,
  meta,
  prices,
  quantity,
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "SubscriptionUpsell",
    subscriptionUpsellEnUsResource
  );

  if (!prices.subscriptionPrice || !meta.hasSubscription) {
    return null;
  }

  const orderIntervalFrequency =
    defaultOrderIntervalFrequency ?? parseInt(meta.frequencies[0]);

  return (
    <button
      css={s(
        (t) => ({
          alignItems: "center",
          backgroundColor: t.color.background.feature1,
          display: "flex",
          justifyContent: "stretch",
          ...px(t.spacing.sm),
          ...py([t.spacing.xs, null, t.spacing.sm]),
          width: "100%",
        }),
        _css
      )}
      onClick={() =>
        handleLineItemUpdate({
          payload: {
            frequency,
            newFrequency: frequency
              ? null
              : {
                  chargeDelayDays: null,
                  orderIntervalFrequency:
                    defaultOrderIntervalFrequency ??
                    parseInt(meta.frequencies[0]),
                  orderIntervalUnit: meta.unit,
                },
          },
          type: CartLineItemActionType.SET_SUBSCRIPTION,
        })
      }
    >
      <div css={s((t) => ({ flexGrow: 1, marginRight: t.spacing.sm }))}>
        <p css={s(headingEchoStatic)}>
          {t("SubscriptionUpsell:title", {
            amount: formatCurrency(
              moneyFns.multiply(
                moneyFns.subtract(prices.oneOffPrice, prices.subscriptionPrice),
                quantity
              )
            ),
          })}
        </p>
        <p
          css={s(bodyTextSmallStatic, (t) => ({
            fontSize: 12,
            lineHeight: "14px",
            marginTop: t.spacing.xxs,
          }))}
        >
          {t("SubscriptionUpsell:description", {
            frequency: t(`SubscriptionUpsell:frequency.${meta.unit}`, {
              count: orderIntervalFrequency,
            }),
          })}
        </p>
      </div>
      <div css={s(toggle({ checked: !!frequency }), { flexShrink: 0 })} />
    </button>
  );
};

interface QuantityControlProps {
  disabled: boolean;
  handleLineItemUpdate: HandleLineItemUpdate;
  quantity: number;
}

const QuantityControl: FC<QuantityControlProps> = ({
  disabled,
  handleLineItemUpdate,
  quantity,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "quantityControl",
    quantityControlEnUsResource
  );

  return (
    <div
      css={s({
        borderColor: "rgba(47, 78, 37, 0.15)",
        borderStyle: "solid",
        borderWidth: 1,
        display: "inline-block",
        opacity: disabled ? 0.3 : 1,
        transition: "opacity 300ms",
      })}
    >
      <button
        css={s(incDecButtonStyle)}
        disabled={disabled}
        onClick={() =>
          handleLineItemUpdate({
            payload: { quantity: 1 },
            type: CartLineItemActionType.DECREMENT,
          })
        }
      >
        <Icon
          _css={s(incDecIconStyle)}
          path={minus}
          title={t("quantityControl:decrease.label")}
        />
      </button>
      <label
        css={s(bodyTextStatic, {
          display: "inline-block",
          textAlign: "center",
          width: 20,
        })}
      >
        <span css={s(visuallyHidden)}>{t("quantityControl:label")}</span>
        <input
          css={s({ textAlign: "center", width: "100%" })}
          name="quantity"
          readOnly
          type="text"
          value={quantity}
        />
      </label>
      <button
        css={s(incDecButtonStyle)}
        disabled={disabled}
        onClick={() =>
          handleLineItemUpdate({
            payload: { quantity: 1 },
            type: CartLineItemActionType.INCREMENT,
          })
        }
      >
        <Icon
          _css={s(incDecIconStyle)}
          path={plus}
          title={t("quantityControl:increase.label")}
        />
      </button>
    </div>
  );
};

const cartLineItemEnUsResource = {
  container: {
    label: "Refill container",
  },
  interval: {
    label: "Frequency",
  },
  price: {
    label: "Price",
  },
  remove: {
    label: "Remove item",
  },
  rrp: {
    label: "RRP",
  },
  size: {
    label: "Size",
  },
  variant: {
    label: "Bundle size",
  },
};

type CartLineItemProps = {
  defaultOrderIntervalFrequency?: number;
  wide?: boolean;
} & (ComputedCartLineItem | EnhancedCartLineItem);

const CartLineItem: FC<CartLineItemProps> = ({
  defaultOrderIntervalFrequency,
  frequency,
  imageUrl,
  linePrice,
  properties,
  quantity,
  subtitle,
  title,
  wide,
  ...rest
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();
  const { lineItemUpdate } = useCart();
  const [hasUpsell] = useState(!frequency);

  i18n.addResourceBundle("en-US", "cartLineItems", cartLineItemEnUsResource);

  let container: ProductContainer | null = null;
  let lineCompareAtPrice: Money | null = null;
  let prices: VariantWithSelectionPrices | null = null;
  let subscriptionMeta: ProductCoreSubscriptionMetadata | null = null;
  let variant: (Variant & { product: ProductCore }) | null = null;

  if ("variant" in rest) {
    // We have an enhanced line item
    variant = rest.variant;

    container = rest.container;
    lineCompareAtPrice = rest.lineCompareAtPrice;
    prices = getVariantPrices(variant, !!frequency);
    subscriptionMeta = getProductCoreSubscriptionMetadata(variant.product, {});
  }

  const disabled = !variant;

  const defaultShippingIntervalFrequency =
    variant && parseIntegerMetafield(variant.defaultShippingIntervalFrequency);

  const handleLineItemUpdate: HandleLineItemUpdate = useCallback(
    (input) => {
      if (!variant) {
        return;
      }

      let action: CartLineItemAction;

      switch (input.type) {
        case CartLineItemActionType.REMOVE:
          action = {
            payload: {
              ...getCoreCartLineItem(variant),
              frequency,
              properties,
            },
            type: input.type,
          };
          break;
        case CartLineItemActionType.SET_SUBSCRIPTION:
          action = {
            payload: {
              frequency,
              properties,
              variantId: variant.id,
              ...input.payload,
            },
            type: input.type,
          };
          break;
        default:
          action = {
            payload: {
              ...getCoreCartLineItem(variant),
              frequency,
              properties,
              ...input.payload,
            },
            type: input.type,
          };
      }

      lineItemUpdate(action);

      if (input.type === CartLineItemActionType.INCREMENT) {
        trackAddToCartEvent(
          variant.product,
          variant,
          TRACKING_SOURCE,
          quantity,
          frequency
        );
      } else if (
        input.type === CartLineItemActionType.REMOVE ||
        (input.type === CartLineItemActionType.DECREMENT && quantity === 1)
      ) {
        trackRemoveFromCartEvent(
          variant.product,
          variant,
          TRACKING_SOURCE,
          quantity,
          frequency
        );
      }
    },
    [frequency, lineItemUpdate, properties, quantity, variant]
  );

  return (
    <div css={s({ position: "relative" })} data-testid="cart-line-item">
      <div
        css={s({
          alignItems: "stretch",
          display: "flex",
          flexDirection: "row",
          justifyContent: "stretch",
        })}
      >
        <div
          css={s(thumbnailStyle, (t) => ({
            ...size(["25%", 100]),
            marginRight: [t.spacing.sm, t.spacing.md],
            maxWidth: [100, "unset"],
          }))}
        >
          {imageUrl && (
            <ResponsiveImage
              alt=""
              layout="fill"
              sizes={{ width: 100 }}
              src={imageUrl}
            />
          )}
        </div>
        <div css={s({ flexGrow: 1 })}>
          <p css={s(headingDeltaStatic, (t) => ({ ...my(t.spacing.xs) }))}>
            {title}
          </p>
          <dl css={s(bodyTextSmallStatic)}>
            {subtitle !== "Default Title" && (
              <div css={s({ display: "inline" })}>
                <dt css={s(visuallyHidden)}>
                  {t("cartLineItems:variant.label")}
                </dt>
                <dd
                  css={s((t) => ({
                    display: "inline",
                    marginRight: t.spacing.sm,
                  }))}
                >
                  {subtitle}
                </dd>
              </div>
            )}
            <AnimatePresence initial={false}>
              {frequency && (
                <motion.div
                  animate={variants.fade.visible}
                  css={s({ display: "inline" })}
                  exit={variants.fade.hidden}
                  initial={variants.fade.hidden}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <dt css={s(visuallyHidden)}>
                    {t("cartLineItems:interval.label")}
                  </dt>
                  <dd
                    css={s((t) => ({
                      display: "inline",
                      marginRight: t.spacing.xxs,
                    }))}
                  >
                    <Frequency {...frequency} />
                    <br />
                  </dd>
                </motion.div>
              )}
            </AnimatePresence>
          </dl>
          <AnimatePresence initial={false}>
            {container && (
              <motion.div
                key="container"
                animate={variants.fadeWithLayout.visible}
                css={s({
                  overflow: "hidden",
                })}
                exit={variants.fadeWithLayout.hidden}
                initial={variants.fadeWithLayout.hidden}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div
                  css={s((t) => ({
                    alignItems: "center",
                    backgroundColor: t.color.background.feature3,
                    display: "flex",
                    height: 50,
                    marginTop: t.spacing.xs,
                    maxWidth: 308,
                  }))}
                >
                  <div css={s(thumbnailStyle, size(50))}>
                    {container.image && (
                      <ResponsiveImage
                        alt=""
                        layout="fill"
                        sizes={{ width: 50 }}
                        src={container.image.url}
                      />
                    )}
                  </div>
                  <dl
                    css={s((t) => ({
                      "font-size": [12, 14], // Legacy fallback
                      fontSize: "clamp(12px, 3.33vw, 14px)",
                      ...px(["4%", t.spacing.sm]),
                      paddingTop: t.spacing.xxs, // Compensate for wonky leading
                    }))}
                  >
                    <div>
                      <dt css={s(visuallyHidden)}>
                        {t("cartLineItems:container.label")}
                      </dt>
                      <dd
                        css={s(headingEchoStatic, {
                          fontSize: "inherit",
                          lineHeight: 1.3,
                        })}
                      >
                        {container.title}
                      </dd>
                    </div>
                    <div css={s({ display: "inline-block" })}>
                      <dt css={s(visuallyHidden)}>
                        {t("cartLineItems:price.label")}
                      </dt>
                      <dd
                        css={s(bodyTextSmallStatic, (t) => ({
                          fontSize: "inherit",
                          fontWeight: t.font.primary.weight.medium,
                          lineHeight: 1.5,
                          textTransform: "uppercase",
                        }))}
                      >
                        {moneyFns.toFloat(container.price) === 0
                          ? t("common:free")
                          : formatCurrency(container.price)}
                      </dd>
                    </div>
                    {container.compareAtPrice &&
                      moneyFns.toFloat(container.compareAtPrice) > 0 && (
                        <div
                          css={s((t) => ({
                            display: "inline-block",
                            fontSize: "inherit",
                            marginLeft: t.spacing.xs,
                          }))}
                        >
                          <dt css={s(visuallyHidden)}>
                            {t("cartLineItems:rrp.label")}
                          </dt>
                          <dd
                            css={s(bodyTextSmallStatic, {
                              fontSize: "inherit",
                              opacity: 0.6,
                              textDecoration: "line-through",
                            })}
                          >
                            {formatCurrency(container.compareAtPrice)}
                          </dd>
                        </div>
                      )}
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            css={s((t) => ({
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginTop: t.spacing.sm,
            }))}
          >
            <QuantityControl
              disabled={disabled}
              quantity={quantity}
              handleLineItemUpdate={handleLineItemUpdate}
            />
            <dl css={s({ alignItems: "flex-end", display: "flex" })}>
              <AnimatePresence initial={false}>
                {lineCompareAtPrice && (
                  <motion.div
                    animate={variants.fade.visible}
                    css={s((t) => ({ marginRight: t.spacing.xs }))}
                    exit={variants.fade.hidden}
                    initial={variants.fade.hidden}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <dt css={s(visuallyHidden)}>
                      {t("cartLineItems:rrp.label")}
                    </dt>
                    <dd
                      css={s(bodyTextSmallStatic, {
                        opacity: 0.6,
                        textDecoration: "line-through",
                      })}
                    >
                      {formatCurrency(lineCompareAtPrice)}
                    </dd>
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <dt css={s(visuallyHidden)}>
                  {t("cartLineItems:price.label")}
                </dt>
                <dd css={s(bodyTextStatic)}>{formatCurrency(linePrice)}</dd>
              </div>
            </dl>
          </div>
          <button
            css={s({
              opacity: disabled ? 0 : 1,
              position: "absolute",
              right: 0,
              top: 0,
              transition: "opacity 300ms",
            })}
            disabled={disabled}
            onClick={() =>
              handleLineItemUpdate({ type: CartLineItemActionType.REMOVE })
            }
          >
            <Icon
              _css={s({ ...size(18), opacity: 0.5 })}
              path={times}
              title={t("cartLineItems:remove.label")}
            />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {subscriptionMeta?.hasSubscription && hasUpsell && prices && (
          <motion.div
            animate={variants.fadeWithLayout.visible}
            css={s((t) => ({
              ...(wide && mx([null, null, 124])),
              marginTop: t.spacing.md,
              maxWidth: wide ? 412 : null,
            }))}
            exit={variants.fadeWithLayout.hidden}
            initial={variants.fadeWithLayout.hidden}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SubscriptionUpsell
              defaultOrderIntervalFrequency={
                defaultOrderIntervalFrequency ??
                defaultShippingIntervalFrequency
              }
              frequency={frequency}
              handleLineItemUpdate={handleLineItemUpdate}
              meta={subscriptionMeta}
              prices={prices}
              quantity={quantity}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type CartLineItemsProps = {
  lineItems: (ComputedCartLineItem | EnhancedCartLineItem)[];
  wide?: boolean;
} & ComponentStyleProps;

const CartLineItems: FC<CartLineItemsProps> = ({
  _css = {},
  lineItems,
  wide,
}) => {
  // Use the first subscription item's frequency as the default for upsells
  const defaultOrderIntervalFrequency = lineItems.find(
    ({ frequency }) => frequency
  )?.frequency?.orderIntervalFrequency;

  return (
    <div css={s({ flexGrow: 1, flexShrink: 0 }, _css)}>
      <ul
        css={s((t) => ({
          marginTop: -t.spacing.md,
        }))}
      >
        <AnimatePresence initial={false}>
          {lineItems.map((lineItem, index) => {
            const first = index === 0;

            return (
              <motion.li
                key={lineItem.id}
                animate={{ height: "auto", opacity: 1 }}
                css={s({
                  borderTopColor: first
                    ? "transparent"
                    : "rgba(47, 78, 37, 0.15)",
                  borderTopStyle: "solid",
                  borderTopWidth: first ? 0 : 1,
                  transition: "border 500ms",
                })}
                exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div
                  css={s((t) => ({
                    paddingBottom: t.spacing.md,
                    paddingTop: t.spacing.md,
                  }))}
                >
                  <CartLineItem
                    defaultOrderIntervalFrequency={
                      defaultOrderIntervalFrequency
                    }
                    wide={wide}
                    {...lineItem}
                  />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default CartLineItems;
