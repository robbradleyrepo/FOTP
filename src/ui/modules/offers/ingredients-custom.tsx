import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import React, { FC, useState } from "react";

import {
  belt,
  ComponentStyleProps,
  mx,
  percentage,
  s,
  size,
  useTheme,
} from "@/common/ui/utils";

import {
  getIngredientTitle,
  Ingredient,
  IngredientData,
} from "../../../cms/ingredient";
import { secondaryButton } from "../../base/button";
import { Grid, GridProps, Item } from "../../base/grid";
import ResponsiveImage from "../../base/responsive-image";
import { headingDelta } from "../../base/typography";

const enUsResource = {
  ashwagandha:
    "Backed by 12 clinical studies, this herb helps reduce anxiety while improving natural immunity",

  chondroitin:
    "Helps keep your dog mobile and flexible, supporting their cartilage for more enjoyable play, higher jumps and more energetic walkies.",
  curcumin:
    "A rich antioxidant that’s proven to fight against cellular damage and reduces inflammation (29x greater absorption rate) while alleviating lameness.",
  glucosamine:
    "Backed by 15,000+ studies this powerful amino sugar helps aid the repaid or joints and cartilage",
  "green-tea-extract":
    "Sourced directly from Japan, green tea is loaded with disease fighting antioxidants and promotes healthy oral health, and may help avoid those expensive trips to the vet.",
  krill:
    "High in Omega 3, this powerful fatty acid helps support heart function, healthy skin and coat while reducing inflammation and delivering more health benefits than any other fish oil. ",
  "l-carnitine":
    "Aid recovery and supports optimal muscle growth to help your dog power through each day",
  "l-theanine":
    "Backed by 40 patents, this amino acid helps trigger the release of happy hormones’ to reduce stress and soothe anxiety.",
  msm:
    "Our MSM is the only compound of its type approved by FDA. Scientists rave about its ability to help support hair growth, prevent allergic reactions, reduce inflammation and pain.",
  postbiotic:
    "A friendly gut bacteria to help maintain your dog’s digestion. It supports healthy weight management and helps keep skin clear of irritation.",
  prebiotic:
    "Helps support natural gut health without unwanted gas or uncomfortable bloating.",
  showMore: "View all {{ count }}",
  taurine:
    "The purest non animal amino acid on the planet, Taurine helps keep the heart healthy while protecting against cellular damage",
};

const enUsResourceCard = {
  benefitTitle: "Why we chose it",
  descriptionTitle: "What is it?",
  effectTitle: "What does it do?",
};

export interface IngredientCardProps extends Ingredient, ComponentStyleProps {
  groupId?: string;
}

export const IngredientCard: FC<IngredientCardProps> = ({
  _meta,
  image,
  productName,
  summary,
  type,
}) => {
  const { t, i18n } = useLocale();
  i18n.addResourceBundle("en-US", "ingredientsCard", enUsResourceCard);
  const ingredientTitle = getIngredientTitle({ productName, type });

  const hasCustomSummary = [
    "chondroitin",
    "curcumin",
    "l-theanine",
    "krill",
    "l-carnitine",
    "ashwagandha",
    "msm",
    "postbiotic",
    "green-tea-extract",
    "glucosamine",
    "prebiotic",
    "taurine",
  ].includes(_meta.uid);

  return (
    <figure
      css={s((t) => ({
        backgroundColor: t.color.background.dark,
        borderRadius: t.radius.lg,
        color: t.color.background.base,
        display: "flex",
        flexFlow: ["column", null, "row"],
        minHeight: ["auto", 220],
        padding: t.spacing.sm,
        paddingTop: t.spacing.md,
        textAlign: "left",
      }))}
    >
      {image && (
        <div
          css={s((t) => ({
            marginBottom: t.spacing.md,
            marginRight: [t.spacing.sm, null, t.spacing.md],
            ...size([64, 84]),
            minWidth: [64, null, 84],
          }))}
        >
          <ResponsiveImage
            _css={s((t) => ({
              borderRadius: t.radius.xxl,
            }))}
            alt=""
            height={image.dimensions.height}
            src={image.url}
            width={image.dimensions.width}
            sizes={{ width: [64, 84] }}
          />
        </div>
      )}
      <figcaption>
        <h3>
          {ingredientTitle && (
            <span
              css={s(headingDelta, (t) => ({
                display: "block",
                marginBottom: t.spacing.sm,
              }))}
            >
              {ingredientTitle}
            </span>
          )}
        </h3>

        {hasCustomSummary
          ? t(`ingredientsGridCustom:${_meta.uid}`)
          : summary && <RichTextFragment render={summary} />}
      </figcaption>
    </figure>
  );
};

export interface IngredientsGridCustomProps extends GridProps {
  groupId?: string;
  ingredients: IngredientData[];
  initialShowCount?: number;
}

export const IngredientsGridCustom: FC<IngredientsGridCustomProps> = ({
  _css = {},
  align,
  direction,
  groupId,
  gx,
  gy,
  ingredients,
  initialShowCount = 6,
  itemWidth = [percentage(1), null, percentage(1 / 2), percentage(1 / 3)],
}) => {
  const { i18n, t } = useLocale();
  const [showMore, setShowMore] = useState(false);
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "ingredientsGridCustom", enUsResource);

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
        {ingredients.map(({ ingredient }, index) => (
          <Item
            key={ingredient._meta.id}
            _css={s({
              display:
                showMore || index < initialShowCount
                  ? undefined
                  : ["none", null, "block"],
            })}
          >
            <IngredientCard groupId={groupId} {...ingredient} />
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
          {t("ingredientsGridCustom:showMore", { count: ingredients.length })}
        </button>
      )}
    </div>
  );
};
