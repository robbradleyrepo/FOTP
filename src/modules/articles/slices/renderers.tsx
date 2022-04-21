import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextSlice } from "@sss/prismic";
import React, { FC } from "react";
import { primaryButton } from "src/ui/base/button";
import ResponsiveImage from "src/ui/base/responsive-image";

import { s, visuallyHidden } from "@/common/ui/utils";

import { useCmsLayout } from "../../../cms/layout";
import { OpinionatedRichText } from "../../../cms/prismic";
import {
  bodyText,
  bodyTextSmall,
  bodyTextSmallStatic,
  bodyTextStatic,
  headingCharlie,
} from "../../../ui/base/typography";
import { ArticlePageProductSlice, useArticlePageSliceZoneContext } from "./";

export const ProductRenderer: FC<ArticlePageProductSlice> = (props) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();
  const { products } = useArticlePageSliceZoneContext();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ProductRenderer", {
    cta: "Shop now",
    price: "Price",
    rrp: "RRP",
  });

  const handle = props.primary?.product?._meta.uid;

  if (!handle) return null;

  const product = products[handle];

  if (!product) return null;

  return (
    <aside
      css={s(gutterX, mb, {
        display: "block",
      })}
    >
      <Link
        css={s(belt, (t) => ({
          borderColor: t.color.border.light,
          borderRadius: t.radius.sm,
          borderStyle: "solid",
          borderWidth: 1,
          boxShadow: "0px 4px 6px rgba(6, 47, 34, 0.05)",
          display: "flex",
          flexWrap: ["wrap", null, "nowrap"],
          maxWidth: [400, null, 600],
          overflow: "hidden",
        }))}
        to={`/products/${product.handle}`}
      >
        <div css={s({ flexShrink: 0, width: ["100%", null, 248] })}>
          <ResponsiveImage
            alt=""
            height={product.image.height ?? 2048}
            sizes={{ maxWidth: [480, null, 248], width: "100vw" }}
            src={product.image.url}
            width={product.image.width ?? 2048}
          />
        </div>
        <div
          css={s((t) => ({
            marginLeft: [null, null, t.spacing.xs],
            padding: [t.spacing.md, null, t.spacing.lg],
            paddingTop: [t.spacing.sm, null, t.spacing.lg],
            width: "100%",
          }))}
        >
          <header>
            <h2 css={s(headingCharlie)}>{product.title}</h2>
            {product.subtitle && (
              <p
                css={s(bodyTextSmall, (t) => ({
                  marginTop: [t.spacing.xxs, null, t.spacing.xs],
                }))}
              >
                {product.subtitle}
              </p>
            )}
          </header>
          <dl css={s((t) => ({ marginTop: t.spacing.sm }))}>
            <dt css={s(visuallyHidden)}>{t("ProductRenderer:price")}</dt>
            <dd
              css={s(bodyTextStatic, (t) => ({
                display: "inline",
                fontWeight: t.font.primary.weight.medium,
              }))}
            >
              {formatCurrency(product.currentPrice)}
            </dd>
            {product.currentDiscount && (
              <>
                <dt css={s(visuallyHidden)}>{t("ProductRenderer:rrp")}</dt>
                <dd
                  css={s(bodyTextSmallStatic, (t) => ({
                    display: "inline",
                    marginLeft: t.spacing.xs,
                    opacity: 0.6,
                    textDecoration: "line-through",
                  }))}
                >
                  {formatCurrency(product.regularPrice)}
                </dd>
              </>
            )}
          </dl>
          <span
            css={s(primaryButton(), (t) => ({
              marginTop: t.spacing.sm,
              width: "100%",
            }))}
          >
            {t("ProductRenderer:cta")}
          </span>
        </div>
      </Link>
    </aside>
  );
};

export const RichTextRenderer: FC<RichTextSlice> = ({
  primary: { content },
}) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();

  return (
    <div css={s(bodyText, gutterX, mb)}>
      <div css={s(belt)}>
        <OpinionatedRichText render={content} />
      </div>
    </div>
  );
};
