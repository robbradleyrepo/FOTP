/* eslint-disable simple-import-sort/imports */

// Import for side effects (`configureXYZ(...)`)
import "../pages/_app";

import Sandbox from "@sss/apollo/testing";
import * as ecommerce from "@sss/ecommerce/testing";

import PageProviders from "./ui/providers";
import introspectionResultData from "../generated/config/fragment-types.json";
import { I18N } from "./config";

export const anonymous = new Sandbox({
  Wrapper: PageProviders,
  globalMocks: [
    ecommerce.mockedResponses.checkout.none,
    ecommerce.mockedResponses.collection.core,
  ],
  introspectionResultData,
  locale: I18N.fallbackLocale,
});

export default anonymous;
