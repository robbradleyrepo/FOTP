import { Router } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { mocked } from "ts-jest/utils";

import { getAsPath } from "./helpers";

export const getMockedRouter = (pathname: string, params?: ParsedUrlQuery) => {
  const asPath = getAsPath(pathname, params);

  return mocked(({
    asPath,
    events: {
      off: jest.fn(),
      on: jest.fn(),
    },
    isReady: true,
    pathname,
    prefetch: jest.fn(async () => undefined),
    push: jest.fn(),
    query: params,
    replace: jest.fn(),
    route: pathname,
  } as unknown) as Router);
};
