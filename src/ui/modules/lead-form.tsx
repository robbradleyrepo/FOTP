import { useMutation } from "@apollo/react-hooks";
import { dataLayerTrack, SubscribeEvent } from "@sss/analytics";
import { SUBSCRIBE_TO_EMAIL } from "@sss/ecommerce/subscribe";
import { validateEmail } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { FORM_ERROR } from "final-form";
import React, { FC } from "react";
import { AnyObject } from "react-final-form";

import { px, py, s, Style } from "@/common/ui/utils";

import { secondaryButton } from "../base/button";
import { bodyText, bodyTextStatic } from "../base/typography";
import Field from "../forms/field";
import Form from "../forms/form";

const enUsResource = {
  error: "There was a problem signing up. Please try again later.",
  field: {
    email: {
      error: "Please enter a valid email",
      label: "Enter your email",
    },
    submit: {
      label: "Sign up",
    },
  },
  success: "Thanks for signing up. We’ll be in touch soon.",
};

interface LeadProps {
  event: string;
  klaviyoList?: string;
  responsive?: boolean;
  source?: string;
  _css: Style;
}

const LeadForm: FC<LeadProps> = ({
  _css,
  event,
  klaviyoList,
  responsive = true,
  source,
}) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "leadForm", enUsResource);

  const [subscribeToEmail] = useMutation(SUBSCRIBE_TO_EMAIL);

  const onSubmit = async ({ email }: AnyObject) => {
    try {
      const {
        data: {
          payload: { userErrors },
        },
      } = await subscribeToEmail({
        variables: { email, list: klaviyoList, source: source },
      });

      if (userErrors.length > 0) {
        throw Error("There was a problem creating lead");
      }

      dataLayerTrack<SubscribeEvent>({
        email,
        event,
        list: klaviyoList,
        source,
      });
    } catch (error) {
      return { [FORM_ERROR]: [t("leadForm:error")] };
    }
  };

  return (
    <div css={s({ position: "relative" }, _css)}>
      <Form onSubmit={onSubmit}>
        {({ busy, submitSucceeded }) => (
          <>
            <div
              css={s({
                alignItems: "flex-start",
                display: responsive ? ["block", null, "flex"] : "block",
                visibility: submitSucceeded ? "hidden" : "visible",
              })}
            >
              <Field
                _css={s((t) => ({
                  flexGrow: 1,
                  marginBottom: responsive
                    ? [t.spacing.xs, null, 0]
                    : t.spacing.xs,
                  marginRight: responsive ? [0, null, t.spacing.xs] : 0,
                  width: "100%",
                }))}
                ariaLabel={t("leadForm:field.email.label")}
                name="email"
                type="email"
                placeholder={t("leadForm:field.email.label")}
                validate={validateEmail(t("leadForm:field.email.error"))}
              />
              <button
                css={s(secondaryButton({ disabled: busy }), (t) => ({
                  height: 54,
                  width: responsive ? ["100%", null, "auto"] : "100%",
                  ...px(t.spacing.md),
                  ...py(t.spacing.xs),
                  whiteSpace: "nowrap",
                }))}
                disabled={busy}
                type="submit"
              >
                {t("leadForm:field.submit.label")}
              </button>
            </div>
            {submitSucceeded && (
              <p
                css={s(responsive ? bodyText : bodyTextStatic, {
                  left: 0,
                  position: "absolute",
                  top: 0,
                  width: "100%",
                })}
              >
                {t("leadForm:success")}
              </p>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default LeadForm;
