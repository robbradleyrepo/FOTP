import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { belt, s, size, useTheme } from "@/common/ui/utils";

import { Grid, GridProps, Item } from "../../../base/grid";
import Icon from "../../../base/icon";
import { bodyTextSmall } from "../../../base/typography";
import fields from "../../../icons/features/fields";
import flag from "../../../icons/features/flag";
import organic from "../../../icons/features/organic";
import serve from "../../../icons/features/serve";
import stethoscope from "../../../icons/features/stethoscope";

const enUsResource = {
  convenient: "Ready to eat",
  natural: "All natural",
  organic: "Organic",
  usa: "Made in the USA",
  vets: "Made by vets",
};

const features = [
  {
    key: "vets",
    path: stethoscope,
  },
  {
    key: "natural",
    path: fields,
  },
  {
    key: "organic",
    path: organic,
  },
  {
    key: "convenient",
    path: serve,
  },
  {
    key: "usa",
    path: flag,
  },
];

const ProductFeaturesFood: FC<GridProps> = (props) => {
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "ProductFeaturesFood", enUsResource);

  return (
    <div css={s(belt, { maxWidth: 1040 })}>
      <Grid
        align="center"
        gx={[theme.spacing.sm, theme.spacing.md, null, theme.spacing.xl]}
        gy={[theme.spacing.sm, null, theme.spacing.md]}
        itemWidth={["33.33333%", null, "20%"]}
        {...props}
      >
        {features.map(({ key, path }) => (
          <Item _css={s({ textAlign: "center" })} key={key}>
            <div
              css={s({
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              })}
            >
              <Icon _css={s(size([64, null, 70]))} path={path} />
              <p
                css={s(bodyTextSmall, (t) => ({
                  fontWeight: t.font.primary.weight.bold,
                  wordBreak: "keep-all",
                }))}
              >
                {t(`ProductFeaturesFood:${key}`)}
              </p>
            </div>
          </Item>
        ))}
      </Grid>
    </div>
  );
};

export default ProductFeaturesFood;
