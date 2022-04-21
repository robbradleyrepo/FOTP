import { useMutation } from "@apollo/react-hooks";
import { dataLayerTrack } from "@sss/analytics";
import { runServerSideQuery } from "@sss/apollo";
import {
  SUBSCRIBE_TO_REFERRAL,
  SubscribeToReferralPayload,
} from "@sss/ecommerce/subscribe";
import { validateEmail, validateRequired } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { FORM_ERROR } from "final-form";
import React, { FC, useState } from "react";
import { AnyObject } from "react-final-form";
import { Trans } from "react-i18next";

import {
  FacebookShareLink,
  TwitterShareLink,
  WhatsAppShareLink,
} from "@/common/share-links";
import { belt, gutter, percentage, px, py, s, size } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import REFER_DOGS_IMG from "../../../assets/images/refer/DOGS.png";
import OG_IMG from "../../../assets/images/sustainability/OPENGRAPH.jpg";
import type { Faq } from "../../../cms/common";
import { OpinionatedRichText } from "../../../cms/prismic";
import type { FaqCategorySnippetData } from "../../../cms/snippets";
import Accordion from "../../../ui/base/accordion";
import { contrastButton } from "../../../ui/base/button";
import { Grid, Item } from "../../../ui/base/grid";
import Icon from "../../../ui/base/icon";
import ResponsiveImage from "../../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingCharlie,
  textLink,
} from "../../../ui/base/typography";
import CheckboxField from "../../../ui/forms/checkbox-field";
import Field from "../../../ui/forms/field";
import Form from "../../../ui/forms/form";
import facebook from "../../../ui/icons/facebook";
import twitter from "../../../ui/icons/twitter";
import whatsapp from "../../../ui/icons/whatsapp";
import ShopCTA from "../../../ui/modules/shop-cta";
import { theme } from "../../../ui/styles/theme";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  faqs: {
    title: "Referral FAQs",
  },
  form: {
    error: "There was a problem signing up. Please try again later.",
    field: {
      acceptsEmailMarketing: {
        label:
          "Tick to receive exclusive email offers and vet tips to keep your dog healthy.",
      },
      email: {
        error: "Please enter a valid email",
        label: "Your email",
        placeholder: "john@example.com",
      },
      name: {
        error: "Please enter your name",
        label: "Your Name",
        placeholder: "John",
      },
    },
    submit: {
      label: "Get invite link",
    },
  },
  header: {
    description:
      "Give your friends $20 off their first order, and we’ll give you $20 for referring them!",
    title: "Give $20, Get $20",
  },
  meta: {
    description:
      "Give your friends $20 off their first order, and we’ll give you $20 for referring them!",
    openGraph: {
      description:
        "Give your friends $20 off their first order, and we’ll give you $20 for referring them!",
      title: "Give $20, Get $20",
    },
    title: "Give $20, Get $20 | FOTP Top Dog Supplements",
  },
  portal: {
    text: "Looking to claim rewards? <Link>Click here</Link> to get started.",
  },
  share: {
    copied: "Your link was copied!",
    cta: "Copy link",
    text:
      "Get $20 off dog supplements with my referral code from Front Of The Pack: ",
    title: "Your unique referral link",
  },
  steps: {
    step1: {
      text:
        "Enter your email to get your unique referral link and ready to grab your rewards",
      title: "Get your referral link",
    },
    step2: {
      text:
        "Share your link with friends to give them $20 off their purchase from Front Of The Pack",
      title: "Give your friends $20 off",
    },
    step3: {
      text:
        "When your friends buy from your invite link, you also get $20 off your next purchase",
      title: "You also get $20 off",
    },
  },
};

interface ReferralPageProps {
  faqs: { faq: Faq }[];
}

