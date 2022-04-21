import { useLocale } from "@sss/i18n";
import React, { FC, useState } from "react";

import { belt, mx, percentage, s, useTheme } from "@/common/ui/utils";

import { secondaryButton } from "../../base/button";
import { Grid, GridProps, Item } from "../../base/grid";
import IngredientsCard from "./card";
import type { CoreIngredientProperties } from "./data-mapping";

const enUsResource = {
  showMore: "View all {{ count }}",
};

export interface IngredientsGridProps extends GridProps {
  groupId?: string;
  ingredients: CoreIngredientProperties[];
  initialShowCount?: number;
}

const IngredientsGrid: FC<IngredientsGridProps> = ({
  _css = {},
  align,
  direction,
  gx,
  gy,
  ingredients,
  initialShowCount = 6,
  itemWidth = [
    percentage(1),
    null,
    percentage(1 / 2),
    percentage(1 / 3),
    percentage(1 / 4),
  ],
}) => {
  const { i18n, t } = useLocale();
  const [showMore, setShowMore] = useState(false);
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "IngredientsGrid", enUsResource);

  return (
    <div css={s(belt, _css)}>
      <Grid
        _css={s(mx("auto"))}
        align={align}
        direction={direction}
        gx={gx ?? [theme.spacing.sm, null, theme.spacing.md]}
        gy={gy ?? [theme.spacing.sm, null, theme.spacing.md]}
        itemWidth={itemWidth}
      >
        {ingredients.map((ingredient, index) => (
          <Item
            key={ingredient.id}
            _css={s({
              display:
                showMore || index < initialShowCount
                  ? undefined
                  : ["none", null, "block"],
            })}
          >
            <IngredientsCard {...ingredient} />
          </Item>
        ))}
      </Grid>
      {!showMore && ingredients.length > initialShowCount && (
        <button
          css={s(secondaryButton(), (t) => ({
            display: ["block", null, "none"],
            marginTop: t.spacing.lg,
            ...mx("auto"),
          }))}
          onClick={() => setShowMore(true)}
        >
          {t("IngredientsGrid:showMore", { count: ingredients.length })}
        </button>
      )}
    </div>
  );
};

export default IngredientsGrid;
