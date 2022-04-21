import { captureException } from "@sentry/nextjs";
import {
  Frequency,
  parseFloatMetafield,
  parseIntegerMetafield,
} from "@sss/ecommerce/common";
import {
  getProductCoreSubscriptionMetadata,
  Product,
  Variant,
} from "@sss/ecommerce/product";
import { ApolloError } from "apollo-client";

import { DogProfile, useDogProfile } from "../../dogs/profile";
import calorieCalculator from "../calorie-calculator";

export interface FoodPlanData {
  availableForSale: boolean;
  dailyCalories: number;
  dogProfile: DogProfile;
  frequency: Frequency & { orderIntervalUnit: "WEEK" };
  quantity: number;
  variant: Variant;
}

interface FoodPlanResult {
  data?: FoodPlanData;
  error?: ApolloError | Error;
  loading: boolean;
}

export const useFoodPlan = ({
  product,
  uuid,
}: {
  product: Product;
  uuid: string | null;
}): FoodPlanResult => {
  const { data, error, loading } = useDogProfile(uuid);

  // Parse our product data. If anything fails at this point we'll throw an
  // error, as we want to fail during the build step if possible
  const subscriptionMetadata = getProductCoreSubscriptionMetadata(product, {});

  if (!subscriptionMetadata.hasSubscription) {
    throw new Error(`Food product "${product.handle}" is not subscribable`);
  }

  if (subscriptionMetadata.unit !== "WEEK") {
    throw new Error(
      `Food product "${product.handle}" does not have a weekly subscription interval`
    );
  }

  const caloriesPerUnit = parseIntegerMetafield(product.caloriesPerUnit);

  if (typeof caloriesPerUnit !== "number") {
    throw new Error(
      `Missing "caloriesPerUnit" metafield data for product "${product.handle}"`
    );
  }

  // We only have the logic to make a recommendation for a single bag size
  if (product.variants.edges.length > 1) {
    throw new Error(
      `Unable to generate food plan: product "${product.handle}" contains multiple variants`
    );
  }

  const variant = product.variants.edges[0].node;

  const unitsPerVariant = parseFloatMetafield(variant.units);

  if (typeof unitsPerVariant !== "number") {
    throw new Error(
      `Missing "units" metafield data for variant "${variant.sku}"`
    );
  }

  const caloriesPerVariant = caloriesPerUnit * unitsPerVariant;

  // Handle any client-side data loading errors
  if (error) {
    return {
      error,
      loading,
    };
  }

  if (uuid && !data?.dogProfile && !loading) {
    return {
      error: error ?? new Error("Error loading dog profile data"),
      loading,
    };
  }

  // Generate the plan
  if (data?.dogProfile) {
    const DAYS_PER_WEEK = 7;
    const TARGET_INTERVAL_DAYS = DAYS_PER_WEEK * 4;

    const dailyCalories = calorieCalculator(data.dogProfile);
    const calorieTarget = dailyCalories * TARGET_INTERVAL_DAYS;

    const quantity = Math.ceil(calorieTarget / caloriesPerVariant);

    const actualCalories = quantity * caloriesPerVariant;
    const maxIntervalDays = Math.floor(actualCalories / dailyCalories);

    // Find the largest frequency that is smaller than the max interval
    const frequency = subscriptionMetadata.frequencies
      .map((frequency) => parseInt(frequency))
      .sort((a, b) => b - a)
      .find((frequency) => frequency * DAYS_PER_WEEK <= maxIntervalDays);

    if (!frequency) {
      const error = new Error("Unable to find suitable subscription frequency");

      captureException(error, {
        extra: {
          dogProfile: data.dogProfile,
          product,
        },
      });

      return {
        error,
        loading,
      };
    }

    return {
      data: {
        availableForSale:
          variant.availableForSale && variant.quantityAvailable >= quantity,
        dailyCalories,
        dogProfile: data.dogProfile,
        frequency: {
          chargeDelayDays: null,
          orderIntervalFrequency: frequency,
          orderIntervalUnit: subscriptionMetadata.unit,
        },
        quantity,
        variant,
      },
      loading,
    };
  }

  return {
    error,
    loading,
  };
};
