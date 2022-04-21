import { trackViewCartEvent } from "@sss/ecommerce/analytics";
import { hasCompleteLineItemData, useCart } from "@sss/ecommerce/cart";
import { useRedirectToWebCheckout } from "@sss/ecommerce/checkout";
import { useLocale } from "@sss/i18n";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";

import { ComponentStyleProps, greedy, s } from "@/common/ui/utils";

import Icon from "../../base/icon";
import Modal, { ModalType } from "../../base/modal";
import { headingEcho } from "../../base/typography";
import drawerClose from "../../icons/drawerClose";
import { useCartController } from "./controller";
import CartEmpty from "./empty";
import CartLineItems from "./line-items";
import CartSummary from "./summary";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const enUsResource = {
  title: "Cart",
};

const AnimationWrapper: FC<ComponentStyleProps> = ({ _css = {}, ...props }) => (
  <motion.div
    animate={variants.visible}
    css={s(
      (t) => ({
        padding: t.spacing.md,
        paddingTop: 80,
      }),
      _css
    )}
    exit={variants.hidden}
    initial={variants.hidden}
    layout={true}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    {...props}
  />
);

const CartDrawer: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { open, setIsOpen } = useCartController();
  const [
    eventAlreadyTrackedForThisOpeningAction,
    setEventAlreadyTrackedForThisOpeningAction,
  ] = useState(false);
  const { i18n, t } = useLocale();
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
  const redirectToWebCheckout = useRedirectToWebCheckout();

  i18n.addResourceBundle("en-US", "cartDrawer", enUsResource);

  useEffect(() => {
    if (open === false) {
      setEventAlreadyTrackedForThisOpeningAction(false);
    }
  }, [open]);

  useEffect(() => {
    if (
      !open ||
      itemCount === 0 ||
      lineItems.length === 0 ||
      eventAlreadyTrackedForThisOpeningAction ||
      !hasCompleteLineItemData(lineItems, status)
    ) {
      return;
    }

    trackViewCartEvent(cartId, lineItemsSubtotalPrice, lineItems);

    setEventAlreadyTrackedForThisOpeningAction(true);
  }, [
    open,
    cartId,
    itemCount,
    lineItems,
    lineItemsSubtotalPrice,
    status,
    eventAlreadyTrackedForThisOpeningAction,
  ]);

  const onCheckoutClick = async () => {
    if (itemCount > 0) redirectToWebCheckout();
  };

  return (
    <Modal
      _css={s({ maxWidth: 480 }, _css)}
      alignment="right"
      labelledBy="cart-label"
      open={open}
      onClose={() => setIsOpen(false)}
      type={ModalType.DRAWER}
    >
      <header
        css={s((t) => ({
          alignItems: "center",
          backgroundColor: t.color.background.base,
          display: "flex",
          flexGrow: 0,
          flexShrink: 0,
          height: 80,
          justifyContent: "center",
          left: 0,
          padding: t.spacing.md,
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1,
        }))}
      >
        <p
          css={s(headingEcho)}
          id="cart-label"
          data-testid="cart-header-counter"
        >
          {t("cartDrawer:title")}
          {!!itemCount && ` (${itemCount})`}
        </p>
        <button
          data-testid="drawer-toggle"
          css={s((t) => ({
            left: 0,
            padding: t.spacing.md,
            position: "absolute",
            top: 0,
          }))}
          onClick={() => setIsOpen(false)}
        >
          <Icon
            _css={s({ transform: "scale(-1, 1)", width: 32 })}
            title={t("common:close")}
            path={drawerClose}
            viewBox="0 0 32 32"
          />
        </button>
      </header>
      <AnimatePresence initial={false}>
        {itemCount && lineItemsSubtotalPrice ? (
          <AnimationWrapper
            _css={s({
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
            })}
            key="items"
          >
            <CartLineItems
              _css={s((t) => ({
                borderBottomColor: "rgba(47, 78, 37, 0.15)",
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                marginBottom: t.spacing.md,
              }))}
              lineItems={lineItems}
            />
            <CartSummary
              discountCode={discountCode}
              onCheckoutClick={onCheckoutClick}
              lineItemsSavingsPrice={lineItemsSavingsPrice}
              lineItemsSubtotalPrice={lineItemsSubtotalPrice}
              shippingThreshold={shippingThreshold}
              stickyCta
            />
          </AnimationWrapper>
        ) : (
          <AnimationWrapper _css={s(greedy)} key="empty">
            <CartEmpty _css={s((t) => ({ marginTop: t.spacing.md }))} />
          </AnimationWrapper>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default CartDrawer;
