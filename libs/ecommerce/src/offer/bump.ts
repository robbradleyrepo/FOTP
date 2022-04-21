import { useQuery } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useMemo } from "react";

import {
  CartData,
  CartStatus,
  hasCompleteLineItemData,
  useCart,
} from "../cart";
import {
  findVariantBySku,
  Product,
  PRODUCT_BY_HANDLE,
  ProductData,
  Variant,
} from "../product";

export interface BumpOffer {
  exclude?: { handles: string[] }; // Don't trigger offer if the cart contains a matching product
  include: { handles: string[] };
  product: Record<"handle" | "sku", string>;
}

interface GetApplicableBumpOfferParams {
  cart: Pick<CartData, "lineItems" | "status">;
  offers: BumpOffer[];
  product: Pick<Product, "handle">;
  query: ParsedUrlQuery;
}

export const getApplicableBumpOffer = ({
  cart: { lineItems, status },
  offers,
  product,
  query,
}: GetApplicableBumpOfferParams): BumpOffer | null => {
  let applicableOffer = null;

  if (
    offers &&
    query.bump_offers !== "false" &&
    hasCompleteLineItemData(lineItems, status) // We can't tell if the offer is applicable or not until all cart data is available
  ) {
    const isApplicableOffer = (offer: BumpOffer) =>
      !lineItems.some(
        ({ variant }) =>
          offer.product.handle === variant.product.handle || // The offer is not applicable if the cart contains the offer product
          (offer.exclude?.handles ?? []).includes(variant.product.handle) // Or if the cart contains an explicitly excluded product
      );

    // Loop through all offers and find the first that applies
    for (const offer of offers) {
      if (
        offer.include.handles.includes(product.handle) &&
        isApplicableOffer(offer)
      ) {
        applicableOffer = offer;
        break;
      }
    }
  }

  return applicableOffer;
};

export interface UseBumpOfferOptions {
  disabled?: boolean;
  ignoreCart?: boolean;
  offers: BumpOffer[];
  product: Pick<Product, "handle">;
}

export enum BumpOfferStatus {
  ERROR = "ERROR",
  FETCHING = "FETCHING",
  INITIALIZING = "INITIALIZING",
  READY = "READY",
}

export type UseBumpOfferResult =
  | {
      offer: BumpOffer | null;
      status: BumpOfferStatus;
    }
  | {
      offer: BumpOffer;
      product: Product;
      status: BumpOfferStatus.READY;
      variant: Variant;
    };

export const useBumpOffer = ({
  disabled = false,
  ignoreCart,
  offers,
  product,
}: UseBumpOfferOptions): UseBumpOfferResult => {
  const { lineItems, status } = useCart();
  const router = useRouter();

  const effectiveLineItems = ignoreCart ? null : lineItems;

  const offer = useMemo(
    () =>
      disabled
        ? null
        : getApplicableBumpOffer({
            cart: { lineItems: effectiveLineItems ?? [], status },
            offers,
            product,
            query: router.query,
          }),
    [disabled, effectiveLineItems, offers, product, router, status]
  );

  const queryResult = useQuery<ProductData>(PRODUCT_BY_HANDLE, {
    skip: !offer?.product.handle,
    variables: { handle: offer?.product.handle },
  });

  return useMemo(() => {
    if (status !== CartStatus.READY) {
      return {
        offer: null,
        status: BumpOfferStatus.INITIALIZING,
      };
    }

    const { data, loading } = queryResult;

    if (!offer) {
      return {
        offer: null,
        status: BumpOfferStatus.READY,
      };
    }

    if (data?.product && !loading) {
      const { product } = data;
      const variant = findVariantBySku(product.variants, offer.product.sku);

      if (variant) {
        if (!variant.availableForSale) {
          return {
            offer: null,
            status: BumpOfferStatus.READY,
          };
        }

        return {
          offer,
          product,
          status: BumpOfferStatus.READY,
          variant,
        };
      }

      const error = new Error("Invalid bump offer configuration");

      if (process.env.NODE_ENV === "production") {
        captureException(error, { extra: { offer, product } });
      } else {
        throw error;
      }
    }

    if (loading) {
      return {
        offer,
        status: BumpOfferStatus.FETCHING,
      };
    }

    return {
      offer,
      status: BumpOfferStatus.ERROR,
    };
  }, [offer, queryResult, status]);
};
