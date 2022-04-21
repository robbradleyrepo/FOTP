import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import React, { FC, Fragment, useState } from "react";

import {
  belt,
  ComponentStyleProps,
  mx,
  percentage,
  px,
  py,
  s,
  size,
  useTheme,
} from "@/common/ui/utils";

import {
  getIngredientTitle,
  Ingredient,
  IngredientData,
} from "../../cms/ingredient";
import { RichText } from "../../cms/prismic";
import { secondaryButton } from "../base/button";
import { interactiveCard } from "../base/card";
import { Grid, GridProps, Item } from "../base/grid";
import Icon from "../base/icon";
import Modal, { ModalType, useModalController } from "../base/modal";
import ResponsiveImage from "../base/responsive-image";
import {
  bodyTextSmallStatic,
  bodyTextStatic,
  headingBravoStatic,
  headingCharlieStatic,
  headingDelta,
  headingDeltaStatic,
} from "../base/typography";
import chevronRight from "../icons/chevronRight";
import drawerClose from "../icons/drawerClose";
import { ThemeEnhanced } from "../styles/theme";

const enUsResource = {
  showMore: "View all {{ count }}",
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
  _css = {},
  _meta: { uid },
  advantageDescription,
  advantageTitle,
  benefits,
  description,
  effects,
  groupId,
  image,
  productName,
  specifications,
  summary,
  type,
}) => {
  const { t, i18n } = useLocale();
  i18n.addResourceBundle("en-US", "ingredientsCard", enUsResourceCard);

  let drawerId = `ingredient-${uid}`;

  if (groupId) {
    drawerId = `${groupId}-${drawerId}`;
  }

  const { open, setIsOpen } = useModalController(drawerId);

  const ingredientTitle = getIngredientTitle({ productName, type });
  const subhead = !!ingredientTitle && productName;

  return (
    <>
      <button
        css={s(
          interactiveCard,
          (t) => ({
            alignItems: "center",
            display: "flex",
            height: "100%",
            position: "relative",
            ...px([t.spacing.sm, null, t.spacing.md]),
            ...py([t.spacing.md, null, t.spacing.lg]),
            textAlign: "left",
            width: "100%",
          }),
          _css
        )}
        onClick={() => setIsOpen(true)}
      >
        {image && (
          <div
            css={s((t) => ({
              marginRight: [t.spacing.sm, null, t.spacing.md],
              ...size([64, 84]),
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
        <div>
          <h3>
            {ingredientTitle && (
              <span css={s(headingDelta, { display: "block" })}>
                {ingredientTitle}
              </span>
            )}
            {subhead && (
              <span
                css={s(bodyTextStatic, (t) => ({
                  display: "block",
                  fontWeight: t.font.primary.weight.medium,
                  marginTop: [2, null, t.spacing.xxs],
                }))}
              >
                <RichTextFragment render={subhead} />
              </span>
            )}
          </h3>
          {summary && (
            <p
              css={s(bodyTextSmallStatic, (t) => ({
                lineHeight: 1.5,
                marginTop: t.spacing.xxs,
              }))}
            >
              <RichTextFragment render={summary} />
            </p>
          )}
          <Icon
            _css={s((t) => ({
              marginTop: -6,
              position: "absolute",
              right: t.spacing.xs,
              top: "50%",
              ...size(12),
            }))}
            path={chevronRight}
          />
        </div>
      </button>
      <Modal
        _css={s({
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          flexGrow: 0,
          flexShrink: 0,
          justifyContent: "stretch",
          maxWidth: 600,
          textAlign: "left",
        })}
        alignment="right"
        labelledBy={`${drawerId}-label`}
        open={open}
        onClose={() => setIsOpen(false)}
        type={ModalType.DRAWER}
      >
        <button
          css={s((t) => ({ padding: t.spacing.md }))}
          onClick={() => setIsOpen(false)}
        >
          <Icon
            _css={s({
              transform: "scale(-1, 1)",
              width: 32,
            })}
            path={drawerClose}
            title={t("common:close")}
            viewBox="0 0 32 32"
          />
        </button>
        <div
          css={s((t) => ({
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            flexShrink: 1,
            overflow: "auto",
            ...px([t.spacing.md, null, t.spacing.lg]),
            paddingBottom: [t.spacing.md, null, t.spacing.lg],
            paddingTop: [0, null, t.spacing.sm],
          }))}
        >
          <header
            css={s((t) => ({
              display: "flex",
              marginBottom: t.spacing.lg,
            }))}
          >
            <div css={s({ width: "100%" })}>
              {ingredientTitle && (
                <h3 css={s(headingBravoStatic)} id={`${drawerId}-label`}>
                  {ingredientTitle}
                </h3>
              )}
              {subhead && (
                <p
                  css={s(headingCharlieStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  <RichTextFragment render={subhead} />
                </p>
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
            </div>
            {image && (
              <div
                css={s((t) => ({
                  marginRight: [t.spacing.sm, null, t.spacing.md],
                  ...size([64, 84]),
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
          </header>
          {specifications && (
            <dl
              css={s(bodyTextSmallStatic, (t) => ({
                borderBottomStyle: "solid",
                borderColor: "rgba(47, 78, 37, 0.15)",
                borderTopStyle: "solid",
                borderWidth: 1,
                marginBottom: t.spacing.lg,
                ...py(t.spacing.lg),
              }))}
            >
              {specifications.map(({ name, value }, index) => {
                const mt = (t: Pick<ThemeEnhanced, "spacing">) =>
                  index !== 0 ? t.spacing.xs : 0;
                return (
                  <Fragment key={index}>
                    <dt
                      css={s((t) => ({
                        float: "left",
                        fontStyle: "italic",
                        marginTop: mt(t),
                        width: 140,
                      }))}
                    >
                      {name}:
                    </dt>
                    <dd
                      css={s((t) => ({
                        marginTop: mt(t),
                      }))}
                    >
                      {value}
                    </dd>
                  </Fragment>
                );
              })}
            </dl>
          )}
          {description && (
            <>
              <h4
                css={s(headingDeltaStatic, (t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("ingredientsCard:descriptionTitle")}
              </h4>
              <div
                css={s(bodyTextStatic, (t) => ({
                  marginBottom: t.spacing.lg,
                }))}
              >
                <RichText render={description} />
              </div>
            </>
          )}
          {effects && (
            <>
              <h4
                css={s(headingDeltaStatic, (t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("ingredientsCard:effectTitle")}
              </h4>
              <div
                css={s(bodyTextStatic, (t) => ({
                  marginBottom: t.spacing.lg,
                }))}
              >
                <RichText render={effects} />
              </div>
            </>
          )}
          {benefits && (
            <>
              <h4
                css={s(headingDeltaStatic, (t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                {t("ingredientsCard:benefitTitle")}
              </h4>
              <div
                css={s(bodyTextStatic, (t) => ({
                  marginBottom: t.spacing.lg,
                }))}
              >
                <RichText render={benefits} />
              </div>
            </>
          )}
          {advantageTitle && (
            <h4
              css={s(headingDeltaStatic, (t) => ({
                marginBottom: t.spacing.sm,
              }))}
            >
              <RichTextFragment render={advantageTitle} />
            </h4>
          )}
          {advantageDescription && (
            <div
              css={s(bodyTextStatic, (t) => ({
                marginBottom: t.spacing.lg,
              }))}
            >
              <RichText render={advantageDescription} />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export interface IngredientsGridProps extends GridProps {
  groupId?: string;
  ingredients: IngredientData[];
  initialShowCount?: number;
}

export const IngredientsGrid: FC<IngredientsGridProps> = ({
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

  i18n.addResourceBundle("en-US", "ingredientsGrid", enUsResource);

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
          {t("ingredientsGrid:showMore", { count: ingredients.length })}
        </button>
      )}
    </div>
  );
};
