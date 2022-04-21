import { useLocale } from "@sss/i18n";
import React, { FC, ReactNode } from "react";

import { ComponentStyleProps, s, visuallyHidden } from "@/common/ui/utils";

import SimpleTable from "../../base/table";
import { bodyTextSmallStatic, headingDeltaStatic } from "../../base/typography";

const enUsResource = {
  activeIngredients: {
    columnHeader: "Ingredient",
    title: "Active ingredients",
  },
  macronutrientFacts: {
    columnHeader: "Amount per serving",
    title: "Macronutrient facts",
  },
  otherIngredients: {
    title: "Other ingredients",
  },
};

const sectionStyle = s((t) => ({
  "&:first-child": {
    marginTop: 0,
  },
  marginTop: t.spacing.lg,
}));

export type ProductIngredientsInformationProps = ComponentStyleProps &
  Partial<
    Record<
      "activeIngredientsCss" | "macronutrientFactsCss" | "otherIngredientsCss",
      ComponentStyleProps["_css"]
    >
  > & {
    otherIngredients?: ReactNode;
  } & (
    | {
        activeIngredients: Record<"name" | "value", ReactNode>[];
        activeIngredientsLabel: ReactNode;
      }
    | {
        activeIngredients?: undefined;
      }
  ) &
  (
    | {
        macronutrientFacts: Record<"name" | "value", ReactNode>[];
        macronutrientFactsDisclaimer?: ReactNode;
      }
    | {
        macronutrientFacts?: undefined;
      }
  );

const ProductIngredientsInformation: FC<ProductIngredientsInformationProps> = ({
  _css = {},
  activeIngredientsCss = {},
  macronutrientFactsCss = {},
  otherIngredientsCss = {},
  ...props
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "ProductIngredientsInformation",
    enUsResource
  );

  return (
    <div
      css={s(
        {
          position: "relative",
        },
        _css
      )}
    >
      {props.activeIngredients && (
        <div css={s(sectionStyle, activeIngredientsCss)}>
          <h3 css={s(headingDeltaStatic, { position: "absolute" })}>
            {t("ProductIngredientsInformation:activeIngredients.title")}
          </h3>
          <SimpleTable
            body={props.activeIngredients}
            header={{
              name: (
                <span css={s(visuallyHidden)}>
                  {t(
                    "ProductIngredientsInformation:activeIngredients.columnHeader"
                  )}
                </span>
              ),
              value: (
                <span
                  css={s({
                    display: "block",
                    height: 18,
                    lineHeight: 1,
                    position: "relative",
                  })}
                >
                  <span
                    css={s({
                      bottom: -1,
                      position: "absolute",
                      right: 0,
                    })}
                  >
                    {props.activeIngredientsLabel}
                  </span>
                </span>
              ),
            }}
          />
        </div>
      )}
      {props.otherIngredients && (
        <div css={s(sectionStyle, otherIngredientsCss)}>
          {props.activeIngredients && (
            <h3
              css={s(headingDeltaStatic, (t) => ({
                borderBottomStyle: "solid",
                borderColor: "currentColor",
                borderWidth: 2,
                marginBottom: t.spacing.xs,
                marginTop: t.spacing.lg,
                paddingBottom: t.spacing.xs,
              }))}
            >
              {t("ProductIngredientsInformation:otherIngredients.title")}
            </h3>
          )}
          {props.otherIngredients}
        </div>
      )}
      {props.macronutrientFacts && (
        <div css={s(sectionStyle, macronutrientFactsCss)}>
          <h3 css={s(headingDeltaStatic, { position: "absolute" })}>
            {t("ProductIngredientsInformation:macronutrientFacts.title")}
          </h3>
          <SimpleTable
            body={props.macronutrientFacts}
            header={{
              name: null,
              value: (
                <span
                  css={s({
                    display: "block",
                    height: 18,
                    lineHeight: 1,
                    position: "relative",
                  })}
                >
                  <span
                    css={s({
                      bottom: -1,
                      position: "absolute",
                      right: 0,
                    })}
                  >
                    {t(
                      "ProductIngredientsInformation:macronutrientFacts.columnHeader"
                    )}
                  </span>
                </span>
              ),
            }}
          />
          {props.macronutrientFactsDisclaimer && (
            <div
              css={s(bodyTextSmallStatic, (t) => ({
                fontStyle: "italic",
                marginTop: t.spacing.md,
              }))}
            >
              {props.macronutrientFactsDisclaimer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductIngredientsInformation;
