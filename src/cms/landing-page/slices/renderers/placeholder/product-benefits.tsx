import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";

import { mx, percentage, s, size, visuallyHidden } from "@/common/ui/utils";

import { Grid, Item } from "../../../../../ui/base/grid";
import Icon from "../../../../../ui/base/icon";
import { bodyTextSmall, headingDelta } from "../../../../../ui/base/typography";
import benefitIcons from "../../../../../ui/icons/benefits";
import { useCmsLayout } from "../../../../layout";
import { useProductData } from "../../../";

const enUsResource = {
  title: "{{ count }} benefits in 1 world class supplement",
};

const ProductBenefits: FC = () => {
  const {
    styles: { belt, mb, paddingX },
  } = useCmsLayout();
  const { cms } = useProductData();

  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "phProductBenefits", enUsResource);

  if (!cms?.benefits) {
    return null;
  }

  return (
    <div css={s(belt, mb, paddingX)}>
      <h2 css={s(visuallyHidden)}>
        {t("phProductBenefits:title", { count: cms.benefits.length })}
      </h2>
      <Grid
        _css={s({ textAlign: "center" })}
        gx={(t) => t.spacing.sm}
        gy={(t) => [t.spacing.lg, null, t.spacing.xl]}
        itemWidth={[percentage(1 / 2), null, percentage(1 / 4)]}
      >
        {cms.benefits?.map(({ benefit: { icon, name, value } }, index) => (
          <Item key={index}>
            <div css={s(belt, { maxWidth: 200 })}>
              {icon && (
                <Icon
                  _css={s((t) => ({
                    marginBottom: t.spacing.sm,
                    ...size([80, null, 90, null, 100]),
                  }))}
                  path={benefitIcons[icon]}
                />
              )}
              {name && (
                <h3
                  css={s(headingDelta, (t) => ({
                    marginBottom: t.spacing.sm,
                    ...mx(-t.spacing.xs),
                  }))}
                >
                  <RichTextFragment render={name} />
                </h3>
              )}
              {value && (
                <p css={s(bodyTextSmall)}>
                  <RichTextFragment render={value} />
                </p>
              )}
            </div>
          </Item>
        ))}
      </Grid>
    </div>
  );
};

export default ProductBenefits;
