import { useLocale } from "@sss/i18n";
import { Config, FORM_ERROR } from "final-form";
import { rgba } from "polished";
import React, { FC, ReactNode, useCallback, useState } from "react";
import { Form, FormSpy } from "react-final-form";

import { belt, ComponentStyleProps, gutter, mx, s } from "@/common/ui/utils";

import type { DogBreed } from "../../../dogs/breed";
import { useDogProfilePronouns } from "../../../dogs/profile";
import { primaryButton } from "../../../ui/base/button";
import {
  bodyTextSmall,
  headingBravo,
  headingDeltaStatic,
  headingEcho,
} from "../../../ui/base/typography";
import FoodPlanInfo from "../../../ui/modules/food/plan/info";
import {
  ageDecorator,
  FoodPlanFormCommonRenderProps,
  FoodPlanFormCommonSubmissionHandler,
  FoodPlanFormData,
  FoodPlanFormInitializer,
  FoodPlanFormStepHandle,
  FORM_STEPS,
  saveFormData,
  VALIDATORS,
} from "./common";
import {
  FoodPlanFieldActivity,
  FoodPlanFieldAge,
  FoodPlanFieldBreed,
  FoodPlanFieldCondition,
  FoodPlanFieldName,
  FoodPlanFieldNeutered,
  FoodPlanFieldSex,
  FoodPlanFieldWeight,
} from "./fields";

