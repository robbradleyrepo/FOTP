import { captureException } from "@sentry/nextjs";
import { throwGraphQLErrors } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { useApolloClient, useQuery } from "react-apollo";
import { ToastRack, ToastType, useToastController } from "src/ui/base/toast";
import { bodyText, headingBravo } from "src/ui/base/typography";
import { createGlobalStyle } from "styled-components";

import { belt, gutterBottom, gutterX, gutterY, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import { DOG_BREEDS, DogBreedsData } from "../../../dogs/breed";
import {
  DOG_PROFILE_UPDATE,
  DogProfileData,
  DogProfileUpdateInput,
} from "../../../dogs/profile";
import { clearFormData, isFormValid } from "../../../food/plan/form/common";
import {
  FoodPlanFormEdit,
  FoodPlanFormEditContent,
} from "../../../food/plan/form/edit";
import { PageSpinner } from "../../../ui/base/spinner";
import SalesFunnelHeader from "../../../ui/modules/sales-funnel-header";
import { ThemeEnhanced } from "../../../ui/styles/theme";

const enUsResource = {
  form: {
    error: "Something has gone wrong. Please try again later.",
  },
  header: {
    description:
      "Check your dog’s info below and make any changes before we generate your recommended food plan.",
    title: "Your dog’s info",
  },
  meta: {
    title: "Create a personalized meal plan that’s perfect for your dog | FOTP",
  },
};

const BodyStyle = createGlobalStyle`
body {
  background-color: ${({ theme }) =>
    (theme as ThemeEnhanced).color.background.feature3}
}
`;

const FoodPlanFormEditPage: FC = () => {
  const client = useApolloClient();
  const { i18n, t } = useLocale();
  const { data } = useQuery<DogBreedsData>(DOG_BREEDS);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const toast = useToastController();

  i18n.addResourceBundle("en-US", "FoodPlanFormEditPage", enUsResource);

  return (
    <>
      <Metadata noindex title={t("FoodPlanFormEditPage:meta.title")} />
      <SalesFunnelHeader showContact={false} showLinks={false} />
      <FoodPlanFormEdit
        onSubmit={async (values, _form, { uuid }) => {
          setBusy(true);

          try {
            if (!isFormValid(values)) {
              throw new Error(
                "Attempted `FoodPlanForm` submission within incomplete or invalid data"
              );
            }

            const data: DogProfileUpdateInput = {
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
              { data: DogProfileUpdateInput; uuid: string }
            >({
              mutation: DOG_PROFILE_UPDATE,
              variables: {
                data,
                uuid,
              },
            });

            throwGraphQLErrors(result);

            if (!result.data?.payload.dogProfile) {
              throw new Error("Missing `dogProfile` in result");
            }

            // We'll only hit this if something goes wrong on the back end
            if (result.data.payload.dogProfile.uuid !== uuid) {
              const error = new Error(
                "`DOG_PROFILE_UPDATE` returned a different UUID"
              );

              captureException(error);

              throw error;
            }
          } catch (error) {
            setBusy(false);

            const message = t("FoodPlanFormEditPage:form.error");

            toast.push({
              children: message,
              type: ToastType.ERROR,
            });

            return { [FORM_ERROR]: message };
          }

          await router.push({
            pathname: "/food/plan/flavor",
            query: { dog_profile: uuid },
          });

          clearFormData();
        }}
      >
        {({ ready, valid, values }) => (
          <>
            {!ready ? (
              <PageSpinner label={t("common:loading")} />
            ) : (
              <>
                <BodyStyle />
                <main
                  css={s(gutterX, (t) => ({
                    marginTop: [
                      t.height?.nav.mobile,
                      null,
                      t.height?.nav.desktop,
                    ],
                  }))}
                >
                  <div css={s(belt, { maxWidth: [400, null, 420] })}>
                    <header css={s(gutterY, { textAlign: "center" })}>
                      <h1 css={s(headingBravo)}>
                        {t("FoodPlanFormEditPage:header.title")}
                      </h1>
                      <p
                        css={s(bodyText, (t) => ({
                          marginTop: [t.spacing.sm, null, t.spacing.md],
                        }))}
                      >
                        {t("FoodPlanFormEditPage:header.description")}
                      </p>
                    </header>
                    <FoodPlanFormEditContent
                      _css={s(gutterBottom)}
                      busy={busy}
                      dogBreeds={data?.dogBreeds ?? []}
                      values={values}
                      valid={valid}
                    />
                  </div>
                </main>
              </>
            )}
          </>
        )}
      </FoodPlanFormEdit>
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

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));

export default FoodPlanFormEditPage;
