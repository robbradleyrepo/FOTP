import {
  QueryHookOptions,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { getCapturedTrackingParams } from "@sss/analytics";
import { NextPageWithApollo } from "@sss/apollo";
import { useCustomer } from "@sss/customer";
import {
  getTrackingAttributes,
  trackPurchaseEvent,
} from "@sss/ecommerce/analytics";
import {
  CartStatus,
  getHasSubscription,
  hasCompleteLineItemData,
  useCart,
} from "@sss/ecommerce/cart";
import {
  cartLineitemsToCheckoutInput,
  CHECKOUT,
  Checkout,
  CHECKOUT_COMPLETED,
  CHECKOUT_UPDATE,
  CheckoutData,
  CheckoutUpdateData,
  CheckoutUpdateInput,
  CheckoutUpdatePayload,
} from "@sss/ecommerce/checkout";
import { Money } from "@sss/ecommerce/common";
import {
  SHOPIFY_CHECKOUT_CREATE,
  SHOPIFY_CHECKOUT_LINE_ITEM_REPLACE,
  ShopifyCheckoutCreateInput,
  ShopifyCheckoutLineItemReplaceInput,
  ShopifyCheckoutUpdateData,
  ShopifyCheckoutUpdatePayload,
} from "@sss/ecommerce/shopify-checkout";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { SHOPPING_GIVES } from "@sss/shopping-gives";
import { DocumentNode } from "graphql";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import store from "store/dist/store.modern";

import { s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../pages/_app";
import { PageSpinner } from "../ui/base/spinner";
import { ToastType, useToastController } from "../ui/base/toast";
import { bodyTextSmallStatic } from "../ui/base/typography";
import CheckoutBreadcrumbs from "../ui/modules/checkout/breadcrumbs";
import { CheckoutStep } from "../ui/modules/checkout/common";
import CheckoutStepInformation from "../ui/modules/checkout/steps/information";
import CheckoutStepPayment from "../ui/modules/checkout/steps/payment";
import CheckoutStepThanks from "../ui/modules/checkout/steps/thanks";
import { StripeElements } from "../ui/modules/payment-fields";
import CheckoutTemplate from "../ui/templates/checkout";

const useCheckoutSyncEnUsResource = {
  error: {
    generic: "Something when wrong. Please try again or contact support.",
  },
};

interface UseCheckoutSyncParams {
  id?: string;
  step: CheckoutStep;
}

interface UseCheckoutSyncResult {
  rCheckout: Checkout | null;
  shippingThreshold: Money | null;
}

const useCheckoutSync = ({
  id,
  step,
}: UseCheckoutSyncParams): UseCheckoutSyncResult => {
  const client = useApolloClient();
  const {
    associateCheckout: associateCheckoutToCart,
    customAttributes: cartCustomAttributes,
    checkoutId,
    discountCode,
    lineItems,
    reset: resetCart,
    shippingThreshold,
    status,
  } = useCart();
  const { customer, loading: customerLoading } = useCustomer();
  const { i18n, t } = useLocale();
  const [updateRCheckout] = useMutation<
    CheckoutUpdateData,
    CheckoutUpdateInput
  >(CHECKOUT_UPDATE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: CHECKOUT }],
  });
  const router = useRouter();
  const toast = useToastController();

  const isSyncRequired = step !== CheckoutStep.THANKS;

  const shouldAttemptSyncRef = useRef(isSyncRequired);
  const [isReChargeSynced, setIsReChargeSynced] = useState(!isSyncRequired);

  i18n.addResourceBundle(
    "en-US",
    "useCheckoutSync",
    useCheckoutSyncEnUsResource
  );

  const shouldUseCustomCheckout =
    status === CartStatus.INITIALIZING
      ? null
      : process.env.FEATURE_SHOPIFY_CHECKOUT !== "true" || // Use the custom checkout if the Shopify checkout is disabled
        step === CheckoutStep.THANKS || // Always use the custom checkout for the thanks page, as it can be viewed without a cart
        getHasSubscription({ lineItems }); // Use the custom checkout if there are any subscription items in the cart

  const redirectToCart = useCallback(() => {
    router.replace("/cart");
  }, [router]);

  const getCustomAttributes = useCallback(async () => {
    const attributes = {
      ...cartCustomAttributes,
      ...(await getTrackingAttributes()),
    };

    if (SHOPPING_GIVES.storeId) {
      const sgkey = `sg.sid-${SHOPPING_GIVES.storeId.split("-").join("")}`;
      const sgTrackingId = sessionStorage.getItem(sgkey);
      if (sgTrackingId) {
        attributes["ShoppingGives Donation Tracking ID"] = atob(sgTrackingId);
      }
    }

    return attributes;
  }, [cartCustomAttributes]);

  // Only load the ReCharge Checkout if we know we need to use it
  const rCheckoutQueryHookOptions = { skip: shouldUseCustomCheckout !== true };
  const rCheckoutQuery: [DocumentNode, QueryHookOptions] =
    step === CheckoutStep.THANKS
      ? [
          CHECKOUT_COMPLETED,
          { ...rCheckoutQueryHookOptions, variables: { id } },
        ]
      : [CHECKOUT, rCheckoutQueryHookOptions];

  const {
    data: { rCheckout } = {},
    loading: rCheckoutLoading,
  } = useQuery<CheckoutData>(...rCheckoutQuery);

  const loading = rCheckoutLoading || status === CartStatus.INITIALIZING;

  // Shopify Checkout
  useEffect(() => {
    if (
      !shouldAttemptSyncRef.current ||
      shouldUseCustomCheckout !== false || // Don't do anything if we're not using the Shopify checkout
      !hasCompleteLineItemData(lineItems, status)
    ) {
      return;
    }

    const updateCheckout = async () => {
      shouldAttemptSyncRef.current = false;

      let error: Error | null = null;
      let payload: ShopifyCheckoutUpdatePayload | null = null;

      const lineItemInput = cartLineitemsToCheckoutInput(lineItems).map(
        ({ properties, quantity, variantId }) => ({
          // Include custom attributes to prevent Shopify deduplicating the
          // containers
          customAttributes: properties.map(({ name, value }) => ({
            key: `_${name}`, // Prefix with an underscore to hide on the Shopify Checkout
            value,
          })),
          quantity,
          variantId,
        })
      );

      try {
        if (checkoutId) {
          // If we have a checkout ID we'll update the entire cart: we won't ever
          // have the Shopify checkout cached as we always leave the app once
          // we've loaded it
          const { data } = await client.mutate<
            ShopifyCheckoutUpdateData,
            ShopifyCheckoutLineItemReplaceInput
          >({
            context: {
              shopify: {
                query: getCapturedTrackingParams(),
              },
            },
            mutation: SHOPIFY_CHECKOUT_LINE_ITEM_REPLACE,
            variables: { checkoutId, lineItems: lineItemInput },
          });

          payload = data?.payload ?? null;
        } else {
          // If we don't have an existing checkout, create a new one
          const { data } = await client.mutate<
            ShopifyCheckoutUpdateData,
            { input: ShopifyCheckoutCreateInput }
          >({
            context: {
              shopify: {
                query: getCapturedTrackingParams(),
              },
            },
            mutation: SHOPIFY_CHECKOUT_CREATE,
            variables: {
              input: {
                customAttributes: Object.entries(
                  await getCustomAttributes()
                ).map(([key, value]) => ({
                  key,
                  value,
                })),
                email: customer?.email,
                lineItems: lineItemInput,
              },
            },
          });

          payload = data?.payload ?? null;
        }
      } catch (caughtError) {
        error = caughtError;
      }

      const captureError = () =>
        captureException(
          error ?? new Error("Unable to sync Shopify checkout"),
          {
            extra: {
              checkout: payload?.checkout,
              checkoutId,
              input: { lineItems: lineItemInput },
              userErrors: payload?.userErrors,
            },
          }
        );

      if (!payload) {
        // We should only hit this if we don't get a valid response from the
        // server. Redirect the user to the cart so the can try again, but
        // display a warning so they don't get stuck in an endless loop without
        // feedback
        captureError();
        toast.push({
          children: t("useCheckoutSync:error.generic"),
          type: ToastType.ERROR,
        });
        redirectToCart();

        return;
      } else if (!payload.checkout || payload.userErrors.length > 0) {
        // We couldn't create the checkout from our cart data. Let's assume the
        // cart data is invalid (eg the checkout has been completed or the data
        // is corrupt) and reset the cart
        captureError();
        resetCart();
        redirectToCart();

        return;
      }

      associateCheckoutToCart({ checkoutId: payload.checkout.id });

      let url = payload.checkout.webUrl;

      if (discountCode) {
        url = `${url}${url.includes("?") ? "&" : "?"}discount=${discountCode}`;
      }

      if (window.location.replace) {
        window.location.replace(url);
      } else {
        window.location.href = url;
      }
    };

    updateCheckout();
  }, [
    associateCheckoutToCart,
    checkoutId,
    client,
    customer?.email,
    discountCode,
    getCustomAttributes,
    lineItems,
    redirectToCart,
    resetCart,
    shouldUseCustomCheckout,
    status,
    t,
    toast,
  ]);

  useEffect(() => {
    if (
      !shouldAttemptSyncRef.current ||
      customerLoading || // Wait until we have customer data before syncing
      !shouldUseCustomCheckout ||
      loading ||
      !hasCompleteLineItemData(lineItems, status)
    ) {
      return;
    }

    const syncRCheckout = async () => {
      shouldAttemptSyncRef.current = false;

      if (lineItems.length > 0) {
        let error: Error | null = null;
        let payload: CheckoutUpdatePayload | null = null;

        // Create or update a checkout with the current content of cart.
        const variables: CheckoutUpdateInput = {
          // Don't include discount code as invalid codes will cause the sync
          // to fail and the cart to be reset. We'll apply it in the
          // `CheckoutDiscount` module
          email: customer?.email ? { email: customer.email } : undefined,
          lineItems: cartLineitemsToCheckoutInput(lineItems),
          noteAttributes: Object.entries(await getCustomAttributes()).map(
            ([name, value]) => ({
              name,
              value,
            })
          ),
        };

        try {
          const { data } = await updateRCheckout({ variables });

          payload = data?.payload ?? null;
        } catch (caughtError) {
          error = caughtError;
        }

        setIsReChargeSynced(true);

        if (!payload) {
          captureException(error ?? new Error("Invalid server response"), {
            extra: { variables },
          });
          toast.push({
            children: t("useCheckoutSync:error.generic"),
            type: ToastType.ERROR,
          });
          redirectToCart();

          return;
        }

        if (payload.rCheckout === null || payload.userErrors.length > 0) {
          captureException(
            error ?? new Error("Unable to sync ReCharge checkout"),
            {
              extra: {
                checkout: payload.rCheckout,
                userErrors: payload.userErrors,
                variables,
              },
            }
          );

          resetCart();
          redirectToCart();

          return;
        }

        associateCheckoutToCart({ rCheckoutId: payload.rCheckout.id });
      } else {
        // cart is empty, no point in being here
        redirectToCart();
      }
    };

    syncRCheckout();
  }, [
    associateCheckoutToCart,
    customer?.email,
    customerLoading,
    getCustomAttributes,
    isReChargeSynced,
    lineItems,
    loading,
    redirectToCart,
    resetCart,
    shouldUseCustomCheckout,
    status,
    t,
    toast,
    updateRCheckout,
  ]);

  useEffect(() => {
    if (step === CheckoutStep.PAYMENT && !loading) {
      if (!rCheckout) {
        // no checkout in progress, go create one
        router.replace("/checkout/information");
      }
    }
  }, [loading, rCheckout, router, step]);

  useEffect(() => {
    if (step === CheckoutStep.THANKS && !loading) {
      if (rCheckout && rCheckout.completedAt !== null && lineItems.length > 0) {
        resetCart();
      }
    }
  }, [lineItems.length, loading, rCheckout, resetCart, step]);

  return {
    rCheckout: (isReChargeSynced && rCheckout) || null,
    shippingThreshold,
  };
};

