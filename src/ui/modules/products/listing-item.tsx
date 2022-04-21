import { trackSelectItemEvent } from "@sss/ecommerce/analytics";
import { Product } from "@sss/ecommerce/product";
import {
  findDefaultVariant,
  findVariantBySku,
  getVariantPrices,
  parsePreorderTypeMetafield,
  PreorderType,
} from "@sss/ecommerce/product";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";
import { MergeExclusive } from "type-fest";

import {
  ComponentStyleProps,
  px,
  py,
  ResponsiveImageProperties,
  s,
} from "@/common/ui/utils";

import ResponsiveImage from "../../base/responsive-image";
import {
  bodyTextStatic,
  callToActionText,
  headingDelta,
} from "../../base/typography";
import Rating from "../reviews/rating";

const enUsResource = {
  outOfStock: "Sold out",
  preorder: "Preorder now",
};

export enum ProductListingItemLayoutType {
  DEFAULT = "DEFAULT",
  MINIMAL = "MINIMAL",
}

type ProductListingItemProps = ComponentStyleProps & {
  layout?: ProductListingItemLayoutType;
  position: number;
  product: Product;
  sizes: string | ResponsiveImageProperties;
  to?: string;
} & MergeExclusive<
    { collectionName: string; trackingEnabled?: true },
    { trackingEnabled: false }
  >;

const ProductListingItem: FC<ProductListingItemProps> = ({
  _css = {},
  layout = ProductListingItemLayoutType.DEFAULT,
  position,
  product,
  sizes,
  to = `/products/${product.handle}`,
  ...rest
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ProductListingItem", enUsResource);

  const { bottomline, title, variants } = product;

  const image = product.images.edges[0].node;
  const subtitle = product.listingSubtitle ?? product.subtitle;
  const variant =
    (product.listingSku?.value &&
      findVariantBySku(variants, product.listingSku.value)) ||
    findDefaultVariant(variants);

  const { currentDiscount, currentPrice, regularPrice } = getVariantPrices(
    variant,
    product.hasSubscription?.value.toLowerCase() === "true" &&
      product.listingSubscription?.value.toLowerCase() !== "false"
  );

  const displayAsSoldOut =
    layout !== ProductListingItemLayoutType.MINIMAL &&
    !product.availableForSale;

  const displayAsPreorder =
    layout !== ProductListingItemLayoutType.MINIMAL &&
    parsePreorderTypeMetafield(product.preorderType) !== PreorderType.NONE;

  return (
    <Link
      css={s(
        bodyTextStatic,
        {
          display: "flex",
          flexDirection: "column",
          img: {
            filter: "brightness(1)",
            transform: "scale(1)",
            transition: "all 0.15s ease-in-out",
          },
          "img:hover": {
            filter: "brightness(1.1)",
            transform: "scale(1.05)",
            transition: "all 0.15s ease-in-out",
          },
          opacity: displayAsSoldOut ? 0.6 : 1,
          position: "relative",
          textAlign: "left",
        },

        _css
      )}
      onClick={() =>
        rest.trackingEnabled &&
        trackSelectItemEvent(product, rest.collectionName, position)
      }
      to={to}
    >
      <div
        css={s((t) => ({
          backgroundColor: t.color.background.feature3,
          borderRadius: t.radius.sm,
          flexGrow: 0,
          flexShrink: 0,
          marginBottom: t.spacing.md,
          overflow: "hidden",
        }))}
      >
        <ResponsiveImage
          alt=""
          height={image.height ?? 380}
          src={image.url}
          sizes={sizes}
          width={image.width ?? 380}
        />
      </div>
      <div css={s({ flexGrow: 1 })}>
        <h2 css={s(headingDelta, (t) => ({ marginBottom: t.spacing.xs }))}>
          {title}
        </h2>
        {subtitle?.value && layout !== ProductListingItemLayoutType.MINIMAL && (
          <p>{subtitle.value}</p>
        )}
      </div>
      {layout !== ProductListingItemLayoutType.MINIMAL && (
        <div css={s((t) => ({ marginTop: t.spacing.sm }))}>
          <p>
            <span
              css={s((t) => ({ fontWeight: t.font.primary.weight.medium }))}
            >
              {formatCurrency(currentPrice)}
            </span>
            {currentDiscount && (
              <span
                css={s((t) => ({
                  marginLeft: t.spacing.xs,
                  opacity: 0.5,
                  textDecoration: "line-through",
                }))}
              >
                {formatCurrency(regularPrice)}
              </span>
            )}
          </p>
          <div
            css={s((t) => ({
              height: 24, // Set exact height for consistent layout when no reviews are available
              marginTop: t.spacing.xs,
            }))}
          >
            {!!bottomline?.totalReviews && <Rating {...bottomline} />}
          </div>
          {displayAsSoldOut && (
            <p
              css={s(callToActionText, (t) => ({
                backgroundColor: t.color.background.dark,
                borderRadius: t.radius.sm,
                color: t.color.text.light.base,
                left: t.spacing.sm,
                lineHeight: 1.4,
                ...px(t.spacing.sm),
                ...py(t.spacing.xs),
                position: "absolute",
                top: t.spacing.sm,
              }))}
            >
              {t("ProductListingItem:outOfStock")}
            </p>
          )}
          {!displayAsSoldOut && displayAsPreorder && (
            <p
              css={s(callToActionText, (t) => ({
                backgroundColor: t.color.background.dark,
                borderRadius: t.radius.sm,
                color: t.color.text.light.base,
                fontSize: 12,
                lineHeight: 1.4,
                ...px(t.spacing.sm),
                ...py(t.spacing.xs),
                position: "absolute",
                right: t.spacing.sm,
                top: t.spacing.sm,
              }))}
            >
              {t("ProductListingItem:preorder")}
            </p>
          )}
        </div>
      )}
    </Link>
  );
};

export default ProductListingItem;
