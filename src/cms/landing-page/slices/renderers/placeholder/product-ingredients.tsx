import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextFragment } from "@sss/prismic";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { FC, useState } from "react";
import { Trans } from "react-i18next";

import { percentage, py, s, useTheme } from "@/common/ui/utils";

import { secondaryButton } from "../../../../../ui/base/button";
import { Grid, Item } from "../../../../../ui/base/grid";
import ResponsiveImage from "../../../../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextSmallStatic,
  headingBravo,
  headingDeltaStatic,
} from "../../../../../ui/base/typography";
import { useCmsLayout } from "../../../../layout";
import { useProductData } from "../../../";

const MotionGrid = motion.custom(Grid);
const MotionItem = motion.custom(Item);

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const enUsResource = {
  description: {
    harmony:
      "With some of the most effective and safest stress and anxiety ingredients available for dogs packed into <Link>Harmony</Link>, it’s no surprise that it’s proving so popular with each clinically proven ingredient doing exactly what it says…",
    move:
      "With some of the most effective and safest joint health ingredients available for dogs packed into <Link>Move</Link>, it’s no surprise that it’s proving so popular, with each clinically proven ingredient doing exactly what it says…",
    soothe:
      "Soothe uses only clinically proven ingredients, including some of the most powerful dog-specific probiotics in the world.",
    "the-one":
      "With some of the most effective and safest ingredients available for dogs packed into <Link>The One</Link>, it’s no surprise that it’s proving so popular with each clinically proven ingredient doing exactly what it says…",
  },
  showMore: "View all {{ count }} ingredients",
  title: "What are the ingredients?",
};

const ProductIngredients: FC = () => {
  const {
    styles: { belt, mb, paddingX },
  } = useCmsLayout();
  const { i18n, t } = useLocale();
  const { cms, ecommerce } = useProductData();
  const [showMore, setShowMore] = useState(false);
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "phProductIngredients", enUsResource);

  if (!cms?.ingredients || !ecommerce) {
    return null;
  }

  const { ingredients } = cms;

  let desktopColumnCount = 4;
  let desktopMaxWidth: number | string = "unset";
  let mobileColumnCount = 2;

  if ([1, 3].includes(ingredients.length)) {
    mobileColumnCount = 1;
  }

  // Use a 3-column layout for...
  if (
    (ingredients.length % 2 !== 0 && ingredients.length < 6) || // Odd numbers less than 6
    (ingredients.length % 3 === 0 && // Multiples of 3 that are not also multiples of 4
      ingredients.length % desktopColumnCount !== 0)
  ) {
    desktopColumnCount = 3;
    desktopMaxWidth = 640;
  }

  const initialShowCount = desktopColumnCount * 2;

  const descriptionKey = `phProductIngredients:description.${ecommerce.handle}`;
  const hasDescription = i18n.exists(descriptionKey);

  return (
    <AnimateSharedLayout>
      <motion.div
        css={s(belt, mb, paddingX, (t) => ({
          backgroundColor: t.color.background.feature3,
          ...py([t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
          textAlign: "center",
        }))}
        layout
      >
        <motion.div layout>
          <h2 css={s(headingBravo)}>{t("phProductIngredients:title")}</h2>
          {hasDescription && (
            <p css={s(bodyText, (t) => ({ marginTop: t.spacing.md }))}>
              <Trans
                components={
                  {
                    Link: (
                      <Link
                        css={s({ textDecoration: "underline" })}
                        to={`/offer/${ecommerce.handle}/expert-lead`}
                      />
                    ),
                  } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                }
                i18nKey={descriptionKey}
              />
            </p>
          )}
        </motion.div>
        <MotionGrid
          _css={s(belt, (t) => ({
            marginTop: [t.spacing.xl, null, t.spacing.xxl],
            maxWidth: [480, null, desktopMaxWidth],
          }))}
          gx={[theme.spacing.md, theme.spacing.lg, theme.spacing.xl]}
          gy={[theme.spacing.md, theme.spacing.lg, theme.spacing.xl]}
          innerCss={s({ justifyContent: "center" })}
          itemWidth={[
            percentage(1 / mobileColumnCount),
            null,
            percentage(1 / desktopColumnCount),
          ]}
          layout
        >
          <AnimatePresence initial={false}>
            {ingredients.map(
              ({ ingredient: { _meta, image, summary, type } }, index) =>
                (index < initialShowCount || showMore) && (
                  <MotionItem
                    key={_meta.uid}
                    animate={variants.visible}
                    exit={variants.visible}
                    initial={variants.hidden}
                    layout
                  >
                    {image && (
                      <div
                        css={s((t) => ({
                          "& > *": { verticalAlign: "top" },
                          backgroundColor: t.color.background.feature4,
                          borderRadius: t.radius.xxl,
                          display: "inline-block",
                          padding: t.spacing.xxs,
                        }))}
                      >
                        <ResponsiveImage
                          alt=""
                          height={96}
                          layout="fixed"
                          sizes="96px"
                          src={image.url}
                          width={96}
                        />
                      </div>
                    )}
                    {type && (
                      <h3
                        css={s(headingDeltaStatic, (t) => ({
                          marginTop: t.spacing.sm,
                        }))}
                      >
                        <RichTextFragment render={type} />
                      </h3>
                    )}
                    {summary && (
                      <p
                        css={s(bodyTextSmallStatic, (t) => ({
                          marginTop: t.spacing.xs,
                        }))}
                      >
                        <RichTextFragment render={summary} />
                      </p>
                    )}
                  </MotionItem>
                )
            )}
          </AnimatePresence>
        </MotionGrid>
        <AnimatePresence initial={false}>
          {!showMore && ingredients.length > initialShowCount && (
            <motion.div
              animate={variants.visible}
              exit={{ ...variants.hidden, height: 0 }}
              layout
            >
              <button
                css={s(secondaryButton(), (t) => ({ marginTop: t.spacing.lg }))}
                onClick={() => setShowMore(true)}
              >
                {t("phProductIngredients:showMore", {
                  count: ingredients.length,
                })}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimateSharedLayout>
  );
};

export default ProductIngredients;
