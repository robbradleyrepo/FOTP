import {
  trackAddToCartEvent,
  trackViewItemEvent,
} from "@sss/ecommerce/analytics";
import {
  CartLineItemActionType,
  getCoreCartLineItem,
  useCart,
} from "@sss/ecommerce/cart";
import { useBumpOffer, UseBumpOfferResult } from "@sss/ecommerce/offer/bump";
import {
  CartOfferDestinationType,
  useCartOfferRedirect,
  UseCartOfferRedirectResult,
} from "@sss/ecommerce/offer/cart";
import {
  findBundleQuantity,
  findVariantBySku,
  formValuesToFrequency,
  getInitialProductFormValues,
  getPreorderAllocation,
  ProductContainerOption,
  ProductFormValues,
  useProductSelectionDecorator,
  Variant,
} from "@sss/ecommerce/product";
import { useHasChangedSinceLastCall, useInView } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { FORM_ERROR } from "final-form";
import React, { FC, useEffect } from "react";
import { Form, FormRenderProps } from "react-final-form";

import {
  UnifiedProductPageDataWithMetadata,
  useProductPageData,
} from "../../../cms/product-page";
import { ToastType, useToastController } from "../../base/toast";
import BundlePickerUI from "./bundle-picker-ui";

type BundlePickerSelectionProps = BundlePickerProps &
  Pick<
    FormRenderProps<ProductFormValues>,
    "form" | "handleSubmit" | "submitSucceeded" | "submitting" | "values"
  > & {
    bumpOfferResult: UseBumpOfferResult;
    cartOffer: UseCartOfferRedirectResult;
    data: UnifiedProductPageDataWithMetadata;
    variant: Variant;
  };

const BundlePickerSelection: FC<BundlePickerSelectionProps> = ({
  cartOffer,
  data,
  form,
  trackingSource,
  values,
  variant,
  widgetId = "shopping-gives-bundle-picker-product-widget",
  ...rest
}) => {
  const shouldTrackGTMView = useHasChangedSinceLastCall();
  const [ref, isInView] = useInView();

  // We need to find the non-bundle variant.
  const inventoryVariant = data.ecommerce.variants.edges.find(
    ({ node }) => findBundleQuantity(node.selectedOptions) === 1
  )?.node;
  const preorderAllocation = inventoryVariant
    ? getPreorderAllocation(inventoryVariant)
    : null;

  useEffect(() => {
    if (
      shouldTrackGTMView([variant.id, values.subscription, values.frequency])
    ) {
      trackViewItemEvent(
        data.ecommerce,
        variant,
        trackingSource,
        formValuesToFrequency(values, data.meta)
      );
    }
  }, [
    data.ecommerce,
    data.meta,
    shouldTrackGTMView,
    trackingSource,
    values,
    variant,
  ]);

  // Reset the form if the page is loaded from cache. This ensures
  // that any users who navigation from the checkout using Safari's
  // back button can resubmit the form.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        form.reset();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [form]);

  // Prefetch the offer page for the currently selected variant when in view
  useEffect(() => {
    if (isInView) {
      cartOffer.prefetch(variant.sku);
    }
  }, [isInView, cartOffer, variant.sku]);

  return (
    <BundlePickerUI
      {...rest}
      data={data}
      preorderAllocation={preorderAllocation}
      ref={ref}
      values={values}
      variant={variant}
      widgetId={widgetId}
    />
  );
};

interface BundlePickerProps {
  widgetId?: string;
  skus: string[];
  trackingSource: string;
}

