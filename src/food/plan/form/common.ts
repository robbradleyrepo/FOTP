import { FormApi, SubmissionErrors } from "final-form";
import { FC, useEffect, useRef } from "react";
import { FormRenderProps } from "react-final-form";
import store from "store/dist/store.modern";
import type { Promisable } from "type-fest";

import type { DogBreed } from "../../../dogs/breed";
import { DogProfile, useDogProfile } from "../../../dogs/profile";

const DATA_VERSION = 4;
const STORE_KEY = "food-plan:form";

const MAX_AGE_MONTHS = 480;

export type FoodPlanValidFormData = Omit<
  DogProfile,
  "breed" | "estimatedAgeMonths" | "id" | "uuid"
> & {
  ageWholeYears: number;
  ageRemainingMonths: number;
  breed: DogBreed | null;
  estimatedAgeMonths?: never;
  id?: never;
  version?: never;
  uuid?: string;
};

export type FoodPlanFormData = Partial<FoodPlanValidFormData>;

type PersistedFoodPlanFormData = Omit<FoodPlanFormData, "version"> & {
  lastUpdated: number;
  version: number;
};

export const ageDecorator = (form: FormApi<FoodPlanFormData>) =>
  form.subscribe(
    ({ active, touched, values }) => {
      let ageMonths = values.ageMonths;

      const visibleAgeFieldKeys = [
        "ageWholeYears",
        "ageRemainingMonths",
      ] as const;

      // We'll update the total age in months if the user is updating either
      // of the age fields and we have at least one valid value
      if (
        active &&
        (visibleAgeFieldKeys as readonly string[]).includes(active) &&
        (typeof values.ageWholeYears !== "undefined" ||
          typeof values.ageRemainingMonths !== "undefined")
      ) {
        // Avoid negative numbers
        const ageWholeYears = Math.max(0, values.ageWholeYears ?? 0);
        const ageRemainingMonths = Math.max(0, values.ageRemainingMonths ?? 0);

        ageMonths = ageWholeYears * 12 + ageRemainingMonths;
      }

      // Clamp our total age to a valid range
      ageMonths = ageMonths && Math.min(Math.max(0, ageMonths), MAX_AGE_MONTHS);

      // Make sure our field inputs match the calculated value - this will
      // make sure all stored and displayed values are valid
      const ageWholeYears =
        typeof ageMonths === "number" ? Math.floor(ageMonths / 12) : undefined;
      const ageRemainingMonths =
        typeof ageWholeYears === "number" && typeof ageMonths === "number"
          ? ageMonths - ageWholeYears * 12
          : undefined;

      if (ageMonths !== values.ageMonths) {
        form.change("ageMonths", ageMonths);
      }

      const updatedValues = {
        ageRemainingMonths,
        ageWholeYears,
      };

      const visibleAgeFieldActive = visibleAgeFieldKeys.some(
        (key) => active === key
      );
      const visibleAgeFieldTouched = visibleAgeFieldKeys.some(
        (key) => touched?.[key]
      );

      visibleAgeFieldKeys.forEach((key) => {
        const original = values[key];
        const updated = updatedValues[key];
        if (
          updated !== original &&
          !visibleAgeFieldActive && // Don't update while the fields are active, as this is jarring to the user
          !(
            // Don't replace `undefined` with `0` if either of the visible age
            // fields has been touched
            (
              typeof original === "undefined" &&
              updated === 0 &&
              visibleAgeFieldTouched
            )
          )
        ) {
          form.change(key, updated);
        }
      });
    },
    {
      active: true,
      touched: true,
      values: true,
    }
  );

export const clearFormData = () => store.remove(STORE_KEY);

export const saveFormData = (values: FoodPlanFormData) => {
  const persistedData: PersistedFoodPlanFormData = {
    activityLevel: values.activityLevel,
    ageMonths: values.ageMonths,
    breed: values.breed,
    condition: values.condition,
    lastUpdated: Date.now(),
    name: values.name,
    neutered: values.neutered,
    sex: values.sex,
    uuid: values.uuid,
    version: DATA_VERSION,
    weightLb: values.weightLb,
  };

  store.set(STORE_KEY, persistedData);
};

export enum FoodPlanFormStepHandle {
  NAME = "name",
  SEX = "sex",
  NEUTERED = "neutered",
  BREED = "breed",
  AGE = "age",
  WEIGHT = "weight",
  CONDITION = "condition",
  ACTIVITY = "activity",
}

