import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { isStringEnumMember } from "@/common/filters";
import { ComponentStyleProps, s } from "@/common/ui/utils";

import AMEX_IMG from "../../assets/images/checkout/card-brands/AMEX.svg";
import DINERS_IMG from "../../assets/images/checkout/card-brands/DINERS.svg";
import DISCOVER_IMG from "../../assets/images/checkout/card-brands/DISCOVER.svg";
import JCB_IMG from "../../assets/images/checkout/card-brands/JCB.svg";
import MASTERCARD_IMG from "../../assets/images/checkout/card-brands/MASTERCARD.svg";
import VISA_IMG from "../../assets/images/checkout/card-brands/VISA.svg";

export enum PaymentCardBrand {
  AMEX = "amex",
  DINERS = "diners",
  DISCOVER = "discover",
  JCB = "jcb",
  MASTERCARD = "mastercard",
  VISA = "visa",
}

const images: Record<PaymentCardBrand, StaticImageData> = {
  [PaymentCardBrand.AMEX]: AMEX_IMG,
  [PaymentCardBrand.DINERS]: DINERS_IMG,
  [PaymentCardBrand.DISCOVER]: DISCOVER_IMG,
  [PaymentCardBrand.JCB]: JCB_IMG,
  [PaymentCardBrand.MASTERCARD]: MASTERCARD_IMG,
  [PaymentCardBrand.VISA]: VISA_IMG,
};

const enUsResource = {
  [PaymentCardBrand.AMEX]: "American Express",
  [PaymentCardBrand.DINERS]: "Diners Club International",
  [PaymentCardBrand.DISCOVER]: "Discover",
  [PaymentCardBrand.JCB]: "JCB",
  [PaymentCardBrand.MASTERCARD]: "MasterCard",
  [PaymentCardBrand.VISA]: "Visa",
};

export const isKnownCardBrand = (brand: string): brand is PaymentCardBrand =>
  isStringEnumMember(PaymentCardBrand, brand);

interface PaymentCardProps extends ComponentStyleProps {
  brand: PaymentCardBrand;
}

const PaymentCard: FC<PaymentCardProps> = ({ _css = {}, brand }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "paymentCard", enUsResource);

  return (
    <img
      alt={t(`paymentCard:${brand}`)}
      css={s(
        {
          maxWidth: 76,
          width: "100%",
        },
        _css
      )}
      src={images[brand].src}
    />
  );
};

export default PaymentCard;
