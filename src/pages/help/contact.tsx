import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";

import { belt, gutter, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import OG_IMG from "../../assets/images/contact/OPENGRAPH.jpg";
import {
  bodyText,
  headingAlpha,
  headingCharlie,
  textLink,
} from "../../ui/base/typography";
import SocialIcons from "../../ui/modules/social-icons";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  address: {
    address:
      "Front Of The Pack<br />6060 Center Dr<br />Ste 69, Fl 10<br /> Los Angeles, CA 90045",
    description:
      "We do not sell any products from the above location. Please get in touch to arrange any visits to our office in advance.",
    title: "Head Office Address",
  },
  header: {
    title: "Contact Us",
  },
  help: {
    adblock: `
    If you can't see a help icon in the bottom right of your browser,
    you may have ad-blocking software enabled that prevents it from
    showing up. If you wish to get in touch via chat you might need to
    disable your ad-blocker.`,
    description:
      "Call us on <Phone>323-922-5737</Phone> 9am - 5pm PT (Mon - Fri), use the help widget to send a message directly to the team, or send us an email at: <Email>$t(common:email)</Email>",
    social: "You can also contact us via our social media accounts:",
    title: "Questions? We're here to help!",
  },
  meta: {
    description:
      "Questions or concerns? We're here to help. Via email, phone or direct message we'll get you sorted and on your way in no time. Call us: +1 323-922-5737",
    openGraph: {
      description: "Questions or concerns? We're here to help",
      title: "Questions? We're here to help | Front Of The Pack",
    },
    title: "Questions? We're here to help | FOTP | Best Dog Supplements",
  },
};

const headingStyle = s(headingCharlie, (t) => ({
  marginBottom: [t.spacing.sm, null, t.spacing.md],
  marginTop: [t.spacing.lg, null, t.spacing.xl],
}));

const textStyle = s(bodyText, (t) => ({
  marginBottom: [t.spacing.sm, null, t.spacing.md],
}));

export const ContactPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "contactPage", enUsResource);

  return (
    <Standard gorgiasDelay={false}>
      <Metadata
        description={t("contactPage:meta.description")}
        title={t("contactPage:meta.title")}
        openGraph={{
          description: t("contactPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("contactPage:meta.openGraph.title"),
        }}
      />
      <main>
        <header css={s(gutter)}>
          <div css={s(belt, { maxWidth: 840 })}>
            <h1
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.md, null, t.spacing.lg],
              }))}
            >
              {t("contactPage:header.title")}
            </h1>

            <h2 css={s(headingStyle)}>{t("contactPage:help.title")}</h2>
            <p css={s(textStyle)}>
              <Trans
                components={{
                  Email: (
                    <a css={s(textLink)} href={`mailto:${t("common:email")}`} />
                  ),
                  Phone: <a href="tel:+13239225737" />,
                }}
                i18nKey="contactPage:help.description"
              />
            </p>
            <p css={s(textStyle)}>{t("contactPage:help.adblock")}</p>
            <p css={s(textStyle)}>{t("contactPage:help.social")}</p>
            <SocialIcons
              _css={s((t) => ({
                display: "flex",
                justifyContent: "flex-start",
                marginTop: t.spacing.lg,
                paddingBottom: t.spacing.md,
              }))}
              size={32}
            />

            <h2 css={s(headingStyle)}>{t("contactPage:address.title")}</h2>
            <p css={s(textStyle)}>
              <Trans i18nKey="contactPage:address.address" />
            </p>
            <p css={s(textStyle)}>{t("contactPage:address.description")}</p>
          </div>
        </header>
      </main>
    </Standard>
  );
};

export default ContactPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 15 * 60,
}));
