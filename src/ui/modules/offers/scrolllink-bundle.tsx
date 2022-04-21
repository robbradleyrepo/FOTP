import { useLocale } from "@sss/i18n";
import React, { FC } from "react";
import { Link as ScrollLink } from "react-scroll";
import { contrastButton } from "src/ui/base/button";
import { bodyTextSmall } from "src/ui/base/typography";
import { StyleProps } from "src/ui/styles/helpers";

import { mx, s } from "@/common/ui/utils";

const enUsResource = {
  cta: "Order now",
  cta_caption: "100% satisfaction, 90-day risk free guarantee",
};

const ScrollLinkCustom: FC<StyleProps> = () => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "ScrollLinkCustom", enUsResource);

  return (
    <nav
      css={s({
        display: "block",
        maxWidth: ["none", null, 400, 320],
        ...mx("auto"),
        textAlign: "center",
      })}
    >
      <ScrollLink
        css={s(contrastButton(), (t) => ({
          display: "inline-block",
          marginTop: t.spacing.lg,
          maxWidth: ["none", null, 400, 320],
          ...mx("auto"),
          fontSize: 18,
          width: "100%",
        }))}
        duration={500}
        href="#bundles"
        offset={-60}
        smooth={true}
        to="bundles"
      >
        {t("ScrollLinkCustom:cta")}
      </ScrollLink>
      <p
        css={s(bodyTextSmall, (t) => ({
          marginBottom: t.spacing.md,
          marginTop: t.spacing.sm,
        }))}
      >
        <i>{t("ScrollLinkCustom:cta_caption")}</i>
      </p>
    </nav>
  );
};
export default ScrollLinkCustom;
