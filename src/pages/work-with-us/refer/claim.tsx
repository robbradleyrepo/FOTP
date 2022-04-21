import { useMutation } from "@apollo/react-hooks";
import {
  SUBSCRIBE_TO_REFERRAL,
  SubscribeToReferralPayload,
} from "@sss/ecommerce/subscribe";
import { validateEmail } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { FORM_ERROR } from "final-form";
import React from "react";
import { AnyObject } from "react-final-form";
import { Trans } from "react-i18next";

import { gutter, px, py, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import OG_IMG from "../../../assets/images/sustainability/OPENGRAPH.jpg";
import { contrastButton } from "../../../ui/base/button";
import { bodyText, headingAlpha } from "../../../ui/base/typography";
import Field from "../../../ui/forms/field";
import Form from "../../../ui/forms/form";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  description: "Ready to claim your rewards? Enter your email to get started.",
  form: {
    error: "There was a problem. Please try again later.",
    field: {
      email: {
        error: "Please enter a valid email",
        label: "Your email",
        placeholder: "john@example.com",
      },
    },
    submit: {
      label: "Get Started",
    },
  },
  meta: {
    description:
      "Rewards Portal | Give your friends $20 off their first order, and we’ll give you $20!",
    openGraph: {
      description:
        "Rewards Portal | Give your friends $20 off their first order, and we’ll give you $20 for referring them!",
      title: "Rewards Portal | Give $20, Get $20",
    },
    title: "Rewards Portal | Give $20, Get $20 | FOTP Top Dog Supplements",
  },
  title: "Rewards Portal",
};

export const ReferClaimPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "referClaimPage", enUsResource);

  const [subscribeToReferral] = useMutation<SubscribeToReferralPayload>(
    SUBSCRIBE_TO_REFERRAL
  );

  const onSubmit = async ({ email }: AnyObject) => {
    try {
      const { data } = await subscribeToReferral({
        variables: {
          acceptsEmailMarketing: false,
          email,
          source: "claim",
        },
      });

      if (
        !data ||
        data?.payload?.userErrors.length > 0 ||
        !data?.payload?.subscription?.portalUrl
      ) {
        throw Error("There was a problem creating lead");
      }

      window.location.href = data.payload.subscription.portalUrl + "/rewards";
    } catch (error) {
      return { [FORM_ERROR]: [t("referClaimPage:error")] };
    }
  };

  return (
    <Standard>
      <Metadata
        description={t("referClaimPage:meta.description")}
        title={t("referClaimPage:meta.title")}
        openGraph={{
          description: t("referClaimPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("referClaimPage:meta.openGraph.title"),
        }}
      />
      <main
        css={s(gutter, (t) => ({
          backgroundColor: "#DEE9D6",
          minHeight: 600,
          paddingBottom: [t.spacing.xxl, null, null, t.spacing.xxxl],
          paddingTop: t.spacing.xxl,
        }))}
      >
        <div
          css={s((t) => ({
            backgroundColor: t.color.background.base,
            borderRadius: t.radius.md,
            boxShadow: "0 6px 10px rgba(24, 83, 65, 0.1)",
            margin: "0 auto",
            maxWidth: 700,
            ...px([t.spacing.md, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
            ...py([t.spacing.lg, null, t.spacing.xl]),
          }))}
        >
          <h1
            css={s(headingAlpha, (t) => ({
              fontSize: [36, null, 48, 54],
              lineHeight: "1.1em",
              margin: ["0 auto", null, null, 0],
              paddingBottom: [t.spacing.md, null, t.spacing.lg],
            }))}
          >
            <Trans i18nKey="referClaimPage:title" />
          </h1>
          <p
            css={s(bodyText, (t) => ({
              fontSize: [16, 18, 20],
              marginBottom: [t.spacing.sm, null, t.spacing.md],
              maxWidth: ["none", null, null],
            }))}
          >
            {t("referClaimPage:description")}
          </p>
          <Form onSubmit={onSubmit}>
            {({ busy }) => (
              <>
                <Field
                  _css={s((t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                  ariaLabel={t("referClaimPage:form.field.email.label")}
                  autoComplete="email"
                  busy={busy}
                  label={t("referClaimPage:form.field.email.label")}
                  name="email"
                  placeholder={t("referClaimPage:form.field.email.placeholder")}
                  type="email"
                  validate={validateEmail(
                    t("referClaimPage:form.field.email.error")
                  )}
                />

                <button
                  css={s(contrastButton({ disabled: busy }), { width: "100%" })}
                  disabled={busy}
                  type="submit"
                >
                  {t("referClaimPage:form.submit.label")}
                </button>
              </>
            )}
          </Form>
        </div>
      </main>
    </Standard>
  );
};

export default ReferClaimPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