type FoodPlanFormValidators = Record<
  FoodPlanFormStepHandle,
  (values: FoodPlanFormData) => boolean
>;

export const VALIDATORS: FoodPlanFormValidators = {
  [FoodPlanFormStepHandle.ACTIVITY]: ({ activityLevel }) => !!activityLevel,
  [FoodPlanFormStepHandle.AGE]: ({ ageMonths }) =>
    typeof ageMonths === "number" &&
    ageMonths >= 0 &&
    ageMonths <= MAX_AGE_MONTHS,
  [FoodPlanFormStepHandle.BREED]: ({ breed }) => typeof breed !== "undefined",
  [FoodPlanFormStepHandle.CONDITION]: ({ condition }) => !!condition,
  [FoodPlanFormStepHandle.NAME]: ({ name }) => !!name?.trim(),
  [FoodPlanFormStepHandle.NEUTERED]: ({ neutered }) =>
    typeof neutered === "boolean",
  [FoodPlanFormStepHandle.SEX]: () => true,
  [FoodPlanFormStepHandle.WEIGHT]: ({ weightLb }) =>
    typeof weightLb === "number" && weightLb >= 1 && weightLb <= 350,
};

export const FORM_STEPS = Object.values(FoodPlanFormStepHandle);

export const isFormValid = (
  values: FoodPlanFormData | FoodPlanValidFormData
): values is FoodPlanValidFormData =>
  !Object.values(VALIDATORS).some((validator) => !validator(values));

interface FoodPlanFormInitializerProps {
  form: FormApi<FoodPlanFormData>;
  onReady: () => void;
  uuid?: string;
}

export const FoodPlanFormInitializer: FC<FoodPlanFormInitializerProps> = ({
  form,
  onReady,
  uuid = null,
}) => {
  const hasInitializedRef = useRef(false);

  let persistedData = store.get(STORE_KEY) as PersistedFoodPlanFormData | null;

  const lastUpdated = persistedData?.lastUpdated ?? null;

  const isInvalidDogProfile = uuid
    ? persistedData?.uuid !== uuid
    : !!persistedData?.uuid;
  const isOldDataStructure =
    persistedData?.version && persistedData.version !== DATA_VERSION;
  const isStale =
    !lastUpdated || lastUpdated + 1000 * 60 * 60 * 24 * 7 < Date.now();

  if (isInvalidDogProfile || isOldDataStructure || isStale) {
    clearFormData();
    persistedData = null;
  }

  const queryResult = useDogProfile(persistedData ? null : uuid);

  useEffect(() => {
    if (!queryResult.loading && !hasInitializedRef.current) {
      let data: FoodPlanFormData | null = null;

      if (queryResult.data?.dogProfile) {
        data = {
          activityLevel: queryResult.data.dogProfile.activityLevel,
          ageMonths: queryResult.data.dogProfile.estimatedAgeMonths, // Make sure we use the estimated age to factor in the time passed since last update
          breed: queryResult.data.dogProfile.breed,
          condition: queryResult.data.dogProfile.condition,
          name: queryResult.data.dogProfile.name,
          neutered: queryResult.data.dogProfile.neutered,
          sex: queryResult.data.dogProfile.sex,
          uuid: queryResult.data.dogProfile.uuid,
          weightLb: queryResult.data.dogProfile.weightLb,
        };
      } else if (persistedData) {
        const {
          version, // eslint-disable-line @typescript-eslint/no-unused-vars
          ...formData
        } = persistedData;

        data = formData;
      } else if (!uuid) {
        data = {};
      }

      if (!data) {
        throw new Error("Missing dog profile data");
      }

      form.initialize(data);
      saveFormData(data);
      onReady();
      hasInitializedRef.current = true;
    }
  }, [form, onReady, persistedData, queryResult, uuid]);

  return null;
};

export interface FoodPlanFormCommonRenderProps
  extends FormRenderProps<FoodPlanFormData> {
  ready: boolean;
}

export type FoodPlanFormCommonSubmissionHandler<
  Extras extends unknown[] = never[]
> = (
  values: FoodPlanFormData,
  form: FormApi<FoodPlanFormData>,
  ...extras: Extras
) => Promisable<SubmissionErrors | undefined | void>;
