import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { NextPageWithApollo, sanitize } from "@sss/apollo";
import {
  getCoreCartLineItem,
  PersistedCartLineItem,
  useCart,
} from "@sss/ecommerce/cart";
import {
  CHECKOUT_COMPLETED_CORE,
  CHECKOUT_WITH_VARIANTS,
  CheckoutWithVariants,
  CheckoutWithVariantsData,
  LineItemType,
  LineItemWithVariant,
} from "@sss/ecommerce/checkout";
import {
  ProductContainerOption,
  ProductContainerType,
} from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import React from "react";

import { isStringEnumMember } from "@/common/filters";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { PageSpinner } from "../../ui/base/spinner";
import { ToastType, useToastController } from "../../ui/base/toast";

const enUsResource = {
  completed: "Your cart has already been completed",
  error: "There was an unexpected problem restoring your cart",
  loading: "Fetching your cart...",
  missing:
    "There was a problem restoring your cart: the link you used is invalid or incomplete",
};

enum ReservedLineItemPropertyName {
  CART_LINE_ITEM_ID = "cartLineItemId",
  LINE_ITEM_TYPE = "lineItemType",
}

export const checkoutLineItemsToCartLineItems = (
  checkout: CheckoutWithVariants
): PersistedCartLineItem[] => {
  const cartLineItems: PersistedCartLineItem[] = [];
  const containerCheckoutLineItemMap = new Map<string, LineItemWithVariant>();
  const standaloneCheckoutLineItems: LineItemWithVariant[] = [];

  const getCartLineItemId = ({
    properties,
  }: Pick<LineItemWithVariant, "properties">): string | null =>
    properties.find(
      ({ name }) => name === ReservedLineItemPropertyName.CART_LINE_ITEM_ID
    )?.value ?? null;

  for (const checkoutLineItem of checkout.lineItems) {
    const cartLineItemId = getCartLineItemId(checkoutLineItem);
    const lineItemType =
      checkoutLineItem.properties.find(
        ({ name }) => name === ReservedLineItemPropertyName.LINE_ITEM_TYPE
      )?.value ?? null;

    if (cartLineItemId && lineItemType === LineItemType.CONTAINER) {
      containerCheckoutLineItemMap.set(cartLineItemId, checkoutLineItem);
    } else if (!lineItemType) {
      standaloneCheckoutLineItems.push(checkoutLineItem);
    }
  }

  for (const {
    frequency,
    id,
    quantity,
    properties,
    product,
    variant,
  } of standaloneCheckoutLineItems) {
    let containerUpgrade = false;

    let cartLineItemId = getCartLineItemId({ properties });

    if (cartLineItemId) {
      // Make sure we don't have multiple line items with the same ID
      if (cartLineItems.find(({ id }) => id === cartLineItemId)) {
        const error = new Error(
          `Duplicate cart line item ID "${cartLineItemId}" in checkout "${checkout.id}"`
        );

        if (process.env.NODE_ENV === "production") {
          captureException(error, { extra: { checkout } });
        } else {
          throw error;
        }

        cartLineItemId = null;
      } else {
        const containerCheckoutLineItem =
          containerCheckoutLineItemMap.get(cartLineItemId) ?? null;

        if (
          !frequency && // We only currently offer container upgrades for OTP products
          containerCheckoutLineItem &&
          containerCheckoutLineItem.variantId ===
            product.containers?.[ProductContainerType.OTP][
              ProductContainerOption.UPGRADE
            ].variantId
        ) {
          containerUpgrade = true;
        }
      }
    }

    cartLineItems.push(
      sanitize({
        ...getCoreCartLineItem(variant, product),
        containerUpgrade,
        frequency,
        id: cartLineItemId ?? id,
        properties: properties.reduce(
          (result, { name, value }) =>
            isStringEnumMember(ReservedLineItemPropertyName, name)
              ? result
              : { ...result, [name]: value },
          {}
        ),
        quantity,
      })
    );
  }

  return cartLineItems;
};

const CartRestore: NextPageWithApollo = () => {
  const client = useApolloClient();
  const cart = useCart();
  const { i18n, t } = useLocale();
  const [hasAlreadyRestored, setHasAlreadyRestored] = useState(false);
  const [hasHandledFailure, setHasHandledFailure] = useState(false);
  const router = useRouter();
  const toast = useToastController();

  i18n.addResourceBundle("en-US", "CartRestore", enUsResource);

  const id = router.query.token;

  const checkout = useQuery<CheckoutWithVariantsData>(CHECKOUT_WITH_VARIANTS, {
    skip: !router.query.token,
    variables: { id },
  });

  const redirectToCart = useCallback(() => router.replace("/cart"), [router]);

  const handleFailure = useCallback(
    async (id: string) => {
      try {
        const { data } = await client.query({
          // Avoid caching the query otherwise `null` results may persist
          // after the checkout is completed
          fetchPolicy: "no-cache",
          query: CHECKOUT_COMPLETED_CORE,
          variables: { id },
        });

        toast.push(
          data.rCheckout?.completedAt
            ? {
                children: t("CartRestore:completed"),
                type: ToastType.WARNING,
              }
            : {
                children: t("CartRestore:missing"),
                type: ToastType.ERROR,
              }
        );
      } catch (error) {
        if (process.env.NODE_ENV === "production") {
          captureException(error);
        } else {
          throw error;
        }

        toast.push({
          children: t("CartRestore:error"),
          type: ToastType.ERROR,
        });
      }

      redirectToCart();
    },
    [client, redirectToCart, t, toast]
  );

  useEffect(() => {
    if (hasAlreadyRestored) {
      return;
    }

    // Because we're using a query param, we can't tell if the ID is set or not
    // until the router is ready
    if (!router.isReady) {
      return;
    }

    if (typeof id === "string") {
      // We need to wait until the cart has loaded/initialised before we replace
      // it with the restored cart, otherwise the `CartProvider` will
      // reinitialise or overwrite it
      if (!cart.id) {
        return;
      }

      if (checkout.error) {
        throw new Error(
          `Error restoring cart: GraphQL error while retrieving checkout ${id}`
        );
      }

      if (!checkout.data) {
        if (!checkout.loading) {
          throw new Error(
            `Error restoring cart: did not recieve valid payload for checkout ${id}`
          );
        }
        return;
      }

      if (!checkout.data.rCheckout) {
        if (!hasHandledFailure) {
          handleFailure(id);
          setHasHandledFailure(true);
        }

        return;
      }

      cart.replace({
        checkoutId: null,
        customAttributes: (checkout.data.rCheckout.noteAttributes ?? []).reduce(
          (accum, item) => ({ ...accum, [item.name]: item.value }),
          {}
        ),
        discountCode: checkout.data.rCheckout.discount?.code ?? null,
        id: null,
        lineItems: checkoutLineItemsToCartLineItems(checkout.data.rCheckout),
        rCheckoutId: checkout.data.rCheckout.id,
      });
    }

    setHasAlreadyRestored(true);

    redirectToCart();
  }, [
    checkout,
    cart,
    handleFailure,
    hasAlreadyRestored,
    hasHandledFailure,
    id,
    redirectToCart,
    router,
  ]);

  return <PageSpinner label={t("CartRestore:loading")} />;
};

export default CartRestore;

// Include `makeStaticPropsGetter` so we pre-fetch static navigation data for
// the error page
export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
