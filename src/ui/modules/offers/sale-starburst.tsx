import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { ComponentStyleProps, greedy, s, size } from "@/common/ui/utils";

import Icon from "../../base/icon";
import { headingCharlieStatic } from "../../base/typography";
import starburst from "../../icons/starburst";

const enUsResource = {
  extra: "Extra",
  off: "Off",
  percentage: "20%",
};

const textStyle = s(headingCharlieStatic, {
  display: "block",
  lineHeight: 1,
});

const OfferSaleStarburst: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "OfferSaleStarburst", enUsResource);

  return (
    <p
      css={s(
        (t) => ({
          alignItems: "center",
          color: t.color.text.light.base,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          ...size([104, null, 134]),
          textAlign: "center",
        }),
        _css
      )}
    >
      <Icon
        _css={s(greedy, {
          color: "black",
          filter: "drop-shadow(0px 4px 8px #00000026)",
          zIndex: -1,
        })}
        path={starburst}
      />
      <span css={s(textStyle, { fontSize: [18, null, 24] })}>
        {t("OfferSaleStarburst:extra")}
      </span>
      <span css={s(textStyle, { fontSize: [28, null, 32] })}>
        {t("OfferSaleStarburst:percentage")}
      </span>
      <span
        css={s(textStyle, {
          fontSize: [22, null, 28],
          textTransform: "uppercase",
        })}
      >
        {t("OfferSaleStarburst:off")}
      </span>
    </p>
  );
};

export default OfferSaleStarburst;
