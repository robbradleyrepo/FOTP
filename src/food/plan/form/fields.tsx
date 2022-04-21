import { useLocale } from "@sss/i18n";
import React, { FC, MouseEventHandler, ReactNode } from "react";
import { Field as FinalField } from "react-final-form";
import { bodyTextSmall } from "src/ui/base/typography";

import {
  ComponentStyleProps,
  link,
  percentage,
  s,
  Style,
} from "@/common/ui/utils";

import type { DogBreed } from "../../../dogs/breed";
import DogBreedAutocomplete from "../../../dogs/breed/autocomplete";
import {
  DogProfileActivityLevel,
  DogProfileCondition,
  DogProfileSex,
} from "../../../dogs/profile";
import { Grid, Item } from "../../../ui/base/grid";
import Field, { FieldTransform } from "../../../ui/forms/field";
import RadioField from "../../../ui/forms/radio-field";
import { FoodPlanFormData, FoodPlanFormStepHandle } from "./common";

const i18nKey = "FoodPlanField";

const enUsResource = {
  [FoodPlanFormStepHandle.ACTIVITY]: {
    field: {
      [DogProfileActivityLevel.HIGH]: {
        hint: "1.5-2 hours per day",
        label: "Very active",
      },
      [DogProfileActivityLevel.LOW]: {
        hint: "Less than an hour per day",
        label: "Less active",
      },
      [DogProfileActivityLevel.NORMAL]: {
        hint: "1-1.5 hours per day",
        label: "Average",
      },
      [DogProfileActivityLevel.WORKING]: {
        hint: "More than 2 hours per day",
        label: "Working / sporting dog",
      },
    },
    value: `$t(${i18nKey}:${FoodPlanFormStepHandle.ACTIVITY}.field.{{ activityLevel }}.label)`,
  },
  [FoodPlanFormStepHandle.AGE]: {
    field: {
      ageRemainingMonths: {
        label: "Months",
        placeholder: "e.g. 9",
      },
      ageWholeYears: {
        label: "Years",
        placeholder: "e.g. 2",
      },
    },
    month_one: "{{ count }} month",
    month_other: "{{ count }} months",
    value: `$t(${i18nKey}:${FoodPlanFormStepHandle.AGE}.year, { "count": {{ ageWholeYears }} }) $t(${i18nKey}:${FoodPlanFormStepHandle.AGE}.month, { "count": {{ ageRemainingMonths }} })`,
    valueMonthsOnly: `$t(${i18nKey}:${FoodPlanFormStepHandle.AGE}.month, { "count": {{ ageRemainingMonths }} })`,
    year_one: "{{ count }} year",
    year_other: "{{ count }} years",
  },
  [FoodPlanFormStepHandle.BREED]: {
    fallback: "Not specified",
    field: {
      mixed: "Mixed breed",
      none: "I don’t know",
    },
    value: "{{ breed.name }}",
  },
  [FoodPlanFormStepHandle.CONDITION]: {
    field: {
      [DogProfileCondition.CHUNKY]: {
        hint: "Waistline is not visible and the ribs are hard to feel.",
        label: "Chunky",
      },
      [DogProfileCondition.IDEAL]: {
        hint:
          "Visible waistline with some fat cover but the ribs are easy to feel.",
        label: "Ideal",
      },
      [DogProfileCondition.OVERWEIGHT]: {
        hint: "Visible layer of fat over the ribs and pronounced stomach.",
        label: "Overweight",
      },
      [DogProfileCondition.UNDERWEIGHT]: {
        hint: "Narrow waistline and you can clearly see the ribs.",
        label: "Underweight",
      },
    },
    value: `$t(${i18nKey}:${FoodPlanFormStepHandle.CONDITION}.field.{{ condition }}.label)`,
  },
  [FoodPlanFormStepHandle.NAME]: {
    field: {
      placeholder: "e.g. Fergus",
    },
    value: "{{ name }}",
  },
  [FoodPlanFormStepHandle.NEUTERED]: {
    field: {
      false: {
        label: "No",
      },
      true: {
        label: "Yes",
      },
    },
    value: `$t(${i18nKey}:${FoodPlanFormStepHandle.NEUTERED}.field.{{ neutered }}.label)`,
  },
  [FoodPlanFormStepHandle.SEX]: {
    field: {
      [DogProfileSex.FEMALE]: {
        label: "Girl",
      },
      [DogProfileSex.MALE]: {
        label: "Boy",
      },
    },
    value: `$t(${i18nKey}:${FoodPlanFormStepHandle.SEX}.field.{{ sex }}.label)`,
  },
  [FoodPlanFormStepHandle.WEIGHT]: {
    field: {
      weightLb: {
        label: "lbs",
        placeholder: "e.g. 17",
      },
    },
    helper: {
      pound_one: "lb",
      pound_other: "lbs",
    },
    value: `{{ weightLb }} $t(${i18nKey}:${FoodPlanFormStepHandle.WEIGHT}.helper.pound, { "count": {{ weightLb }} })`,
  },
};