export const ReferralPage: FC<ReferralPageProps> = ({ faqs }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "referralPage", enUsResource);

  const [
    subscribeToReferral,
    { data },
  ] = useMutation<SubscribeToReferralPayload>(SUBSCRIBE_TO_REFERRAL);
  const shareLink = data?.payload?.subscription?.shareUrl;
  const portalLink = data?.payload?.subscription?.portalUrl;
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const onSubmit = async ({
    acceptsEmailMarketing,
    email,
    name,
  }: AnyObject) => {
    try {
      const { data } = await subscribeToReferral({
        variables: {
          acceptsEmailMarketing: acceptsEmailMarketing ?? false,
          email,
          firstName: name,
          source: "referral",
        },
      });

      if (!data || data?.payload?.userErrors.length > 0) {
        throw Error("There was a problem creating lead");
      }

      if (acceptsEmailMarketing) {
        dataLayerTrack({
          email,
          event: "dl_subscribe",
          source: "Referral",
        });
      }

      dataLayerTrack({
        email,
        event: "referral_signup",
      });
    } catch (error) {
      return { [FORM_ERROR]: [t("referralPage:error")] };
    }
  };

  return (
    <Standard>
      <Metadata
        description={t("referralPage:meta.description")}
        title={t("referralPage:meta.title")}
        openGraph={{
          description: t("referralPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("referralPage:meta.openGraph.title"),
        }}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            backgroundColor: "#DEE9D6",
            paddingBottom: [t.spacing.xxl, null, null, t.spacing.xxxl],
            paddingTop: t.spacing.xxl,
          }))}
        >
          <div
            css={s(belt, {
              position: "relative",
            })}
          >
            <Grid
              gx={[theme.spacing.lg, null, null, theme.spacing.xxl]}
              gy={theme.spacing.xl}
              itemWidth={[percentage(1), null, null, percentage(1 / 2)]}
            >
              <Item>
                <div
                  css={s(belt, (t) => ({
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    margin: 0,
                    paddingTop: [0, null, null, t.spacing.xxl],
                    textAlign: ["center", null, null, "left"],
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
                    <Trans i18nKey="referralPage:header.title" />
                  </h1>
                  <p
                    css={s(bodyText, {
                      fontSize: [16, 18, 20],
                      margin: ["0 auto", null, null, 0],
                      maxWidth: ["none", null, null, 400],
                    })}
                  >
                    {t("referralPage:header.description")}
                  </p>
                </div>
              </Item>
              <Item>
                <div
                  css={s((t) => ({
                    backgroundColor: t.color.background.base,
                    borderRadius: t.radius.md,
                    boxShadow: "0 6px 10px rgba(24, 83, 65, 0.1)",
                    margin: "0 auto",
                    maxWidth: 600,
                    ...px([
                      t.spacing.md,
                      t.spacing.lg,
                      t.spacing.xl,
                      t.spacing.xxl,
                    ]),
                    ...py([t.spacing.lg, null, t.spacing.xl]),
                  }))}
                >
                  {!shareLink ? (
                    <Form onSubmit={onSubmit}>
                      {({ busy }) => (
                        <>
                          <Field
                            _css={s((t) => ({
                              marginBottom: t.spacing.md,
                            }))}
                            ariaLabel={t("referralPage:form.field.email.label")}
                            autoComplete="email"
                            busy={busy}
                            label={t("referralPage:form.field.email.label")}
                            name="email"
                            placeholder={t(
                              "referralPage:form.field.email.placeholder"
                            )}
                            type="email"
                            validate={validateEmail(
                              t("referralPage:form.field.email.error")
                            )}
                          />
                          <Field
                            _css={s((t) => ({
                              marginBottom: t.spacing.md,
                            }))}
                            ariaLabel={t("referralPage:form.field.name.label")}
                            autoComplete="given-name"
                            busy={busy}
                            label={t("referralPage:form.field.name.label")}
                            name="name"
                            placeholder={t(
                              "referralPage:form.field.name.placeholder"
                            )}
                            type="text"
                            validate={validateRequired(
                              t("referralPage:form.field.name.error")
                            )}
                          />
                          <CheckboxField
                            _css={s((t) => ({
                              fontSize: [14, null, 16],
                              marginBottom: t.spacing.md,
                            }))}
                            busy={busy}
                            label={t(
                              "referralPage:form.field.acceptsEmailMarketing.label"
                            )}
                            name="acceptsEmailMarketing"
                          />
                          <button
                            css={s(contrastButton({ disabled: busy }), {
                              width: "100%",
                            })}
                            disabled={busy}
                            type="submit"
                          >
                            {t("referralPage:form.submit.label")}
                          </button>
                          <p
                            css={s(bodyTextSmall, (t) => ({
                              fontSize: [12, null, 14],
                              marginTop: t.spacing.md,
                            }))}
                          >
                            <Trans
                              components={{
                                Link: (
                                  <Link
                                    css={s(textLink, {
                                      ":hover": {
                                        textDecoration: "none",
                                      },
                                      textDecoration: "underline",
                                    })}
                                    to="/work-with-us/refer/claim"
                                  />
                                ),
                              }}
                              i18nKey="referralPage:portal.text"
                            />
                          </p>
                        </>
                      )}
                    </Form>
                  ) : (
                    <div css={s({ textAlign: "center" })}>
                      <h2
                        css={s(headingCharlie, (t) => ({
                          marginBottom: [t.spacing.sm, null, t.spacing.md],
                        }))}
                      >
                        {t("referralPage:share.title")}
                      </h2>
                      <div
                        css={s((t) => ({
                          borderColor: t.color.border.light,
                          borderStyle: "solid",
                          borderWidth: 1,
                          padding: t.spacing.sm,
                        }))}
                      >
                        {shareLink}
                      </div>
                      {linkCopied && (
                        <p
                          css={s((t) => ({
                            backgroundColor: t.color.background.feature3,
                            padding: t.spacing.xs,
                          }))}
                        >
                          {t("referralPage:share.copied")}
                        </p>
                      )}
                      <button
                        css={s(contrastButton(), (t) => ({
                          marginTop: t.spacing.sm,
                          width: "100%",
                        }))}
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink).then(
                            () => {
                              setLinkCopied(true);
                            },
                            () => {
                              setLinkCopied(false);
                            }
                          );
                        }}
                      >
                        {t("referralPage:share.cta")}
                      </button>
                      <div>
                        <p
                          css={s(bodyText, (t) => ({
                            fontFamily: t.font.secondary.family,
                            fontStyle: "italic",
                            fontWeight: t.font.secondary.weight.book,
                            marginBottom: t.spacing.sm,
                            marginTop: t.spacing.lg,
                          }))}
                        >
                          Share with your friends:
                        </p>
                        <div>
                          <FacebookShareLink
                            url={shareLink}
                            css={s((t) => ({
                              color: "#1877F2",
                              marginRight: t.spacing.sm,
                            }))}
                          >
                            <Icon
                              _css={s(size(32))}
                              path={facebook}
                              title="Facebook"
                              viewBox="0 0 100 100"
                            />
                          </FacebookShareLink>
                          <TwitterShareLink
                            text={t("referralPage:share.text")}
                            url={shareLink}
                            css={s((t) => ({
                              color: "#1DA1F2",
                              marginRight: t.spacing.sm,
                            }))}
                          >
                            <Icon
                              _css={s(size(32))}
                              path={twitter}
                              title="Twitter"
                              viewBox="0 0 100 100"
                            />
                          </TwitterShareLink>
                          <WhatsAppShareLink
                            text={t("referralPage:share.text") + shareLink}
                            css={s({ color: "#25D366" })}
                          >
                            <Icon
                              _css={s(size(32))}
                              path={whatsapp}
                              title="WhatsApp"
                              viewBox="0 0 100 100"
                            />
                          </WhatsAppShareLink>
                        </div>
                        {portalLink && (
                          <div>
                            <p
                              css={s(bodyTextSmall, (t) => ({
                                fontSize: [12, null, 14],
                                marginTop: t.spacing.md,
                              }))}
                            >
                              <Trans
                                components={{
                                  Link: (
                                    <a
                                      css={s(textLink, {
                                        ":hover": {
                                          textDecoration: "none",
                                        },
                                        textDecoration: "underline",
                                      })}
                                      href={portalLink + "/rewards"}
                                    />
                                  ),
                                }}
                                i18nKey="referralPage:portal.text"
                              />
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Item>
            </Grid>
            <div
              css={s({
                bottom: -220,
                display: ["none", null, null, "block"],
                left: -120,
                maxWidth: [280, null, 480, 500],
                position: "absolute",
                width: "100%",
              })}
            >
              <ResponsiveImage
                alt=""
                sizes={{ width: [280, null, 480, 500] }}
                src={REFER_DOGS_IMG}
              />
            </div>
          </div>
        </header>

        <section
          css={s(gutter, {
            ...py([96, null, 120, 140]),
            textAlign: "center",
          })}
        >
          <div css={s(belt)}>
            <Grid
              gx={[theme.spacing.lg, null, null, theme.spacing.xxl]}
              gy={[theme.spacing.xxl, null, theme.spacing.lg]}
              itemWidth={[percentage(1), null, percentage(1 / 3)]}
            >
              <Item>
                <div
                  css={s((t) => ({
                    alignItems: "center",
                    borderColor: t.color.border.dark,
                    borderRadius: t.radius.xxl,
                    borderStyle: "solid",
                    borderWidth: 2,
                    display: "inline-flex",
                    height: [72, null, 80],
                    justifyContent: "center",
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                    width: [72, null, 80],
                  }))}
                >
                  <span css={s(headingBravo)}>1</span>
                </div>
                <h2
                  css={s(headingCharlie, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("referralPage:steps.step1.title")}
                </h2>
                <p css={s(bodyText)}>{t("referralPage:steps.step1.text")}</p>
              </Item>
              <Item>
                <div
                  css={s((t) => ({
                    alignItems: "center",
                    borderColor: t.color.border.dark,
                    borderRadius: t.radius.xxl,
                    borderStyle: "solid",
                    borderWidth: 2,
                    display: "inline-flex",
                    height: [72, null, 80],
                    justifyContent: "center",
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                    width: [72, null, 80],
                  }))}
                >
                  <span css={s(headingBravo)}>2</span>
                </div>
                <h2
                  css={s(headingCharlie, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("referralPage:steps.step2.title")}
                </h2>
                <p css={s(bodyText)}>{t("referralPage:steps.step2.text")}</p>
              </Item>
              <Item>
                <div
                  css={s((t) => ({
                    alignItems: "center",
                    borderColor: t.color.border.dark,
                    borderRadius: t.radius.xxl,
                    borderStyle: "solid",
                    borderWidth: 2,
                    display: "inline-flex",
                    height: [72, null, 80],
                    justifyContent: "center",
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                    width: [72, null, 80],
                  }))}
                >
                  <span css={s(headingBravo)}>3</span>
                </div>
                <h2
                  css={s(headingCharlie, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("referralPage:steps.step3.title")}
                </h2>
                <p css={s(bodyText)}>{t("referralPage:steps.step3.text")}</p>
              </Item>
            </Grid>
          </div>
        </section>
        <section>
          {faqs && (
            <section
              css={s(gutter, (t) => ({
                backgroundColor: t.color.background.feature3,
                color: t.color.text.dark.base,
              }))}
            >
              <div css={s(belt, { maxWidth: 900 })}>
                <h2
                  css={s(headingAlpha, (t) => ({
                    margin: ["0 auto", null, 0],
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    textAlign: "center",
                  }))}
                >
                  {t("referralPage:faqs.title")}
                </h2>
                {faqs.map(
                  ({ faq: { answer, question } }, uid) =>
                    answer &&
                    question && (
                      <Accordion
                        key={uid}
                        id={`faq-${uid}`}
                        label={<RichTextFragment render={question} />}
                        labelAs="h3"
                      >
                        <div
                          css={s(bodyText, (t) => ({
                            marginBottom: t.spacing.md,
                          }))}
                        >
                          <OpinionatedRichText render={answer} />
                        </div>
                      </Accordion>
                    )
                )}
              </div>
            </section>
          )}
        </section>
        <ShopCTA />
      </main>
    </Standard>
  );
};

export default ReferralPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const { FAQ_CATEGORY_SNIPPET } = await import("../../../cms/snippets");

    const { data } = await runServerSideQuery<FaqCategorySnippetData>(
      apolloClient,
      {
        query: FAQ_CATEGORY_SNIPPET,
        variables: { handle: "referral-faqs" },
      }
    );

    if (!data?.faqCategorySnippet?.body?.[0]?.fields) {
      throw new Error("Failed to fetch referral-faqs");
    }

    return {
      props: { faqs: data.faqCategorySnippet.body[0].fields },
      revalidate: 5 * 60,
    };
  }
);