const labelStyle = s(headingBravo, (t) => ({
  display: "block",
  marginBottom: t.spacing.xl,
  textAlign: "center",
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

const radioFieldStyle = ({ disabled, selected }: RadioStyleProps) =>
  s(headingDeltaStatic, (t) => ({
    "&:first-child": {
      marginTop: 0,
    },
    alignItems: "center",
    backgroundColor: disabled
      ? rgba(t.color.border.light, 0.5)
      : selected
      ? t.color.background.feature1
      : t.color.background.base,
    borderColor: selected ? t.color.border.selected : t.color.border.light,
    borderRadius: t.radius.sm,
    borderStyle: "solid",
    borderWidth: 1,
    color: disabled
      ? rgba(t.color.text.dark.base, 0.6)
      : t.color.text.dark.base,
    marginTop: t.spacing.sm,
    padding: t.spacing.md,
    transition: "background-color 300ms, border-color 500ms",
  }));

type FoodPlanFormWizardContentWrapperProps = ComponentStyleProps &
  Pick<FoodPlanFormWizardRenderProps, "prevStep" | "valid" | "values"> & {
    busy: boolean;
    info?: ReactNode;
    step: FoodPlanFormStepHandle;
  };

const FoodPlanFormWizardContentWrapper: FC<FoodPlanFormWizardContentWrapperProps> = ({
  _css = {},
  busy,
  children,
  info,
  prevStep,
  valid,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "FoodPlanFormWizardContentWrapper", {
    button: {
      initial: "Get started",
      standard: "Continue",
    },
  });

  return (
    <div css={s(gutter, { width: "100%" }, _css)}>
      <div css={s(belt, { maxWidth: 420 })}>
        {children}
        <button
          css={s(primaryButton({ disabled: busy || !valid }), (t) => ({
            marginTop: t.spacing.md,
            width: "100%",
          }))}
          type="submit"
        >
          {t(
            `FoodPlanFormWizardContentWrapper:button.${
              prevStep ? "standard" : "initial"
            }`
          )}
        </button>
        {info && (
          <div
            css={s((t) => ({
              marginTop: t.spacing.xxl,
              ...mx([-t.spacing.xs, null, -t.spacing.md, -t.spacing.xl]),
            }))}
          >
            <FoodPlanInfo>{info}</FoodPlanInfo>
          </div>
        )}
      </div>
    </div>
  );
};

type FoodPlanFormWizardContentProps = Omit<
  FoodPlanFormWizardContentWrapperProps,
  "info"
> & {
  dogBreeds: DogBreed[];
};

export const FoodPlanFormWizardContent: FC<FoodPlanFormWizardContentProps> = (
  props
) => {
  const profilePronouns = useDogProfilePronouns();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "FoodPlanFormWizardContent", {
    step: {
      [FoodPlanFormStepHandle.ACTIVITY]: {
        info:
          "A hyperactive dog who spends several hours a day will not need the same nutritional intake as a lover of naps.",
        label: "How active is {{ name }}?",
      },
      [FoodPlanFormStepHandle.AGE]: {
        info: `Dogs’ nutritional needs vary throughout their lives. At each step, we will adapt {{ name }}’s plan to ${profilePronouns.their} needs.`,
        label: "How old is {{ name }}?",
      },
      [FoodPlanFormStepHandle.BREED]: {
        info: `Knowing {{ name }}’s breed will allow us to adapt the meal plan to ${profilePronouns.their} specific needs.`,
        label: "What breed is {{ name }}?",
      },
      [FoodPlanFormStepHandle.CONDITION]: {
        info: `If {{ name }} is a little thin or if he has a few extra pounds, we will adapt ${profilePronouns.their} plan to meet ${profilePronouns.their} nutritional needs.`,
        label: "What is {{ name }}’s body condition like?",
      },
      [FoodPlanFormStepHandle.NAME]: {
        info: {
          description:
            "Don’t worry, you can add as many pups as you want after you’ve added your first one.",
          title: "Have more than one dog?",
        },
        label: "What’s your dog’s name?",
      },
      [FoodPlanFormStepHandle.NEUTERED]: {
        info:
          "Neutering can impact your dog’s metabolism. This essential detail will allow us to create a recipe perfectly suited to {{ name }}.",
        label: "Is {{ name }} neutered?",
      },
      [FoodPlanFormStepHandle.SEX]: {
        label: "Is {{ name }} a boy or a girl?",
      },
      [FoodPlanFormStepHandle.WEIGHT]: {
        info:
          "Different size dogs need a different amount of calories per day to stay at a nice healthy weight.",
        label: "How much does {{ name }} weigh in pounds?",
      },
    },
  });

  const { busy, dogBreeds, step, values } = props;

  switch (step) {
    case FoodPlanFormStepHandle.ACTIVITY:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <p css={s(bodyTextSmall)}>
              {t(`FoodPlanFormWizardContent:step.${step}.info`, values)}
            </p>
          }
        >
          <FoodPlanFieldActivity
            busy={busy}
            fieldCss={radioFieldStyle}
            inputCss={radioInputStyle}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.AGE:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <p css={s(bodyTextSmall)}>
              {t(`FoodPlanFormWizardContent:step.${step}.info`, values)}
            </p>
          }
        >
          <FoodPlanFieldAge
            busy={busy}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.BREED:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <p css={s(bodyTextSmall)}>
              {t(`FoodPlanFormWizardContent:step.${step}.info`, values)}
            </p>
          }
          valid={props.valid && !!values.breed}
        >
          <FoodPlanFieldBreed
            busy={busy}
            dogBreeds={dogBreeds}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.CONDITION:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <p css={s(bodyTextSmall)}>
              {t(`FoodPlanFormWizardContent:step.${step}.info`, values)}
            </p>
          }
        >
          <FoodPlanFieldCondition
            busy={busy}
            fieldCss={radioFieldStyle}
            inputCss={radioInputStyle}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.NAME:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <>
              <p css={s(headingEcho, (t) => ({ marginBottom: t.spacing.xs }))}>
                {t(`FoodPlanFormWizardContent:step.${step}.info.title`)}
              </p>
              <p css={s(bodyTextSmall)}>
                {t(`FoodPlanFormWizardContent:step.${step}.info.description`)}
              </p>
            </>
          }
        >
          <FoodPlanFieldName
            busy={busy}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.NEUTERED:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <p css={s(bodyTextSmall)}>
              {t(`FoodPlanFormWizardContent:step.${step}.info`, values)}
            </p>
          }
        >
          <FoodPlanFieldNeutered
            busy={busy}
            fieldCss={radioFieldStyle}
            inputCss={radioInputStyle}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.SEX:
      return (
        <FoodPlanFormWizardContentWrapper {...props}>
          <FoodPlanFieldSex
            busy={busy}
            fieldCss={radioFieldStyle}
            inputCss={radioInputStyle}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    case FoodPlanFormStepHandle.WEIGHT:
      return (
        <FoodPlanFormWizardContentWrapper
          {...props}
          info={
            <p css={s(bodyTextSmall)}>
              {t(`FoodPlanFormWizardContent:step.${step}.info`, values)}
            </p>
          }
        >
          <FoodPlanFieldWeight
            busy={busy}
            label={t(`FoodPlanFormWizardContent:step.${step}.label`, values)}
            labelCss={labelStyle}
            values={values}
          />
        </FoodPlanFormWizardContentWrapper>
      );
    default:
      return null;
  }
};

