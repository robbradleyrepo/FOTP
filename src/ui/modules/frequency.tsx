import * as common from "@sss/ecommerce/common";
import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { s, size } from "@/common/ui/utils";

import Icon from "../base/icon";
import refresh from "../icons/refresh";

const enUsResource = {
  value: {
    DAY_one: "{{ count }} day",
    DAY_other: "{{ count }} days",
    MONTH_one: "{{ count }} month",
    MONTH_other: "{{ count }} months",
    WEEK_one: "{{ count }} week",
    WEEK_other: "{{ count }} weeks",
  },
};

interface FrequencyProps extends common.Frequency {
  title?: string;
}

const Frequency: FC<FrequencyProps> = ({
  orderIntervalFrequency,
  orderIntervalUnit,
  title,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "frequency", enUsResource);

  return (
    <>
      <Icon
        _css={s({
          marginBottom: "-0.15em",
          marginRight: "0.2em",
          ...size("1em"),
          verticalAlign: "baseline",
        })}
        path={refresh}
        title={title}
      />{" "}
      {t(`frequency:value.${orderIntervalUnit}`, {
        count: orderIntervalFrequency,
      })}
    </>
  );
};

export default Frequency;
