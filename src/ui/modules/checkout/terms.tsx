import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { ComponentStyleProps, link, s } from "@/common/ui/utils";

const enUsResource = {
  terms:
    "By placing your order you agree to FOTP’s <TermsLink>Terms of Service</TermsLink> and <PrivacyLink>Privacy Policy</PrivacyLink>, you confirm that subscription products will automatically renew and your credit card will automatically be charged the subscription price at the frequency selected according to the Order summary section of this page until you cancel your subscription. After your first order, we may adjust the subscription price at our discretion but you will always be notified in advance. You can cancel your subscription at any time.",
};

const CheckoutTerms: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n } = useLocale();

  i18n.addResourceBundle("en-US", "checkoutTerms", enUsResource);

  return (
    <p css={s({ fontSize: 12 }, _css)}>
      <Trans
        i18nKey={"checkoutTerms:terms"}
        components={{
          PrivacyLink: <Link css={s(link)} target="_blank" to="/privacy" />,
          TermsLink: (
            <Link css={s(link)} target="_blank" to="/terms-of-service" />
          ),
        }}
      />
    </p>
  );
};

export default CheckoutTerms;
