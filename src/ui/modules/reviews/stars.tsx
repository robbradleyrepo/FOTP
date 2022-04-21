import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { s, Style } from "@/common/ui/utils";

const getStarPath = (value: number) => {
  const paths = [
    "M100 38.1l-36.2-2.5L50 1.9 36.2 36.2 0 38.1l28.1 23.7-9.4 36.3 31.2-20 31.2 20-9.4-35.6L100 38.1zM50 71.2L28.1 85l6.2-25L15 43.1l25.6-1.9L50 17.5l9.4 24.4L85 43.8 65.6 60.6l6.2 25L50 71.2z",
    "M100 38.1l-36.2-2.5L50 1.9 36.2 36.2 0 38.1l28.1 23.7-9.4 36.3 31.2-20 31.2 20-9.4-35.6L100 38.1zM50 17.5l9.4 24.4L85 43.8 65.6 60.6l6.2 25L50 71.2V17.5zM34.4 60",
    "M100 38.1l-36.2-1.9L50 1.9 36.2 36.2 0 38.1l28.1 23.8-9.3 36.2 31.2-20 31.2 20-9.4-35.6z",
  ];

  const index = Math.round(2 * Math.max(0, Math.min(value, 1)));

  return paths[index];
};

interface StarsProps {
  _css: Style;
  fill?: string;
  value: number;
}

const Stars: FC<StarsProps> = ({ _css, value }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "Stars", {
    value_one: "{{ count }} star out of 5",
    value_other: "{{ count }} stars out of 5",
  });

  return (
    <svg
      css={s(
        (t) => ({
          color: "#F8B430",
          height: t.spacing.md,
          width: 6 * t.spacing.md,
        }),
        _css
      )}
      viewBox="0 0 600 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{t("Stars:value", { count: value })}</title>
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          css={s({ transform: `translateX(${index * 125}px)` })}
          d={getStarPath(value - index)}
        />
      ))}
    </svg>
  );
};

export default Stars;
