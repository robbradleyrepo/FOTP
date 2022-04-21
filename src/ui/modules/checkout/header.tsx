import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, gutterX, px, s, size } from "@/common/ui/utils";

import Icon from "../../base/icon";
import Logo from "../../base/logo";
import lock from "../../icons/lock";
import Contact from "../../nav/contact";
import { belt, height } from "./common";

const enUsResource = {
  secure: "Secure checkout",
};

const CheckoutHeader: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "checkoutHeader", enUsResource);

  return (
    <header
      css={s(
        gutterX,
        (t) =>
          px([t.spacing.sm, t.spacing.md, t.spacing.lg, null, t.spacing.xl]),
        _css
      )}
    >
      <div
        css={s(belt, {
          alignItems: "center",
          display: "flex",
          height: height.header,
          justifyContent: "center",
          position: "relative",
        })}
      >
        <Link to="/">
          <Logo
            _css={s({
              height: [48, null, 60],
              width: "auto",
            })}
            fill="currentColor"
          />
        </Link>
        <Icon
          _css={s({
            ...size(20),
            left: 0,
            position: "absolute",
          })}
          path={lock}
          title={t("checkoutHeader:secure")}
        />
        <Contact
          _css={s({
            position: "absolute",
            right: 0,
            textAlign: "right",
          })}
        />
      </div>
    </header>
  );
};

export default CheckoutHeader;
