import { captureException } from "@sentry/nextjs";
import { CartStatus, useCart } from "@sss/ecommerce/cart";
import { useLocale } from "@sss/i18n";
import { useRouter } from "next/router";
import { FC, useEffect, useRef } from "react";

import { useToastController } from "./base/toast";

const DISCOUNT_PARAMS = [
  {
    parameter: "aic",
    transform: (value: string) => `FRIEND-${value}`,
  },
  {
    parameter: "d",
  },
  {
    parameter: "discount",
  },
];

const enUsResource = {
  success: "{{ code }} has been automatically applied to your cart",
};

export const DiscountListener: FC = () => {
  const { discountCode, setDiscountCode, status } = useCart();
  const { i18n, t } = useLocale();
  const hasSyncedRef = useRef(false);
  const { query } = useRouter();
  const toast = useToastController();

  i18n.addResourceBundle("en-US", "DiscountListener", enUsResource);

  useEffect(() => {
    if (hasSyncedRef.current || status === CartStatus.INITIALIZING) {
      return;
    }

    const disabledCodes =
      process.env.DISABLED_DISCOUNT_CODES?.split(",").map((str) =>
        str.trim()
      ) ?? [];

    if (discountCode && disabledCodes.includes(discountCode)) {
      setDiscountCode(null);
    }

    let code: string | null = process.env.DEFAULT_DISCOUNT_CODE ?? null;

    if (code && disabledCodes.includes(code)) {
      captureException(
        `"DEFAULT_DISCOUNT_CODE" contains disabled discount code "${code}"`
      );

      code = null;
    }

    for (const {
      parameter,
      transform = (value: string) => value,
    } of DISCOUNT_PARAMS) {
      const param = query[parameter];
      if (typeof param === "string") {
        const qsCode = transform(param);

        if (!disabledCodes.includes(qsCode)) {
          code = qsCode;

          break;
        }
      }
    }

    if (code && code !== discountCode) {
      setDiscountCode(code);

      toast.push({
        children: t("DiscountListener:success", { code }),
      });
    }

    hasSyncedRef.current = true;
  }, [discountCode, hasSyncedRef, query, setDiscountCode, status, t, toast]);

  return null;
};
