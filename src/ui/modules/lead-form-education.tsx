import { useMutation } from "@apollo/react-hooks";
import { dataLayerTrack, SubscribeEvent } from "@sss/analytics";
import { SUBSCRIBE_TO_EMAIL } from "@sss/ecommerce/subscribe";
import { validateEmail } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { FORM_ERROR } from "final-form";
import React, { FC } from "react";
import { AnyObject } from "react-final-form";
import { Trans } from "react-i18next";

import { belt, gutterX, link, percentage, s } from "@/common/ui/utils";

import { secondaryButton } from "../base/button";
import { Grid, Item } from "../base/grid";
import { bodyTextSmall, headingDelta } from "../base/typography";
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
  success: "Thanks for signing up to watch later!",
  successBody: "We’ll be in touch soon.",
  notNowTitle: "Not ready to watch all of this course now?",
  notNowBody:
    "You can find it on <PlaylistLink>YouTube</PlaylistLink> or get it on email at a convenient time by signing up.",
};

interface LeadProps {
  event: string;
  klaviyoList: string;
  source: string;
  playlistUrl: string;
}

const LeadFormEducation: FC<LeadProps> = ({
  event,
  klaviyoList,
  source,
  playlistUrl,
}) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "LeadFormEducation", enUsResource);

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
      return { [FORM_ERROR]: [t("LeadFormEducation:error")] };
    }
  };

  return (
    <section
      css={s(gutterX, (t) => ({
        backgroundColor: t.color.tint.algae,
        paddingBottom: t.spacing.xl,
        paddingTop: t.spacing.xl,
        position: "relative",
      }))}
    >
      <Form onSubmit={onSubmit}>
        {({
          busy,
          submitSucceeded,
        }: {
          busy: boolean;
          submitSucceeded: boolean;
        }) => (
          <div css={s(belt)}>
            {submitSucceeded ? (
              <div
                css={s({
                  textAlign: "center",
                })}
              >
                <h2
                  css={s(headingDelta, (t) => ({
                    paddingBottom: t.spacing.md,
                  }))}
                >
                  {t("LeadFormEducation:success")}
                </h2>
                <p
                  css={s(bodyTextSmall, (t) => ({
                    paddingBottom: [t.spacing.md, null, 0],
                  }))}
                >
                  {t("LeadFormEducation:successBody")}
                </p>
              </div>
            ) : (
              <Grid
                gx={(t) => t.spacing.lg}
                gy={(t) => t.spacing.xl}
                align="center"
                itemWidth={[percentage(1), null, percentage(1 / 2)]}
              >
                <Item>
                  <h2
                    css={s(headingDelta, (t) => ({
                      paddingBottom: t.spacing.md,
                    }))}
                  >
                    {t("LeadFormEducation:notNowTitle")}
                  </h2>
                  <p
                    css={s(bodyTextSmall, {
                      paddingBottom: 0,
                    })}
                  >
                    <Trans
                      components={{
                        PlaylistLink: (
                          <Link
                            to={playlistUrl}
                            target="_blank"
                            rel="noopener"
                            css={s(link, {
                              fontWeight: "bold",
                            })}
                          />
                        ),
                      }}
                      i18nKey="LeadFormEducation:notNowBody"
                    />
                  </p>
                </Item>
                <Item
                  _css={s({
                    display: "flex",
                    flexDirection: ["column", null, null, "row"],
                    alignItems: "center",
                  })}
                >
                  <Field
                    _css={s((t) => ({
                      marginBottom: [t.spacing.sm, null, null, 0],
                      marginRight: [0, null, null, t.spacing.xs],
                      width: "100%",
                    }))}
                    ariaLabel={t("LeadFormEducation:field.email.label")}
                    name="email"
                    type="email"
                    placeholder={t("LeadFormEducation:field.email.label")}
                    validate={validateEmail(
                      t("LeadFormEducation:field.email.error")
                    )}
                  />
                  <button
                    css={s(secondaryButton({ disabled: busy }), {
                      height: 52,
                      lineHeight: 0.5,
                      whiteSpace: "nowrap",
                      width: ["100%", null, null, "auto"],
                    })}
                    disabled={busy}
                    type="submit"
                  >
                    {t("LeadFormEducation:field.submit.label")}
                  </button>
                </Item>
              </Grid>
            )}
          </div>
        )}
      </Form>
    </section>
  );
};

export default LeadFormEducation;
