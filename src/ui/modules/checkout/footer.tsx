import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, link, py, s } from "@/common/ui/utils";

import { bodyTextSmallStatic } from "../../base/typography";
import { belt } from "./common";

const enUsResource = {
  privacy: "Privacy policy",
  refunds: "Refund policy",
  shipping: "Shipping policy",
  terms: "Terms of service",
};

const linkStyle = s(bodyTextSmallStatic, link, {
  "&:first-child": { marginLeft: 0 },
  fontSize: 12,
  marginLeft: 20,
});

const CheckoutFooter: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "checkoutFooter", enUsResource);

  return (
    <footer css={s(_css)}>
      <div
        css={s(belt, (t) => ({
          ...py(t.spacing.md),
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          flexWrap: ["wrap", null, null, "nowrap"],
          justifyContent: ["center", null, null, "space-between"],
          position: "relative",
          textAlign: ["center", null, null, "left"],
        }))}
      >
        <div>
          <Link css={linkStyle} to="/refund">
            {t("checkoutFooter:refunds")}
          </Link>
          <Link css={linkStyle} to="/shipping">
            {t("checkoutFooter:shipping")}
          </Link>
          <Link css={linkStyle} to="/privacy">
            {t("checkoutFooter:privacy")}
          </Link>
          <Link css={linkStyle} to="/terms-of-service">
            {t("checkoutFooter:terms")}
          </Link>
        </div>
        <p
          css={s(bodyTextSmallStatic, (t) => ({
            marginTop: [t.spacing.md, null, null, 0],
            width: ["100%", null, null, "auto"],
          }))}
        >
          {t("common:footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

export default CheckoutFooter;
