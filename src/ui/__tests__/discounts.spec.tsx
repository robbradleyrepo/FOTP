import { captureException } from "@sentry/nextjs";
import { CART_STATE_VERSION } from "@sss/ecommerce/cart";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import store from "store/dist/store.modern";
import { mocked } from "ts-jest/utils";

import { anonymous } from "../../sandbox";
import { ToastRack } from "../base/toast";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

// `DiscountListener` is mounted as part of the sandbox, so we'll mock the
// module everywhere but our `anonymous.component` call
jest.mock("../discounts", () => ({
  DiscountListener: () => null,
}));

const mockedCaptureException = mocked(captureException);

const mount = (params: ParsedUrlQuery = {}) => {
  const { DiscountListener } = jest.requireActual("../discounts");

  return anonymous.component({
    Component: (
      <>
        <DiscountListener />
        <ToastRack />
      </>
    ),
    params,
  });
};

describe("<DiscountListener />", () => {
  const DEFAULT_DISCOUNT_CODE = process.env.DEFAULT_DISCOUNT_CODE;
  const DISABLED_DISCOUNT_CODES = process.env.DISABLED_DISCOUNT_CODES;

  beforeEach(() => {
    process.env.DEFAULT_DISCOUNT_CODE = "DEFAULT";
  });

  afterEach(() => {
    process.env.DISABLED_DISCOUNT_CODES = DISABLED_DISCOUNT_CODES;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.DEFAULT_DISCOUNT_CODE = DEFAULT_DISCOUNT_CODE;
  });

  it("should automatically apply the default discount code", async () => {
    const { component } = await mount();

    expect(store.get("cart")).toMatchObject({ discountCode: "DEFAULT" });
    expect(
      component.getByText("DEFAULT has been automatically applied to your cart")
    ).toBeInTheDocument();
  });

  it("should automatically apply the discount code provided with the `aic` query param", async () => {
    const { component } = await mount({ aic: "TEST1" });

    expect(store.get("cart")).toMatchObject({ discountCode: "FRIEND-TEST1" });
    expect(
      component.getByText(
        "FRIEND-TEST1 has been automatically applied to your cart"
      )
    ).toBeInTheDocument();
  });

  it("should automatically apply the discount code provided with the `d` query param", async () => {
    const { component } = await mount({ d: "TEST2" });

    expect(store.get("cart")).toMatchObject({ discountCode: "TEST2" });
    expect(
      component.getByText("TEST2 has been automatically applied to your cart")
    ).toBeInTheDocument();
  });

  it("should automatically apply the discount code provided with the `discount` query param", async () => {
    const { component } = await mount({ discount: "TEST3" });

    expect(store.get("cart")).toMatchObject({ discountCode: "TEST3" });
    expect(
      component.getByText("TEST3 has been automatically applied to your cart")
    ).toBeInTheDocument();
  });

  it("should automatically remove any disabled codes", async () => {
    const disabledCodes = ["TEST1", "TEST2", "TEST3"];
    process.env.DISABLED_DISCOUNT_CODES = disabledCodes.join(",");

    for (const discountCode of disabledCodes) {
      store.set("cart", {
        checkoutId: null,
        customAttributes: {},
        discountCode,
        id: "da47f20d-9da2-472d-b922-e8e4eac54468",
        lineItems: [],
        rCheckoutId: null,
        version: CART_STATE_VERSION,
      });

      await mount();

      expect(store.get("cart")).toMatchObject({
        discountCode: process.env.DEFAULT_DISCOUNT_CODE,
      });
    }
  });

  it("should not automatically apply the default discount code if it is disabled", async () => {
    process.env.DISABLED_DISCOUNT_CODES = "DEFAULT";

    const { component } = await mount();

    expect(store.get("cart")).toMatchObject({
      discountCode: null,
    });
    expect(
      component.queryByText(
        "DEFAULT has been automatically applied to your cart"
      )
    ).toBeNull();
    expect(mockedCaptureException.mock.calls).toMatchSnapshot();
  });

  it("should not automatically apply the provided discount code if it is disabled", async () => {
    process.env.DISABLED_DISCOUNT_CODES = "FRIEND-TEST1, TEST2, TEST3";

    const testOne = await mount({ aic: "TEST1" });

    expect(store.get("cart")).toMatchObject({
      discountCode: process.env.DEFAULT_DISCOUNT_CODE,
    });
    expect(
      testOne.component.queryByText(
        "FRIEND-TEST1 has been automatically applied to your cart"
      )
    ).toBeNull();

    const testTwo = await mount({ d: "TEST2" });

    expect(store.get("cart")).toMatchObject({
      discountCode: process.env.DEFAULT_DISCOUNT_CODE,
    });
    expect(
      testTwo.component.queryByText(
        "TEST2 has been automatically applied to your cart"
      )
    ).toBeNull();

    const testThree = await mount({ discount: "TEST3" });

    expect(store.get("cart")).toMatchObject({
      discountCode: process.env.DEFAULT_DISCOUNT_CODE,
    });
    expect(
      testThree.component.queryByText(
        "TEST3 has been automatically applied to your cart"
      )
    ).toBeNull();
  });

  it("should apply the first active discount code if multiple query params are provided", async () => {
    const params = {
      aic: "TEST1",
      d: "TEST2",
      discount: "TEST3",
    };

    const testOne = await mount(params);

    expect(store.get("cart")).toMatchObject({ discountCode: "FRIEND-TEST1" });
    expect(
      testOne.component.getByText(
        "FRIEND-TEST1 has been automatically applied to your cart"
      )
    ).toBeInTheDocument();

    process.env.DISABLED_DISCOUNT_CODES = "FRIEND-TEST1";

    const testTwo = await mount(params);

    expect(store.get("cart")).toMatchObject({ discountCode: "TEST2" });
    expect(
      testTwo.component.getByText(
        "TEST2 has been automatically applied to your cart"
      )
    ).toBeInTheDocument();
  });

  it("should only notify the user if the applied code is different that in the cart", async () => {
    const cart = store.get("cart");
    store.set("cart", { ...cart, discountCode: "TEST" });

    const { component } = await mount({ discount: "TEST" });

    expect(store.get("cart")).toMatchObject({ discountCode: "TEST" });
    expect(
      component.queryByText("TEST has been automatically applied to your cart")
    ).toBeNull();
  });
});
