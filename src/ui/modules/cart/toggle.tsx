import { useCart } from "@sss/ecommerce/cart";
import { useLocale } from "@sss/i18n";
import { motion } from "framer-motion";
import React, { FC } from "react";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import Icon from "../../base/icon";
import { bodyTextSmall } from "../../base/typography";
import cart from "../../icons/cart";
import { useCartController } from "./controller";

const enUsResource = {
  title: "Cart",
};

const CartToggle: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { setIsOpen } = useCartController();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartToggle", enUsResource);

  const { itemCount } = useCart();

  return (
    <button
      css={s(
        (t) => ({
          outline: "none",
          padding: t.spacing.sm,
          position: "relative",
        }),
        _css
      )}
      onClick={() => setIsOpen(true)}
    >
      <Icon
        _css={s({ width: 22 })}
        viewBox="0 0 20 22"
        path={cart}
        title={t("cartToggle:title")}
      />
      {itemCount > 0 ? (
        <motion.div
          animate={{ opacity: 1 }}
          css={s((t) => ({
            ...size(28),
            alignItems: "center",
            backgroundColor: t.color.background.dark,
            borderRadius: t.radius.xxl,
            color: t.color.background.base,
            display: "flex",
            justifyContent: "center",
            left: -18,
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
          }))}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span
            css={s(bodyTextSmall, (t) => ({
              display: "block",
              fontFamily: t.font.secondary.family,
              fontSize: 14,
            }))}
          >
            {itemCount}
          </span>
        </motion.div>
      ) : null}
    </button>
  );
};

export default CartToggle;
