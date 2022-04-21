import { throwGraphQLErrors } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { FORM_ERROR } from "final-form";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import { useApolloClient, useQuery } from "react-apollo";
import { ToastRack, ToastType, useToastController } from "src/ui/base/toast";

import { isStringEnumMember } from "@/common/filters";
import { s, visuallyHidden } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import { DOG_BREEDS, DogBreedsData } from "../../../dogs/breed";
import {
  DOG_PROFILE_CREATE,
  DogProfileCreateInput,
  DogProfileData,
} from "../../../dogs/profile";
import {
  clearFormData,
  FoodPlanFormStepHandle,
  FORM_STEPS,
  isFormValid,
} from "../../../food/plan/form/common";
import {
  FoodPlanFormWizard,
  FoodPlanFormWizardContent,
} from "../../../food/plan/form/wizard";
import { PageSpinner } from "../../../ui/base/spinner";
import FoodPlanContentWrapper, {
  FoodPlanNavigationDirection,
} from "../../../ui/modules/food/plan/content-wrapper";
import FoodPlanHeader from "../../../ui/modules/food/plan/header";

const enUsResource = {
  form: {
    error: "Something has gone wrong. Please try again later.",
  },
  meta: {
    title: "Create a personalized meal plan that’s perfect for your dog | FOTP",
  },
  title: "Create a personalized meal plan that’s perfect for your dog",
};

const makeRoute = (step: string) => `/food/plan/${[step]}`;

const useFoodPlanNavigationDirection = (
  step: FoodPlanFormStepHandle
): FoodPlanNavigationDirection => {
  const previousStepRef = useRef(step);
  const router = useRouter();
  const [direction, setDirection] = useState(
    FoodPlanNavigationDirection.FORWARD
  );

  useEffect(() => {
    const handleBeforeHistoryChange = (path: string) => {
      const step = path.split("/").pop();

      if (!step || !isStringEnumMember(FoodPlanFormStepHandle, step)) {
        return;
      }

      setDirection(
        FORM_STEPS.indexOf(step) > FORM_STEPS.indexOf(previousStepRef.current)
          ? FoodPlanNavigationDirection.FORWARD
          : FoodPlanNavigationDirection.BACK
      );

      previousStepRef.current = step;
    };

    router.events.on("beforeHistoryChange", handleBeforeHistoryChange);

    return () =>
      router.events.off("beforeHistoryChange", handleBeforeHistoryChange);
  }, [router, setDirection]);

  return direction;
};

interface FoodPlanFormPrefetchProps {
  nextStep: FoodPlanFormStepHandle | null;
}

const FoodPlanFormPrefetch: FC<FoodPlanFormPrefetchProps> = ({ nextStep }) => {
  const router = useRouter();

  useEffect(() => {
    if (nextStep) {
      router.prefetch(makeRoute(nextStep));
    }
  }, [nextStep, router]);

  return null;
};

interface FoodPlanFormRedirectProps {
  destinationStep: FoodPlanFormStepHandle | null;
}

const FoodPlanFormRedirect: FC<FoodPlanFormRedirectProps> = ({
  destinationStep,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (destinationStep) {
      router.replace(destinationStep);
    }
  }, [destinationStep, router]);

  return null;
};

interface FoodPlanFormWizardPageProps {
  step: FoodPlanFormStepHandle;
}

const FoodPlanFormWizardPage: FC<FoodPlanFormWizardPageProps> = ({ step }) => {
  const client = useApolloClient();
  const direction = useFoodPlanNavigationDirection(step);
  const { i18n, t } = useLocale();
  const { data } = useQuery<DogBreedsData>(DOG_BREEDS);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const toast = useToastController();

  i18n.addResourceBundle("en-US", "FoodPlanFormWizardPage", enUsResource);

  const progress = FORM_STEPS.indexOf(step) / FORM_STEPS.length;

  return (
    <>
      <Metadata title={t("FoodPlanFormWizardPage:meta.title")} />
      <FoodPlanFormWizard
        onSubmit={async (values, _form, { nextStep }) => {
          if (nextStep) {
            router.push(makeRoute(nextStep));
            return;
          }

          setBusy(true);

          let uuid: string | null = null;

          try {
            if (!isFormValid(values)) {
              throw new Error(
                "Attempted `FoodPlanForm` submission within incomplete or invalid data"
              );
            }

            const data: DogProfileCreateInput = {
              activityLevel: values.activityLevel,
              ageMonths: values.ageMonths,
              breedId: values.breed?.id ?? null,
              condition: values.condition,
              name: values.name,
              neutered: values.neutered,
              sex: values.sex,
              weightLb: values.weightLb,
            };

            const result = await client.mutate<
              { payload: DogProfileData },
              { input: DogProfileCreateInput }
            >({
              mutation: DOG_PROFILE_CREATE,
              variables: {
                input: data,
              },
            });

            throwGraphQLErrors(result);

            if (!result.data?.payload.dogProfile) {
              throw new Error("Missing `dogProfile` in result");
            }

            uuid = result.data.payload.dogProfile.uuid;
          } catch (error) {
            setBusy(false);

            const message = t("FoodPlanFormWizardPage:form.error");

            toast.push({
              children: message,
              type: ToastType.ERROR,
            });

            return { [FORM_ERROR]: message };
          }

          await router.push({
            pathname: makeRoute("flavor"),
            query: { dog_profile: uuid },
          });

          clearFormData();
        }}
        step={step}
      >
        {({ nextStep, prevInvalidStep, prevStep, ready, valid, values }) => (
          <>
            <FoodPlanFormPrefetch nextStep={nextStep} />
            <FoodPlanFormRedirect destinationStep={prevInvalidStep} />
            <FoodPlanHeader
              back={prevStep && makeRoute(prevStep)}
              progress={progress}
            />
            {!ready || prevInvalidStep ? (
              <PageSpinner label={t("common:loading")} />
            ) : (
              <main css={s({ textAlign: "center" })}>
                <h1 css={s(visuallyHidden)}>
                  {t("FoodPlanFormWizardPage:title")}
                </h1>
                <FoodPlanContentWrapper direction={direction} id={step}>
                  <FoodPlanFormWizardContent
                    busy={busy}
                    dogBreeds={data?.dogBreeds ?? []}
                    step={step}
                    prevStep={prevStep}
                    valid={valid}
                    values={values}
                  />
                </FoodPlanContentWrapper>
              </main>
            )}
          </>
        )}
      </FoodPlanFormWizard>
      <ToastRack
        _css={s((t) => ({
          height: 0,
          position: "fixed",
          right: 0,
          top: [t.height.nav.mobile, null, t.height.nav.desktop],
          zIndex: 99999,
        }))}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => ({
  fallback: "blocking",
  paths: [],
});

export const getStaticProps = makeStaticPropsGetter<FoodPlanFormWizardPageProps>(
  async ({ params }) => {
    if (
      typeof params?.step !== "string" ||
      !isStringEnumMember(FoodPlanFormStepHandle, params.step)
    ) {
      return { notFound: true };
    }

    return {
      props: {
        step: params.step,
      },
      revalidate: 60,
    };
  }
);

export default FoodPlanFormWizardPage;
