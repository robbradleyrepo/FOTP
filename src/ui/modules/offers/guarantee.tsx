import { useLocale } from "@sss/i18n";
import React, { FC } from "react";
import ResponsiveImage from "src/ui/base/responsive-image";
import { headingBravo } from "src/ui/base/typography";

import { ComponentStyleProps, gutter, py, s } from "@/common/ui/utils";

import GUARANTEE_IMG from "../../../assets/images/offers/GUARANTEE.png";

const enUsResource = {
  strap: "90 day money-back guarantee on every order",
};

const Guarantee: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "guarantee", enUsResource);

  return (
    <section
      css={s(
        gutter,
        (t) => ({
          alignItems: "center",
          backgroundColor: t.color.background.dark,
          display: ["block", null, "flex"],
          justifyContent: "center",
          ...py([t.spacing.lg, t.spacing.xl]),
          textAlign: ["center", null, "left"],
        }),
        _css
      )}
    >
      <div
        css={s((t) => ({
          marginBottom: [t.spacing.sm, null, 0],
          marginLeft: ["auto", null, 0],
          marginRight: ["auto", null, t.spacing.lg, t.spacing.xl],
          maxWidth: [80, null, 100, 120],
          width: "100%",
        }))}
      >
        <ResponsiveImage
          alt=""
          sizes={{ width: [80, null, 100, 120] }}
          src={GUARANTEE_IMG}
        />
      </div>
      <h2
        css={s(headingBravo, (t) => ({
          color: t.color.text.light.base,
          fontSize: [22, 28, 32, 36],
          lineHeight: ["28px", "32px", "36px", "48px"],
        }))}
      >
        {t("guarantee:strap")}
      </h2>
    </section>
  );
};

export default Guarantee;
