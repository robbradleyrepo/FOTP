import { CART_STATE_VERSION, StoredCartState } from "@sss/ecommerce/cart";
import * as ecommerce from "@sss/ecommerce/testing";
import { act, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import store from "store/dist/store.modern";

import { anonymous } from "../../../../sandbox";
import { MenuDrawer } from "../../../nav/menu";
import CartDrawer from "../drawer";
import CartToggle from "../toggle";

describe("<CartDrawer />", () => {
  // Populate localStorage in tests instead of mocking it, since
  // current JSDOM supports it, and mocking it is trickier, see:
  // - https://github.com/facebook/jest/issues/6798,
  // - https://github.com/facebook/jest/issues/6858,
  // - https://github.com/jsdom/jsdom/issues/2318)

  const SAMPLE_EMPTY_CART: StoredCartState = {
    checkoutId: null,
    customAttributes: {},
    discountCode: null,
    id: "edf7b4b0-12bc-4f5d-8b6b-6a04cb3ec234",
    lineItems: [],
    rCheckoutId: null,
    version: CART_STATE_VERSION,
  };

  const SAMPLE_CART = {
    ...SAMPLE_EMPTY_CART,
    discountCode: "SAVE",
    lineItems: [
      {
        frequency: null,
        id: "foo",
        imageUrl: "https://cdn.shopify.com/fake/product/image.jpg",
        productId: "foo",
        quantity: 1,
        subscriptionUnitPrice: {
          amount: "5.0",
          currencyCode: "USD",
        },
        subtitle: "Default Title",
        title: "Test Product",
        unitPrice: {
          amount: "5.0",
          currencyCode: "USD",
        },
        variantId: "variant123",
      },
    ],
  };

  afterEach(() => {
    store.clearAll();
  });

  it("should decrement the cart quantity if the user clicks on the `Decrease` button", async () => {
    store.set("cart", SAMPLE_CART);

    const { component } = await anonymous.component({
      Component: (
        <>
          <CartToggle />
          <CartDrawer />
        </>
      ),
      globalMocks: [
        ecommerce.mockedResponses.checkout.one,
        ecommerce.mockedResponses.collection.core,
      ],
      mocks: [ecommerce.mockedResponses.cart.variantInfo],
    });

    const cartToggle = component.getByText("Cart");

    fireEvent.click(cartToggle);

    const decrease = await component.findByText("Decrease quantity");

    if (!decrease) {
      throw new Error("Missing UI control");
    }

    await waitFor(() => expect(decrease).not.toBeDisabled());

    act(() => {
      fireEvent.click(decrease);
    });

    await waitFor(() => component.getByText("Your cart is empty"));
  });

  it("should increment the cart quantity if the user clicks on the `Increase` button", async () => {
    store.set("cart", SAMPLE_CART);

    const { component } = await anonymous.component({
      Component: (
        <>
          <CartToggle />
          <CartDrawer />
        </>
      ),
      globalMocks: [
        ecommerce.mockedResponses.checkout.one,
        ecommerce.mockedResponses.collection.core,
      ],
      mocks: [ecommerce.mockedResponses.cart.variantInfo],
    });

    const cartToggle = component.getByText("Cart");

    fireEvent.click(cartToggle);

    const increase = await component.findByText("Increase quantity");

    if (!increase) {
      throw new Error("Missing UI control");
    }

    await waitFor(() => expect(increase).not.toBeDisabled());

    act(() => {
      fireEvent.click(increase);
    });

    await expect(component.findByText("Cart (2)")).resolves.toBeTruthy();
  });

  it("should remove the item from the cart if the user clicks on the `Remove` button", async () => {
    store.set("cart", SAMPLE_CART);

    const { component } = await anonymous.component({
      Component: (
        <>
          <CartToggle />
          <CartDrawer />
        </>
      ),
      globalMocks: [
        ecommerce.mockedResponses.checkout.one,
        ecommerce.mockedResponses.collection.core,
      ],
      mocks: [ecommerce.mockedResponses.cart.variantInfo],
    });

    const cartToggle = component.getByText("Cart");

    fireEvent.click(cartToggle);

    const remove = await component.findByText("Remove item");

    if (!remove) {
      throw new Error("Missing UI control");
    }

    await waitFor(() => expect(remove).not.toBeDisabled());

    act(() => {
      fireEvent.click(remove);
    });

    await expect(
      component.findByText("Your cart is empty")
    ).resolves.toBeTruthy();
  });

  it("should link to the ReCharge checkout if there are items in the cart", async () => {
    store.set("cart", SAMPLE_CART);

    const { component } = await anonymous.component({
      Component: (
        <>
          <CartToggle />
          <CartDrawer />
        </>
      ),
      globalMocks: [
        ecommerce.mockedResponses.checkout.one,
        ecommerce.mockedResponses.collection.core,
      ],
      mocks: [ecommerce.mockedResponses.cart.variantInfo],
    });

    const cartToggle = component.getByText("Cart");

    fireEvent.click(cartToggle);

    await waitFor(() => component.getByText("Checkout"));
  });

  it("should render a button that links to the product listing page if the cart is empty", async () => {
    store.set("cart", SAMPLE_EMPTY_CART);

    const { component } = await anonymous.component({
      Component: (
        <>
          <CartToggle />
          <CartDrawer />
          <MenuDrawer />
        </>
      ),
    });

    const cartToggle = component.getByText("Cart");

    fireEvent.click(cartToggle);

    const link = await component.findByText("Shop Now");

    expect(link).toHaveAttribute("href", "/products");
  });
});