const checkoutPageEnUsResource = {
  loading: "Preparing your cart…",
  meta: {
    title: "Secure Checkout",
  },
};

interface CheckoutPageProps {
  step: CheckoutStep;
}

const getFirstTimeAccessedKey = (checkout: Checkout) =>
  `${checkout.id}:first_time_accessed`;

export const CheckoutPage: NextPageWithApollo<CheckoutPageProps> = ({
  step,
}) => {
  const { setTraits: setCustomerTraits } = useCustomer();
  const { i18n, t } = useLocale();
  const router = useRouter();
  const id = router.query
    ? Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id
    : undefined;

  i18n.addResourceBundle("en-US", "checkoutPage", checkoutPageEnUsResource);

  const { rCheckout, shippingThreshold } = useCheckoutSync({ id, step });

  const handleComplete = (checkout: Checkout) => {
    // As we're doing a full page reload on purchase (see below), we push
    // a flag to local storage to indicate that we need to trigger analytics
    // for this purchase on the Thank You page. We could trigger it here, however
    // we might not have enough time to trigger all the pixels before navigation.
    store.set(getFirstTimeAccessedKey(checkout), true);

    // Force a full page reload here. If we do `router.push` here instead,
    // the CheckoutPage will not be re-rendered, the `router` object will
    // not be updated, and the `id` query parameter will not be retrieved,
    // due to shallow routing. See https://github.com/vercel/next.js/issues/2819
    window.location.href = `/checkout/${CheckoutStep.THANKS}?id=${checkout.id}`;
  };

  useEffect(() => {
    // As we're doing a full page reload on purchase (see above), we've pushed
    // a flag to local storage to indicate that we need to trigger analytics
    // for this purchase on the Thank You page. We could trigger it in `handleComplete`,
    // however we might not have enough time to trigger all the pixels before navigation.
    if (step !== CheckoutStep.THANKS || rCheckout === null) {
      return;
    }

    const pendingFirstTimeAccessedKey = getFirstTimeAccessedKey(rCheckout);
    const isFirstTimeAccessed: boolean =
      store.get(pendingFirstTimeAccessedKey) !== undefined;

    if (isFirstTimeAccessed) {
      if (rCheckout.customer?.analyticsUserId && rCheckout.email) {
        setCustomerTraits({
          email: rCheckout.email,
          firstName:
            rCheckout.billingAddress?.firstName ??
            rCheckout.shippingAddress?.firstName,
          id: parseInt(rCheckout.customer.analyticsUserId),
          lastName:
            rCheckout.billingAddress?.lastName ??
            rCheckout.shippingAddress?.lastName,
          phone: rCheckout.shippingAddress?.phone,
        });
      }

      trackPurchaseEvent(rCheckout, "Front Of The Pack");

      store.remove(pendingFirstTimeAccessedKey);
    }
  }, [rCheckout, setCustomerTraits, step]);

  if (!rCheckout) {
    return <PageSpinner label={t("checkoutPage:loading")} />;
  }

  const metadata = {
    title: `${t("checkoutPage:meta.title")} | ${t("common:fotp")}`,
  };

  return (
    <StripeElements>
      <CheckoutTemplate
        checkout={rCheckout}
        shippingThreshold={shippingThreshold}
      >
        <Metadata {...metadata} openGraph={metadata} />
        <main
          css={s(bodyTextSmallStatic, (t) => ({
            paddingBottom: [t.spacing.lg, null, t.spacing.xl],
          }))}
        >
          {step !== CheckoutStep.THANKS && (
            <CheckoutBreadcrumbs
              _css={s((t) => ({
                paddingBottom: [t.spacing.lg, null, t.spacing.xl],
                paddingTop: [t.spacing.sm, null, 0],
                textAlign: ["center", null, "left"],
              }))}
              checkout={rCheckout}
              currentStep={step}
            />
          )}
          {step === CheckoutStep.INFORMATION && (
            <CheckoutStepInformation
              checkout={rCheckout}
              onComplete={handleComplete}
            />
          )}
          {step === CheckoutStep.PAYMENT && (
            <CheckoutStepPayment
              checkout={rCheckout}
              onComplete={handleComplete}
            />
          )}
          {step === CheckoutStep.THANKS && (
            <CheckoutStepThanks
              _css={s((t) => ({
                paddingTop: [t.spacing.lg, null, t.spacing.sm],
              }))}
              checkout={rCheckout}
            />
          )}
        </main>
      </CheckoutTemplate>
    </StripeElements>
  );
};

export default CheckoutPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: [
      {
        params: {
          step: CheckoutStep.INFORMATION,
        },
      },
      { params: { step: CheckoutStep.PAYMENT } },
      { params: { step: CheckoutStep.THANKS } },
    ],
  };
};

export const getStaticProps = makeStaticPropsGetter(async ({ params }) => {
  if (!params?.step) throw new Error('Missing "step" param');
  return {
    props: { step: params.step },
  };
});
