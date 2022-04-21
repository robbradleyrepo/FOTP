import { useLocale } from "@sss/i18n";
import { hasContent, renderAsString, RichTextFragment } from "@sss/prismic";
import React, { FC, ReactNode } from "react";

import { s } from "@/common/ui/utils";

import ProductIngredientsInformation, {
  ProductIngredientsInformationProps,
} from "../../ui/modules/products/ingredients-information";
import { RichText } from "../prismic";
import type { MacronutrientFacts, Product } from ".";

const enUsResource = {
  macronutrientFacts: {
    calories: "Calories",
    caloriesFromFat: "Calories from fat",
    dietaryFiber: "Dietary fiber",
    protein: "Protein",
    servingSize: "Serving size",
    servingsPerContainer: "Servings per container",
    sugars: "Sugars",
    totalCarbohydrate: "Total carbohydrate",
    totalFat: "Total fat",
  },
};

type CmsProductIngredientsInformationProps = Omit<
  ProductIngredientsInformationProps,
  | "activeIngredients"
  | "activeIngredientsLabel"
  | "otherIngredients"
  | "macronutrientFacts"
  | "macronutrientFactsDisclaimer"
> &
  Pick<
    Product,
    | "macronutrientFacts"
    | "otherIngredients"
    | "typicalValues"
    | "typicalValuesLabel"
  >;

const CmsProductIngredientsInformation: FC<CmsProductIngredientsInformationProps> = (
  props
) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "CmsProductIngredientsInformation",
    enUsResource
  );

  const activeIngredients = props.typicalValues?.length
    ? props.typicalValues
    : undefined;

  const activeIngredientsLabel =
    activeIngredients &&
    props.typicalValuesLabel &&
    hasContent(props.typicalValuesLabel)
      ? renderAsString(props.typicalValuesLabel)
      : undefined;

  let macronutrientFacts: Record<"name" | "value", ReactNode>[] | undefined;

  ([
    { key: "calories", level: 0 },
    { key: "caloriesFromFat", level: 1 },
    { key: "totalFat", level: 0 },
    { key: "totalCarbohydrate", level: 0 },
    { key: "dietaryFiber", level: 1 },
    { key: "sugars", level: 1 },
    { key: "protein", level: 0 },
  ] as {
    key: keyof MacronutrientFacts;
    level: number;
  }[]).forEach(({ key, level }) => {
    const richText = props.macronutrientFacts?.[0][key];

    if (richText) {
      macronutrientFacts = macronutrientFacts ?? [];

      macronutrientFacts.push({
        name: (
          <span
            css={s((t) => ({
              fontWeight: level === 0 ? t.font.primary.weight.medium : null,
              paddingLeft: t.spacing.sm * level,
            }))}
          >
            {t(`CmsProductIngredientsInformation:macronutrientFacts.${key}`)}
          </span>
        ),
        value: <RichTextFragment render={richText} />,
      });
    }
  });

  const macronutrientFactsDisclaimer =
    macronutrientFacts &&
    props.macronutrientFacts?.[0].disclaimer &&
    hasContent(props.macronutrientFacts[0].disclaimer) ? (
      <RichText render={props.macronutrientFacts[0].disclaimer} />
    ) : undefined;

  const otherIngredients =
    props.otherIngredients && hasContent(props.otherIngredients) ? (
      <RichText render={props.otherIngredients} />
    ) : undefined;

  return (
    <ProductIngredientsInformation
      {...props}
      activeIngredients={activeIngredients}
      activeIngredientsLabel={activeIngredientsLabel}
      otherIngredients={otherIngredients}
      macronutrientFacts={macronutrientFacts}
      macronutrientFactsDisclaimer={macronutrientFactsDisclaimer}
    />
  );
};

export default CmsProductIngredientsInformation;