export interface FoodPlanFormWizardRenderProps
  extends FoodPlanFormCommonRenderProps {
  nextStep: FoodPlanFormStepHandle | null;
  prevInvalidStep: FoodPlanFormStepHandle | null;
  prevStep: FoodPlanFormStepHandle | null;
}

type FoodPlanFormWizardSubmissionHandler = FoodPlanFormCommonSubmissionHandler<
  [
    {
      nextStep: FoodPlanFormStepHandle | null;
      prevStep: FoodPlanFormStepHandle | null;
      step: FoodPlanFormStepHandle;
    }
  ]
>;

interface FoodPlanFormWizardProps extends ComponentStyleProps {
  children: (props: FoodPlanFormWizardRenderProps) => ReactNode;
  onSubmit: FoodPlanFormWizardSubmissionHandler;
  step: FoodPlanFormStepHandle;
}

export const FoodPlanFormWizard = ({
  _css = {},
  children,
  onSubmit,
  step,
}: FoodPlanFormWizardProps) => {
  const { i18n, t } = useLocale();
  const [ready, setReady] = useState(false);

  i18n.addResourceBundle("en-US", "FoodPlanFormWizard", {
    validation: {
      error: "Please complete the required fields and try again.",
    },
  });

  const nextStep = FORM_STEPS[FORM_STEPS.indexOf(step) + 1] ?? null;
  const prevStep = FORM_STEPS[FORM_STEPS.indexOf(step) - 1] ?? null;

  const handleSubmit: Config<FoodPlanFormData>["onSubmit"] = useCallback(
    (values, form) => {
      onSubmit(values, form, { nextStep, prevStep, step });
    },

    [nextStep, onSubmit, prevStep, step]
  );

  return (
    <Form<FoodPlanFormData>
      decorators={[ageDecorator]}
      onSubmit={handleSubmit}
      validate={(values) => {
        if (!VALIDATORS[step](values)) {
          return { [FORM_ERROR]: t("FoodPlanFormWizard:validation.error") };
        }
      }}
    >
      {(props) => {
        let prevInvalidStep: FoodPlanFormStepHandle | null = null;

        if (ready) {
          for (const formStep of FORM_STEPS) {
            if (formStep === step) {
              break;
            }

            const valid = VALIDATORS[formStep](props.values);

            if (!valid) {
              prevInvalidStep = formStep;
              break;
            }
          }
        }

        return (
          <>
            <FoodPlanFormInitializer
              form={props.form}
              onReady={() => setReady(true)}
            />
            <FormSpy<FoodPlanFormData>
              onChange={({ values }) => ready && saveFormData(values)}
              subscription={{ values: true }}
            />
            <form css={s(_css)} onSubmit={props.handleSubmit} noValidate>
              {children({
                ...props,
                nextStep,
                prevInvalidStep,
                prevStep,
                ready,
              })}
            </form>
          </>
        );
      }}
    </Form>
  );
};