export const useFieldValueFormatter = (step: FoodPlanFormStepHandle) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (values: FoodPlanFormData) => {
    if (step === FoodPlanFormStepHandle.BREED && !values.breed) {
      return t(`${i18nKey}:${FoodPlanFormStepHandle.BREED}.fallback`);
    }

    if (step === FoodPlanFormStepHandle.AGE && !values.ageWholeYears) {
      return t(`${i18nKey}:${step}.valueMonthsOnly`, values);
    }

    return t(`${i18nKey}:${step}.value`, values);
  };
};

const hintStyle = s(bodyTextSmall, (t) => ({
  display: "block",
  marginTop: t.spacing.xs,
}));

const inputWithInlineLabelStyle = s({
  paddingRight: 96,
});

const inlineLabelStyle = s((t) => ({
  borderColor: "transparent",
  borderStyle: "solid",
  borderWidth: 1,
  fontFamily: null,
  fontSize: null,
  fontWeight: null,
  height: 54,
  letterSpacing: null,
  lineHeight: "20px",
  padding: t.spacing.sm,
  position: "absolute",
  right: 0,
  textTransform: "lowercase",
}));
const inlineLabelWrapperStyle = s({ display: "block", position: "relative" });

interface RadioStyleProps {
  disabled: boolean;
  selected: boolean;
}

export type RadioStyle = (props: RadioStyleProps) => Style;

const intFieldTransform: FieldTransform<number | undefined, string> = {
  format: (value) => value?.toString() ?? "",
  parse: (value) => {
    const result = parseInt(value);

    return isNaN(result) ? undefined : result;
  },
};

interface FoodPlanFieldCommonProps extends ComponentStyleProps {
  busy: boolean;
  label: ReactNode;
  labelCss?: ComponentStyleProps["_css"];
  values: FoodPlanFormData;
}

interface FoodPlanFieldRadioProps extends FoodPlanFieldCommonProps {
  fieldCss?: RadioStyle;
  inputCss?: RadioStyle;
}