const BundlePicker: FC<BundlePickerProps> = ({
  widgetId,
  skus,
  trackingSource,
}) => {
  const { i18n, t } = useLocale();
  const { lineItemUpdate } = useCart();
  const { push } = useToastController();
  const data = useProductPageData();

  const bumpOfferResult = useBumpOffer({
    ignoreCart: true,
    offers: [
      {
        include: { handles: ["harmony", "the-one", "move", "soothe"] },
        product: {
          handle: "free-range-beef-tripe-dog-treats",
          sku: "FPTR03-BEEF",
        },
      },
    ],
    product: data.ecommerce,
  });
  const cartOffer = useCartOfferRedirect({
    destinationType: CartOfferDestinationType.CHECKOUT,
    ignoreCart: true,
    offers: [
      {
        handle: "the-one",
        include: { skus: ["FPHM01-HM30", "FPHM01-HM30x2", "FPHM01-HM30x3"] },
        products: ["the-one"],
      },
      {
        handle: "harmony",
        include: {
          skus: [
            "FPTO01-PH",
            "FPTO01-PHx2",
            "FPTO01-PHx3",
            "FPTO01-PHx6",
            "FPMV01-PH",
            "FPMV01-PHx2",
            "FPMV01-PHx3",
            "FPSH01-PH",
            "FPSH01-PHx2",
            "FPSH01-PHx3",
          ],
        },
        products: ["harmony"],
      },
      {
        handle: "treats",
        include: {
          skus: [
            "FPHM01-HM30",
            "FPHM01-HM30x2",
            "FPHM01-HM30x3",
            "FPTO01-PH",
            "FPTO01-PHx2",
            "FPTO01-PHx3",
            "FPTO01-PHx6",
          ],
        },
        products: [
          "free-range-beef-tripe-dog-treats",
          "farm-raised-rabbit-dog-treats",
          "wild-alaskan-salmon-dog-treats",
          "variety-pack-dog-treats",
        ],
      },
    ],
    product: data.ecommerce,
  });

  i18n.addResourceBundle("en-US", "BundlePicker", {
    error:
      "There was a problem adding the item to your cart. Please try again.",
  });

  const formDefaults = getInitialProductFormValues(
    data.meta.selection,
    data.ecommerce.containers
  );

  const productSelectionDecorator = useProductSelectionDecorator(data.meta);

  const handleAddToCart = async (values: ProductFormValues) => {
    try {
      const variant = findVariantBySku(data.ecommerce.variants, values.sku);
      const addOns: string[] = [];
      const properties = {};

      // We shouldn't hit this error, as the user shouldn't be able
      // to make an invalid selection
      if (!variant) {
        throw new Error("Invalid variant ID");
      }

      const frequency = formValuesToFrequency(values, data.meta);
      const quantity = values.quantity;

      lineItemUpdate({
        payload: {
          ...getCoreCartLineItem(variant, data.ecommerce),
          containerUpgrade:
            values.containerOptionOtp === ProductContainerOption.UPGRADE,
          frequency,
          properties,
          quantity,
        },
        type: CartLineItemActionType.REPLACE_ALL,
      });

      trackAddToCartEvent(
        data.ecommerce,
        variant,
        trackingSource,
        quantity,
        frequency
      );

      if (values.bumpOffer && "variant" in bumpOfferResult) {
        lineItemUpdate({
          payload: {
            ...getCoreCartLineItem(
              bumpOfferResult.variant,
              bumpOfferResult.product
            ),
            frequency,
            properties: {},
            quantity,
          },
          type: CartLineItemActionType.INCREMENT,
        });

        trackAddToCartEvent(
          bumpOfferResult.product,
          bumpOfferResult.variant,
          `${trackingSource}-bump-offer`,
          quantity,
          frequency
        );

        addOns.push(bumpOfferResult.product.handle);
      }

      cartOffer.redirect({
        addOns,
        frequency,
        properties,
        sku: variant.sku,
        variantId: variant.id,
      });
    } catch (error) {
      push({
        children: t("BundlePicker:error"),
        type: ToastType.ERROR,
      });

      return { [FORM_ERROR]: true };
    }
  };

  return (
    <Form
      key={data.ecommerce.id} // Provide a key to make sure a new form is mounted if the product changes
      decorators={[productSelectionDecorator]}
      initialValues={formDefaults}
      onSubmit={handleAddToCart}
    >
      {(props) => {
        const variant = findVariantBySku(
          data.ecommerce.variants,
          props.values.sku
        );

        // We shouldn't hit this error, as the user shouldn't be able
        // to make an invalid selection
        if (!variant) {
          throw new Error("Invalid variant selected");
        }

        return (
          <BundlePickerSelection
            {...props}
            bumpOfferResult={bumpOfferResult}
            cartOffer={cartOffer}
            data={data}
            skus={skus}
            trackingSource={trackingSource}
            variant={variant}
            widgetId={widgetId}
          />
        );
      }}
    </Form>
  );
};

export default BundlePicker;
