import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { primaryButton } from "../../base/button";
import { bodyTextStatic, headingBravoStatic } from "../../base/typography";

const enUsResource = {
  cta: "Shop Now",
  info: "Add some support for your bestie",
  title: "Your cart is empty",
};

export const CartEmpty: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartEmpty", enUsResource);

  return (
    <div css={s({ textAlign: "center" }, _css)}>
      <p css={s(headingBravoStatic)}>{t("cartEmpty:title")}</p>
      <p css={s(bodyTextStatic, (t) => ({ marginTop: t.spacing.sm }))}>
        {t("cartEmpty:info")}
      </p>
      <Link
        css={s(primaryButton(), (t) => ({
          marginTop: t.spacing.xl,
          maxWidth: "unset",
        }))}
        to="/products"
      >
        {t("cartEmpty:cta")}
      </Link>
    </div>
  );
};

export default CartEmpty;
