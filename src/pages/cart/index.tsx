import { trackViewCartEvent } from "@sss/ecommerce/analytics";
import {
  CartStatus,
  hasCompleteLineItemData,
  useCart,
} from "@sss/ecommerce/cart";
import { useRedirectToWebCheckout } from "@sss/ecommerce/checkout";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React, { useEffect } from "react";

import { belt, gutter, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { PageSpinner } from "../../ui/base/spinner";
import { bodyText, headingBravo } from "../../ui/base/typography";
import CartEmpty from "../../ui/modules/cart/empty";
import CartLineItems from "../../ui/modules/cart/line-items";
import CartSummary from "../../ui/modules/cart/summary";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  header: {
    count_one: "{{ count }} item",
    count_other: "{{ count }} items",
    title: "Cart",
  },
  meta: {
    title: "Cart",
  },
};

export const CartPage = () => {
  const { i18n, t } = useLocale();
  const redirectToWebCheckout = useRedirectToWebCheckout();

  i18n.addResourceBundle("en-US", "cartPage", enUsResource);

  const {
    discountCode,
    id: cartId,
    itemCount,
    lineItems,
    lineItemsSavingsPrice,
    lineItemsSubtotalPrice,
    shippingThreshold,
    status,
  } = useCart();

  useEffect(() => {
    if (
      itemCount === 0 ||
      lineItems.length === 0 ||
      cartId === null ||
      !hasCompleteLineItemData(lineItems, status)
    ) {
      return;
    }

    trackViewCartEvent(cartId, lineItemsSubtotalPrice, lineItems);
  }, [cartId, itemCount, lineItems, lineItemsSubtotalPrice, status]);

  const onCheckoutClick = () => {
    if (itemCount > 0) redirectToWebCheckout();
  };

  const metadata = {
    title: `${t("cartPage:meta.title")} | ${t("common:fotp")}`,
  };

  return (
    <Standard>
      <Metadata {...metadata} openGraph={metadata} />
      <main css={s(gutter)}>
        <div
          css={s(belt, {
            maxWidth: 846,
            minHeight: 240,
            position: "relative",
          })}
        >
          {status === CartStatus.INITIALIZING && (
            <PageSpinner label={t("common:loading")} />
          )}
          {status !== CartStatus.INITIALIZING && itemCount === 0 && (
            <CartEmpty />
          )}
          {status !== CartStatus.INITIALIZING && itemCount > 0 && (
            <>
              <header
                css={s((t) => ({
                  marginBottom: t.spacing.lg,
                  textAlign: ["center", null, "left"],
                }))}
              >
                <h1 css={s(headingBravo, { display: "inline-block" })}>
                  {t("cartPage:header.title")}
                </h1>
                <span
                  css={s(bodyText, (t) => ({
                    display: "inline-block",
                    marginLeft: t.spacing.sm,
                  }))}
                >
                  ({t("cartPage:header.count", { count: itemCount })})
                </span>
              </header>
              <CartLineItems
                _css={s((t) => ({
                  borderColor: "rgba(47, 78, 37, 0.15)",
                  borderStyle: "solid",
                  borderWidth: "1px 0",
                  marginBottom: t.spacing.md,
                  paddingTop: t.spacing.md,
                }))}
                lineItems={lineItems}
                wide
              />
              <div
                css={s({
                  marginLeft: "auto",
                  maxWidth: 412,
                })}
              >
                <CartSummary
                  continueShopping
                  discountCode={discountCode}
                  onCheckoutClick={onCheckoutClick}
                  lineItemsSavingsPrice={lineItemsSavingsPrice}
                  lineItemsSubtotalPrice={lineItemsSubtotalPrice}
                  shippingThreshold={shippingThreshold}
                  shoppingGivesWidget
                />
              </div>
            </>
          )}
        </div>
      </main>
    </Standard>
  );
};

export const getStaticProps = makeStaticPropsGetter(async () => {
  return {
    props: {},
  };
});

export default CartPage;
