import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { mockedResponses } from "@sss/ecommerce/testing";
import { renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";

import { DOG_PROFILE } from "../../../dogs/profile";
import { useFoodPlan } from "../";

const breed = {
  handle: "fourche-terrier",
  id: "Z2lkOi8vZm90cC9Eb2dCcmVlZC82OTI=",
  name: "Fourche Terrier",
  popularity: null,
};

const makeWrapper = (mocks: MockedResponse[]): FC =>
  function Wrapper({ children }) {
    return (
      // Disable cache in order to silence deprecation warnings (see
      // https://github.com/apollographql/react-apollo/issues/1747#issuecomment-603444537)
      <MockedProvider
        addTypename={false}
        defaultOptions={{
          query: { fetchPolicy: "no-cache" },
          watchQuery: { fetchPolicy: "no-cache" },
        }}
        mocks={mocks}
      >
        <>{children}</>
      </MockedProvider>
    );
  };

describe("useFoodPlan", () => {
  it.only("should return a valid recommendation for dogs with extremely low calorie requirements", async () => {
    const mock = {
      request: {
        query: DOG_PROFILE,
        variables: { uuid: "xs" },
      },
      result: {
        data: {
          dogProfile: {
            activityLevel: "LOW",
            ageMonths: 36,
            breed,
            condition: "OVERWEIGHT",
            id: "dog-profile-xs",
            name: "Lil Tubs",
            neutered: true,
            uuid: "xs",
            weightLb: 4,
          },
        },
      },
    };

    const { result, waitFor } = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: mock.request.variables.uuid,
        }),
      { wrapper: makeWrapper([mock]) }
    );

    await waitFor(() => !result.current.loading);

    expect(result.current.data).toMatchObject({
      frequency: {
        chargeDelayDays: null,
        orderIntervalFrequency: 6,
        orderIntervalUnit: "WEEK",
      },
      quantity: 1,
    });
  });

  it("should return a valid recommendation for dogs with low calorie requirements", async () => {
    const mock = {
      request: {
        query: DOG_PROFILE,
        variables: { uuid: "sm" },
      },
      result: {
        data: {
          dogProfile: {
            activityLevel: "NORMAL",
            ageMonths: 36,
            breed,
            condition: "IDEAL",
            id: "dog-profile-sm",
            name: "Princess",
            neutered: true,
            uuid: "sm",
            weightLb: 10,
          },
        },
      },
    };

    const { result, waitFor } = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: mock.request.variables.uuid,
        }),
      { wrapper: makeWrapper([mock]) }
    );

    await waitFor(() => !result.current.loading);

    expect(result.current.data).toMatchObject({
      frequency: {
        chargeDelayDays: null,
        orderIntervalFrequency: 4,
        orderIntervalUnit: "WEEK",
      },
      quantity: 2,
    });
  });

  it("should return a valid recommendation for dogs with medium calorie requirements", async () => {
    const mock = {
      request: {
        query: DOG_PROFILE,
        variables: { uuid: "md" },
      },
      result: {
        data: {
          dogProfile: {
            activityLevel: "NORMAL",
            ageMonths: 36,
            breed,
            condition: "IDEAL",
            id: "dog-profile-md",
            name: "Fido",
            neutered: false,
            uuid: "md",
            weightLb: 20,
          },
        },
      },
    };

    const { result, waitFor } = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: mock.request.variables.uuid,
        }),
      { wrapper: makeWrapper([mock]) }
    );

    await waitFor(() => !result.current.loading);

    expect(result.current.data).toMatchObject({
      frequency: {
        chargeDelayDays: null,
        orderIntervalFrequency: 4,
        orderIntervalUnit: "WEEK",
      },
      quantity: 3,
    });
  });

  it("should return a valid recommendation for dogs with high calorie requirements", async () => {
    const mock = {
      request: {
        query: DOG_PROFILE,
        variables: { uuid: "lg" },
      },
      result: {
        data: {
          dogProfile: {
            activityLevel: "ACTIVE",
            ageMonths: 36,
            breed,
            condition: "IDEAL",
            id: "dog-profile-lg",
            name: "Rex",
            neutered: false,
            uuid: "high",
            weightLb: 50,
          },
        },
      },
    };

    const { result, waitFor } = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: mock.request.variables.uuid,
        }),
      { wrapper: makeWrapper([mock]) }
    );

    await waitFor(() => !result.current.loading);

    expect(result.current.data).toMatchObject({
      frequency: {
        chargeDelayDays: null,
        orderIntervalFrequency: 4,
        orderIntervalUnit: "WEEK",
      },
      quantity: 6,
    });
  });

  it("should return a valid recommendation for dogs with extremely high calorie requirements", async () => {
    const mock = {
      request: {
        query: DOG_PROFILE,
        variables: { uuid: "xl" },
      },
      result: {
        data: {
          dogProfile: {
            activityLevel: "WORKING",
            ageMonths: 10,
            breed,
            condition: "UNDERWEIGHT",
            id: "dog-profile-xl",
            name: "Gigantor",
            neutered: false,
            uuid: "xl",
            weightLb: 100,
          },
        },
      },
    };

    const { result, waitFor } = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: mock.request.variables.uuid,
        }),
      { wrapper: makeWrapper([mock]) }
    );

    await waitFor(() => !result.current.loading);

    expect(result.current.data).toMatchObject({
      frequency: {
        chargeDelayDays: null,
        orderIntervalFrequency: 4,
        orderIntervalUnit: "WEEK",
      },
      quantity: 17,
    });
  });

  it("should return an error if the requested dog profile cannot be loaded", async () => {
    // The query returns an error
    const queryError = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: "query-error",
        }),
      { wrapper: makeWrapper([]) }
    );

    await queryError.waitFor(() => !queryError.result.current.loading);

    expect(queryError.result.current).toMatchObject({
      error: expect.any(Error),
      loading: false,
    });

    // There is no profile for the provided UUID
    const mock = {
      request: {
        query: DOG_PROFILE,
        variables: { uuid: "no-record" },
      },
      result: {
        data: {
          dogProfile: null,
        },
      },
    };

    const noRecord = renderHook(
      () =>
        useFoodPlan({
          product: mockedResponses.product.productFood,
          uuid: mock.request.variables.uuid,
        }),
      {
        wrapper: makeWrapper([mock]),
      }
    );

    await noRecord.waitFor(() => !noRecord.result.current.loading);

    expect(noRecord.result.current).toMatchObject({
      error: expect.objectContaining({
        message: "Error loading dog profile data",
      }),
      loading: false,
    });
  });
});
