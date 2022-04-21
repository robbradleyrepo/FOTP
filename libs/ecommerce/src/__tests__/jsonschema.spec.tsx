import { configureI18n, LocaleProvider } from "@sss/i18n";
import { render } from "@testing-library/react";
import { advanceTo } from "jest-date-mock";
import React from "react";

import { ProductSchema } from "../jsonschema";
import { mockedResponses } from "../testing";

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    customCheckout: false,
    origin: "https://example.com",
    subscriptions: false,
  },
}));

const locale = {
  countryCode: "US",
  label: "Looking for our US store?",
  langtag: "en-US",
  language: "en",
  region: "us",
  resource: {},
  timeZone: "America/Los_Angeles",
};

configureI18n({ fallbackLocale: locale, supportedLocales: [locale] });

describe("ProductSchema", () => {
  beforeEach(() => {
    advanceTo("2021-01-02");
  });

  it("should render a valid JSON", () => {
    const product = mockedResponses.product.productFragment;

    const root = render(
      <LocaleProvider locale={locale}>
        <ProductSchema product={product} />
      </LocaleProvider>
    );

    expect(root.asFragment()).toMatchSnapshot();
  });
});
