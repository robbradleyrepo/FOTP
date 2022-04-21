import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { belt, s, size, useTheme } from "@/common/ui/utils";

import { Grid, GridProps, Item } from "../../../base/grid";
import Icon from "../../../base/icon";
import { bodyTextSmall } from "../../../base/typography";
import circleSlash from "../../../icons/features/circle-slash";
import fields from "../../../icons/features/fields";
import flask from "../../../icons/features/flask";
import hand from "../../../icons/features/hand";
import mortarAndPestle from "../../../icons/features/mortar-and-pestle";

const enUsResource = {
  freeFrom: "No artificial flavors & colors",
  hypoallergenic: "Hypoallergenic",
  naturallyOccuring: "Rooted in nature",
  nonGMO: "Non-GMO",
  pesticideFree: "Pesticide-free",
};

const features = [
  {
    key: "naturallyOccuring",
    path: fields,
  },
  {
    key: "nonGMO",
    path: flask,
  },
  {
    key: "freeFrom",
    path: mortarAndPestle,
  },
  {
    key: "hypoallergenic",
    path: circleSlash,
  },
  {
    key: "pesticideFree",
    path: hand,
  },
];

const ProductFeaturesSupplement: FC<GridProps> = (props) => {
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "ProductFeaturesSupplement", enUsResource);

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
                {t(`ProductFeaturesSupplement:${key}`)}
              </p>
            </div>
          </Item>
        ))}
      </Grid>
    </div>
  );
};

export default ProductFeaturesSupplement;
