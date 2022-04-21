import { Money, moneyFns, parseFloatMetafield } from "@sss/ecommerce/common";
import { UseBumpOfferResult } from "@sss/ecommerce/offer/bump";
import {
  findProductContainer,
  findProductContainerFromFormValues,
  getVariantPrices,
  PreorderType,
  ProductContainer,
  ProductContainerOption,
  ProductContainerType,
  ProductFormValues,
  Variant,
  VariantWithSelectionPrices,
} from "@sss/ecommerce/product";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { rgba } from "polished";
import React, { FC, forwardRef, ReactNode } from "react";
import { FormRenderProps, useForm } from "react-final-form";

import { isDefined } from "@/common/filters";
import {
  ComponentStyleProps,
  greedy,
  link,
  my,
  px,
  py,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import { RichText } from "../../../cms/prismic";
import { UnifiedProductPageDataWithMetadata } from "../../../cms/product-page";
import { badge as badgeStyle } from "../../base/badge";
import Icon from "../../base/icon";
import Modal, { ModalType, useModalController } from "../../base/modal";
import ResponsiveImage from "../../base/responsive-image";
import {
  bodyText,
  bodyTextSmall,
  headingDelta,
  headingEcho,
  headingEchoStatic,
} from "../../base/typography";
import CheckboxField from "../../forms/checkbox-field";
import Field from "../../forms/field";
import RadioField from "../../forms/radio-field";
import cross from "../../icons/cross";
import { ShoppingGivesProduct } from "../shopping-gives";
import USPs from "../usps";
import ProductServingSizes from "./serving-sizes";

const infoStyle = {
  "&:before": { content: '"– "' },
  display: "inline-block",
  marginLeft: "0.2em",
};

const labelStyle = s(headingEchoStatic, {
  fontSize: [16, null, 20],
});

const labelWrapperStyle = {
  alignItems: "flex-start",
  display: "flex",
  flexGrow: 1,
  justifyContent: "space-between",
};

const legendStyle = s(headingEcho, (t) => ({
  marginBottom: [t.spacing.sm, null, t.spacing.md],
}));

const radioStyle = (selected: boolean) =>
  s((t) => ({
    borderColor: "currentColor",
    color: selected ? t.color.border.selected : "currentColor",
  }));

const radioFieldStyle = (selected: boolean) =>
  s((t) => {
    const highlightColor = t.color.background.feature1;

    return {
      "&:after": {
        boxShadow: `0 -1px ${highlightColor}`,
      },
      "&:after, &:before": {
        ...greedy,
        borderRadius: "inherit",
        content: '""',
        display: "block",
        opacity: selected ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 300ms",
        zIndex: 1,
      },
      "&:before": {
        boxShadow: `0 1px ${highlightColor}`,
      },
      "&:first-child": {
        "&:after": {
          boxShadow: "none",
        },
        borderTopLeftRadius: t.radius.sm,
        borderTopRightRadius: t.radius.sm,
        marginTop: 0,
      },
      "&:last-child": {
        "&:before": {
          boxShadow: "none",
        },
        borderBottomLeftRadius: t.radius.sm,
        borderBottomRightRadius: t.radius.sm,
      },
      backgroundColor: selected ? highlightColor : null,
      borderColor: t.color.border.light,
      borderStyle: "solid",
      borderWidth: 1,
      color: selected
        ? t.color.text.dark.base
        : rgba(t.color.text.dark.base, 0.7),
      marginTop: -1,
      padding: [t.spacing.sm, null, t.spacing.md],
      position: "relative",
      transition: "background-color 300ms, border-color 500ms, color 300ms",
    };
  });

interface BundlePickerContainerFieldProps {
  badge?: ReactNode;
  busy?: boolean;
  container: ProductContainer;
  fieldType?: "checkbox" | "radio";
  name: string;
  option: ProductContainerOption;
  selected: boolean;
  subtitle: ReactNode;
}

const BundlePickerContainerField: FC<BundlePickerContainerFieldProps> = ({
  badge,
  busy,
  container,
  fieldType,
  name,
  option,
  selected,
  subtitle,
}) => {
  const commonProps = {
    busy: busy,
    inputCss: s(radioStyle(selected), size(20)),
    key: container.productId,
    label: (
      <div
        css={s({
          alignItems: "center",
          display: "flex",
          justifyContent: "stretch",
        })}
      >
        {container.image && (
          <div
            css={s((t) => ({
              alignSelf: "center",
              flexGrow: 0,
              flexShrink: 0,
              left: -t.spacing.xs,
              ...my(-t.spacing.xs),
              position: "relative",
              width: [64, 96],
            }))}
          >
            <ResponsiveImage
              alt=""
              height={container.image.height ?? 2048}
              sizes={{ width: [64, 96] }}
              src={container.image.url}
              width={container.image.width ?? 2048}
            />
          </div>
        )}
        <div css={s({ flexGrow: 1 })}>
          <div css={s(labelWrapperStyle)}>
            <p css={s(headingEcho, { flexGrow: 1 })}>{container.title}</p>
            {badge && (
              <p
                css={s(badgeStyle, (t) => ({
                  marginLeft: t.spacing.sm,
                }))}
              >
                {badge}
              </p>
            )}
          </div>
          <div
            css={s((t) => ({
              marginTop: t.spacing.xxs,
            }))}
          >
            {subtitle}
          </div>
        </div>
      </div>
    ),
    name,
  };

  return fieldType === "checkbox" ? (
    <CheckboxField<ProductContainerOption | null, boolean>
      {...commonProps}
      _css={s(radioFieldStyle(selected), {
        alignItems: "center",
      })}
      transform={{
        format: (value) => value === ProductContainerOption.UPGRADE,
        parse: (value) => (value ? ProductContainerOption.UPGRADE : null),
      }}
    />
  ) : (
    <RadioField
      {...commonProps}
      _css={s(radioFieldStyle(selected))}
      align="center"
      value={option}
    />
  );
};

export interface BundlePickerUISumbitRenderProps {
  children: ReactNode;
  disabled: boolean;
}

export type BundlePickerUIProps = ComponentStyleProps &
  Pick<
    FormRenderProps<ProductFormValues>,
    "handleSubmit" | "submitSucceeded" | "submitting" | "values"
  > & {
    bumpOfferResult?: UseBumpOfferResult;
    busyAfterSubmit?: boolean;
    data: UnifiedProductPageDataWithMetadata;
    header?: ReactNode;
    skus: string[];
    submit: (props: BundlePickerUISumbitRenderProps) => ReactNode;
    variant: Variant;
    widgetId?: string;
  };

const BundlePickerUI = forwardRef<HTMLFormElement, BundlePickerUIProps>(
  function BundlePickerUI(
    {
      _css = {},
      bumpOfferResult,
      busyAfterSubmit = false,
      data,
      handleSubmit,
      header,
      skus,
      submit,
      submitSucceeded,
      submitting,
      values,
      variant: selectedVariant,
      widgetId,
    },
    ref
  ) {
    const formatCurrency = useCurrencyFormatter();
    const form = useForm();
    const { i18n, t } = useLocale();
    const { query } = useRouter();

    const feedingGuideId = "bundle-picker-feeding-guide";
    const feedingGuideModal = useModalController(feedingGuideId);

    i18n.addResourceBundle("en-US", "BundlePickerUI", {
      cta: {
        outOfStock: "Out of stock",
        preorder: "Pre-order now",
        regular: "Add to cart",
      },
      feedingGuide: {
        title: "Feeding Guide",
      },
      options: {
        bumpOffer: {
          label: "Tasty extras",
          price: "Your price:",
          title: "Add Some {{ productTitle }}",
        },
        container: {
          free: "Free",
          label: "Refill container",
          none: {
            label: "None selected",
          },
          otp: {
            upgrade: {
              badge: "Upgrade offer",
              info: "Free to subscribers",
            },
          },
          price: "Your price:",
          sub: {
            base: {
              badge: "Save {{ price }}",
              info: "When you subscribe",
            },
          },
        },
        frequency: {
          label: "Frequency",
          oneTime: {
            info: "Purchase this time only",
            label: "One Time",
          },
          price: "Your price:",
          rrp: "RRP:",
          subscription: {
            badge: "Save 10% extra",
            frequency: {
              label: "Delivery frequency",
              value: {
                DAY_one: "{{ count }} day",
                DAY_other: "{{ count }} days",
                MONTH_one: "{{ count }} month",
                MONTH_other: "{{ count }} months",
                WEEK_one: "{{ count }} week",
                WEEK_other: "{{ count }} weeks",
              },
            },
            info: "Change or cancel anytime",
            label: "Subscribe & save",
          },
        },
        quantity: {
          badge: "Save {{ percentage }}%",
          label: "Quantity",
        },
      },
      shipping: "FREE shipping",
      total: "Subtotal",
    });

    const {
      cms,
      ecommerce: { containers },
    } = data;

    const variants = skus
      .map(
        (sku) =>
          data.ecommerce.variants.edges.find(({ node }) => node.sku === sku)
            ?.node
      )
      .filter(isDefined);

    // We'll redirect after successfully adding to cart, so we'll want
    // the form to remain disabled while we redirect
    const busy = (busyAfterSubmit && submitSucceeded) || submitting;
    const isBumpOfferEnabled = query.bump_offers !== "false";
    const isBumpOfferSelected = !!values.bumpOffer;
    const isSubscriptionSelected = values.subscription === "True";

    const unitPrices = getVariantPrices(
      selectedVariant,
      isSubscriptionSelected
    );

    const [currentPrice, oneOffPrice, regularPrice, subscriptionPrice] = [
      unitPrices.currentPrice,
      unitPrices.oneOffPrice,
      unitPrices.regularPrice,
      unitPrices.subscriptionPrice,
    ].map((price) => price && moneyFns.multiply(price, values.quantity)) as [
      Money,
      Money,
      Money,
      Money | null
    ];

    let bumpOfferPrices: VariantWithSelectionPrices | null = null;

    if (bumpOfferResult && "variant" in bumpOfferResult) {
      bumpOfferPrices = getVariantPrices(
        bumpOfferResult.variant,
        isSubscriptionSelected
      );
    }

    const selectedContainer = findProductContainerFromFormValues(
      containers,
      values
    );

    const hasBundle = !!data.ecommerce.options.find(
      ({ name }) => name === "Bundle size"
    );

    // We can only handle multiple variants that are part of a bundle
    if (!hasBundle && variants.length > 1) {
      throw new Error(
        `Invalid product configuration for product "${data.ecommerce.handle}": product contains multiple variants that aren't part of a bundle`
      );
    }

    const bundleUnit = data.ecommerce.bundleUnit?.value ?? null;
    const bundleUnitPlural = data.ecommerce.bundleUnitPlural?.value ?? null;
    const productUnit = data.ecommerce.unit?.value;
    const variantUnits = parseFloatMetafield(selectedVariant.units);

    const quantityValue = hasBundle
      ? selectedVariant.title
      : productUnit && variantUnits
      ? `${values.quantity * variantUnits} ${productUnit}`
      : `${values.quantity} × ${selectedVariant.title}`;

    return (
      <>
        <form
          css={s({ textAlign: "left" }, _css)}
          ref={ref}
          onSubmit={handleSubmit}
        >
          {header}
          {hasBundle && variants.length > 1 && (
            <fieldset>
              <div
                css={s(legendStyle, {
                  alignItems: "baseline",
                  display: "flex",
                  justifyContent: "space-between",
                })}
              >
                <legend>
                  {t("BundlePickerUI:options.quantity.label")}
                  <span aria-hidden css={s(bodyTextSmall)}>
                    : {quantityValue}
                  </span>
                </legend>
                {cms.product?.use && (
                  <button
                    css={s(legendStyle, link)}
                    onClick={() => feedingGuideModal.setIsOpen(true)}
                    type="button"
                  >
                    {t("BundlePickerUI:feedingGuide.title")}
                  </button>
                )}
              </div>
              <div>
                {variants.map((variant) => {
                  const { oneOffDiscount } = getVariantPrices(
                    variant,
                    isSubscriptionSelected
                  );

                  const isSelected = variant.sku === selectedVariant.sku;

                  let subtitleFragment =
                    data.ecommerce.unit?.value && variant.units?.value ? (
                      <>
                        {variant.units.value} {data.ecommerce.unit.value}
                      </>
                    ) : null;

                  if (variant.listingUsp?.value) {
                    subtitleFragment = subtitleFragment ? (
                      <>
                        {subtitleFragment}
                        <span
                          css={s(infoStyle, (t) => ({
                            fontStyle: "italic",
                            fontWeight: t.font.primary.weight.medium,
                          }))}
                        >
                          {variant.listingUsp.value}
                        </span>
                      </>
                    ) : (
                      <>{variant.listingUsp.value}</>
                    );
                  }

                  return (
                    <RadioField
                      key={variant.id}
                      _css={s(radioFieldStyle(isSelected))}
                      align="center"
                      busy={busy}
                      inputCss={s(radioStyle(isSelected))}
                      label={
                        <>
                          <div css={s(labelWrapperStyle)}>
                            <p css={s(labelStyle, { flexGrow: 1 })}>
                              {variant.title}
                            </p>
                            {!!oneOffDiscount?.percentage && (
                              <p
                                css={s(badgeStyle, (t) => ({
                                  marginLeft: t.spacing.xs,
                                }))}
                              >
                                {t("BundlePickerUI:options.quantity.badge", {
                                  percentage: oneOffDiscount.percentage.toFixed(
                                    0
                                  ),
                                })}
                              </p>
                            )}
                          </div>
                          {subtitleFragment && (
                            <p
                              css={s(bodyTextSmall, (t) => ({
                                marginTop: [t.spacing.xxs, null, t.spacing.xs],
                              }))}
                            >
                              {subtitleFragment}
                            </p>
                          )}
                        </>
                      }
                      name="sku"
                      value={variant.sku}
                    />
                  );
                })}
              </div>
            </fieldset>
          )}
          {!hasBundle && (
            <div css={s({ position: "relative" })}>
              <Field<number, string>
                busy={busy}
                disabled={!isSubscriptionSelected}
                inputCss={s({ minWidth: 250, width: "auto" })}
                label={
                  <>
                    {t("BundlePickerUI:options.quantity.label")}
                    <span aria-hidden css={s(bodyTextSmall)}>
                      : {quantityValue}
                    </span>
                  </>
                }
                labelCss={s(legendStyle)}
                name="quantity"
                transform={{
                  format: (value) => value.toString(),
                  parse: (value) => parseInt(value),
                }}
                type="select"
              >
                {[1, 2, 3, 4].map((value) => (
                  <option key={value} value={value}>
                    {value} × {selectedVariant.units?.value} {productUnit}{" "}
                    {value !== 1 ? bundleUnitPlural : bundleUnit}
                  </option>
                ))}
              </Field>
              {cms.product?.use && (
                <button
                  css={s(legendStyle, link, {
                    position: "absolute",
                    right: 0,
                    top: 0,
                  })}
                  onClick={() => feedingGuideModal.setIsOpen(true)}
                  type="button"
                >
                  {t("BundlePickerUI:feedingGuide.title")}
                </button>
              )}
            </div>
          )}
          {data.meta.subscription.hasSubscription && subscriptionPrice && (
            <fieldset
              css={s((t) => ({
                marginTop: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              <legend css={s(legendStyle)}>
                {t("BundlePickerUI:options.frequency.label")}
                <span aria-hidden css={s(bodyTextSmall)}>
                  :{" "}
                  {isSubscriptionSelected
                    ? t(
                        `BundlePickerUI:options.frequency.subscription.frequency.value.${data.meta.subscription.unit}`,
                        { count: Number(values.frequency) }
                      )
                    : t("BundlePickerUI:options.frequency.oneTime.label")}
                </span>
              </legend>
              <div>
                <div
                  css={s(radioFieldStyle(isSubscriptionSelected), {
                    position: "relative",
                  })}
                  onClick={() => form.change("subscription", "True")}
                >
                  <RadioField
                    busy={busy}
                    inputCss={s(radioStyle(isSubscriptionSelected))}
                    label={
                      <>
                        <div
                          css={s(labelWrapperStyle, (t) => ({
                            marginBottom: t.spacing.xs,
                          }))}
                        >
                          <p css={s(labelStyle, { flexGrow: 1 })}>
                            {t(
                              "BundlePickerUI:options.frequency.subscription.label"
                            )}
                          </p>
                          <p
                            css={s(badgeStyle, (t) => ({
                              marginLeft: t.spacing.xs,
                            }))}
                          >
                            {t(
                              "BundlePickerUI:options.frequency.subscription.badge"
                            )}
                          </p>
                        </div>
                        <div css={s(labelStyle)}>
                          <p
                            css={s({
                              display: "inline-block",
                            })}
                          >
                            <span css={s(visuallyHidden)}>
                              {t("BundlePickerUI:options.frequency.price")}{" "}
                            </span>
                            {formatCurrency(subscriptionPrice)}
                          </p>
                          <p css={s(bodyTextSmall, infoStyle)}>
                            {t(
                              "BundlePickerUI:options.frequency.subscription.info"
                            )}
                          </p>
                        </div>
                      </>
                    }
                    labelCss={s({ position: "relative" })}
                    name="subscription"
                    value="True"
                  />
                  <Field
                    _css={s((t) => ({
                      height: isSubscriptionSelected ? 54 : 0, // Match `input` height
                      marginTop: isSubscriptionSelected ? t.spacing.sm : 0,
                      opacity: isSubscriptionSelected ? 1 : 0,
                      paddingLeft: 36, // Match `RadioField` padding
                      transform: `perspective(1920px) rotateX(${
                        isSubscriptionSelected ? 0 : 60
                      }deg)`,
                      transition: `height 500ms, margin 500ms, opacity 500ms, transform 400ms linear${
                        isSubscriptionSelected ? "" : " 100ms"
                      }, visibility 0ms${
                        isSubscriptionSelected ? "" : " 500ms"
                      }`,
                      visibility: isSubscriptionSelected ? "visible" : "hidden",
                    }))}
                    busy={busy}
                    disabled={!isSubscriptionSelected}
                    inputCss={s({ minWidth: 190, width: "auto" })}
                    label={t(
                      "BundlePickerUI:options.frequency.subscription.frequency.label"
                    )}
                    labelCss={s(visuallyHidden)}
                    name="frequency"
                    type="select"
                  >
                    {data.meta.subscription.frequencies.map(
                      (value) =>
                        data.meta.subscription.hasSubscription && (
                          <option key={value} value={value}>
                            {t(
                              `BundlePickerUI:options.frequency.subscription.frequency.value.${data.meta.subscription.unit}`,
                              { count: Number(value) }
                            )}
                          </option>
                        )
                    )}
                  </Field>
                </div>
                <RadioField
                  _css={s(radioFieldStyle(!isSubscriptionSelected))}
                  align="center"
                  busy={busy}
                  inputCss={s(radioStyle(!isSubscriptionSelected))}
                  label={
                    <>
                      <p
                        css={s(labelStyle, (t) => ({
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        {t("BundlePickerUI:options.frequency.oneTime.label")}
                      </p>
                      <div css={s(labelStyle)}>
                        <p
                          css={s({
                            display: "inline-block",
                          })}
                        >
                          <span css={s(visuallyHidden)}>
                            {t("BundlePickerUI:options.frequency.price")}{" "}
                          </span>
                          {formatCurrency(oneOffPrice)}
                        </p>
                        <p css={s(bodyTextSmall, infoStyle)}>
                          {t("BundlePickerUI:options.frequency.oneTime.info")}
                        </p>
                      </div>
                    </>
                  }
                  name="subscription"
                  value="False"
                />
              </div>
            </fieldset>
          )}
          {containers && (
            <fieldset
              css={s((t) => ({
                marginTop: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              <legend css={s(legendStyle)}>
                {t("BundlePickerUI:options.container.label")}
                <span aria-hidden css={s(bodyTextSmall)}>
                  :{" "}
                  {selectedContainer
                    ? selectedContainer.title
                    : t("BundlePickerUI:options.container.none.label")}
                </span>
              </legend>
              {Object.values<ProductContainerType>(ProductContainerType).map(
                (type) => {
                  if (
                    isSubscriptionSelected !==
                    (type === ProductContainerType.SUB)
                  ) {
                    return null;
                  }

                  const fieldType = containers[type][
                    ProductContainerOption.BASE
                  ]
                    ? "radio"
                    : "checkbox";

                  return (
                    <div key={type}>
                      {Object.values(ProductContainerOption).map((option) => {
                        const container = findProductContainer(
                          containers,
                          type,
                          option
                        );

                        if (!container) {
                          return null;
                        }

                        const baseTranslationKey = `BundlePickerUI:options.container.${type}.${option}`;

                        const name = `containerOption${
                          type === ProductContainerType.SUB ? "Sub" : "Otp"
                        }`;

                        const selected = container === selectedContainer;

                        return (
                          <BundlePickerContainerField
                            key={option}
                            badge={t(`${baseTranslationKey}.badge`, {
                              defaultValue: "",
                              price:
                                container.compareAtPrice &&
                                formatCurrency(container.compareAtPrice),
                            })}
                            busy={busy}
                            container={container}
                            fieldType={fieldType}
                            name={name}
                            option={option}
                            selected={selected}
                            subtitle={
                              <>
                                <p
                                  css={s(headingEcho, {
                                    display: "inline-block",
                                    textTransform: "uppercase",
                                  })}
                                >
                                  {moneyFns.toFloat(container.price) > 0
                                    ? formatCurrency(container.price)
                                    : t(
                                        "BundlePickerUI:options.container.free"
                                      )}
                                </p>
                                {i18n.exists(`${baseTranslationKey}.info`) && (
                                  <p css={s(bodyTextSmall, infoStyle)}>
                                    {t(`${baseTranslationKey}.info`)}
                                  </p>
                                )}
                              </>
                            }
                          />
                        );
                      })}
                    </div>
                  );
                }
              )}
            </fieldset>
          )}
          <AnimatePresence>
            {isBumpOfferEnabled &&
              bumpOfferResult &&
              "variant" in bumpOfferResult &&
              bumpOfferPrices && (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <fieldset
                    css={s((t) => ({
                      marginTop: [t.spacing.lg, null, t.spacing.xl],
                    }))}
                  >
                    <legend css={s(legendStyle)}>
                      {t("BundlePickerUI:options.bumpOffer.label")}
                    </legend>
                    <div>
                      <CheckboxField
                        _css={s(radioFieldStyle(isBumpOfferSelected), {
                          alignItems: "center",
                        })}
                        busy={busy}
                        inputCss={s(radioStyle(isBumpOfferSelected), size(20))}
                        label={
                          <div
                            css={s({
                              alignItems: "center",
                              display: "flex",
                              justifyContent: "stretch",
                            })}
                          >
                            <div
                              css={s((t) => ({
                                alignSelf: "center",
                                flexGrow: 0,
                                flexShrink: 0,
                                left: -t.spacing.xs,
                                ...my(-t.spacing.xs),
                                position: "relative",
                                width: [64, 96],
                              }))}
                            >
                              <ResponsiveImage
                                alt=""
                                height={
                                  bumpOfferResult.variant.image.height ?? 2048
                                }
                                sizes={{ width: [64, 96] }}
                                src={bumpOfferResult.variant.image.url}
                                width={
                                  bumpOfferResult.variant.image.width ?? 2048
                                }
                              />
                            </div>
                            <div css={s({ flexGrow: 1 })}>
                              <div css={s(labelWrapperStyle)}>
                                <p css={s(headingEcho, { flexGrow: 1 })}>
                                  {t("BundlePickerUI:options.bumpOffer.title", {
                                    productTitle: bumpOfferResult.product.title,
                                  })}
                                </p>
                                {!!bumpOfferPrices.oneOffDiscount
                                  ?.percentage && (
                                  <p
                                    css={s(badgeStyle, (t) => ({
                                      marginLeft: t.spacing.xs,
                                    }))}
                                  >
                                    {t(
                                      "BundlePickerUI:options.quantity.badge",
                                      {
                                        percentage: bumpOfferPrices.oneOffDiscount.percentage.toFixed(
                                          0
                                        ),
                                      }
                                    )}
                                  </p>
                                )}
                              </div>
                              <div
                                css={s((t) => ({ marginTop: t.spacing.xxs }))}
                              >
                                <p
                                  css={s(headingEcho, {
                                    display: "inline-block",
                                  })}
                                >
                                  <span css={s(visuallyHidden)}>
                                    {t(
                                      "BundlePickerUI:options.bumpOffer.price"
                                    )}{" "}
                                  </span>
                                  {formatCurrency(bumpOfferPrices.currentPrice)}
                                </p>
                                {bumpOfferResult.variant.title !==
                                  "Default Title" && (
                                  <p css={s(bodyTextSmall, infoStyle)}>
                                    {bumpOfferResult.variant.title}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        }
                        name="bumpOffer"
                      />
                    </div>
                  </fieldset>
                </motion.div>
              )}
          </AnimatePresence>

          {cms.product?.announcementEnabled && cms.product.announcement && (
            <div
              css={s((t) => ({
                backgroundColor: t.color.background.feature2,
                marginTop: t.spacing.lg,
                ...py([t.spacing.sm, t.spacing.md, t.spacing.lg]),
                ...px(t.spacing.md),
                textAlign: "center",
              }))}
            >
              <span
                css={s(bodyText, (t) => ({
                  fontWeight: t.font.primary.weight.medium,
                }))}
              >
                <RichTextFragment render={cms.product.announcement} />
              </span>
            </div>
          )}

          {[PreorderType.NONE, PreorderType.SHOPIFY].includes(
            data.meta.subscription.preorder.type
          ) && (
            <ShoppingGivesProduct
              targetId={widgetId}
              variant={selectedVariant}
              price={currentPrice}
            />
          )}

          {(!data.meta.subscription.hasSubscription ||
            data.meta.subscription.isSubscriptionOnly) && (
            <div
              css={s((t) => ({
                borderTopColor: t.color.border.light,
                borderTopStyle: "solid",
                borderTopWidth: 1,
                display: "flex",
                justifyContent: "space-between",
                marginTop: t.spacing.lg,
                paddingTop: t.spacing.md,
              }))}
            >
              <span css={s(legendStyle, { marginBottom: 0 })}>
                {t("BundlePickerUI:total")}
              </span>
              <div
                css={s({
                  flexGrow: 1,
                  textAlign: "right",
                })}
              >
                {currentPrice.amount !== regularPrice.amount && (
                  <span
                    css={s(bodyText, (t) => ({
                      marginRight: t.spacing.xs,
                      opacity: 0.7,
                      textDecoration: "line-through",
                    }))}
                  >
                    {formatCurrency(regularPrice)}
                  </span>
                )}
                <span
                  css={s(bodyText, (t) => ({
                    fontSize: 20,
                    fontWeight: t.font.primary.weight.medium,
                  }))}
                >
                  {formatCurrency(currentPrice)}
                </span>
              </div>
            </div>
          )}

          {submit({
            children: (
              <>
                {t(
                  `BundlePickerUI:cta.${
                    !selectedVariant.availableForSale
                      ? "outOfStock"
                      : data.meta.subscription.preorder.type !==
                        PreorderType.NONE
                      ? "preorder"
                      : "regular"
                  }`
                )}
              </>
            ),
            disabled: busy || !selectedVariant.availableForSale,
          })}
          <USPs shipping={t("BundlePickerUI:shipping")} usa vet />
        </form>
        {cms.product?.use && (
          <Modal
            _css={s(bodyTextSmall, (t) => ({
              height: "auto",
              padding: [t.spacing.md, null, t.spacing.lg],
              width: 420,
            }))}
            label={feedingGuideId}
            onClose={() => feedingGuideModal.setIsOpen(false)}
            open={feedingGuideModal.open}
            type={ModalType.POPUP}
          >
            <h2
              css={s(headingDelta, (t) => ({
                marginBottom: [t.spacing.md, null, t.spacing.lg],
                textAlign: "center",
              }))}
            >
              {t("BundlePickerUI:feedingGuide.title")}
            </h2>
            <RichText render={cms.product.use} />
            {!!cms.product.servingSizes?.length && (
              <ProductServingSizes
                _css={s((t) => ({
                  marginBottom: t.spacing.xs,
                  marginTop: t.spacing.md,
                }))}
                servingSizes={cms.product.servingSizes}
              />
            )}
            <button
              css={s((t) => ({
                borderColor: t.color.border.light,
                borderRadius: t.radius.xxl,
                borderStyle: "solid",
                borderWidth: 2,
                lineHeight: 0,
                padding: t.spacing.xs,
                position: "absolute",
                right: t.spacing.sm,
                top: t.spacing.sm,
              }))}
              onClick={() => feedingGuideModal.setIsOpen(false)}
            >
              <Icon _css={s(size(12))} title={t("common:close")} path={cross} />
            </button>
          </Modal>
        )}
      </>
    );
  }
);

export default BundlePickerUI;
