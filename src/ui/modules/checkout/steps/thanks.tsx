import { FormatAddress } from "@sss/ecommerce/address";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  link,
  percentage,
  px,
  py,
  s,
  size,
} from "@/common/ui/utils";

import { primaryButton } from "../../../base/button";
import { Grid, Item } from "../../../base/grid";
import Icon from "../../../base/icon";
import {
  bodyTextExtraSmallStatic,
  bodyTextStatic,
  headingCharlie,
  headingDelta,
  headingEchoStatic,
} from "../../../base/typography";
import circleTick from "../../../icons/circleTick";
import PaymentCard, { isKnownCardBrand } from "../../../modules/payment-card";
import { theme } from "../../../styles/theme";
import { CheckoutStepProps, section } from "../common";

const enUsResource = {
  continue: "Continue shopping",
  header: {
    details: "Order number #{{ orderNumber }}",
    thanks:
      "Thank you for your order {{ firstName }}! You’ll receive an email when your order is ready.",
    title: "Order complete",
  },
  help: {
    cta: "Contact us",
    info: "Need help?",
  },
  info: {
    billingAddress: { title: "Billing address" },
    contact: { title: "Contact" },
    paymentMethod: {
      card: "Card",
      free: "Free",
      other: "Other",
      title: "Payment method",
    },
    shippingAddress: { title: "Shipping address" },
    shippingMethod: { title: "Shipping method" },
    title: "Customer information",
  },
};

interface CheckoutStepThanksProps
  extends Omit<CheckoutStepProps, "me">,
    ComponentStyleProps {}

const CheckoutStepThanks: FC<CheckoutStepThanksProps> = ({
  _css = {},
  checkout,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "checkoutStepThanks", enUsResource);

  const {
    billingAddress,
    email,
    shippingAddress,
    shippingRate,
    transaction,
  } = checkout;

  // Sanity check / type guard
  if (!email || !shippingAddress || !shippingRate || !transaction) {
    // XXX for some reason (race condition?) this step gets rendered
    // first with a checkout object that doesn't contain a transaction,
    // and then again with a checkout object that does. At least for
    // now, when data is incomplete, simply render a blank component
    // instead of throwing, as that won't stop the subsequent (correct)
    // render.
    // throw new Error("Missing checkout data");
    return null;
  }

  const { firstName } = shippingAddress;

  const order = checkout.rOrders?.[0];

  if (!order) {
    throw new Error("Missing order data");
  }

  const { orderNumber } = order;

  return (
    <div css={s(_css)}>
      <header>
        <div css={s({ alignItems: "flex-start", display: "flex" })}>
          <Icon
            _css={s((t) => ({
              ...size([44, null, 52]),
              marginRight: t.spacing.md,
            }))}
            path={circleTick}
          />
          <div>
            <h1 css={s(headingCharlie, { marginTop: "-0.15em" })}>
              {t("checkoutStepThanks:header.title")}
            </h1>
            <p css={s(bodyTextStatic, (t) => ({ marginTop: t.spacing.xxs }))}>
              {t("checkoutStepThanks:header.details", { orderNumber })}
            </p>
          </div>
        </div>
        <p css={s(bodyTextStatic, (t) => ({ marginTop: t.spacing.lg }))}>
          {t("checkoutStepThanks:header.thanks", { firstName })}
        </p>
      </header>
      <section
        css={s(section, (t) => ({
          ...py(t.spacing.md),
          marginTop: t.spacing.lg,
        }))}
      >
        <h2 css={s(headingDelta, (t) => ({ marginBottom: t.spacing.md }))}>
          {t("checkoutStepThanks:info.title")}
        </h2>
        <dl css={s({ columnCount: [null, null, 2] })}>
          {[
            { children: email, key: "contact" },
            {
              children: <FormatAddress address={shippingAddress} />,
              key: "shippingAddress",
            },
            {
              children: shippingRate.title,
              key: "shippingMethod",
            },
            {
              children: transaction.isFree ? (
                <span css={s({ textTransform: "uppercase" })}>
                  {t("checkoutStepThanks:info.paymentMethod.free")}
                </span>
              ) : transaction.card?.brand &&
                isKnownCardBrand(transaction.card.brand) ? (
                <>
                  {t("checkoutStepThanks:info.paymentMethod.card")}
                  <PaymentCard
                    _css={s((t) => ({ marginLeft: t.spacing.xs, width: 42 }))}
                    brand={transaction.card.brand}
                  />
                </>
              ) : (
                t("checkoutStepThanks:info.paymentMethod.other")
              ),
              key: "paymentMethod",
            },
            {
              children: (
                <FormatAddress address={billingAddress ?? shippingAddress} />
              ),
              key: "billingAddress",
            },
          ].map(({ children, key }) => (
            <div
              key={key}
              css={s((t) => ({
                "&:last-child": {
                  marginBottom: 0,
                },
                breakInside: "avoid",
                marginBottom: t.spacing.md,
              }))}
            >
              <dt
                css={s(bodyTextExtraSmallStatic, {
                  opacity: 0.5,
                })}
              >
                {t(`checkoutStepThanks:info.${key}.title`)}
              </dt>
              <dd
                css={s((t) => ({
                  marginTop: t.spacing.xs,
                }))}
              >
                {children}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <Grid
        _css={s((t) => ({
          marginTop: [t.spacing.md, null, t.spacing.lg],
        }))}
        direction="rtl"
        innerCss={s({ alignItems: "center" })}
        itemWidth={[percentage(1), null, null, percentage(1 / 2)]}
        gx={theme.spacing.md}
        gy={theme.spacing.lg}
      >
        <Item>
          <Link
            css={s(primaryButton(), (t) => ({
              ...px(t.spacing.sm),
              width: "100%",
            }))}
            to="/"
          >
            {t("checkoutStepThanks:continue")}
          </Link>
        </Item>
        <Item _css={s({ textAlign: ["center", null, null, "inherit"] })}>
          {t("checkoutStepThanks:help.info")}
          <a
            css={s(headingEchoStatic, link, (t) => ({
              display: "inline-block",
              marginLeft: t.spacing.xs,
            }))}
            href={`mailto:${t("common:email")}`}
          >
            {t("checkoutStepThanks:help.cta")}
          </a>
        </Item>
      </Grid>
    </div>
  );
};

export default CheckoutStepThanks;
