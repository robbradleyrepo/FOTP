import { useLocale } from "@sss/i18n";
import { Config, FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { rgba } from "polished";
import React, { FC, ReactNode, useCallback, useState } from "react";
import { Form, FormSpy } from "react-final-form";

import { ComponentStyleProps, link, s } from "@/common/ui/utils";

import type { DogBreed } from "../../../dogs/breed";
import { primaryButton } from "../../../ui/base/button";
import {
  callToActionText,
  headingDeltaStatic,
} from "../../../ui/base/typography";
import {
  ageDecorator,
  FoodPlanFormCommonRenderProps,
  FoodPlanFormCommonSubmissionHandler,
  FoodPlanFormData,
  FoodPlanFormInitializer,
  FoodPlanFormStepHandle,
  FORM_STEPS,
  isFormValid,
  saveFormData,
  VALIDATORS,
} from "./common";
import foodPlanFields, { useFieldValueFormatter } from "./fields";

const labelStyle = s(callToActionText, (t) => ({
  display: "block",
  fontSize: 12,
  marginBottom: t.spacing.sm,
}));

interface RadioStyleProps {
  disabled: boolean;
  selected: boolean;
}

const radioInputStyle = ({ selected }: RadioStyleProps) =>
  s((t) => ({
    "&:after": {
      backgroundColor: selected ? t.color.border.selected : "transparent",
    },
    top: 0,
  }));

const radioFieldStyle = ({ disabled }: RadioStyleProps) =>
  s(headingDeltaStatic, (t) => ({
    "&:first-child": {
      marginTop: 0,
    },
    alignItems: "center",
    color: disabled
      ? rgba(t.color.text.dark.base, 0.6)
      : t.color.text.dark.base,
    marginTop: t.spacing.sm,
    transition: "background-color 300ms, border-color 500ms",
  }));

interface FoodPlanFormEditContentWrapperProps extends ComponentStyleProps {
  busy: boolean;
  dogBreeds: DogBreed[];
  step: FoodPlanFormStepHandle;
  values: FoodPlanFormData;
}

const FoodPlanFormEditContentWrapper: FC<FoodPlanFormEditContentWrapperProps> = ({
  _css = {},
  busy,
  dogBreeds,
  step,
  values,
}) => {
  const formatValue = useFieldValueFormatter(step);
  const { i18n, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  i18n.addResourceBundle("en-US", "FoodPlanFormEditContentWrapper", {
    done: "Done",
    edit: "Edit",
    step: {
      [FoodPlanFormStepHandle.ACTIVITY]: {
        label: "Activity level",
      },
      [FoodPlanFormStepHandle.AGE]: {
        label: "Age",
      },
      [FoodPlanFormStepHandle.BREED]: {
        label: "Breed",
      },
      [FoodPlanFormStepHandle.CONDITION]: {
        label: "Body condition",
      },
      [FoodPlanFormStepHandle.NAME]: {
        label: "Name",
      },
      [FoodPlanFormStepHandle.NEUTERED]: {
        label: "Neutered",
      },
      [FoodPlanFormStepHandle.SEX]: {
        label: "Sex",
      },
      [FoodPlanFormStepHandle.WEIGHT]: {
        label: "Weight",
      },
    },
  });

  const Field = foodPlanFields[step];
  const label = t(`FoodPlanFormEditContentWrapper:step.${step}.label`);
  const valid = VALIDATORS[step](values);

  const disabled = busy || !valid;

  return (
    <div
      css={s(
        (t) => ({
          background: t.color.background.base,
          borderRadius: t.radius.sm,
          padding: [t.spacing.sm, null, t.spacing.md],
        }),
        _css
      )}
    >
      {isOpen ? (
        <div css={s((t) => ({ paddingBottom: t.spacing.xs }))}>
          <Field
            busy={busy}
            dogBreeds={dogBreeds}
            fieldCss={radioFieldStyle}
            inputCss={radioInputStyle}
            label={label}
            labelCss={s(labelStyle, (t) => ({ marginBottom: t.spacing.md }))}
            onSkip={(event) => {
              event.preventDefault();
              setIsOpen(false);
            }}
            values={values}
          />
          <button
            css={s(primaryButton({ disabled }), (t) => ({
              marginTop: t.spacing.md,
              width: "100%",
            }))}
            disabled={disabled}
            onClick={() => setIsOpen(false)}
            type="button"
          >
            {t("FoodPlanFormEditContentWrapper:done")}
          </button>
        </div>
      ) : (
        <dl>
          <dt css={s(labelStyle)}>{label}</dt>
          <dd
            css={s({
              alignContent: "baseline",
              display: "flex",
              justifyContent: "space-between",
            })}
          >
            {formatValue(values)}
            <button
              css={s(link, (t) => ({
                fontFamily: t.font.secondary.family,
                fontWeight: t.font.secondary.weight.bold,
              }))}
              disabled={disabled}
              onClick={() => setIsOpen(true)}
              type="button"
            >
              {t("FoodPlanFormEditContentWrapper:edit")}
            </button>
          </dd>
        </dl>
      )}
    </div>
  );
};

type FoodPlanFormEditContentProps = Omit<
  FoodPlanFormEditContentWrapperProps,
  "step"
> & {
  valid: boolean;
};

export const FoodPlanFormEditContent: FC<FoodPlanFormEditContentProps> = ({
  _css = {},
  busy,
  dogBreeds,
  values,
  valid,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "FoodPlanFormEditContent", {
    confirm: "Confirm",
  });

  const disabled = busy || !valid;

  return (
    <div css={s(_css)}>
      {Object.values(FORM_STEPS).map((step, index) => {
        return (
          <FoodPlanFormEditContentWrapper
            _css={s((t) => ({
              marginTop:
                index !== 0 ? [t.spacing.xs, null, t.spacing.sm] : null,
            }))}
            key={step}
            busy={busy}
            dogBreeds={dogBreeds}
            step={step}
            values={values}
          />
        );
      })}
      <button
        css={s(primaryButton({ disabled }), (t) => ({
          marginTop: t.spacing.lg,
          width: "100%",
        }))}
        disabled={disabled}
        type="submit"
      >
        {t("FoodPlanFormEditContent:confirm")}
      </button>
    </div>
  );
};

export interface FoodPlanFormEditRenderProps
  extends FoodPlanFormCommonRenderProps {
  valid: boolean;
}

interface FoodPlanFormEditProps extends ComponentStyleProps {
  children: (props: FoodPlanFormEditRenderProps) => ReactNode;
  onSubmit: FoodPlanFormCommonSubmissionHandler<[{ uuid: string }]>;
}

export const FoodPlanFormEdit = ({
  _css = {},
  children,
  onSubmit,
}: FoodPlanFormEditProps) => {
  const { i18n, t } = useLocale();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  i18n.addResourceBundle("en-US", "FoodPlanFormEdit", {
    validation: {
      error: "Please complete the required fields and try again.",
    },
  });

  let uuid: string | null = null;

  if (router.isReady) {
    if (typeof router.query.dog_profile !== "string") {
      throw new Error("Missing or invalid `dog_profile` query string param");
    }

    uuid = router.query.dog_profile;
  }

  const handleSubmit: Config<FoodPlanFormData>["onSubmit"] = useCallback(
    (values, form) => {
      if (!ready || !uuid) {
        throw new Error("FoodPlanFormEdit requires a UUID");
      }

      onSubmit(values, form, { uuid });
    },

    [onSubmit, ready, uuid]
  );

  return (
    <Form<FoodPlanFormData>
      decorators={[ageDecorator]}
      onSubmit={handleSubmit}
      validate={(values) => {
        if (!isFormValid(values)) {
          return { [FORM_ERROR]: t("FoodPlanFormEdit:validation.error") };
        }
      }}
    >
      {(props) => (
        <>
          {uuid && (
            <FoodPlanFormInitializer
              form={props.form}
              onReady={() => setReady(true)}
              uuid={uuid}
            />
          )}
          <FormSpy<FoodPlanFormData>
            onChange={({ values }) => ready && saveFormData(values)}
            subscription={{ values: true }}
          />
          <form css={s(_css)} onSubmit={props.handleSubmit} noValidate>
            {children({
              ...props,
              ready,
            })}
          </form>
        </>
      )}
    </Form>
  );
};
