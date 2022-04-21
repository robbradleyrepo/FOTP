import React, { FC } from "react";
import { JsonLd } from "react-schemaorg";
import { Product as ProductDts } from "schema-dts";

import { getLegacyId } from "./common";
import { getProductUrl, getProductVariants, Product } from "./product";

interface ProductSchemaProps {
  product: Product;
}

type GtinDts = Pick<ProductDts, "gtin8" | "gtin12" | "gtin13" | "gtin14">;

const getGtinData = (value: string | null): GtinDts | undefined => {
  const GTIN_LENS = [8, 12, 13, 14];

  if (!value || !GTIN_LENS.includes(value.length)) {
    // Invalid value
    return;
  }

  // Seems strange that you need to be explicit with the gtin length value
  // rather than use the generic `gtin` value.

  const key = `gtin${value.length}` as "gtin8" | "gtin12" | "gtin13" | "gtin14";
  return { [key]: value };
};

export const useProductSchemaJson = (product: Product) => {
  const variants = getProductVariants(product);
  const defaultVariant = variants[0];
  const name = `${product.title}${
    product.subtitle?.value ? " – " + product.subtitle.value : ""
  }`.trim();
  // You can just set the expiry date to next year and have it
  // dynamically updated every day.
  const priceValidUntil = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  )
    .toISOString()
    .substring(0, 10);
  const url = getProductUrl(product);

  return {
    "@type": "Product",
    aggregateRating:
      product.bottomline && product.bottomline.totalReviews > 0
        ? {
            "@type": "AggregateRating",
            ratingCount: product.bottomline.totalReviews,
            ratingValue: product.bottomline.averageScore,
          }
        : undefined,
    brand: product.vendor,
    description: product.description,
    ...getGtinData(defaultVariant.barcode),
    image:
      product.images.edges.length > 0
        ? [product.images.edges[0].node.url]
        : undefined,
    name,
    offers: variants.map((variant) => {
      return {
        "@type": "Offer",
        availability: variant.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        description: product.description,
        ...getGtinData(variant.barcode),
        image: variant.image.url,
        itemCondition: "https://schema.org/NewCondition",
        name:
          variant.title !== "Default Title"
            ? `${name} - ${variant.title}`
            : name,
        price: variant.priceV2.amount,
        priceCurrency: variant.priceV2.currencyCode,
        priceValidUntil,
        // As a DTC, vendor and seller is always the same.
        seller: product.vendor,
        sku: variant.sku,
        url: `${url}?variant=${getLegacyId(variant.id)}`,
      };
    }),
    productID: getLegacyId(product.id),
    sku: defaultVariant.sku,
    url,
  };
};

export const ProductSchema: FC<ProductSchemaProps> = ({ product }) => {
  const productSchemaJson = useProductSchemaJson(product);

  return (
    <JsonLd<ProductDts>
      item={{
        "@context": "https://schema.org",
        // Cast to `ProductDts`, as it's better to have the inferred types on
        // `useProductSchemaJson` and it's difficult to narrow the types from
        // `schema-dts`
        ...(productSchemaJson as ProductDts),
      }}
    />
  );
};