export const FoodPlanFieldActivity: FC<FoodPlanFieldRadioProps> = ({
  _css = {},
  busy,
  fieldCss,
  inputCss,
  label,
  labelCss = {},
  values,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <fieldset css={s(_css)}>
      <legend css={s(labelCss)}>{label}</legend>
      <div>
        {[
          DogProfileActivityLevel.LOW,
          DogProfileActivityLevel.NORMAL,
          DogProfileActivityLevel.HIGH,
          DogProfileActivityLevel.WORKING,
        ].map((value) => {
          const radioProps = {
            disabled: busy,
            selected: values.activityLevel === value,
          };

          return (
            <RadioField
              key={value}
              _css={s(fieldCss?.(radioProps) ?? {})}
              inputCss={s(inputCss?.(radioProps) ?? {})}
              label={
                <>
                  {t(
                    `${i18nKey}:${FoodPlanFormStepHandle.ACTIVITY}.field.${value}.label`
                  )}
                  <span css={s(hintStyle)}>
                    {t(
                      `${i18nKey}:${FoodPlanFormStepHandle.ACTIVITY}.field.${value}.hint`
                    )}
                  </span>
                </>
              }
              name="activityLevel"
              value={value}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export const FoodPlanFieldAge: FC<FoodPlanFieldCommonProps> = ({
  _css = {},
  busy,
  label,
  labelCss = {},
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <fieldset css={s(_css)}>
      <legend css={s(labelCss)}>{label}</legend>
      <Grid gx={(t) => t.spacing.sm} itemWidth={percentage(1 / 2)}>
        {[
          { max: 40, name: "ageWholeYears" },
          { max: 11, name: "ageRemainingMonths" },
        ].map(({ max, name }) => (
          <Item key={name}>
            <Field<number | undefined>
              disabled={busy}
              inputCss={inputWithInlineLabelStyle}
              label={t(
                `${i18nKey}:${FoodPlanFormStepHandle.AGE}.field.${name}.label`
              )}
              labelCss={inlineLabelStyle}
              labelWrapperCss={inlineLabelWrapperStyle}
              max={max}
              min={0}
              name={name}
              placeholder={t(
                `${i18nKey}:${FoodPlanFormStepHandle.AGE}.field.${name}.placeholder`
              )}
              transform={intFieldTransform}
              type="number"
            />
          </Item>
        ))}
      </Grid>
    </fieldset>
  );
};

interface FoodPlanFieldBreedProps extends FoodPlanFieldCommonProps {
  dogBreeds: DogBreed[];
  onSkip?: MouseEventHandler<HTMLButtonElement>;
}

export const FoodPlanFieldBreed: FC<FoodPlanFieldBreedProps> = ({
  _css = {},
  dogBreeds,
  label,
  labelCss = {},
  onSkip,
  values,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <FinalField name="breed" type="text">
      {({ input }) => (
        <>
          <DogBreedAutocomplete
            {...input}
            _css={s((t) => ({ marginBottom: t.spacing.sm }), _css)}
            defaultBreeds={dogBreeds}
            // TODO: add `disabled` state
            id="food-plan-step-breed-autocomplete"
            label={label}
            labelCss={labelCss}
            onSelectedItemChange={({ selectedItem }) =>
              input.onChange(selectedItem ?? null)
            }
            selectedItem={values.breed ?? null}
          />
          <div
            css={s((t) => ({
              display: "flex",
              fontWeight: t.font.primary.weight.bold,
              justifyContent: "space-between",
            }))}
          >
            {["mixed", "none"].map((key) => (
              <button
                key={key}
                css={s(link)}
                onClick={(event) => {
                  input.onChange(null);
                  onSkip?.(event);
                }}
                type="submit"
              >
                {t(`${i18nKey}:${FoodPlanFormStepHandle.BREED}.field.${key}`)}
              </button>
            ))}
          </div>
        </>
      )}
    </FinalField>
  );
};

export const FoodPlanFieldCondition: FC<FoodPlanFieldRadioProps> = ({
  _css = {},
  busy,
  fieldCss,
  inputCss,
  label,
  labelCss = {},
  values,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <fieldset css={s(_css)}>
      <legend css={s(labelCss)}>{label}</legend>
      <div>
        {[
          DogProfileCondition.UNDERWEIGHT,
          DogProfileCondition.IDEAL,
          DogProfileCondition.CHUNKY,
          DogProfileCondition.OVERWEIGHT,
        ].map((value) => {
          const radioProps = {
            disabled: busy,
            selected: values.condition === value,
          };

          return (
            <RadioField
              key={value}
              _css={s(fieldCss?.(radioProps) ?? {})}
              inputCss={s(inputCss?.(radioProps) ?? {})}
              label={
                <>
                  {t(
                    `${i18nKey}:${FoodPlanFormStepHandle.CONDITION}.field.${value}.label`
                  )}
                  <span css={s(hintStyle)}>
                    {t(
                      `${i18nKey}:${FoodPlanFormStepHandle.CONDITION}.field.${value}.hint`
                    )}
                  </span>
                </>
              }
              name="condition"
              value={value}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export const FoodPlanFieldName: FC<FoodPlanFieldCommonProps> = ({
  _css = {},
  busy,
  label,
  labelCss = {},
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <Field
      _css={_css}
      disabled={busy}
      label={label}
      labelCss={labelCss}
      name="name"
      placeholder={t(
        `${i18nKey}:${FoodPlanFormStepHandle.NAME}.field.placeholder`
      )}
    />
  );
};

export const FoodPlanFieldNeutered: FC<FoodPlanFieldRadioProps> = ({
  _css = {},
  busy,
  fieldCss,
  inputCss,
  label,
  labelCss = {},
  values,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <fieldset css={s(_css)}>
      <legend css={s(labelCss)}>{label}</legend>
      <div>
        {[true, false].map((value) => {
          const radioProps = {
            disabled: busy,
            selected: values.neutered === value,
          };

          return (
            <RadioField<boolean | undefined, string>
              key={value.toString()}
              _css={s(fieldCss?.(radioProps) ?? {})}
              inputCss={s(inputCss?.(radioProps) ?? {})}
              label={t(
                `${i18nKey}:${FoodPlanFormStepHandle.NEUTERED}.field.${value}.label`
              )}
              name="neutered"
              transform={{
                format: (value) => value?.toString() || "",
                parse: (value) => (value ? value === "true" : undefined),
              }}
              value={value}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export const FoodPlanFieldSex: FC<FoodPlanFieldRadioProps> = ({
  _css = {},
  busy,
  fieldCss,
  inputCss,
  label,
  labelCss = {},
  values,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <fieldset css={s(_css)}>
      <legend css={s(labelCss)}>{label}</legend>
      <div>
        {[DogProfileSex.MALE, DogProfileSex.FEMALE].map((value) => {
          const radioProps = {
            disabled: busy,
            selected: values.sex === value,
          };

          return (
            <RadioField
              key={value}
              _css={s(fieldCss?.(radioProps) ?? {})}
              inputCss={s(inputCss?.(radioProps) ?? {})}
              label={t(
                `${i18nKey}:${FoodPlanFormStepHandle.SEX}.field.${value}.label`
              )}
              name="sex"
              value={value}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export const FoodPlanFieldWeight: FC<FoodPlanFieldCommonProps> = ({
  _css = {},
  busy,
  label,
  labelCss = {},
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", i18nKey, enUsResource);

  return (
    <fieldset css={s(_css)}>
      <legend css={s(labelCss)}>{label}</legend>
      <Field<number | undefined>
        disabled={busy}
        inputCss={inputWithInlineLabelStyle}
        label={t(
          `${i18nKey}:${FoodPlanFormStepHandle.WEIGHT}.field.weightLb.label`
        )}
        labelCss={inlineLabelStyle}
        labelWrapperCss={inlineLabelWrapperStyle}
        max={350}
        min={1}
        name="weightLb"
        placeholder={t(
          `${i18nKey}:${FoodPlanFormStepHandle.WEIGHT}.field.weightLb.placeholder`
        )}
        transform={intFieldTransform}
        type="number"
      />
    </fieldset>
  );
};

const foodPlanFields = {
  [FoodPlanFormStepHandle.ACTIVITY]: FoodPlanFieldActivity,
  [FoodPlanFormStepHandle.AGE]: FoodPlanFieldAge,
  [FoodPlanFormStepHandle.BREED]: FoodPlanFieldBreed,
  [FoodPlanFormStepHandle.CONDITION]: FoodPlanFieldCondition,
  [FoodPlanFormStepHandle.NAME]: FoodPlanFieldName,
  [FoodPlanFormStepHandle.NEUTERED]: FoodPlanFieldNeutered,
  [FoodPlanFormStepHandle.SEX]: FoodPlanFieldSex,
  [FoodPlanFormStepHandle.WEIGHT]: FoodPlanFieldWeight,
};

export default foodPlanFields;
