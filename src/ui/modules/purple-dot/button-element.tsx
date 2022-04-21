import {
  Address,
  ButtonElement as PurpleDotButtonElement,
  ButtonElementProps as PurpleDotButtonElementProps,
  Money,
  PreorderCheckoutStepCallback,
  PreorderCreatedCallback,
  PurpleDot,
} from "@purple-dot/purple-dot-react";
import {
  CheckoutStepEvent,
  dataLayerTrack,
  PrePurchaseEvent,
} from "@sss/analytics";
import { useCustomer } from "@sss/customer";
import {
  mapProductVariantToDataLayer,
  trackAddToCartEvent,
} from "@sss/ecommerce/analytics";
import { getLegacyId, moneyFns } from "@sss/ecommerce/common";
import { getVariantPrices, Product, Variant } from "@sss/ecommerce/product";
import React, { FC } from "react";

import { useTheme } from "@/common/ui/utils";

const mapPresaleToCheckoutStep = ({
  event,
  product,
  step,
  variant,
}: {
  event: CheckoutStepEvent["event"];
  product: Product;
  step: CheckoutStepEvent["ecommerce"]["checkout"]["actionField"]["step"];
  variant: Variant;
}): CheckoutStepEvent => ({
  cart_total: variant.priceV2.amount,
  ecommerce: {
    checkout: {
      actionField: {
        step,
      },
      products: [mapProductVariantToDataLayer(product, variant)],
    },
    currencyCode: "USD",
  },
  event,
  is_preorder: true,
  purchase_type: "one time",
});

const trackPresaleAddToCartEvent = (
  product: Product,
  variant: Variant,
  source: string
) => trackAddToCartEvent(product, variant, source, 1, null);

const trackBeginPresaleCheckoutEvent = (product: Product, variant: Variant) =>
  dataLayerTrack<CheckoutStepEvent>(
    mapPresaleToCheckoutStep({
      event: "dl_begin_checkout",
      product,
      step: "1",
      variant,
    })
  );

const trackAddPresaleShippingInfoEvent = (product: Product, variant: Variant) =>
  dataLayerTrack<CheckoutStepEvent>(
    mapPresaleToCheckoutStep({
      event: "dl_add_shipping_info",
      product,
      step: "2",
      variant,
    })
  );

const trackAddPresalePaymentInfoEvent = (product: Product, variant: Variant) =>
  dataLayerTrack<CheckoutStepEvent>(
    mapPresaleToCheckoutStep({
      event: "dl_add_payment_info",
      product,
      step: "3",
      variant,
    })
  );

const trackPresalePurchaseEvent = ({
  customerId,
  email,
  product,
  reference,
  shippingAddress,
  total,
  variant,
}: {
  customerId?: string;
  email: string;
  product: Product;
  reference: string;
  shippingAddress: Address;
  total: Money;
  variant: Variant;
}) => {
  const { currentDiscount, currentPrice } = getVariantPrices(variant, false);

  const shipping = 0; // Assume we'll always have free shipping on pre-orders
  const subtotal = moneyFns.toFloat(currentPrice); // Assume we'll always have a single line item
  const tax = total.amount - (subtotal + shipping);

  return dataLayerTrack<PrePurchaseEvent>({
    ecommerce: {
      currencyCode: "USD",
      purchase: {
        actionField: {
          affiliation: "Purple Dot",
          discount_amount: currentDiscount?.price.amount ?? "0",
          id: `PD${reference}`,
          order_name: `#PD${reference}`,
          revenue: total.amount.toFixed(2),
          shipping: shipping.toFixed(2),
          sub_total: subtotal.toFixed(2),
          tax: tax.toFixed(2),
        },
        products: [
          {
            brand: product.vendor ?? "",
            category: product.productType ?? "",
            id: variant.sku,
            image: variant.image.url,
            name: product.title,
            position: 0,
            price: variant.priceV2.amount,
            product_id: getLegacyId(product.id),
            purchase_type: "one time",
            quantity: 1,
            variant: variant.title?.replace?.("'", "") ?? "",
            variant_id: variant.id,
          },
        ],
      },
    },
    event: "dl_pre_purchase",
    purchase_type: "one time",
    user_properties: {
      ...(customerId
        ? {
            customer_id: customerId,
            customer_tags: "",
            visitor_type: "logged_in",
          }
        : { visitor_type: "guest" }),
      customer_city: shippingAddress.city,
      customer_country_code: shippingAddress.country,
      customer_email: email,
      customer_first_name: shippingAddress.firstName,
      customer_last_name: shippingAddress.lastName,
      customer_phone: shippingAddress.phoneNumber ?? "",
      customer_province_code: shippingAddress.province ?? "",
      customer_zip: shippingAddress.postalCode,
      user_consent: "yes",
    },
  });
};

type ButtonElementProps = Partial<
  Pick<PurpleDotButtonElementProps, "disabledStyle" | "hoverStyle" | "style">
> & {
  product: Product;
  source?: string;
  variant: Variant;
};

const ButtonElement: FC<ButtonElementProps> = ({
  disabledStyle,
  hoverStyle,
  product,
  source = "pre-order",
  style,
  variant,
}) => {
  const { customer } = useCustomer();
  const theme = useTheme();

  const handlePreorderCheckoutStep: PreorderCheckoutStepCallback = ({
    stepNumber,
  }) => {
    switch (stepNumber) {
      case 0:
        trackPresaleAddToCartEvent(product, variant, source);
        break;
      case 1:
        trackBeginPresaleCheckoutEvent(product, variant);
        trackAddPresaleShippingInfoEvent(product, variant);
        break;
      case 3:
        trackAddPresalePaymentInfoEvent(product, variant);
        break;
    }
  };
  const handlePreorderCreated: PreorderCreatedCallback = ({
    email,
    reference,
    shippingAddress,
    total,
  }) =>
    trackPresalePurchaseEvent({
      customerId: customer?.id.toString(),
      email,
      product,
      reference,
      shippingAddress,
      total,
      variant,
    });

  return (
    <PurpleDot apiKey={process.env.PURPLE_DOT_API_KEY}>
      <PurpleDotButtonElement
        customerData={{
          address: {
            firstName: customer?.firstName,
            lastName: customer?.lastName,
            phoneNumber: customer?.phone ?? undefined,
          },
          email: customer?.email,
        }}
        disabledStyle={{ ...disabledStyle }}
        hoverStyle={{
          backgroundColor: theme.color.background.light,
          ...hoverStyle,
        }}
        onPreorderCheckoutStep={handlePreorderCheckoutStep}
        onPreorderCreated={handlePreorderCreated}
        productId={getLegacyId(product.id)}
        sku={variant.sku}
        style={{
          backgroundColor: theme.color.background.dark,
          fontSize: "14px",
          height: 60,
          ...style,
        }}
      />
    </PurpleDot>
  );
};

export default ButtonElement;
